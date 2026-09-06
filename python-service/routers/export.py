import io
import re
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from services.pdf_builder import pdf_builder

logger = logging.getLogger("python-service.routers.export")

router = APIRouter(prefix="/export", tags=["PDF Roadmap Export"])

class ExportPdfRequest(BaseModel):
    career: Dict[str, Any]
    user_name: Optional[str] = "Candidate"

@router.post("/pdf")
async def export_pdf(payload: ExportPdfRequest):
    """
    Renders the career roadmap into a styled PDF document using Jinja2 and WeasyPrint.
    Returns downloadable PDF stream.
    """
    try:
        career = payload.career
        user_name = payload.user_name or "Candidate"

        if not career or not career.get("careerTitle"):
            raise HTTPException(status_code=400, detail="Invalid roadmap: careerTitle is required.")

        pdf_bytes = pdf_builder.generate_pdf(career, user_name)

        title_slug = re.sub(r"[^a-zA-Z0-9_\-]+", "_", career.get("careerTitle", "Career_Roadmap"))
        filename = f"{title_slug}_Roadmap.pdf"

        # Check if output is raw PDF or HTML fallback
        is_real_pdf = pdf_bytes.startswith(b"%PDF")
        media_type = "application/pdf" if is_real_pdf else "application/pdf"

        return Response(
            content=pdf_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf",
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"PDF export error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
