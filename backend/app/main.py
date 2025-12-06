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
            # Check connection info
            result = await session.execute(text("SELECT current_database(), current_user, inet_server_addr()"))
            db_info = result.one()
            print(f"🔌 App connected to: DB={db_info[0]}, User={db_info[1]}, IP={db_info[2]}")
            
            result = await session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = result.scalars().all()
            print(f"Tables found: {tables}")
            print(f"Tables found: {tables}")
            
            # Always run init_db to ensure migrations are applied (e.g. adding new cols)
            print("🔄 Running database initialization/migration check...")
            try:
                # Append backend root to path to import init_db
                import sys
                import os
                sys.path.append(os.getcwd()) 
                from init_db import init_db
                init_db()
                print("✅ Database initialization/migration completed.")
            except Exception as e:
                print(f"❌ Database initialization failed: {e}")
                # We log but might not want to kill the app if it's just a check
                
            break # Just need one session
    except Exception as e:
        print(f"❌ DB Check Failed: {e}")
    print("------------------------")