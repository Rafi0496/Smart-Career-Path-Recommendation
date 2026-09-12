import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env / .env.local
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "Smart Career Path"
    VERSION: str = "3.0.0"
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    IS_VERCEL: bool = bool(os.getenv("VERCEL") or os.getenv("VERCEL_ENV") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))
    
    # Paths
    STATIC_DIR: Path = BASE_DIR / "app" / "static"
    TEMPLATES_DIR: Path = BASE_DIR / "app" / "templates"
    DATA_DIR: Path = BASE_DIR / "app" / "data"

    # Database
    DATABASE_PATH: Path = (Path("/tmp") / "career_path.db") if IS_VERCEL else (BASE_DIR / "career_path.db")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DATABASE_PATH.as_posix()}")

settings = Settings()
