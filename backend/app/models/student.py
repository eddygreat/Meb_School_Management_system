from sqlalchemy import String, Integer, ForeignKey, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    admission_no: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    class_name: Mapped[str] = mapped_column(String(50))
    date_of_birth: Mapped[Date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
