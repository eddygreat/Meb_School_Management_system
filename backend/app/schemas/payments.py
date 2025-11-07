from pydantic import BaseModel
from datetime import datetime

class InvoiceCreate(BaseModel):
    student_id: int
    title: str
    amount: float
    currency: str = "NGN"

class InvoiceOut(BaseModel):
    id: int
    student_id: int
    title: str
    amount: float
    currency: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class PaymentInitRequest(BaseModel):
    invoice_id: int
    provider: str  # paystack|flutterwave

class PaymentOut(BaseModel):
    id: int
    invoice_id: int
    provider: str
    reference: str
    amount: float
    currency: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class PaymentInitResponse(BaseModel):
    checkout_url: str
    reference: str
