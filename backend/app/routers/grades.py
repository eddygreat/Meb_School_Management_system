from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import require_roles, get_db
from app.models.grades import AcademicYear, Term, GradeEntry
from app.models.timetable import Subject
from app.schemas.grades import (
    YearCreate, YearOut,
    TermCreate, TermOut,
    GradeEntryCreate, GradeEntryOut,
    ReportOut, ReportSubject,
)
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import io

router = APIRouter()

def grade_letter_and_remark(total: float) -> tuple[str, str]:
    # WAEC-like scale approximation
    if total >= 75: return ("A1", "Excellent")
    if total >= 70: return ("B2", "Very Good")
    if total >= 65: return ("B3", "Good")
    if total >= 60: return ("C4", "Credit")
    if total >= 55: return ("C5", "Credit")
    if total >= 50: return ("C6", "Credit")
    if total >= 45: return ("D7", "Pass")
    if total >= 40: return ("E8", "Pass")
    return ("F9", "Fail")

# Years and terms
@router.post('/year', response_model=YearOut)
async def create_year(payload: YearCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    y = AcademicYear(name=payload.name)
    db.add(y)
    await db.commit()
    await db.refresh(y)
    return y

@router.get('/years', response_model=list[YearOut])
async def list_years(db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(AcademicYear))
    return [i for i in res.scalars().all()]

@router.post('/term', response_model=TermOut)
async def create_term(payload: TermCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    t = Term(name=payload.name, year_id=payload.year_id)
    db.add(t)
    await db.commit()
    await db.refresh(t)
    return t

@router.get('/terms', response_model=list[TermOut])
async def list_terms(year_id: int | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    stmt = select(Term)
    if year_id:
        stmt = stmt.where(Term.year_id == year_id)
    res = await db.execute(stmt)
    return [i for i in res.scalars().all()]

# Grade entries
@router.post('/entry', response_model=GradeEntryOut)
async def create_grade_entry(payload: GradeEntryCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    total = float(payload.ca1) + float(payload.ca2) + float(payload.exam)
    letter, remark = grade_letter_and_remark(total)
    ge = GradeEntry(
        student_id=payload.student_id,
        subject_id=payload.subject_id,
        term_id=payload.term_id,
        year_id=payload.year_id,
        ca1=payload.ca1,
        ca2=payload.ca2,
        exam=payload.exam,
        total=total,
        grade=letter,
        remark=remark,
    )
    db.add(ge)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=409, detail='Grade for this subject/term/year/student already exists')
    await db.refresh(ge)
    return ge

@router.get('/entries', response_model=list[GradeEntryOut])
async def list_entries(student_id: int, term_id: int, year_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','parent','student'))):
    res = await db.execute(
        select(GradeEntry).where(
            GradeEntry.student_id==student_id,
            GradeEntry.term_id==term_id,
            GradeEntry.year_id==year_id
        )
    )
    return [i for i in res.scalars().all()]

# Report
@router.get('/report/{student_id}', response_model=ReportOut)
async def get_report(student_id: int, term_id: int = Query(...), year_id: int = Query(...), db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','parent','student'))):
    res = await db.execute(
        select(GradeEntry).where(
            GradeEntry.student_id==student_id,
            GradeEntry.term_id==term_id,
            GradeEntry.year_id==year_id
        )
    )
    entries = res.scalars().all()
    subjects = [ReportSubject(
        subject_id=e.subject_id,
        ca1=float(e.ca1), ca2=float(e.ca2), exam=float(e.exam),
        total=float(e.total), grade=e.grade, remark=e.remark
    ) for e in entries]
    avg = round(sum(s.total for s in subjects)/len(subjects), 2) if subjects else 0.0
    return ReportOut(student_id=student_id, term_id=term_id, year_id=year_id, subjects=subjects, average=avg, position=None, comments=None)

@router.get('/report/{student_id}/pdf')
async def get_report_pdf(student_id: int, term_id: int = Query(...), year_id: int = Query(...), db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','parent','student'))):
    res = await db.execute(
        select(GradeEntry).where(
            GradeEntry.student_id==student_id,
            GradeEntry.term_id==term_id,
            GradeEntry.year_id==year_id
        )
    )
    entries = res.scalars().all()
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4
    y = height - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Report Card (WAEC/NECO Format - Simplified)")
    y -= 30
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Student ID: {student_id}  Term: {term_id}  Year: {year_id}")
    y -= 25
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Subject")
    c.drawString(220, y, "CA1")
    c.drawString(260, y, "CA2")
    c.drawString(300, y, "Exam")
    c.drawString(350, y, "Total")
    c.drawString(400, y, "Grade")
    c.drawString(450, y, "Remark")
    y -= 15
    c.setFont("Helvetica", 10)
    total_sum = 0.0
    count = 0
    for e in entries:
        if y < 60:
            c.showPage(); y = height - 50; c.setFont("Helvetica", 10)
        c.drawString(50, y, f"Subject #{e.subject_id}")
        c.drawRightString(250, y, f"{float(e.ca1):.0f}")
        c.drawRightString(290, y, f"{float(e.ca2):.0f}")
        c.drawRightString(340, y, f"{float(e.exam):.0f}")
        c.drawRightString(390, y, f"{float(e.total):.0f}")
        c.drawString(400, y, e.grade)
        c.drawString(450, y, e.remark)
        total_sum += float(e.total)
        count += 1
        y -= 14
    avg = total_sum / count if count else 0.0
    y -= 10
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, f"Average: {avg:.2f}")
    c.showPage()
    c.save()
    pdf = buf.getvalue()
    buf.close()
    return StreamingResponse(io.BytesIO(pdf), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report_card.pdf"})
