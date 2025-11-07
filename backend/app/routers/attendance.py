from datetime import datetime, timedelta
import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.deps import get_db, require_roles
from app.models.attendance import AttendanceSession, AttendanceRecord, AttendanceMethod
from app.schemas.attendance import (
    AttendanceSessionCreate,
    AttendanceSessionOut,
    CheckInByToken,
    CheckInManual,
    AttendanceRecordOut,
)

router = APIRouter()

@router.post("/session", response_model=AttendanceSessionOut)
async def create_session(payload: AttendanceSessionCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "teacher"))):
    token = secrets.token_urlsafe(16)
    now = datetime.utcnow()
    session = AttendanceSession(
        class_name=payload.class_name,
        created_by_user_id=user.id,
        token=token,
        starts_at=now,
        ends_at=now + timedelta(minutes=payload.duration_minutes),
        is_active=True,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

@router.get("/session/{session_id}", response_model=AttendanceSessionOut)
async def get_session(session_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "teacher"))):
    res = await db.execute(select(AttendanceSession).where(AttendanceSession.id == session_id))
    session = res.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/session/{session_id}/close", response_model=AttendanceSessionOut)
async def close_session(session_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "teacher"))):
    res = await db.execute(select(AttendanceSession).where(AttendanceSession.id == session_id))
    session = res.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.is_active = False
    session.ends_at = datetime.utcnow()
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

@router.post("/checkin/qr", response_model=AttendanceRecordOut)
async def checkin_qr(payload: CheckInByToken, db: AsyncSession = Depends(get_db)):
    sess = await AttendanceSession.get_by_token(db, payload.token)
    if not sess:
        raise HTTPException(status_code=404, detail="Invalid token")
    if not sess.is_active or datetime.utcnow() > sess.ends_at:
        raise HTTPException(status_code=400, detail="Session expired or inactive")
    # avoid duplicate
    existing = await db.execute(
        select(AttendanceRecord).where(and_(AttendanceRecord.session_id == sess.id, AttendanceRecord.student_id == payload.student_id))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already checked in")
    rec = AttendanceRecord(session_id=sess.id, student_id=payload.student_id, method=AttendanceMethod.qr.value, status="present")
    db.add(rec)
    await db.commit()
    await db.refresh(rec)
    return rec

@router.post("/checkin/manual", response_model=AttendanceRecordOut)
async def checkin_manual(payload: CheckInManual, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "teacher"))):
    res = await db.execute(select(AttendanceSession).where(AttendanceSession.id == payload.session_id))
    sess = res.scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    existing = await db.execute(
        select(AttendanceRecord).where(and_(AttendanceRecord.session_id == sess.id, AttendanceRecord.student_id == payload.student_id))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already checked in")
    rec = AttendanceRecord(session_id=sess.id, student_id=payload.student_id, method=AttendanceMethod.manual.value, status="present")
    db.add(rec)
    await db.commit()
    await db.refresh(rec)
    return rec

@router.get("/session/{session_id}/records", response_model=list[AttendanceRecordOut])
async def list_records(session_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "teacher"))):
    res = await db.execute(select(AttendanceRecord).where(AttendanceRecord.session_id == session_id))
    return [r for r in res.scalars().all()]
