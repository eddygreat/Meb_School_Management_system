from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
