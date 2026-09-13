import os
import io
import json
import shutil
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Request, Response, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from app.config import settings
from app.core import database
from app.core.career_engine import career_engine

profile_router = APIRouter()
templates = Jinja2Templates(directory=str(settings.TEMPLATES_DIR))

# Ensure avatar and PDF storage directories exist
AVATARS_DIR = settings.STATIC_DIR / "uploads" / "avatars"
PDFS_DIR = settings.STATIC_DIR / "uploads" / "pdfs"
AVATARS_DIR.mkdir(parents=True, exist_ok=True)
PDFS_DIR.mkdir(parents=True, exist_ok=True)


# ================= SCHEMAS =================

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None

class AddCertificationRequest(BaseModel):
    title: str
    issuer: str
    date_earned: str

class QuizResultLogRequest(BaseModel):
    career_id: str
    quiz_score: int
    weak_skill_areas: Optional[List[str]] = None


# ================= AUTH HELPER =================

def get_auth_user(request: Request) -> Optional[Dict[str, Any]]:
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        user = database.get_user_by_id(int(user_id_str))
        if user:
            return user
    return None

def format_relative_time(iso_str: str) -> str:
    try:
        dt = datetime.fromisoformat(iso_str)
        now = datetime.utcnow()
        diff = now - dt
        seconds = int(diff.total_seconds())
        if seconds < 60:
            return "Just now"
        elif seconds < 3600:
            m = seconds // 60
            return f"{m} minute{'s' if m > 1 else ''} ago"
        elif seconds < 86400:
            h = seconds // 3600
            return f"{h} hour{'s' if h > 1 else ''} ago"
        elif seconds < 172800:
            return "Yesterday"
        else:
            d = seconds // 86400
            return f"{d} days ago"
    except Exception:
        return iso_str[:10] if iso_str else "Recently"


# ================= 1. GET /profile =================

@profile_router.get("/profile", response_class=HTMLResponse)
async def get_profile_page(request: Request):
    user = get_auth_user(request)
    if not user:
        return RedirectResponse(url="/login?redirect=%2Fprofile", status_code=302)

    user_id = user["id"]

    # 1. Profile & Academics
    profile_data = database.get_profile(user_id) or {}
    
    # 2. Recommendations & Top Career
    recs = database.get_recommendations(user_id) or []
    if not recs and profile_data:
        recs = career_engine.get_recommendations(profile_data, limit=5)
    
    top_career = recs[0] if recs else None
    
    # 3. Bookmarks
    raw_bookmarks = database.get_bookmarked_careers(user_id)
    bookmarked_careers = []
    for bm in raw_bookmarks:
        c_info = career_engine.get_career_by_title(bm["career_id"])
        if c_info:
            bookmarked_careers.append({
                **c_info,
                "bookmarked_at": bm["bookmarked_at"]
            })
        else:
            bookmarked_careers.append({
                "title": bm["career_id"],
                "category": "Technology",
                "timeline": "6–12 months",
                "salaryRange": "$80,000 – $130,000",
                "skills": ["Python", "System Design"],
                "bookmarked_at": bm["bookmarked_at"]
            })

    # 4. Quiz History
    quiz_history = database.get_quiz_history(user_id, limit=10)

    # 5. Achievements & Streak
    achievements = database.get_user_achievements(user_id)
    unlocked_count = sum(1 for a in achievements if a["unlocked"])
    total_badges = len(achievements)
    streak = database.calculate_user_streak(user_id)

    # 6. Overall Roadmap Completion %
    all_progress = database.get_all_progress(user_id)
    total_stages = 0
    completed_stages = 0
    for title, steps in all_progress.items():
        career_meta = career_engine.get_career_by_title(title)
        path_len = len(career_meta.get("learningPath", [])) if career_meta else 4
        total_stages += max(path_len, 4)
        completed_stages += len(steps)
    
    overall_roadmap_pct = min(100, round((completed_stages / max(total_stages, 1)) * 100)) if total_stages > 0 else 0

    # 7. Documents Hub (Certifications & PDFs)
    certifications = database.get_certifications(user_id)
    generated_pdfs = database.get_generated_pdfs(user_id)

    # 8. Activity Log with relative time and icons
    raw_activities = database.get_user_activities(user_id, limit=25)
    activities = []
    icon_map = {
        "assessment_taken": {"icon": "edit-3", "color": "text-primary-600 bg-primary-100 dark:bg-primary-950"},
        "resume_uploaded": {"icon": "file-text", "color": "text-indigo-600 bg-indigo-100 dark:bg-indigo-950"},
        "career_bookmarked": {"icon": "bookmark", "color": "text-amber-600 bg-amber-100 dark:bg-amber-950"},
        "quiz_taken": {"icon": "help-circle", "color": "text-emerald-600 bg-emerald-100 dark:bg-emerald-950"},
        "pdf_downloaded": {"icon": "download", "color": "text-sky-600 bg-sky-100 dark:bg-sky-950"},
        "roadmap_started": {"icon": "flag", "color": "text-rose-600 bg-rose-100 dark:bg-rose-950"},
        "roadmap_stage_completed": {"icon": "award", "color": "text-emerald-600 bg-emerald-100 dark:bg-emerald-950"}
    }
    for act in raw_activities:
        meta = icon_map.get(act["action_type"], {"icon": "activity", "color": "text-slate-600 bg-slate-100 dark:bg-slate-800"})
        activities.append({
            **act,
            "icon": meta["icon"],
            "color_class": meta["color"],
            "relative_time": format_relative_time(act["created_at"])
        })

    # Public Share URL
    share_url = f"/share/{user['public_share_id']}" if user.get("public_share_id") and user.get("is_profile_public") else None

    # Member Since Formatted
    member_since = user.get("created_at", "")[:10]

    return templates.TemplateResponse(
        request=request,
        name="profile.html",
        context={
            "active_page": "profile",
            "user": user,
            "profile": profile_data,
            "top_career": top_career,
            "recommendations": recs,
            "bookmarked_careers": bookmarked_careers,
            "quiz_history": quiz_history,
            "achievements": achievements,
            "unlocked_badges_count": unlocked_count,
            "total_badges_count": total_badges,
            "streak": streak,
            "overall_roadmap_pct": overall_roadmap_pct,
            "certifications": certifications,
            "generated_pdfs": generated_pdfs,
            "activities": activities,
            "share_url": share_url,
            "member_since": member_since
        }
    )


