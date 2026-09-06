from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_all():
    # 1. Health
    r = client.get("/health")
    print("Health:", r.status_code, r.json())
    assert r.status_code == 200

    # 2. Recommend
    profile = {
        "academics": {
            "educationLevel": "Undergraduate",
            "streamOrField": "Computer Science",
            "subjects": ["Algorithms", "Web Development"],
            "strengths": ["Problem Solving"],
            "certifications": []
        },
        "interests": {
            "interests": ["Software Development", "Web Design"],
            "hobbies": ["Coding"],
            "skills": ["Python", "JavaScript", "React"],
            "preferredWorkStyle": ["Remote"]
        },
        "aspirations": {
            "dreamRoles": ["Full Stack Developer"],
            "willingToDo": ["Learn New Frameworks"],
            "workEnvironment": ["Tech Startup"],
            "priorities": ["Growth"],
            "timeline": "6 months"
        }
    }
    r = client.post("/recommend", json=profile)
    print("Recommend status:", r.status_code)
    assert r.status_code == 200
    recs = r.json().get("recommendations", [])
    assert len(recs) == 5
    top = recs[0]
    print(f"Top 1: {top['careerTitle']} | Score: {top['matchScore']}% | Overlap: {top.get('skillOverlapPercent')}%")
    print("Reasons:", top.get("whyRecommended"))

    # 3. Quiz
    quiz_payload = {
        "career_id": "software-developer",
        "career_title": "Software Developer",
        "skills_to_develop": ["Docker", "SQL"]
    }
    r = client.post("/quiz/generate", json=quiz_payload)
    print("Quiz status:", r.status_code, "Questions count:", len(r.json().get("questions", [])))
    assert r.status_code == 200
    assert len(r.json().get("questions", [])) > 0

    # 4. Export PDF
    export_payload = {
        "career": top,
        "user_name": "Test User"
    }
    r = client.post("/export/pdf", json=export_payload)
    print("Export PDF status:", r.status_code, "Bytes:", len(r.content), "Content-Type:", r.headers.get("content-type"))
    assert r.status_code == 200
    assert len(r.content) > 100

    print("ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
