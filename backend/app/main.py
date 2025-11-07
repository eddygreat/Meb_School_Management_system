from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, students, teachers, grades, fees, comms, analytics, admin, attendance, biometric, timetable, curriculum, hr, security, settings as settings_router, discipline

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(auth.router, prefix=settings.API_PREFIX + "/auth", tags=["auth"]) 
app.include_router(students.router, prefix=settings.API_PREFIX + "/students", tags=["students"]) 
app.include_router(teachers.router, prefix=settings.API_PREFIX + "/teachers", tags=["teachers"]) 
app.include_router(grades.router, prefix=settings.API_PREFIX + "/grades", tags=["grades"]) 
app.include_router(fees.router, prefix=settings.API_PREFIX + "/fees", tags=["fees"]) 
app.include_router(comms.router, prefix=settings.API_PREFIX + "/comms", tags=["comms"]) 
app.include_router(analytics.router, prefix=settings.API_PREFIX + "/analytics", tags=["analytics"]) 
app.include_router(admin.router, prefix=settings.API_PREFIX + "/admin", tags=["admin"]) 
app.include_router(attendance.router, prefix=settings.API_PREFIX + "/attendance", tags=["attendance"]) 
app.include_router(biometric.router, prefix=settings.API_PREFIX + "/biometric", tags=["biometric"]) 
app.include_router(timetable.router, prefix=settings.API_PREFIX + "/timetable", tags=["timetable"]) 
app.include_router(curriculum.router, prefix=settings.API_PREFIX + "/curriculum", tags=["curriculum"]) 
app.include_router(hr.router, prefix=settings.API_PREFIX + "/hr", tags=["hr"]) 
app.include_router(security.router, prefix=settings.API_PREFIX + "/security", tags=["security"]) 
app.include_router(settings_router.router, prefix=settings.API_PREFIX + "/settings", tags=["settings"]) 
app.include_router(discipline.router, prefix=settings.API_PREFIX + "/discipline", tags=["discipline"]) 

@app.get(settings.API_PREFIX + "/health")
async def health():
    return {"status": "ok"}
