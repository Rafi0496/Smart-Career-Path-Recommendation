import sqlite3
import hashlib
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.config import settings

DB_PATH = settings.DATABASE_PATH

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            
            # Users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            """)

            # User profile table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS profiles (
                    user_id INTEGER PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # Recommendations table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS recommendations (
                    user_id INTEGER PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # Favorites table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS favorites (
                    user_id INTEGER NOT NULL,
                    career_title TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, career_title),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # Learning progress table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS progress (
                    user_id INTEGER NOT NULL,
                    career_title TEXT NOT NULL,
                    step_order INTEGER NOT NULL,
                    completed INTEGER NOT NULL DEFAULT 1,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, career_title, step_order),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            conn.commit()
    except Exception as e:
        print(f"[Database Warning] Could not initialize database at {DB_PATH}: {e}")


# ================= USER AUTHENTICATION =================

def register_user(name: str, email: str, password: str) -> Optional[Dict[str, Any]]:
    clean_name = name.strip()
    clean_email = email.strip().lower()
    if not clean_name or not clean_email or len(password) < 4:
        return None

    pwd_hash = hash_password(password)
    now_iso = datetime.utcnow().isoformat()

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (clean_name, clean_email, pwd_hash, now_iso)
            )
            conn.commit()
            user_id = cursor.lastrowid
            return {
                "id": user_id,
                "name": clean_name,
                "email": clean_email,
                "createdAt": now_iso
            }
    except sqlite3.IntegrityError:
        return None

def authenticate_user(email_or_name: str, password: str) -> Optional[Dict[str, Any]]:
    query_term = email_or_name.strip().lower()
    pwd_hash = hash_password(password)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?",
            (query_term, query_term)
        )
        row = cursor.fetchone()
        if row and row["password_hash"] == pwd_hash:
            return {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "createdAt": row["created_at"]
            }
    return None

def verify_user_for_recovery(email: str, name: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE LOWER(email) = ? AND LOWER(name) = ?",
            (email.strip().lower(), name.strip().lower())
        )
        row = cursor.fetchone()
        if row:
            return {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"]
            }
    return None

def update_user_password(user_id: int, new_password: str) -> bool:
    if len(new_password) < 4:
        return False
    pwd_hash = hash_password(new_password)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password_hash = ? WHERE id = ?", (pwd_hash, user_id))
        conn.commit()
        return cursor.rowcount > 0

# ================= PROFILE & STATE STORAGE =================

def save_profile(user_id: int, profile_data: Dict[str, Any]) -> None:
    now_iso = datetime.utcnow().isoformat()
    json_str = json.dumps(profile_data)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO profiles (user_id, data_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                data_json = excluded.data_json,
                updated_at = excluded.updated_at
        """, (user_id, json_str, now_iso))
        conn.commit()

def get_profile(user_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            return json.loads(row["data_json"])
    return None

def save_recommendations(user_id: int, recs: List[Dict[str, Any]]) -> None:
    now_iso = datetime.utcnow().isoformat()
    json_str = json.dumps(recs)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO recommendations (user_id, data_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                data_json = excluded.data_json,
                updated_at = excluded.updated_at
        """, (user_id, json_str, now_iso))
        conn.commit()

def get_recommendations(user_id: int) -> Optional[List[Dict[str, Any]]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM recommendations WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            return json.loads(row["data_json"])
    return None

def toggle_favorite(user_id: int, career_title: str) -> List[str]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM favorites WHERE user_id = ? AND career_title = ?", (user_id, career_title))
        exists = cursor.fetchone()
        if exists:
            cursor.execute("DELETE FROM favorites WHERE user_id = ? AND career_title = ?", (user_id, career_title))
        else:
            now_iso = datetime.utcnow().isoformat()
            cursor.execute(
                "INSERT INTO favorites (user_id, career_title, created_at) VALUES (?, ?, ?)",
                (user_id, career_title, now_iso)
            )
        conn.commit()

    return get_favorites(user_id)

def get_favorites(user_id: int) -> List[str]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT career_title FROM favorites WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        return [r["career_title"] for r in cursor.fetchall()]

def toggle_step_progress(user_id: int, career_title: str, step_order: int) -> List[int]:
    now_iso = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT completed FROM progress WHERE user_id = ? AND career_title = ? AND step_order = ?",
            (user_id, career_title, step_order)
        )
        row = cursor.fetchone()
        if row and row["completed"] == 1:
            cursor.execute(
                "DELETE FROM progress WHERE user_id = ? AND career_title = ? AND step_order = ?",
                (user_id, career_title, step_order)
            )
        else:
            cursor.execute("""
                INSERT INTO progress (user_id, career_title, step_order, completed, updated_at)
                VALUES (?, ?, ?, 1, ?)
                ON CONFLICT(user_id, career_title, step_order) DO UPDATE SET
                    completed = 1,
                    updated_at = excluded.updated_at
            """, (user_id, career_title, step_order, now_iso))
        conn.commit()

    return get_completed_steps(user_id, career_title)

def get_completed_steps(user_id: int, career_title: str) -> List[int]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT step_order FROM progress WHERE user_id = ? AND career_title = ? AND completed = 1",
            (user_id, career_title)
        )
        return [r["step_order"] for r in cursor.fetchall()]

def get_all_progress(user_id: int) -> Dict[str, List[int]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT career_title, step_order FROM progress WHERE user_id = ? AND completed = 1",
            (user_id,)
        )
        result: Dict[str, List[int]] = {}
        for r in cursor.fetchall():
            title = r["career_title"]
            if title not in result:
                result[title] = []
            result[title].append(r["step_order"])
        return result

# Initialize tables on import
init_db()
