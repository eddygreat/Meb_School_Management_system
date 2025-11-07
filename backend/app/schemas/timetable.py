from pydantic import BaseModel
from datetime import time

class ClassCreate(BaseModel):
    name: str

class RoomCreate(BaseModel):
    name: str
    capacity: int = 40

class SubjectCreate(BaseModel):
    name: str

class TimeSlotCreate(BaseModel):
    day_of_week: int  # 0..6
    start_time: time
    end_time: time

class ScheduleCreate(BaseModel):
    class_id: int
    room_id: int | None = None
    subject_id: int
    teacher_id: int
    time_slot_id: int

class ClassOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class RoomOut(BaseModel):
    id: int
    name: str
    capacity: int
    class Config:
        orm_mode = True

class SubjectOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class TimeSlotOut(BaseModel):
    id: int
    day_of_week: int
    start_time: time
    end_time: time
    class Config:
        orm_mode = True

class ScheduleOut(BaseModel):
    id: int
    class_id: int
    room_id: int | None
    subject_id: int
    teacher_id: int
    time_slot_id: int
    class Config:
        orm_mode = True
