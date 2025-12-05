from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
