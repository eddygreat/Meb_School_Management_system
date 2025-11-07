from datetime import datetime, date
from sqlalchemy import Integer, String, ForeignKey, DateTime, Date, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), unique=True, index=True)
    position: Mapped[str] = mapped_column(String(100), default="Teacher")
    salary: Mapped[float] = mapped_column(Numeric(12,2), default=0)
    hired_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Payroll(Base):
    __tablename__ = "payrolls"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), index=True)
    month: Mapped[str] = mapped_column(String(7))  # YYYY-MM
    gross: Mapped[float] = mapped_column(Numeric(12,2))
    deductions: Mapped[float] = mapped_column(Numeric(12,2), default=0)
    net: Mapped[float] = mapped_column(Numeric(12,2))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), index=True)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    reason: Mapped[str] = mapped_column(String(500), default="")
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending|approved|rejected
    requested_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class PerformanceRecord(Base):
    __tablename__ = "performance_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), index=True)
    period: Mapped[str] = mapped_column(String(20))
    score: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str] = mapped_column(String(1000), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
