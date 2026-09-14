import os
import re
from pathlib import Path
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

class QuizResultRequest(BaseModel):
    career_id: str
    quiz_score: int
    weak_skills: Optional[List[str]] = Field(default_factory=list)

class ExportPdfRequest(BaseModel):
    career: Dict[str, Any]
    user_name: Optional[str] = "Professional"
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
async def chat_with_v(req: ChatRequest):
    if not req.messages:
        raise HTTPException(status_code=400, detail="No chat messages provided")
    
    response = get_mentor_response(req.messages, context=req.context)
    return response

# 3. Native Python PDF Resume Parser Endpoint
@api_router.post("/resume/parse")
async def parse_resume(
    request: Request,
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

    user_hint = None
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        with database.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM users WHERE id = ?", (int(user_id_str),))
            row = cursor.fetchone()
            if row:
                user_hint = row["name"]

    profile = parse_resume_to_profile(contents, filename=upload.filename, user_hint=user_hint)

    if user_id_str and user_id_str.isdigit():
        uid = int(user_id_str)
        try:
            database.log_activity(uid, "resume_uploaded", f"Uploaded resume: {upload.filename}")
            database.check_and_unlock_achievements(uid, "first_resume")
        except Exception:
            pass

    return {
        "success": True,
        "filename": upload.filename,
        "profile": profile,
        "skillsFound": profile.get("interests", {}).get("skills", [])
    }

# 4. Diagnostic Quiz Generator & Result Logger Endpoints
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

@api_router.post("/quiz/result")
async def save_quiz_result(req: QuizResultRequest, request: Request):
    user_id = None
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        user_id = int(user_id_str)
    if user_id:
        database.log_quiz_result(user_id, req.career_id, req.quiz_score, req.weak_skills)
        return {"success": True}
    return {"success": False, "message": "Not authenticated"}

# 5. Executive PDF Blueprint Export Endpoint (POST & GET supported)
@api_router.post("/export/pdf")
async def export_pdf(req: ExportPdfRequest, request: Request):
    career_dict = req.career or {}
    career_title = career_dict.get("careerTitle") or career_dict.get("title") or "Software Developer"
    
    # Enrich with full career engine data if milestones or skills are partial
    full_career = career_engine.get_career_by_title(career_title)
    if full_career:
        merged_career = {**full_career, **career_dict}
    else:
        merged_career = career_dict

    user_name = req.user_name or "Professional"
    user_id = None
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        user_id = int(user_id_str)
        with database.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row and row["name"]:
                user_name = row["name"]

    filename = f"{career_title.replace(' ', '_')}_Executive_Blueprint.pdf"
    
    pdf_bytes = build_executive_career_pdf(
        merged_career,
        user_name=user_name,
        profile=req.profile
    )

    # Persist PDF file for instant re-download
    pdf_dir = Path("app/static/uploads/pdfs")
    pdf_dir.mkdir(parents=True, exist_ok=True)
    clean_fn = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
    file_path = str(pdf_dir / clean_fn)
    try:
        with open(file_path, "wb") as f:
            f.write(pdf_bytes)
        if user_id:
            database.save_generated_pdf_record(user_id, career_title, clean_fn, file_path)
            database.log_activity(user_id, "pdf_downloaded", f"Downloaded Executive PDF for {career_title}")
    except Exception:
        pass

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@api_router.get("/export/pdf")
async def export_pdf_get(title: str, request: Request, user_name: Optional[str] = "Professional"):
    career_title = title or "Software Developer"
    full_career = career_engine.get_career_by_title(career_title)
    if not full_career:
        full_career = career_engine.get_career_by_title("Software Developer")

    name = user_name or "Professional"
    user_id = None
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        user_id = int(user_id_str)
        with database.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row and row["name"]:
                name = row["name"]

    filename = f"{career_title.replace(' ', '_')}_Executive_Blueprint.pdf"
    pdf_bytes = build_executive_career_pdf(
        full_career,
        user_name=name
    )

    pdf_dir = Path("app/static/uploads/pdfs")
    pdf_dir.mkdir(parents=True, exist_ok=True)
    clean_fn = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
    file_path = str(pdf_dir / clean_fn)
    try:
        with open(file_path, "wb") as f:
            f.write(pdf_bytes)
        if user_id:
            database.save_generated_pdf_record(user_id, career_title, clean_fn, file_path)
            database.log_activity(user_id, "pdf_downloaded", f"Downloaded Executive PDF for {career_title}")
    except Exception:
        pass

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

# 6. Learning Progress Sync
@api_router.post("/progress")
async def toggle_progress(req: ProgressRequest):
    completed = database.toggle_step_progress(req.userId, req.careerTitle, req.stepOrder)
    try:
        database.log_activity(req.userId, "roadmap_stage_completed", f"Progressed milestone #{req.stepOrder} for {req.careerTitle}")
        database.check_and_unlock_achievements(req.userId, "roadmap_stage_completed")
    except Exception:
        pass
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

# 7. User Authentication & Profile Endpoints
@api_router.post("/auth/register")
async def api_register(req: AuthRegisterRequest, response: Response):
    user = database.register_user(req.name, req.email, req.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already exists or invalid data")
    
    response.set_cookie(key="user_id", value=str(user["id"]), path="/", httponly=False, samesite="lax")
    return {"success": True, "user": user}

@api_router.post("/auth/login")
async def api_login(req: AuthLoginRequest, response: Response):
    user = database.authenticate_user(req.emailOrName, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    response.set_cookie(key="user_id", value=str(user["id"]), path="/", httponly=False, samesite="lax")
    
    profile = database.get_profile(user["id"])
    recommendations = database.get_recommendations(user["id"])
    favorites = database.get_favorites(user["id"])
    progress = database.get_all_progress(user["id"])

    return {
        "success": True,
        "user": user,
        "profile": profile,
        "recommendations": recommendations,
        "favorites": favorites,
        "progress": progress
    }

@api_router.post("/auth/logout")
async def api_logout(response: Response):
    response.delete_cookie(key="user_id", path="/", samesite="lax", httponly=False)
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

@api_router.post("/user/profile")
async def save_user_profile(req: Dict[str, Any], request: Request):
    user_id = None
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        user_id = int(user_id_str)
    elif "userId" in req and str(req["userId"]).isdigit():
        user_id = int(req["userId"])
    
    profile_data = req.get("profile", req)
    if user_id and profile_data:
        database.save_profile(user_id, profile_data)
        return {"success": True, "userId": user_id}
    return {"success": False, "message": "User not authenticated or empty profile"}

@api_router.get("/user/profile")
async def get_user_profile(request: Request, userId: Optional[int] = None):
    user_id = userId
    if not user_id:
        user_id_str = request.cookies.get("user_id")
        if user_id_str and user_id_str.isdigit():
            user_id = int(user_id_str)
    if not user_id:
        return {"success": False, "profile": None}
    profile = database.get_profile(user_id)
    return {"success": True, "userId": user_id, "profile": profile}

@api_router.post("/user/recommendations")
async def save_user_recommendations(req: Dict[str, Any], request: Request):
    user_id = None
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        user_id = int(user_id_str)
    elif "userId" in req and str(req["userId"]).isdigit():
        user_id = int(req["userId"])
    
    recs = req.get("recommendations", [])
    if user_id and recs:
        database.save_recommendations(user_id, recs)
        return {"success": True, "userId": user_id}
    return {"success": False, "message": "User not authenticated or empty recommendations"}

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