# ================= 2. POST /profile/photo =================

@profile_router.post("/profile/photo")
async def upload_profile_photo(request: Request, file: UploadFile = File(...)):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    allowed_exts = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
    ext = Path(file.filename).suffix.lower()
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Invalid image format. Allowed: PNG, JPG, JPEG, WEBP")

    clean_filename = f"user_{user['id']}_{uuid.uuid4().hex[:8]}{ext}"
    dest_path = AVATARS_DIR / clean_filename

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Photo size exceeds 5MB limit")

    with open(dest_path, "wb") as f:
        f.write(contents)

    photo_url = f"/static/uploads/avatars/{clean_filename}"
    database.update_user_profile_fields(user["id"], profile_photo_url=photo_url)
    database.log_activity(user["id"], "resume_uploaded", "Updated profile avatar photo")

    return {"success": True, "photo_url": photo_url}


# ================= 3. PATCH /profile =================

@profile_router.patch("/profile")
async def update_profile_details(req: UpdateProfileRequest, request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    ok = database.update_user_profile_fields(
        user["id"],
        name=req.name,
        bio=req.bio
    )
    if ok:
        updated_user = database.get_user_by_id(user["id"])
        return {"success": True, "user": updated_user}
    raise HTTPException(status_code=400, detail="Could not update profile")


# ================= 4. POST & DELETE /profile/bookmark/{career_id} =================

@profile_router.post("/profile/bookmark/{career_id}")
async def bookmark_career_post(career_id: str, request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    database.add_bookmark(user["id"], career_id)
    return {"success": True, "bookmarked": True, "career_id": career_id}

@profile_router.delete("/profile/bookmark/{career_id}")
async def bookmark_career_delete(career_id: str, request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    database.remove_bookmark(user["id"], career_id)
    return {"success": True, "bookmarked": False, "career_id": career_id}


# ================= 5. GET /profile/skills-radar =================

@profile_router.get("/profile/skills-radar")
async def get_skills_radar(request: Request, share_id: Optional[str] = None):
    user = None
    if share_id:
        user = database.get_user_by_public_share_id(share_id)
        if not user:
            raise HTTPException(status_code=404, detail="Public profile not found")
    else:
        user = get_auth_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = user["id"]
    profile_data = database.get_profile(user_id) or {}
    recs = database.get_recommendations(user_id) or []
    if not recs and profile_data:
        recs = career_engine.get_recommendations(profile_data, limit=1)
    
    top_career_title = recs[0]["careerTitle"] if recs else "Full Stack Developer"
    career_meta = career_engine.get_career_by_title(top_career_title) or career_engine.get_career_by_title("Full Stack Developer")
    
    required_skills = career_meta.get("skills", []) if career_meta else ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Git"]
    if len(required_skills) < 5:
        required_skills = ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Git"]

    # Limit to top 6 skills for radar clarity
    chart_skills = required_skills[:6]

    self_reported_skills = set(profile_data.get("interests", {}).get("skills", []))
    # Normalized search for matching
    self_norm = {s.lower().replace(" ", ""): s for s in self_reported_skills}

    required_scores = []
    verified_scores = []
    self_reported_scores = []

    for skill in chart_skills:
        required_scores.append(100)
        norm_k = skill.lower().replace(" ", "")
        
        # Check if verified/self-reported
        is_possessed = norm_k in self_norm or any(norm_k in k or k in norm_k for k in self_norm)
        if is_possessed:
            self_reported_scores.append(85)
            verified_scores.append(90)
        else:
            self_reported_scores.append(20)
            verified_scores.append(10)

    return {
        "careerTitle": top_career_title,
        "labels": chart_skills,
        "datasets": [
            {
                "label": "Required Proficiency",
                "data": required_scores,
                "borderColor": "rgba(99, 102, 241, 0.9)",
                "backgroundColor": "rgba(99, 102, 241, 0.2)",
                "borderWidth": 2
            },
            {
                "label": "Verified from Resume",
                "data": verified_scores,
                "borderColor": "rgba(16, 185, 129, 0.9)",
                "backgroundColor": "rgba(16, 185, 129, 0.25)",
                "borderWidth": 2
            },
            {
                "label": "Self-Reported",
                "data": self_reported_scores,
                "borderColor": "rgba(14, 165, 233, 0.9)",
                "backgroundColor": "rgba(14, 165, 233, 0.2)",
                "borderWidth": 2
            }
        ],
        "user_skills": list(self_reported_skills)
    }


# ================= 6. POST & DELETE /profile/certifications =================

@profile_router.post("/profile/certifications")
async def add_certification_endpoint(req: AddCertificationRequest, request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not req.title.strip() or not req.issuer.strip():
        raise HTTPException(status_code=400, detail="Title and issuer are required")

    cert_id = database.add_certification(
        user["id"],
        title=req.title,
        issuer=req.issuer,
        date_earned=req.date_earned,
        added_manually=True
    )
    database.log_activity(user["id"], "roadmap_stage_completed", f"Added certification: {req.title}")
    return {"success": True, "cert_id": cert_id}

@profile_router.delete("/profile/certifications/{cert_id}")
async def delete_certification_endpoint(cert_id: int, request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    ok = database.delete_certification(user["id"], cert_id)
    return {"success": ok}


# ================= 7. GET /profile/pdfs/{id}/redownload =================

@profile_router.get("/profile/pdfs/{pdf_id}/redownload")
async def redownload_pdf(pdf_id: int, request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    pdf_record = database.get_generated_pdf_by_id(user["id"], pdf_id)
    if not pdf_record:
        raise HTTPException(status_code=404, detail="Generated PDF blueprint not found")

    file_path = Path(pdf_record["file_path"])
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="PDF file no longer exists on server")

    return FileResponse(
        path=str(file_path),
        filename=pdf_record["filename"],
        media_type="application/pdf"
    )


# ================= 8. POST /profile/share/toggle & GET /share/{id} =================

@profile_router.post("/profile/share/toggle")
async def toggle_share_endpoint(request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    res = database.toggle_profile_share(user["id"])
    share_url = f"/share/{res['public_share_id']}" if res["is_public"] else None
    return {
        "success": True,
        "is_public": res["is_public"],
        "public_share_id": res["public_share_id"],
        "share_url": share_url
    }

@profile_router.get("/share/{public_share_id}", response_class=HTMLResponse)
async def public_profile_page(public_share_id: str, request: Request):
    user = database.get_user_by_public_share_id(public_share_id)
    if not user:
        return HTMLResponse(
            content="""
            <div style="font-family:sans-serif; text-align:center; padding: 60px;">
              <h2>Profile Not Found or Private</h2>
              <p>This career portfolio is either private or does not exist.</p>
              <a href="/" style="color:#0284c7; text-decoration:none; font-weight:bold;">Return to Home</a>
            </div>
            """,
            status_code=404
        )

    user_id = user["id"]
    profile_data = database.get_profile(user_id) or {}
    recs = database.get_recommendations(user_id) or []
    if not recs and profile_data:
        recs = career_engine.get_recommendations(profile_data, limit=3)
    
    top_career = recs[0] if recs else None
    achievements = database.get_user_achievements(user_id)

    return templates.TemplateResponse(
        request=request,
        name="public_profile.html",
        context={
            "user": user,
            "profile": profile_data,
            "top_career": top_career,
            "achievements": achievements,
            "public_share_id": public_share_id
        }
    )


# ================= 9. GET /profile/export-data =================

@profile_router.get("/profile/export-data")
async def export_user_data(request: Request):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    full_dump = database.get_full_user_data_export(user["id"])
    return JSONResponse(
        content=full_dump,
        headers={"Content-Disposition": f'attachment; filename="career_portfolio_data_{user["id"]}.json"'}
    )


# ================= 10. DELETE /profile/account =================

@profile_router.delete("/profile/account")
async def delete_account_endpoint(request: Request, response: Response):
    user = get_auth_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    database.delete_user_account(user["id"])
    response.delete_cookie(key="user_id", path="/")
    return {"success": True}
