from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles, get_current_user
from app.models.discipline import DisciplineIncident
from app.schemas.discipline import IncidentCreate, IncidentUpdate, IncidentOut
from app.utils.audit import write_audit

router = APIRouter()

@router.post('/incidents', response_model=IncidentOut)
async def create_incident(payload: IncidentCreate, db: AsyncSession = Depends(get_db), current=Depends(get_current_user), user=Depends(require_roles('admin','teacher'))):
    inc = DisciplineIncident(student_id=payload.student_id, reported_by_user_id=current.id, category=payload.category, description=payload.description)
    db.add(inc)
    await db.commit()
    await db.refresh(inc)
    await write_audit(db, current.id, 'discipline.create', f'incident:{inc.id}')
    return inc

@router.get('/incidents', response_model=list[IncidentOut])
async def list_incidents(student_id: int | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    stmt = select(DisciplineIncident)
    if student_id:
        stmt = stmt.where(DisciplineIncident.student_id == student_id)
    res = await db.execute(stmt)
    return [i for i in res.scalars().all()]

@router.post('/incidents/{incident_id}/status', response_model=IncidentOut)
async def update_incident_status(incident_id: int, payload: IncidentUpdate, db: AsyncSession = Depends(get_db), current=Depends(get_current_user), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(DisciplineIncident).where(DisciplineIncident.id == incident_id))
    inc = res.scalar_one_or_none()
    if not inc:
        raise HTTPException(status_code=404, detail='Incident not found')
    inc.status = payload.status
    db.add(inc)
    await db.commit()
    await db.refresh(inc)
    await write_audit(db, current.id, 'discipline.update_status', f'incident:{inc.id}')
    return inc
