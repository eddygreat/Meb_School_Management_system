from pydantic import BaseModel, ConfigDict
from datetime import datetime, date

class EmployeeProfileCreate(BaseModel):
    teacher_id: int
    position: str = "Teacher"
    salary: float = 0

class EmployeeProfileOut(BaseModel):
    id: int
    teacher_id: int
    position: str
    salary: float
    hired_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PayrollCreate(BaseModel):
    teacher_id: int
    month: str  # YYYY-MM
    gross: float
    deductions: float = 0

class PayrollOut(BaseModel):
    id: int
    teacher_id: int
    month: str
    gross: float
    deductions: float
    net: float
    paid_at: datetime | None
    model_config = ConfigDict(from_attributes=True)

class LeaveRequestCreate(BaseModel):
    teacher_id: int
    start_date: date
    end_date: date
    reason: str

class LeaveRequestUpdate(BaseModel):
    status: str  # pending|approved|rejected

class LeaveRequestOut(BaseModel):
    id: int
    teacher_id: int
    start_date: date
    end_date: date
    reason: str
    status: str
    requested_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PerformanceRecordCreate(BaseModel):
    teacher_id: int
    period: str
    score: int
    notes: str = ""

class PerformanceRecordOut(BaseModel):
    id: int
    teacher_id: int
    period: str
    score: int
    notes: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
