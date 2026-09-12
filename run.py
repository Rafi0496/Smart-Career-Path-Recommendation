import uvicorn
import os
from app.config import settings

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"==================================================")
    print(f"  Smart Career Path v{settings.VERSION}")
    print(f"  Local Web App: http://127.0.0.1:{port}")
    print(f"  API Docs:     http://127.0.0.1:{port}/docs")
    print(f"==================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
