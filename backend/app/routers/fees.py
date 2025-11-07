from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.core.deps import require_roles, get_db
from app.models.payments import Invoice, Payment, InvoiceStatus, PaymentStatus
from app.models.student import Student
from app.models.user import User
from app.schemas.payments import InvoiceCreate, InvoiceOut, PaymentInitRequest, PaymentInitResponse, PaymentOut
from app.utils.payments import new_reference, build_checkout_url, verify_signature
from app.utils.audit import write_audit
from app.core.config import settings
from app.utils.receipts import generate_receipt_pdf
from app.tasks.email import send_email_with_attachment
import base64
from app.models.settings import Setting

router = APIRouter()

@router.post("/invoices", response_model=InvoiceOut)
async def create_invoice(payload: InvoiceCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    inv = Invoice(student_id=payload.student_id, title=payload.title, amount=payload.amount, currency=payload.currency, status=InvoiceStatus.pending.value)
    db.add(inv)
    await db.commit()
    await db.refresh(inv)
    return inv

@router.get("/invoices/{student_id}", response_model=list[InvoiceOut])
async def list_invoices(student_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "parent"))):
    res = await db.execute(select(Invoice).where(Invoice.student_id == student_id))
    return [i for i in res.scalars().all()]

@router.post("/initiate", response_model=PaymentInitResponse)
async def initiate_payment(payload: PaymentInitRequest, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "parent"))):
    inv_res = await db.execute(select(Invoice).where(Invoice.id == payload.invoice_id))
    inv = inv_res.scalar_one_or_none()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    if inv.status == InvoiceStatus.paid.value:
        raise HTTPException(status_code=400, detail="Invoice already paid")
    ref = new_reference()
    pay = Payment(invoice_id=inv.id, provider=payload.provider, reference=ref, amount=float(inv.amount), currency=inv.currency)
    db.add(pay)
    await db.commit()
    checkout_url = build_checkout_url(payload.provider, ref, float(inv.amount), inv.currency)
    return PaymentInitResponse(checkout_url=checkout_url, reference=ref)

@router.post("/webhook/{provider}")
async def webhook(provider: str, request: Request, db: AsyncSession = Depends(get_db)):
    # NOTE: This is a stub. In production, verify signatures with provider secret keys.
    raw = await request.body()
    headers = dict(request.headers)
    secret = settings.PAYSTACK_SECRET_KEY if provider == 'paystack' else settings.FLUTTERWAVE_SECRET_KEY
    if not verify_signature(provider, headers, raw, secret):
        raise HTTPException(status_code=401, detail="Invalid signature")
    data = await request.json()
    ref = data.get("reference")
    status = data.get("status")  # 'success' | 'failed'
    if not ref:
        raise HTTPException(status_code=400, detail="Missing reference")
    res = await db.execute(select(Payment).where(Payment.reference == ref))
    pay = res.scalar_one_or_none()
    if not pay:
        raise HTTPException(status_code=404, detail="Payment not found")
    pay.status = PaymentStatus.success.value if status == "success" else PaymentStatus.failed.value
    pay.updated_at = datetime.utcnow()
    db.add(pay)
    # Update invoice on success and send receipt
    if status == "success":
        inv_res = await db.execute(select(Invoice).where(Invoice.id == pay.invoice_id))
        inv = inv_res.scalar_one_or_none()
        if inv:
            inv.status = InvoiceStatus.paid.value
            db.add(inv)
            # Build receipt data
            pay_res2 = await db.execute(select(Payment).where(Payment.invoice_id == inv.id))
            pays = [p for p in pay_res2.scalars().all()]
            invoice_dict = {"id": inv.id, "student_id": inv.student_id, "title": inv.title, "amount": float(inv.amount), "currency": inv.currency, "status": inv.status}
            payments_list = [{"reference": p.reference, "provider": p.provider, "amount": float(p.amount), "currency": p.currency, "status": p.status} for p in pays]
            pdf_bytes = generate_receipt_pdf(invoice_dict, payments_list, school_name=settings.APP_NAME)
            pdf_b64 = base64.b64encode(pdf_bytes).decode('utf-8')
            # Find student email
            stu_res = await db.execute(select(Student).where(Student.id == inv.student_id))
            stu = stu_res.scalar_one_or_none()
            email_to = None
            if stu:
                u_res = await db.execute(select(User).where(User.id == stu.user_id))
                u = u_res.scalar_one_or_none()
                if u:
                    email_to = u.email
            recipients = []
            if email_to:
                recipients.append(email_to)
            # Parent email(s) from settings: PARENT_EMAIL (global) and PARENT_EMAIL_{student_id}
            set_res = await db.execute(select(Setting).where(Setting.key.in_(["PARENT_EMAIL", f"PARENT_EMAIL_{inv.student_id}"])))
            for s in set_res.scalars().all():
                if s.value:
                    # Support comma-separated list
                    for addr in [a.strip() for a in s.value.split(',') if a.strip()]:
                        recipients.append(addr)
            # Deduplicate recipients
            recipients = list(dict.fromkeys(recipients))
            if recipients:
                subject = f"Payment Receipt - Invoice #{inv.id}"
                body = f"Please find attached your receipt for {inv.title}."
                for addr in recipients:
                    send_email_with_attachment.delay(addr, subject, body, pdf_b64, filename=f"receipt_{inv.id}.pdf")
    await db.commit()
    await write_audit(db, None, f'fees.webhook.{provider}', f'ref:{ref}')
    return {"ok": True}

@router.get("/receipt/{invoice_id}")
async def receipt(invoice_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "parent"))):
    inv_res = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    inv = inv_res.scalar_one_or_none()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    pay_res = await db.execute(select(Payment).where(Payment.invoice_id == invoice_id))
    payments = [p for p in pay_res.scalars().all()]
    return {
        "invoice": {"id": inv.id, "title": inv.title, "amount": float(inv.amount), "currency": inv.currency, "status": inv.status},
        "payments": [{"reference": p.reference, "amount": float(p.amount), "status": p.status, "provider": p.provider} for p in payments],
        "pdf_url": None  # Hook up WeasyPrint or similar to generate actual PDF
    }
