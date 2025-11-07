from pydantic import BaseModel
from datetime import datetime

class AttendanceSessionCreate(BaseModel):
    class_name: str
    duration_minutes: int = 15

class AttendanceSessionOut(BaseModel):
    id: int
    class_name: str
    token: str
    starts_at: datetime
    ends_at: datetime
    is_active: bool

    class Config:
        orm_mode = True

class CheckInByToken(BaseModel):
    token: str
    student_id: int

class CheckInManual(BaseModel):
    session_id: int
    student_id: int

class AttendanceRecordOut(BaseModel):
    id: int
    session_id: int
    student_id: int
    method: str
    status: str
    timestamp: datetime

    class Config:
        orm_mode = True
