from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentOut

router = APIRouter()

@router.get("/", response_model=list[StudentOut])
async def list_students(db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin", "teacher"))):
    result = await db.execute(select(Student))
    return [s for s in result.scalars().all()]

@router.post("/", response_model=StudentOut)
async def create_student(payload: StudentCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles("admin"))):
    s = Student(**payload.model_dump())
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return s
