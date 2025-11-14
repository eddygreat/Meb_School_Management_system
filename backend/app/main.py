from fastapi import FastAPI
from app.routers.api import api_router
from app.routers import auth  # ✅ Import the auth router
from app.core.config import settings  # ✅ Import settings if using API_PREFIX

app = FastAPI(
    title="School Management System API",
    description="The API for the School Management System.",
    version="1.0.0",
)

# Include the main API router
app.include_router(api_router, prefix="/api")

# Include the auth router with prefix from settings
app.include_router(auth.router, prefix=settings.API_PREFIX + "/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to the School Management System API"}