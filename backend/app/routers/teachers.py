from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherOut

router = APIRouter()

@router.get("/", response_model=list[TeacherOut])
async def list_teachers(db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    result = await db.execute(select(Teacher))
    return [t for t in result.scalars().all()]

@router.post("/", response_model=TeacherOut)
async def create_teacher(payload: TeacherCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    t = Teacher(**payload.model_dump())
    db.add(t)
    await db.commit()
    await db.refresh(t)
    return t
