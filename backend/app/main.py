from fastapi import FastAPI
from app.routers.api import api_router

app = FastAPI(
    title="School Management System API",
    description="The API for the School Management System.",
    version="1.0.0",
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the School Management System API"}