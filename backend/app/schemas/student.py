from pydantic import BaseModel
from datetime import date

class StudentCreate(BaseModel):
    user_id: int
    admission_no: str
    class_name: str
    date_of_birth: date | None = None

class StudentOut(BaseModel):
    id: int
    user_id: int
    admission_no: str
    class_name: str

    class Config:
        orm_mode = True
