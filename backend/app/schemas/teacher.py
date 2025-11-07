from pydantic import BaseModel
from datetime import date

class TeacherCreate(BaseModel):
    user_id: int
    staff_no: str
    department: str
    date_of_employment: date | None = None

class TeacherOut(BaseModel):
    id: int
    user_id: int
    staff_no: str
    department: str

    class Config:
        orm_mode = True
