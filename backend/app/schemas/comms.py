from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ThreadCreate(BaseModel):
    teacher_id: int | None = None
    parent_user_id: int | None = None
    subject: str

class ThreadOut(BaseModel):
    id: int
    teacher_id: int | None
    parent_user_id: int | None
    subject: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MessageCreate(BaseModel):
    thread_id: int
    body: str

class MessageOut(BaseModel):
    id: int
    thread_id: int
    sender_user_id: int | None
    body: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AnnouncementCreate(BaseModel):
    title: str
    body: str
    audience_role: str = "all"

class AnnouncementOut(BaseModel):
    id: int
    title: str
    body: str
    audience_role: str
    created_by_user_id: int | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    payload: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
