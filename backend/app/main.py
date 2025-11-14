from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.routers.api import api_router
import os

app = FastAPI(title=settings.APP_NAME)
STATIC_DIR = "/app/static"

# CORS Middleware to allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the aggregated API router
app.mount(settings.API_PREFIX, api_router)

# Mount the static files server for the frontend assets
app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

# Catch-all route to serve the frontend's index.html for client-side routing
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))
