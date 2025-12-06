from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.api import api_router
from app.core.config import settings
import json

app = FastAPI(
    title="School Management System API",
    description="The API for the School Management System.",
    version="1.0.0",
)

# Parse BACKEND_CORS_ORIGINS correctly from environment variable
if settings.BACKEND_CORS_ORIGINS:
    try:
        # If it's a JSON string (e.g. '["https://frontend.onrender.com"]')
        origins = json.loads(settings.BACKEND_CORS_ORIGINS)
    except Exception:
        # If it's already a list or a comma-separated string
        if isinstance(settings.BACKEND_CORS_ORIGINS, str):
            origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",")]
        else:
            origins = settings.BACKEND_CORS_ORIGINS

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include the main API router
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to the School Management System API"}

@app.on_event("startup")
async def startup_db_check():
    from sqlalchemy import text
    from app.core.database import get_session
    print("--- STARTUP DB CHECK ---")
    try:
        async for session in get_session():
            result = await session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = result.scalars().all()
            print(f"Tables found: {tables}")
            if "users" in tables:
                print("✅ 'users' table exists.")
            else:
                print("❌ 'users' table MISSING!")
            break # Just need one session
    except Exception as e:
        print(f"❌ DB Check Failed: {e}")
    print("------------------------")