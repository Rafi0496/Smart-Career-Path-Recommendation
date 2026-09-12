from fastapi import APIRouter, HTTPException, UploadFile, File, Request, Response
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.core.career_engine import career_engine
from app.core.pdf_builder import build_executive_career_pdf
from app.core.ai_mentor import get_mentor_response
from app.core.resume_parser import parse_resume_to_profile
from app.core.quiz_engine import generate_quiz_questions
from app.core import database

api_router = APIRouter(prefix="/api")

# Pydantic Schemas
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    context: Optional[Dict[str, Any]] = None

class QuizRequest(BaseModel):
    career_id: str
    career_title: Optional[str] = None
    skills_to_develop: Optional[List[str]] = Field(default_factory=list)

class ExportPdfRequest(BaseModel):
    career: Dict[str, Any]
    user_name: Optional[str] = "Candidate"
    profile: Optional[Dict[str, Any]] = None

class ProgressRequest(BaseModel):
    userId: int
    careerTitle: str
    stepOrder: int

class AuthRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class AuthLoginRequest(BaseModel):
    emailOrName: str
    password: str

class AuthRecoverRequest(BaseModel):
    email: str
    name: str
    newPassword: str

# 1. Recommendation Endpoint
@api_router.post("/recommend")
async def get_recommendations(profile: Dict[str, Any]):
    if not profile:
        raise HTTPException(status_code=400, detail="Missing user profile payload")
    
    recommendations = career_engine.get_recommendations(profile, limit=5)
    return {
        "engine": "Python Hybrid Recommender (Semantic Vector + Feature Weighting)",
        "recommendations": recommendations
    }

# 2. Ask V ("V") Chat Endpoint
@api_router.post("/chat")
async def chat_with_mentor(req: ChatRequest):
    if not req.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    reply = await get_mentor_response(req.messages, req.context)
    return {"content": reply}

# 3. Resume Parser Endpoint
@api_router.post("/resume/parse")
async def parse_resume(
    file: Optional[UploadFile] = File(None),
    resume: Optional[UploadFile] = File(None)
):
    upload = file or resume
    if not upload or not upload.filename:
        raise HTTPException(status_code=400, detail="No PDF resume file provided")
    
    if not upload.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF")
    
    contents = await upload.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")

    profile = parse_resume_to_profile(contents, filename=upload.filename)
    return {
        "success": True,
        "filename": upload.filename,
        "profile": profile,
        "skillsFound": profile.get("interests", {}).get("skills", [])
    }

# 4. Diagnostic Quiz Generator Endpoint
@api_router.post("/quiz/generate")
async def generate_quiz(req: QuizRequest):
    title = req.career_title or req.career_id
    questions = generate_quiz_questions(req.career_id, title, req.skills_to_develop or [])
    return {
        "success": True,
        "career_id": req.career_id,
        "career_title": title,
        "questions": questions
    }

# 5. Executive PDF Blueprint Export Endpoint
@api_router.post("/export/pdf")
async def export_pdf(req: ExportPdfRequest):
    if not req.career or not req.career.get("careerTitle"):
        raise HTTPException(status_code=400, detail="career and careerTitle are required")

    career_title = req.career["careerTitle"]
    filename = f"{career_title.replace(' ', '_')}_Executive_Blueprint.pdf"
    
    pdf_bytes = build_executive_career_pdf(
        req.career,
        user_name=req.user_name or "Candidate",
        profile=req.profile
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

# 6. Learning Progress Sync
@api_router.post("/progress")
async def toggle_progress(req: ProgressRequest):
    completed = database.toggle_step_progress(req.userId, req.careerTitle, req.stepOrder)
    return {
        "success": True,
        "careerTitle": req.careerTitle,
        "completedSteps": completed
    }

@api_router.get("/progress")
async def get_progress(userId: int, careerTitle: Optional[str] = None):
    if careerTitle:
        steps = database.get_completed_steps(userId, careerTitle)
        return {"userId": userId, "careerTitle": careerTitle, "completedSteps": steps}
    all_p = database.get_all_progress(userId)
    return {"userId": userId, "allProgress": all_p}

# 7. User Authentication Endpoints
@api_router.post("/auth/register")
async def api_register(req: AuthRegisterRequest, response: Response):
    user = database.register_user(req.name, req.email, req.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already exists or invalid data")
    
    response.set_cookie(key="user_id", value=str(user["id"]), httponly=True, samesite="lax")
    return {"success": True, "user": user}

@api_router.post("/auth/login")
async def api_login(req: AuthLoginRequest, response: Response):
    user = database.authenticate_user(req.emailOrName, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    response.set_cookie(key="user_id", value=str(user["id"]), httponly=True, samesite="lax")
    return {"success": True, "user": user}

@api_router.post("/auth/logout")
async def api_logout(response: Response):
    response.delete_cookie(key="user_id")
    return {"success": True}

@api_router.post("/auth/recover")
async def api_recover(req: AuthRecoverRequest):
    user = database.verify_user_for_recovery(req.email, req.name)
    if not user:
        raise HTTPException(status_code=404, detail="No matching user account found")
    
    ok = database.update_user_password(user["id"], req.newPassword)
    if not ok:
        raise HTTPException(status_code=400, detail="Password update failed")
    
    return {"success": True, "message": "Password updated successfully"}

# 8. Career Metadata API
@api_router.get("/careers/all")
async def get_all_careers():
    return {
        "total": len(career_engine.careers),
        "careers": career_engine.get_categorized_careers()
    }

@api_router.get("/careers/titles")
async def get_all_career_titles():
    return career_engine.get_all_titles()

@api_router.get("/careers/{title}")
async def get_career_by_title(title: str):
    career = career_engine.get_career_by_title(title)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{title}' not found")
    return career

