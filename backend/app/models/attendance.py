from datetime import datetime, timedelta
from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import Base
import enum

class AttendanceMethod(str, enum.Enum):
    qr = "qr"
    manual = "manual"
    biometric = "biometric"

class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    class_name: Mapped[str] = mapped_column(String(50), index=True)
    created_by_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ends_at: Mapped[datetime] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    @staticmethod
    async def get_by_token(db: AsyncSession, token: str):
        result = await db.execute(select(AttendanceSession).where(AttendanceSession.token == token))
        return result.scalar_one_or_none()

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    session_id: Mapped[int] = mapped_column(Integer, ForeignKey("attendance_sessions.id", ondelete="CASCADE"))
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"))
    method: Mapped[str] = mapped_column(String(20), default=AttendanceMethod.qr.value)
    status: Mapped[str] = mapped_column(String(20), default="present")
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
