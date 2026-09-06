import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.resume_extractor import resume_extractor

logger = logging.getLogger("python-service.routers.resume")

router = APIRouter(prefix="/resume", tags=["Resume Parser"])

@router.post("/parse")
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """
    Parses an uploaded PDF resume using pdfplumber and spaCy NER.
    Extracts name, education level, stream, technical skills, tools,
    certifications, and experience. Returns JSON shaped to pre-fill the assessment form.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a valid PDF document."
        )

    try:
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        extracted = resume_extractor.parse_resume(file_bytes)
        return {
            "success": True,
            "filename": file.filename,
            "profile": extracted,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Resume extraction failed: {str(e)}")
