from pydantic import BaseModel
from datetime import datetime

class YearCreate(BaseModel):
    name: str  # e.g. 2024/2025

class TermCreate(BaseModel):
    name: str   # First/Second/Third
    year_id: int

class GradeEntryCreate(BaseModel):
    student_id: int
    subject_id: int
    term_id: int
    year_id: int
    ca1: float = 0
    ca2: float = 0
    exam: float = 0

class YearOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True
    

class TermOut(BaseModel):
    id: int
    name: str
    year_id: int
    class Config:
        orm_mode = True

class GradeEntryOut(BaseModel):
    id: int
    student_id: int
    subject_id: int
    term_id: int
    year_id: int
    ca1: float
    ca2: float
    exam: float
    total: float
    grade: str
    remark: str
    class Config:
        orm_mode = True

class ReportSubject(BaseModel):
    subject_id: int
    ca1: float
    ca2: float
    exam: float
    total: float
    grade: str
    remark: str

class ReportOut(BaseModel):
    student_id: int
    term_id: int
    year_id: int
    subjects: list[ReportSubject]
    average: float
    position: int | None = None
    comments: str | None = None
