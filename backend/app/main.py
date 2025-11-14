from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.api import api_router
from app.core.config import settings

app = FastAPI(
    title="School Management System API",
    description="The API for the School Management System.",
    version="1.0.0",
)
# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
# Include the main API router
app.include_router(api_router, prefix=settings.API_PREFIX)
 
@app.get("/")
async def root():
    return {"message": "Welcome to the School Management System API"}