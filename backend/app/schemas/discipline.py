from pydantic import BaseModel, ConfigDict
from datetime import datetime

class IncidentCreate(BaseModel):
    student_id: int
    category: str
    description: str

class IncidentUpdate(BaseModel):
    status: str  # open|resolved

class IncidentOut(BaseModel):
    id: int
    student_id: int
    reported_by_user_id: int | None
    category: str
    description: str
    status: str
    created_at: datetime
    resolved_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
