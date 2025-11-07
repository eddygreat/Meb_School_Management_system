from sqlalchemy import String, Integer, ForeignKey, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Teacher(Base):
    __tablename__ = "teachers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    staff_no: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    department: Mapped[str] = mapped_column(String(100))
    date_of_employment: Mapped[Date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
