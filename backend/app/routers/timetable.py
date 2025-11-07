from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.deps import get_db, require_roles
from app.models.timetable import SchoolClass, Room, Subject, TimeSlot, ScheduleEntry
from app.schemas.timetable import (
    ClassCreate, RoomCreate, SubjectCreate, TimeSlotCreate, ScheduleCreate,
    ClassOut, RoomOut, SubjectOut, TimeSlotOut, ScheduleOut
)

router = APIRouter()

# Basic masters
@router.post('/classes', response_model=ClassOut)
async def create_class(payload: ClassCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    c = SchoolClass(name=payload.name)
    db.add(c)
    await db.commit()
    await db.refresh(c)
    return c

@router.get('/classes', response_model=list[ClassOut])
async def list_classes(db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(SchoolClass))
    return [i for i in res.scalars().all()]

@router.post('/rooms', response_model=RoomOut)
async def create_room(payload: RoomCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    r = Room(name=payload.name, capacity=payload.capacity)
    db.add(r)
    await db.commit()
    await db.refresh(r)
    return r

@router.get('/rooms', response_model=list[RoomOut])
async def list_rooms(db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(Room))
    return [i for i in res.scalars().all()]

@router.post('/subjects', response_model=SubjectOut)
async def create_subject(payload: SubjectCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    s = Subject(name=payload.name)
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return s

@router.get('/subjects', response_model=list[SubjectOut])
async def list_subjects(db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(Subject))
    return [i for i in res.scalars().all()]

@router.post('/timeslots', response_model=TimeSlotOut)
async def create_timeslot(payload: TimeSlotCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    ts = TimeSlot(day_of_week=payload.day_of_week, start_time=payload.start_time, end_time=payload.end_time)
    db.add(ts)
    await db.commit()
    await db.refresh(ts)
    return ts

@router.get('/timeslots', response_model=list[TimeSlotOut])
async def list_timeslots(db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(TimeSlot))
    return [i for i in res.scalars().all()]

# Scheduling with conflict resolution
@router.post('/schedule', response_model=ScheduleOut)
async def create_schedule(payload: ScheduleCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    # Conflict checks: same timeslot cannot have
    # - the same class assigned to two subjects (uq_class_timeslot already enforces)
    # - the same teacher in another class
    # - the same room used for another class
    # Teacher conflict
    teacher_conf = await db.execute(select(ScheduleEntry).where(and_(ScheduleEntry.teacher_id==payload.teacher_id, ScheduleEntry.time_slot_id==payload.time_slot_id)))
    if teacher_conf.scalar_one_or_none():
        raise HTTPException(status_code=409, detail='Teacher has a conflicting class at this time')
    # Room conflict
    if payload.room_id is not None:
        room_conf = await db.execute(select(ScheduleEntry).where(and_(ScheduleEntry.room_id==payload.room_id, ScheduleEntry.time_slot_id==payload.time_slot_id)))
        if room_conf.scalar_one_or_none():
            raise HTTPException(status_code=409, detail='Room is already booked for this time slot')
    entry = ScheduleEntry(
        class_id=payload.class_id,
        room_id=payload.room_id,
        subject_id=payload.subject_id,
        teacher_id=payload.teacher_id,
        time_slot_id=payload.time_slot_id,
    )
    db.add(entry)
    try:
        await db.commit()
    except Exception:
        # Likely class-timeslot unique violation
        await db.rollback()
        raise HTTPException(status_code=409, detail='Class already has a subject in this time slot')
    await db.refresh(entry)
    return entry

@router.get('/schedule/by-class/{class_id}', response_model=list[ScheduleOut])
async def schedule_by_class(class_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','student'))):
    res = await db.execute(select(ScheduleEntry).where(ScheduleEntry.class_id==class_id))
    return [i for i in res.scalars().all()]

@router.get('/schedule/by-teacher/{teacher_id}', response_model=list[ScheduleOut])
async def schedule_by_teacher(teacher_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(ScheduleEntry).where(ScheduleEntry.teacher_id==teacher_id))
    return [i for i in res.scalars().all()]
