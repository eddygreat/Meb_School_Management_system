from datetime import datetime
from sqlalchemy import Integer, String, ForeignKey, Numeric, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(20), unique=True, index=True)  # e.g., 2024/2025

class Term(Base):
    __tablename__ = "terms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(20))  # e.g., First, Second, Third
    year_id: Mapped[int] = mapped_column(Integer, ForeignKey("academic_years.id", ondelete="CASCADE"))
    __table_args__ = (UniqueConstraint('name','year_id', name='uq_term_year'),)

class GradeEntry(Base):
    __tablename__ = "grade_entries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    term_id: Mapped[int] = mapped_column(Integer, ForeignKey("terms.id", ondelete="CASCADE"), index=True)
    year_id: Mapped[int] = mapped_column(Integer, ForeignKey("academic_years.id", ondelete="CASCADE"), index=True)
    ca1: Mapped[float] = mapped_column(Numeric(5,2), default=0)
    ca2: Mapped[float] = mapped_column(Numeric(5,2), default=0)
    exam: Mapped[float] = mapped_column(Numeric(5,2), default=0)
    total: Mapped[float] = mapped_column(Numeric(6,2), default=0)
    grade: Mapped[str] = mapped_column(String(3), default='')
    remark: Mapped[str] = mapped_column(String(50), default='')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint('student_id','subject_id','term_id','year_id', name='uq_grade_unique'),)
