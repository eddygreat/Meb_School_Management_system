from fastapi import APIRouter
from . import auth, security

api_router = APIRouter()

# Include your other routers here.
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(security.router, prefix="/security", tags=["Security"])
# api_router.include_router(students.router, prefix="/students", tags=["Students"])