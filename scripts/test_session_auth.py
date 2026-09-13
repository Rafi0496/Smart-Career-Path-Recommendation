import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, follow_redirects=False)

def run_tests():
    print("=== Testing Session Auth System ===")

    # 1. Test unauthenticated redirect
    r = client.get("/dashboard")
    assert r.status_code == 302, f"Expected 302, got {r.status_code}"
    assert "/login?redirect=" in r.headers["location"], f"Invalid location: {r.headers['location']}"
    print(" [PASS] Unauthenticated /dashboard redirects to /login")

    r = client.get("/assessment")
    assert r.status_code == 302, f"Expected 302, got {r.status_code}"
    print(" [PASS] Unauthenticated /assessment redirects to /login")

    # 2. Test registration
    test_email = f"testuser_{os.urandom(4).hex()}@example.com"
    r = client.post("/api/auth/register", json={
        "name": "Session Tester",
        "email": test_email,
        "password": "Password123"
    })
    assert r.status_code == 200, f"Register failed: {r.text}"
    data = r.json()
    assert data["success"] is True
    assert data["user"]["name"] == "Session Tester"
    user_id = data["user"]["id"]
    print(f" [PASS] User registered: id={user_id}, name={data['user']['name']}")

    # 3. Test authenticated requests with cookies
    cookies = {"user_id": str(user_id)}
    
    r = client.get("/dashboard", cookies=cookies)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert "Session Tester" in r.text
    print(" [PASS] Authenticated /dashboard accessible directly without redirect")

    r = client.get("/assessment", cookies=cookies)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert "Session Tester" in r.text
    print(" [PASS] Authenticated /assessment accessible directly without redirect")

    r = client.get("/career-path?title=Software+Developer", cookies=cookies)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    print(" [PASS] Authenticated /career-path accessible directly without redirect")

    r = client.get("/compare", cookies=cookies)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    print(" [PASS] Authenticated /compare accessible directly without redirect")

    r = client.get("/profile", cookies=cookies)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    assert "Session Tester" in r.text
    print(" [PASS] Authenticated /profile accessible directly without redirect")

    # 4. Test login page when already authenticated
    r = client.get("/login", cookies=cookies)
    assert r.status_code == 302, f"Expected 302 redirect for logged in user on /login, got {r.status_code}"
    assert r.headers["location"] == "/dashboard"
    print(" [PASS] Authenticated user on /login redirects to /dashboard")

    # 5. Test saving profile and recommendations
    profile_payload = {
        "userId": user_id,
        "profile": {
            "name": "Session Tester",
            "academics": {"educationLevel": "Undergraduate", "streamOrField": "Computer Science"},
            "interests": {"skills": ["Python", "FastAPI"]}
        }
    }
    r = client.post("/api/user/profile", json=profile_payload, cookies=cookies)
    assert r.status_code == 200 and r.json()["success"] is True
    print(" [PASS] Profile successfully saved to database")

    r = client.get(f"/api/user/profile?userId={user_id}", cookies=cookies)
    assert r.status_code == 200
    assert r.json()["profile"]["academics"]["streamOrField"] == "Computer Science"
    print(" [PASS] Profile successfully retrieved from database")

    # 6. Test login endpoint restores profile
    r = client.post("/api/auth/login", json={
        "emailOrName": test_email,
        "password": "Password123"
    })
    assert r.status_code == 200
    login_data = r.json()
    assert login_data["success"] is True
    assert login_data["profile"] is not None
    assert login_data["profile"]["academics"]["streamOrField"] == "Computer Science"
    print(" [PASS] Login endpoint restores profile data successfully")

    # 7. Test logout
    r = client.post("/api/auth/logout")
    assert r.status_code == 200
    print(" [PASS] Logout endpoint succeeds")

    print("\nAll automated tests passed successfully!")

if __name__ == "__main__":
    run_tests()
