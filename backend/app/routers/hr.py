from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles
from app.models.hr import EmployeeProfile, Payroll, LeaveRequest, PerformanceRecord
from app.schemas.hr import (
    EmployeeProfileCreate, EmployeeProfileOut,
    PayrollCreate, PayrollOut,
    LeaveRequestCreate, LeaveRequestUpdate, LeaveRequestOut,
    PerformanceRecordCreate, PerformanceRecordOut,
)

router = APIRouter()

# Employee Profile
@router.post('/employee', response_model=EmployeeProfileOut)
async def create_employee(payload: EmployeeProfileCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    ep = EmployeeProfile(teacher_id=payload.teacher_id, position=payload.position, salary=payload.salary)
    db.add(ep)
    await db.commit()
    await db.refresh(ep)
    return ep

@router.get('/employee/{teacher_id}', response_model=EmployeeProfileOut | None)
async def get_employee(teacher_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.teacher_id == teacher_id))
    return res.scalar_one_or_none()

# Payroll
@router.post('/payroll', response_model=PayrollOut)
async def create_payroll(payload: PayrollCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    net = float(payload.gross) - float(payload.deductions or 0)
    pr = Payroll(teacher_id=payload.teacher_id, month=payload.month, gross=payload.gross, deductions=payload.deductions or 0, net=net)
    db.add(pr)
    await db.commit()
    await db.refresh(pr)
    return pr

@router.get('/payroll/{teacher_id}', response_model=list[PayrollOut])
async def list_payroll(teacher_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(Payroll).where(Payroll.teacher_id == teacher_id))
    return [i for i in res.scalars().all()]

# Leave
@router.post('/leave', response_model=LeaveRequestOut)
async def request_leave(payload: LeaveRequestCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('teacher','admin'))):
    lr = LeaveRequest(**payload.model_dump())
    db.add(lr)
    await db.commit()
    await db.refresh(lr)
    return lr

@router.get('/leave/{teacher_id}', response_model=list[LeaveRequestOut])
async def list_leave(teacher_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(LeaveRequest).where(LeaveRequest.teacher_id == teacher_id))
    return [i for i in res.scalars().all()]

@router.post('/leave/{leave_id}/status', response_model=LeaveRequestOut)
async def update_leave_status(leave_id: int, payload: LeaveRequestUpdate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    res = await db.execute(select(LeaveRequest).where(LeaveRequest.id == leave_id))
    lr = res.scalar_one_or_none()
    if not lr:
        raise HTTPException(status_code=404, detail='Leave not found')
    lr.status = payload.status
    db.add(lr)
    await db.commit()
    await db.refresh(lr)
    return lr

# Performance
@router.post('/performance', response_model=PerformanceRecordOut)
async def add_performance(payload: PerformanceRecordCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin'))):
    pr = PerformanceRecord(**payload.model_dump())
    db.add(pr)
    await db.commit()
    await db.refresh(pr)
    return pr

@router.get('/performance/{teacher_id}', response_model=list[PerformanceRecordOut])
async def list_performance(teacher_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(PerformanceRecord).where(PerformanceRecord.teacher_id == teacher_id))
    return [i for i in res.scalars().all()]
