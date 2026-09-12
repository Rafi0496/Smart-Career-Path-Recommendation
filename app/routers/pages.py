from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import Optional

from app.config import settings
from app.core.career_engine import career_engine
from app.core import database

pages_router = APIRouter()
templates = Jinja2Templates(directory=str(settings.TEMPLATES_DIR))

def get_current_user(request: Request) -> Optional[dict]:
    user_id_str = request.cookies.get("user_id")
    if user_id_str and user_id_str.isdigit():
        with database.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email FROM users WHERE id = ?", (int(user_id_str),))
            row = cursor.fetchone()
            if row:
                return dict(row)
    return None

@pages_router.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    user = get_current_user(request)
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "active_page": "home",
            "user": user,
            "total_careers": len(career_engine.careers)
        }
    )

@pages_router.get("/assessment", response_class=HTMLResponse)
async def assessment_page(request: Request):
    user = get_current_user(request)
    return templates.TemplateResponse(
        request=request,
        name="assessment.html",
        context={
            "active_page": "assessment",
            "user": user
        }
    )

@pages_router.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    user = get_current_user(request)
    categorized = career_engine.get_categorized_careers()
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "active_page": "dashboard",
            "user": user,
            "categorized_careers": categorized
        }
    )

@pages_router.get("/career-path", response_class=HTMLResponse)
async def career_path_page(request: Request, title: Optional[str] = "Software Developer"):
    user = get_current_user(request)
    career = career_engine.get_career_by_title(title)
    if not career:
        career = career_engine.get_career_by_title("Software Developer")

    return templates.TemplateResponse(
        request=request,
        name="career_path.html",
        context={
            "active_page": "career-path",
            "user": user,
            "career": career,
            "active_career": career.get("title") if career else ""
        }
    )

@pages_router.get("/career-path/quiz", response_class=HTMLResponse)
async def quiz_page(request: Request, title: Optional[str] = "Software Developer"):
    user = get_current_user(request)
    career = career_engine.get_career_by_title(title)
    if not career:
        career = career_engine.get_career_by_title("Software Developer")

    return templates.TemplateResponse(
        request=request,
        name="quiz.html",
        context={
            "active_page": "quiz",
            "user": user,
            "career": career,
            "active_career": career.get("title") if career else ""
        }
    )

@pages_router.get("/compare", response_class=HTMLResponse)
async def compare_page(request: Request):
    user = get_current_user(request)
    all_titles = career_engine.get_all_titles()
    return templates.TemplateResponse(
        request=request,
        name="compare.html",
        context={
            "active_page": "compare",
            "user": user,
            "all_titles": all_titles
        }
    )

@pages_router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    user = get_current_user(request)
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={
            "active_page": "login",
            "user": user
        }
    )

@pages_router.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    user = get_current_user(request)
    return templates.TemplateResponse(
        request=request,
        name="register.html",
        context={
            "active_page": "register",
            "user": user
        }
    )
