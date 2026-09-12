import sys
from pathlib import Path

# Add project root directory to sys.path so 'app' can be imported
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the FastAPI application
from app.main import app

# Expose both app and handler for Vercel ASGI serverless adapter
handler = app
