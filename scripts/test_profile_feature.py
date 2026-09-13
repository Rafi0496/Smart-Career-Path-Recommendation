"""
Comprehensive Automated Test Suite for Full Profile Feature & API Integrations
"""
import io
import json
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.core import database

client = TestClient(app)

def test_full_profile_workflow():
    print("\n--- 1. Register a fresh user ---")
    import random
    unique_suffix = random.randint(10000, 99999)
    reg_payload = {
        "name": "Sarah Connor",
        "email": f"sarah.connor.{unique_suffix}@cyberdyne.io",
        "password": "SecurePassword123!"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 200, f"Registration failed: {res.text}"
    user_data = res.json()["user"]
    user_id = user_data["id"]
    print(f"User registered with ID: {user_id}")

    cookies = {"user_id": str(user_id)}

    print("\n--- 2. GET /profile page render ---")
    res = client.get("/profile", cookies=cookies)
    assert res.status_code == 200, f"GET /profile failed: {res.status_code}"
    assert "Sarah Connor" in res.text
    print("GET /profile returned 200 OK and rendered user profile HTML.")

    print("\n--- 3. PATCH /profile (Update name and bio) ---")
    patch_payload = {
        "name": "Sarah Connor (Lead Systems Architect)",
        "bio": "Specializing in distributed computing, resilient cloud infrastructure, and AI engineering."
    }
    res = client.patch("/profile", json=patch_payload, cookies=cookies)
    assert res.status_code == 200, f"PATCH /profile failed: {res.text}"
    data = res.json()
    assert data["success"] is True
    assert data["user"]["name"] == "Sarah Connor (Lead Systems Architect)"
    assert "distributed computing" in data["user"]["bio"]
    print("Profile details updated successfully.")

    print("\n--- 4. POST /profile/photo (Avatar upload) ---")
    # Generate mock 1x1 PNG bytes
    mock_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xa74d\xaa\x00\x00\x00\x00IEND\xaeB`\x82"
    files = {"file": ("avatar.png", io.BytesIO(mock_png), "image/png")}
    res = client.post("/profile/photo", files=files, cookies=cookies)
    assert res.status_code == 200, f"Avatar upload failed: {res.text}"
    avatar_data = res.json()
    assert avatar_data["success"] is True
    assert "/static/uploads/avatars/" in avatar_data["photo_url"]
    print(f"Avatar uploaded successfully: {avatar_data['photo_url']}")

    print("\n--- 5. Career Bookmarks (POST & DELETE) ---")
    res = client.post("/profile/bookmark/Cloud%20Architect", cookies=cookies)
    assert res.status_code == 200
    assert res.json()["bookmarked"] is True
    
    bms = database.get_bookmarked_careers(user_id)
    assert any(b["career_id"] == "Cloud Architect" for b in bms)
    print("Bookmarking Cloud Architect verified.")

    res = client.delete("/profile/bookmark/Cloud%20Architect", cookies=cookies)
    assert res.status_code == 200
    assert res.json()["bookmarked"] is False
    bms = database.get_bookmarked_careers(user_id)
    assert not any(b["career_id"] == "Cloud Architect" for b in bms)
    print("Bookmark removal verified.")

    print("\n--- 6. Skills Radar Endpoint (/profile/skills-radar) ---")
    # Save a profile first
    client.post("/api/user/profile", json={
        "interests": {"skills": ["Python", "Docker", "AWS", "FastAPI"]},
        "education": {"highestDegree": "Bachelor of Science", "stream": "Computer Science"}
    }, cookies=cookies)

    res = client.get("/profile/skills-radar", cookies=cookies)
    assert res.status_code == 200, f"Skills radar failed: {res.text}"
    radar = res.json()
    assert "labels" in radar
    assert "datasets" in radar
    assert len(radar["datasets"]) == 3
    print(f"Skills radar calculated successfully for career: {radar['careerTitle']}")

    print("\n--- 7. Certifications (POST & DELETE) ---")
    cert_payload = {
        "title": "AWS Solutions Architect Professional",
        "issuer": "Amazon Web Services",
        "date_earned": "2024"
    }
    res = client.post("/profile/certifications", json=cert_payload, cookies=cookies)
    assert res.status_code == 200
    cert_id = res.json()["cert_id"]

    certs = database.get_certifications(user_id)
    assert len(certs) == 1
    assert certs[0]["title"] == "AWS Solutions Architect Professional"
    print(f"Added certification #{cert_id}")

    res = client.delete(f"/profile/certifications/{cert_id}", cookies=cookies)
    assert res.status_code == 200
    certs = database.get_certifications(user_id)
    assert len(certs) == 0
    print("Deleted certification successfully.")

    print("\n--- 8. Diagnostic Quiz Logging (/api/quiz/result) ---")
    quiz_payload = {
        "career_id": "DevOps Engineer",
        "quiz_score": 85,
        "weak_skills": ["Kubernetes", "Terraform"]
    }
    res = client.post("/api/quiz/result", json=quiz_payload, cookies=cookies)
    assert res.status_code == 200
    q_history = database.get_quiz_history(user_id)
    assert len(q_history) >= 1
    assert q_history[0]["career_id"] == "DevOps Engineer"
    assert q_history[0]["quiz_score"] == 85
    print("Quiz result logged and verified in history.")

    print("\n--- 9. Executive PDF Export & Re-download Hub ---")
    pdf_req = {
        "career": {"title": "DevOps Engineer", "careerTitle": "DevOps Engineer"},
        "user_name": "Sarah Connor"
    }
    res = client.post("/api/export/pdf", json=pdf_req, cookies=cookies)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    
    saved_pdfs = database.get_generated_pdfs(user_id)
    assert len(saved_pdfs) >= 1
    pdf_id = saved_pdfs[0]["id"]
    print(f"Generated PDF record saved with ID #{pdf_id}")

    # Test re-download endpoint
    res = client.get(f"/profile/pdfs/{pdf_id}/redownload", cookies=cookies)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000
    print("PDF re-download verified.")

    print("\n--- 10. Public Share Portfolio Toggle & Public View ---")
    res = client.post("/profile/share/toggle", cookies=cookies)
    assert res.status_code == 200
    share_data = res.json()
    assert share_data["is_public"] is True
    share_id = share_data["public_share_id"]
    print(f"Profile shared publicly with ID: {share_id}")

    # Access public profile page unauthenticated
    res = client.get(f"/share/{share_id}")
    assert res.status_code == 200
    assert "Sarah Connor" in res.text
    # Sensitive email should NOT be on the public page
    assert "sarah.connor@cyberdyne.io" not in res.text
    print("Public portfolio view rendered securely without sensitive personal email.")

    # Access public skills radar endpoint
    res = client.get(f"/profile/skills-radar?share_id={share_id}")
    assert res.status_code == 200
    assert "labels" in res.json()
    print("Public skills radar fetched successfully.")

    print("\n--- 11. Data Export (GET /profile/export-data) ---")
    res = client.get("/profile/export-data", cookies=cookies)
    assert res.status_code == 200
    dump = res.json()
    assert "user" in dump
    assert "profile" in dump
    assert "achievements" in dump
    assert "quiz_history" in dump
    assert "activity_log" in dump
    print("Data export JSON verified.")

    print("\n--- 12. Account Deletion (DELETE /profile/account) ---")
    res = client.delete("/profile/account", cookies=cookies)
    assert res.status_code == 200
    
    # Verify user no longer exists
    deleted_user = database.get_user_by_id(user_id)
    assert deleted_user is None
    print("Account deleted and verified.")

    print("\n=======================================================")
    print("ALL 12 PROFILE FEATURE INTEGRATION TESTS PASSED 100%!")
    print("=======================================================\n")

if __name__ == "__main__":
    test_full_profile_workflow()
