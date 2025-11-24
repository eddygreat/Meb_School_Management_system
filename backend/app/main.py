from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.api import api_router
from app.core.config import settings

app = FastAPI(
    title="School Management System API",
    description="The API for the School Management System.",
    version="1.0.0",
)

origins = []

# Set all CORS enabled origins
if hasattr(settings, "BACKEND_CORS_ORIGINS") and settings.BACKEND_CORS_ORIGINS:
    origins.extend([str(origin) for origin in settings.BACKEND_CORS_ORIGINS])
else:
    # Default origins for local development
    origins.extend([
        "http://localhost",
        "http://localhost:3000", # Common for React
        "http://localhost:5173", # Common for Vite
        # "https://your-app-name.netlify.app" # TODO: Add your Netlify frontend URL
    ])

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