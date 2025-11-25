from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.api import api_router
from app.core.config import settings
import os

app = FastAPI(
    title="School Management System API",
    description="The API for the School Management System.",
    version="1.0.0",
)

# Define the list of allowed origins (frontends) that can talk to this backend.
origins = [
    # Your deployed Netlify frontend URL
    "https://mebschoolmanagementsystem.netlify.app",
    
    # URLs for local development
    "http://localhost:5173", # Default for Vite
    "http://localhost:3000", # Common for Create React App
]

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