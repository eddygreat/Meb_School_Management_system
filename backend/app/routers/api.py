from fastapi import APIRouter

from app.routers import (
    admin, analytics, attendance, auth, biometric, comms, curriculum, discipline,
    fees, grades, hr, security, settings_router, students, teachers, timetable
)

api_router = APIRouter()

api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(biometric.router, prefix="/biometric", tags=["biometric"])
api_router.include_router(comms.router, prefix="/comms", tags=["comms"])
api_router.include_router(curriculum.router, prefix="/curriculum", tags=["curriculum"])
api_router.include_router(discipline.router, prefix="/discipline", tags=["discipline"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
api_router.include_router(grades.router, prefix="/grades", tags=["grades"])
api_router.include_router(hr.router, prefix="/hr", tags=["hr"])
api_router.include_router(security.router, prefix="/security", tags=["security"])
api_router.include_router(settings_router.router, prefix="/settings", tags=["settings"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(timetable.router, prefix="/timetable", tags=["timetable"])

@api_router.get("/health")
async def health():
    return {"status": "ok"}