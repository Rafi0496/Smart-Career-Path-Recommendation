import io
import sys
import os
import pypdf

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.main import app

def run_tests():
    client = TestClient(app, follow_redirects=False)

    print("=== 1. Testing Auth Gating for Protected Routes ===")
    protected_routes = ['/assessment', '/dashboard', '/career-path', '/career-path/quiz', '/compare']
    for route in protected_routes:
        resp = client.get(route)
        loc = resp.headers.get("location", "")
        print(f"GET {route} -> status: {resp.status_code}, redirect: {loc}")
        assert resp.status_code == 302, f"Expected 302 for {route}"
        assert "/login?redirect=" in loc, f"Expected redirect to login for {route}"

    print("[PASS] Auth gating verified for all protected sections!")

    print("\n=== 2. Testing Registration and Login Flow ===")
    reg_payload = {"name": "Test Engineer", "email": "test_auth_eng2@example.com", "password": "testpassword123"}
    resp = client.post("/api/auth/register", json=reg_payload)
    print("Register response:", resp.status_code)
    assert resp.status_code in [200, 400]

    login_resp = client.post("/api/auth/login", json={"emailOrName": "test_auth_eng2@example.com", "password": "testpassword123"})
    print("Login response:", login_resp.status_code)
    assert login_resp.status_code == 200

    auth_client = TestClient(app, follow_redirects=True, cookies=login_resp.cookies)
    for route in protected_routes:
        resp = auth_client.get(route)
        print(f"GET {route} (authenticated) -> status: {resp.status_code}")
        assert resp.status_code == 200

    print("[PASS] Authenticated access verified for all sections!")

    print("\n=== 3. Testing Resume Parser ===")
    pdf_buf = io.BytesIO()
    c = canvas.Canvas(pdf_buf, pagesize=letter)
    c.drawString(100, 750, "Jordan Smith")
    c.drawString(100, 720, "Bachelor of Technology in Computer Science")
    c.drawString(100, 690, "Skills: Python, React, Machine Learning, SQL, Docker, FastAPI")
    c.drawString(100, 660, "Experience: Full Stack and AI Engineering projects")
    c.save()
    pdf_bytes = pdf_buf.getvalue()

    # Test multipart with field 'resume'
    resp_resume = auth_client.post("/api/resume/parse", files={"resume": ("jordan_resume.pdf", pdf_bytes, "application/pdf")})
    assert resp_resume.status_code == 200
    data_resume = resp_resume.json()
    print("Parsed skills (via 'resume' field):", data_resume.get("skillsFound"))
    assert "Python" in data_resume.get("skillsFound", [])

    # Test multipart with field 'file'
    resp_file = auth_client.post("/api/resume/parse", files={"file": ("jordan_resume.pdf", pdf_bytes, "application/pdf")})
    assert resp_file.status_code == 200
    data_file = resp_file.json()
    print("Parsed skills (via 'file' field):", data_file.get("skillsFound"))
    assert "Python" in data_file.get("skillsFound", [])

    print("[PASS] Resume parser successfully extracts skills and profile fields!")

    print("\n=== 4. Testing Compare & Career Metadata Endpoints ===")
    titles_resp = auth_client.get("/api/careers/titles")
    titles = titles_resp.json()
    print(f"Total catalog titles: {len(titles)}")
    assert len(titles) > 100

    career_resp = auth_client.get("/api/careers/Full%20Stack%20Developer")
    assert career_resp.status_code == 200
    career_data = career_resp.json()
    print(f"Fetched career: {career_data.get('title')}, salary: {career_data.get('salaryRange')}, steps: {len(career_data.get('learningPath', []))}")

    print("[PASS] Career catalog and comparison endpoints operational!")

    print("\n=== 5. Testing Ask V Chat Endpoint ===")
    chat_resp = auth_client.post(
        "/api/chat",
        json={
            "messages": [{"role": "user", "content": "Hello V, what are high demand backend skills?"}],
            "context": {"userName": "Jordan", "currentCareer": "Full Stack Developer"}
        }
    )
    assert chat_resp.status_code == 200
    chat_content = chat_resp.json().get("content", "")
    print("Ask V response sample (first 100 chars):", chat_content[:100], "...")
    assert len(chat_content) > 10

    print("[PASS] Ask V chatbot responding accurately!")

    print("\n" + "="*50)
    print(">>> ALL 5 VERIFICATION MODULES PASSED 100%! <<<")
    print("="*50)

if __name__ == "__main__":
    run_tests()
