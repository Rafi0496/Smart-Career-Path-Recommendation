import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load local environment variables (.env)
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("python-service")

from services.embeddings import embedding_service
from routers import recommend, resume, quiz, export

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Precompute and cache career embeddings
    logger.info("Starting up Smart Career Path Python ML Microservice...")
    try:
        embedding_service.initialize_model()
        logger.info("Career embedding cache ready.")
    except Exception as e:
        logger.exception(f"Failed to initialize embeddings on startup: {e}")
    yield
    # Shutdown
    logger.info("Shutting down Python ML Microservice...")

app = FastAPI(
    title="Smart Career Path Recommendation Engine - AI/ML Microservice",
    description="Python FastAPI brain handling sentence-transformers embeddings, hybrid recommender, spaCy resume parser, skill-gap quiz generation, and WeasyPrint PDF export.",
    version="2.0.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(recommend.router)
app.include_router(resume.router)
app.include_router(quiz.router)
app.include_router(export.router)

@app.get("/")
async def root():
    return {
        "service": "Smart Career Path AI/ML Microservice",
        "status": "online",
        "version": "2.0.0",
        "endpoints": [
            "POST /recommend",
            "POST /resume/parse",
            "POST /quiz/generate",
            "POST /export/pdf",
            "GET /health"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "careers_loaded": len(embedding_service.careers),
        "embeddings_ready": embedding_service.embeddings is not None,
        "model_type": "sentence-transformers" if embedding_service.is_sentence_transformer else "scikit-learn-tfidf",
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
