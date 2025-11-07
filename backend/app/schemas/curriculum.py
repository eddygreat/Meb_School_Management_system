from pydantic import BaseModel
from datetime import datetime, date

class LessonPlanCreate(BaseModel):
    teacher_id: int
    subject_id: int
    title: str
    content: str
    week_no: int = 1

class LessonPlanOut(BaseModel):
    id: int
    teacher_id: int
    subject_id: int
    title: str
    content: str
    week_no: int
    created_at: datetime
    class Config:
        orm_mode = True

class ResourceCreate(BaseModel):
    subject_id: int
    title: str
    url: str

class ResourceOut(BaseModel):
    id: int
    subject_id: int
    title: str
    url: str
    created_at: datetime
    class Config:
        orm_mode = True

class AssignmentCreate(BaseModel):
    class_id: int
    subject_id: int
    teacher_id: int
    title: str
    description: str
    due_date: date

class AssignmentOut(BaseModel):
    id: int
    class_id: int
    subject_id: int
    teacher_id: int
    title: str
    description: str
    due_date: date
    created_at: datetime
    class Config:
        orm_mode = True

class SubmissionCreate(BaseModel):
    assignment_id: int
    student_id: int
    content_url: str

class SubmissionGrade(BaseModel):
    submission_id: int
    score: int
    feedback: str = ""

class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content_url: str
    score: int
    feedback: str
    submitted_at: datetime
    class Config:
        orm_mode = True
