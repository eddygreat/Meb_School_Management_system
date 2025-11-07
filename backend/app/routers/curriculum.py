from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import get_db, require_roles
from app.models.curriculum import LessonPlan, Resource, Assignment, Submission
from app.schemas.curriculum import (
    LessonPlanCreate, LessonPlanOut,
    ResourceCreate, ResourceOut,
    AssignmentCreate, AssignmentOut,
    SubmissionCreate, SubmissionGrade, SubmissionOut,
)

router = APIRouter()

# Lesson Plans
@router.post('/lesson-plans', response_model=LessonPlanOut)
async def create_lesson_plan(payload: LessonPlanCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    lp = LessonPlan(**payload.model_dump())
    db.add(lp)
    await db.commit()
    await db.refresh(lp)
    return lp

@router.get('/lesson-plans', response_model=list[LessonPlanOut])
async def list_lesson_plans(teacher_id: int | None = None, subject_id: int | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','student'))):
    stmt = select(LessonPlan)
    if teacher_id:
        stmt = stmt.where(LessonPlan.teacher_id == teacher_id)
    if subject_id:
        stmt = stmt.where(LessonPlan.subject_id == subject_id)
    res = await db.execute(stmt)
    return [i for i in res.scalars().all()]

# Resources
@router.post('/resources', response_model=ResourceOut)
async def create_resource(payload: ResourceCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    r = Resource(**payload.model_dump())
    db.add(r)
    await db.commit()
    await db.refresh(r)
    return r

@router.get('/resources', response_model=list[ResourceOut])
async def list_resources(subject_id: int | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','student'))):
    stmt = select(Resource)
    if subject_id:
        stmt = stmt.where(Resource.subject_id == subject_id)
    res = await db.execute(stmt)
    return [i for i in res.scalars().all()]

# Assignments
@router.post('/assignments', response_model=AssignmentOut)
async def create_assignment(payload: AssignmentCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    a = Assignment(**payload.model_dump())
    db.add(a)
    await db.commit()
    await db.refresh(a)
    return a

@router.get('/assignments', response_model=list[AssignmentOut])
async def list_assignments(class_id: int | None = None, subject_id: int | None = None, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','student'))):
    stmt = select(Assignment)
    if class_id:
        stmt = stmt.where(Assignment.class_id == class_id)
    if subject_id:
        stmt = stmt.where(Assignment.subject_id == subject_id)
    res = await db.execute(stmt)
    return [i for i in res.scalars().all()]

# Submissions
@router.post('/submissions', response_model=SubmissionOut)
async def submit_assignment(payload: SubmissionCreate, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher','student'))):
    s = Submission(**payload.model_dump())
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return s

@router.get('/submissions', response_model=list[SubmissionOut])
async def list_submissions(assignment_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(Submission).where(Submission.assignment_id == assignment_id))
    return [i for i in res.scalars().all()]

@router.post('/submissions/grade', response_model=SubmissionOut)
async def grade_submission(payload: SubmissionGrade, db: AsyncSession = Depends(get_db), user=Depends(require_roles('admin','teacher'))):
    res = await db.execute(select(Submission).where(Submission.id == payload.submission_id))
    s = res.scalar_one_or_none()
    if not s:
        raise HTTPException(status_code=404, detail='Submission not found')
    s.score = payload.score
    s.feedback = payload.feedback
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return s
