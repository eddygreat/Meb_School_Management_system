from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import require_roles, get_db, get_current_user
from app.models.comms import MessageThread, Message, Announcement, Notification
from app.schemas.comms import (
    ThreadCreate, ThreadOut,
    MessageCreate, MessageOut,
    AnnouncementCreate, AnnouncementOut,
    NotificationOut,
)

router = APIRouter()

# Threads
@router.post('/threads', response_model=ThreadOut)
async def create_thread(payload: ThreadCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('teacher','parent','admin'))):
    t = MessageThread(teacher_id=payload.teacher_id, parent_user_id=payload.parent_user_id, subject=payload.subject)
    db.add(t)
    await db.commit()
    await db.refresh(t)
    return t

@router.get('/threads', response_model=list[ThreadOut])
async def list_threads(teacher_id: int | None = None, parent_user_id: int | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('teacher','parent','admin'))):
    stmt = select(MessageThread)
    if teacher_id:
        stmt = stmt.where(MessageThread.teacher_id == teacher_id)
    if parent_user_id:
        stmt = stmt.where(MessageThread.parent_user_id == parent_user_id)
    res = await db.execute(stmt)
    return [i for i in res.scalars().all()]

# Messages
@router.get('/threads/{thread_id}/messages', response_model=list[MessageOut])
async def list_messages(thread_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('teacher','parent','admin'))):
    res = await db.execute(select(Message).where(Message.thread_id == thread_id))
    return [m for m in res.scalars().all()]

@router.post('/messages', response_model=MessageOut)
async def send_message(payload: MessageCreate, db: AsyncSession = Depends(get_db), current=Depends(get_current_user)):
    msg = Message(thread_id=payload.thread_id, sender_user_id=current.id, body=payload.body)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

# Announcements
@router.post('/announce', response_model=AnnouncementOut)
async def announce(payload: AnnouncementCreate, db: AsyncSession = Depends(get_db), current=Depends(require_roles('admin'))):
    a = Announcement(title=payload.title, body=payload.body, audience_role=payload.audience_role, created_by_user_id=current.id)
    db.add(a)
    await db.commit()
    await db.refresh(a)
    return a

@router.get('/announcements', response_model=list[AnnouncementOut])
async def list_announcements(audience_role: str | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','parent','student'))):
    stmt = select(Announcement)
    if audience_role and audience_role != 'all':
        stmt = stmt.where(Announcement.audience_role.in_([audience_role, 'all']))
    res = await db.execute(stmt)
    return [a for a in res.scalars().all()]

# Notifications (read-only + mark-read)
@router.get('/notifications', response_model=list[NotificationOut])
async def list_notifications(user_id: int, db: AsyncSession = Depends(get_db), current=Depends(require_roles('admin','teacher','parent','student'))):
    res = await db.execute(select(Notification).where(Notification.user_id == user_id))
    return [n for n in res.scalars().all()]

@router.post('/notifications/{notification_id}/read')
async def mark_read(notification_id: int, db: AsyncSession = Depends(get_db), current=Depends(require_roles('admin','teacher','parent','student'))):
    res = await db.execute(select(Notification).where(Notification.id == notification_id))
    n = res.scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail='Not found')
    n.is_read = True
    db.add(n)
    await db.commit()
    return {"ok": True}
