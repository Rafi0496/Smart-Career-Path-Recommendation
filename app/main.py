from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routers.api import api_router
from app.routers.pages import pages_router
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    init_db()
    print(f"[Smart Career Path] Python Full-Stack Engine Online on port {settings.PORT}")
    yield
    print("[Smart Career Path] Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Python Full-Stack AI Career Recommendation System & Intelligence Platform",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder safely (handles read-only filesystems in serverless)
try:
    settings.STATIC_DIR.mkdir(parents=True, exist_ok=True)
    (settings.STATIC_DIR / "css").mkdir(exist_ok=True)
    (settings.STATIC_DIR / "js").mkdir(exist_ok=True)
    settings.TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    pass

app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")

# Include routers
app.include_router(api_router)
app.include_router(pages_router)
