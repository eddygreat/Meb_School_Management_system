from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, students, teachers, grades, fees, comms, analytics, admin, attendance, biometric, timetable, curriculum, hr, security, settings as settings_router, discipline
import os

app = FastAPI(title=settings.APP_NAME)

@app.on_event("startup")
async def on_startup():
    if os.environ.get("RUN_DB_MIGRATIONS"):
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

# This must be mounted before the catch-all route
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """Catch-all to serve the React index.html for any non-API route."""
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "React app not found. Please build the frontend."}
