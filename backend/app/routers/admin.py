from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import require_roles, get_db
from app.models.user import User
from pydantic import BaseModel, EmailStr
from fastapi import HTTPException
from app.core.security import get_password_hash
from fastapi.responses import StreamingResponse
import io, csv
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from openpyxl import Workbook
from app.models.payments import Invoice, Payment
from app.utils.audit import write_audit

router = APIRouter()

@router.get("/users")
async def users(db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    res = await db.execute(select(User))
    us = res.scalars().all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role, "is_active": u.is_active} for u in us]

@router.get("/export")
async def export_data(user=Depends(require_roles("admin"))):
    return {"pdf_url": "/api/admin/export/pdf", "excel_url": "/api/admin/export/invoices.xlsx"}

@router.get("/export/invoices.xlsx")
async def export_invoices_excel(db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    # Generate invoices + payments workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Invoices"
    ws.append(["Invoice ID","Student ID","Title","Amount","Currency","Status","Created At"])
    inv_res = await db.execute(select(Invoice))
    for inv in inv_res.scalars().all():
        ws.append([inv.id, inv.student_id, inv.title, float(inv.amount), inv.currency, inv.status, inv.created_at.isoformat()])

    ws2 = wb.create_sheet("Payments")
    ws2.append(["Payment ID","Invoice ID","Provider","Reference","Amount","Currency","Status","Created At"])
    pay_res = await db.execute(select(Payment))
    for p in pay_res.scalars().all():
        ws2.append([p.id, p.invoice_id, p.provider, p.reference, float(p.amount), p.currency, p.status, p.created_at.isoformat()])

    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    return StreamingResponse(stream, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=invoices_payments.xlsx"})

@router.get("/export/pdf")
async def export_pdf(db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    # Generate a simple PDF of users list
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4
    y = height - 50
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Users Export")
    y -= 30
    c.setFont("Helvetica", 10)
    res = await db.execute(select(User))
    for u in res.scalars().all():
        line = f"#{u.id} {u.full_name} <{u.email}> role={u.role} active={u.is_active}"
        if y < 50:
            c.showPage(); y = height - 50; c.setFont("Helvetica", 10)
        c.drawString(50, y, line)
        y -= 16
    c.showPage()
    c.save()
    pdf = buf.getvalue()
    buf.close()
    return StreamingResponse(io.BytesIO(pdf), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=users.pdf"})

@router.post("/backup")
async def backup(user=Depends(require_roles("admin"))):
    # Stub: trigger backup task
    return {"ok": True}

@router.post("/restore")
async def restore(user=Depends(require_roles("admin"))):
    # Stub: trigger restore task
    return {"ok": True}

class CreateUser(BaseModel):
    email: EmailStr
    full_name: str
    role: str
    password: str

class UpdateUser(BaseModel):
    full_name: str | None = None
    role: str | None = None
    is_active: bool | None = None

class ResetPassword(BaseModel):
    password: str

@router.post("/users")
async def create_user(payload: CreateUser, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")
    u = User(email=payload.email, full_name=payload.full_name, role=payload.role, hashed_password=get_password_hash(payload.password))
    db.add(u)
    await db.commit()
    await db.refresh(u)
    await write_audit(db, user.id, 'admin.user.create', f'user:{u.id}')
    return {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role, "is_active": u.is_active}

@router.put("/users/{user_id}")
async def update_user(user_id: int, payload: UpdateUser, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    res = await db.execute(select(User).where(User.id == user_id))
    u = res.scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.full_name is not None:
        u.full_name = payload.full_name
    if payload.role is not None:
        u.role = payload.role
    if payload.is_active is not None:
        u.is_active = payload.is_active
    db.add(u)
    await db.commit()
    await db.refresh(u)
    await write_audit(db, user.id, 'admin.user.update', f'user:{u.id}')
    return {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role, "is_active": u.is_active}

@router.post("/users/{user_id}/reset-password")
async def reset_password(user_id: int, payload: ResetPassword, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    res = await db.execute(select(User).where(User.id == user_id))
    u = res.scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.hashed_password = get_password_hash(payload.password)
    db.add(u)
    await db.commit()
    await write_audit(db, user.id, 'admin.user.reset_password', f'user:{user_id}')
    return {"ok": True}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    res = await db.execute(select(User).where(User.id == user_id))
    u = res.scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(u)
    await db.commit()
    await write_audit(db, user.id, 'admin.user.delete', f'user:{user_id}')
    return {"ok": True}
