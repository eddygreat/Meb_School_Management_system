from datetime import datetime
from sqlalchemy import Integer, String, Numeric, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum

class InvoiceStatus(str, enum.Enum):
    pending = "pending"
    partially_paid = "partially_paid"
    paid = "paid"
    canceled = "canceled"

class PaymentProvider(str, enum.Enum):
    paystack = "paystack"
    flutterwave = "flutterwave"

class PaymentStatus(str, enum.Enum):
    initialized = "initialized"
    success = "success"
    failed = "failed"

class Invoice(Base):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    amount: Mapped[float] = mapped_column(Numeric(12,2))
    currency: Mapped[str] = mapped_column(String(10), default="NGN")
    status: Mapped[str] = mapped_column(String(20), default=InvoiceStatus.pending.value, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Payment(Base):
    __tablename__ = "payments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_id: Mapped[int] = mapped_column(Integer, ForeignKey("invoices.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(20))
    reference: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    amount: Mapped[float] = mapped_column(Numeric(12,2))
    currency: Mapped[str] = mapped_column(String(10), default="NGN")
    status: Mapped[str] = mapped_column(String(20), default=PaymentStatus.initialized.value, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
