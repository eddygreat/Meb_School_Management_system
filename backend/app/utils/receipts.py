from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from datetime import datetime

def generate_receipt_pdf(invoice: dict, payments: list[dict], school_name: str = "SchoolMS") -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    y = height - 30 * mm
    c.setFont("Helvetica-Bold", 16)
    c.drawString(20 * mm, y, f"{school_name} - Payment Receipt")
    y -= 10 * mm

    c.setFont("Helvetica", 10)
    c.drawString(20 * mm, y, f"Invoice ID: {invoice.get('id')}")
    y -= 6 * mm
    c.drawString(20 * mm, y, f"Student ID: {invoice.get('student_id')}")
    y -= 6 * mm
    c.drawString(20 * mm, y, f"Title: {invoice.get('title')}")
    y -= 6 * mm
    c.drawString(20 * mm, y, f"Amount: {invoice.get('currency')} {invoice.get('amount')}")
    y -= 6 * mm
    c.drawString(20 * mm, y, f"Status: {invoice.get('status')}")
    y -= 10 * mm

    c.setFont("Helvetica-Bold", 12)
    c.drawString(20 * mm, y, "Payments")
    y -= 7 * mm
    c.setFont("Helvetica", 10)
    c.drawString(20 * mm, y, "Ref")
    c.drawString(70 * mm, y, "Provider")
    c.drawString(100 * mm, y, "Amount")
    c.drawString(130 * mm, y, "Status")
    y -= 5 * mm
    c.line(20 * mm, y, 190 * mm, y)
    y -= 5 * mm

    for p in payments:
        if y < 20 * mm:
            c.showPage()
            y = height - 30 * mm
        c.drawString(20 * mm, y, str(p.get('reference')))
        c.drawString(70 * mm, y, str(p.get('provider')))
        c.drawString(100 * mm, y, f"{p.get('currency')} {p.get('amount')}")
        c.drawString(130 * mm, y, str(p.get('status')))
        y -= 6 * mm

    y -= 10 * mm
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(20 * mm, y, f"Generated on {datetime.utcnow().isoformat()}Z")

    c.showPage()
    c.save()
    pdf = buf.getvalue()
    buf.close()
    return pdf
