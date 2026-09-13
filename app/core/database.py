import sqlite3
import hashlib
import json
import uuid
from datetime import datetime, timedelta
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
                    created_at TEXT NOT NULL,
                    profile_photo_url TEXT,
                    bio TEXT,
                    public_share_id TEXT UNIQUE,
                    is_profile_public INTEGER DEFAULT 0
                )
            """)

            # Run column migrations on users table if columns are missing in existing DB
            user_columns = [
                ("profile_photo_url", "TEXT"),
                ("bio", "TEXT"),
                ("public_share_id", "TEXT"),
                ("is_profile_public", "INTEGER DEFAULT 0")
            ]
            for col_name, col_type in user_columns:
                try:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                except Exception:
                    pass  # Column already exists

            try:
                cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_public_share_id ON users(public_share_id)")
            except Exception:
                pass

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

            # Favorites / Bookmarked table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS favorites (
                    user_id INTEGER NOT NULL,
                    career_title TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, career_title),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS bookmarked_careers (
                    user_id INTEGER NOT NULL,
                    career_id TEXT NOT NULL,
                    bookmarked_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, career_id),
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

            # Quiz history table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS quiz_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    career_id TEXT NOT NULL,
                    quiz_score INTEGER NOT NULL,
                    taken_at TEXT NOT NULL,
                    weak_skill_areas TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # User activity log table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_activity (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    action_type TEXT NOT NULL,
                    action_detail TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # Achievements table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS achievements (
                    user_id INTEGER NOT NULL,
                    badge_key TEXT NOT NULL,
                    earned_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, badge_key),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # Certifications table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS certifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    issuer TEXT NOT NULL,
                    date_earned TEXT NOT NULL,
                    added_manually INTEGER NOT NULL DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            # Generated PDFs table for instant re-download
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS generated_pdfs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    career_id TEXT NOT NULL,
                    filename TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    generated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            conn.commit()
    except Exception as e:
        print(f"[Database Warning] Could not initialize database at {DB_PATH}: {e}")


# ================= USER AUTHENTICATION & MANAGEMENT =================

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
            return dict(row)
    return None

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, created_at, profile_photo_url, bio, public_share_id, is_profile_public FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            return dict(row)
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

def update_user_profile_fields(
    user_id: int,
    name: Optional[str] = None,
    bio: Optional[str] = None,
    profile_photo_url: Optional[str] = None
) -> bool:
    updates = []
    params = []
    if name is not None and name.strip():
        updates.append("name = ?")
        params.append(name.strip())
    if bio is not None:
        updates.append("bio = ?")
        params.append(bio.strip())
    if profile_photo_url is not None:
        updates.append("profile_photo_url = ?")
        params.append(profile_photo_url.strip())
    
    if not updates:
        return True
    
    params.append(user_id)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", params)
        conn.commit()
        return cursor.rowcount > 0

def toggle_profile_share(user_id: int) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT public_share_id, is_profile_public FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return {"success": False, "is_public": False, "public_share_id": None}
        
        current_share_id = row["public_share_id"]
        current_is_public = bool(row["is_profile_public"])
        
        if not current_share_id:
            current_share_id = str(uuid.uuid4())[:12]
        
        new_is_public = 0 if current_is_public else 1
        
        cursor.execute(
            "UPDATE users SET public_share_id = ?, is_profile_public = ? WHERE id = ?",
            (current_share_id, new_is_public, user_id)
        )
        conn.commit()
        
        return {
            "success": True,
            "is_public": bool(new_is_public),
            "public_share_id": current_share_id
        }

def get_user_by_public_share_id(public_share_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, bio, profile_photo_url, created_at, is_profile_public, public_share_id FROM users WHERE public_share_id = ? AND is_profile_public = 1",
            (public_share_id,)
        )
        row = cursor.fetchone()
        if row:
            return dict(row)
    return None

def delete_user_account(user_id: int) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        cursor.execute("DELETE FROM profiles WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM recommendations WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM favorites WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM bookmarked_careers WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM progress WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM quiz_history WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM user_activity WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM achievements WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM certifications WHERE user_id = ?", (user_id,))
        cursor.execute("DELETE FROM generated_pdfs WHERE user_id = ?", (user_id,))
        conn.commit()
        return True


# ================= PROFILE & RECOMMENDATION STORAGE =================

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
    log_activity(user_id, "assessment_taken", "Updated comprehensive career assessment profile")
    check_and_unlock_achievements(user_id)

def get_profile(user_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT data_json, updated_at FROM profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            data = json.loads(row["data_json"])
            data["_updated_at"] = row["updated_at"]
            return data
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


# ================= BOOKMARKS & FAVORITES =================

def toggle_favorite(user_id: int, career_title: str) -> List[str]:
    now_iso = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM favorites WHERE user_id = ? AND career_title = ?", (user_id, career_title))
        exists = cursor.fetchone()
        if exists:
            cursor.execute("DELETE FROM favorites WHERE user_id = ? AND career_title = ?", (user_id, career_title))
            cursor.execute("DELETE FROM bookmarked_careers WHERE user_id = ? AND career_id = ?", (user_id, career_title))
        else:
            cursor.execute("INSERT INTO favorites (user_id, career_title, created_at) VALUES (?, ?, ?)", (user_id, career_title, now_iso))
            cursor.execute("""
                INSERT INTO bookmarked_careers (user_id, career_id, bookmarked_at)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id, career_id) DO UPDATE SET bookmarked_at = excluded.bookmarked_at
            """, (user_id, career_title, now_iso))
            log_activity(user_id, "career_bookmarked", f"Bookmarked {career_title}")
            check_and_unlock_achievements(user_id)
        conn.commit()

    return get_favorites(user_id)

def get_favorites(user_id: int) -> List[str]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT career_title FROM favorites WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        return [r["career_title"] for r in cursor.fetchall()]

def add_bookmark(user_id: int, career_id: str) -> bool:
    now_iso = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO bookmarked_careers (user_id, career_id, bookmarked_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, career_id) DO UPDATE SET bookmarked_at = excluded.bookmarked_at
        """, (user_id, career_id, now_iso))
        cursor.execute("""
            INSERT INTO favorites (user_id, career_title, created_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, career_title) DO NOTHING
        """, (user_id, career_id, now_iso))
        conn.commit()
    log_activity(user_id, "career_bookmarked", f"Bookmarked {career_id}")
    check_and_unlock_achievements(user_id)
    return True

def remove_bookmark(user_id: int, career_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM bookmarked_careers WHERE user_id = ? AND career_id = ?", (user_id, career_id))
        cursor.execute("DELETE FROM favorites WHERE user_id = ? AND career_title = ?", (user_id, career_id))
        conn.commit()
    return True

def get_bookmarked_careers(user_id: int) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT career_id, bookmarked_at FROM bookmarked_careers WHERE user_id = ? ORDER BY bookmarked_at DESC", (user_id,))
        return [dict(r) for r in cursor.fetchall()]


# ================= ROADMAP PROGRESS =================

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
            log_activity(user_id, "roadmap_stage_completed", f"Completed Stage {step_order} in {career_title}")
            check_and_unlock_achievements(user_id)
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


# ================= QUIZ HISTORY =================

def log_quiz_result(
    user_id: int,
    career_id: str,
    quiz_score: int,
    weak_skill_areas: Optional[List[str]] = None
) -> int:
    now_iso = datetime.utcnow().isoformat()
    weak_json = json.dumps(weak_skill_areas or [])
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO quiz_history (user_id, career_id, quiz_score, taken_at, weak_skill_areas)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, career_id, quiz_score, now_iso, weak_json))
        conn.commit()
        row_id = cursor.lastrowid
    
    log_activity(user_id, "quiz_taken", f"Scored {quiz_score}% on {career_id} skill quiz")
    check_and_unlock_achievements(user_id)
    return row_id

def get_quiz_history(user_id: int, limit: int = 20) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, career_id, quiz_score, taken_at, weak_skill_areas
            FROM quiz_history
            WHERE user_id = ?
            ORDER BY taken_at DESC
            LIMIT ?
        """, (user_id, limit))
        rows = []
        for r in cursor.fetchall():
            d = dict(r)
            try:
                d["weak_skill_areas"] = json.loads(d["weak_skill_areas"]) if d["weak_skill_areas"] else []
            except Exception:
                d["weak_skill_areas"] = []
            rows.append(d)
        return rows


# ================= CERTIFICATIONS =================

def add_certification(
    user_id: int,
    title: str,
    issuer: str,
    date_earned: str,
    added_manually: bool = True
) -> int:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO certifications (user_id, title, issuer, date_earned, added_manually)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, title.strip(), issuer.strip(), date_earned.strip(), 1 if added_manually else 0))
        conn.commit()
        return cursor.lastrowid

def get_certifications(user_id: int) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, issuer, date_earned, added_manually
            FROM certifications
            WHERE user_id = ?
            ORDER BY id DESC
        """, (user_id,))
        return [dict(r) for r in cursor.fetchall()]

def delete_certification(user_id: int, cert_id: int) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM certifications WHERE id = ? AND user_id = ?", (cert_id, user_id))
        conn.commit()
        return cursor.rowcount > 0


# ================= GENERATED PDFS =================

def save_generated_pdf_record(
    user_id: int,
    career_id: str,
    filename: str,
    file_path: str
) -> int:
    now_iso = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO generated_pdfs (user_id, career_id, filename, file_path, generated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, career_id, filename, file_path, now_iso))
        conn.commit()
        pdf_id = cursor.lastrowid
    log_activity(user_id, "pdf_downloaded", f"Exported Executive Blueprint PDF for {career_id}")
    check_and_unlock_achievements(user_id)
    return pdf_id

def get_generated_pdfs(user_id: int) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, career_id, filename, file_path, generated_at
            FROM generated_pdfs
            WHERE user_id = ?
            ORDER BY generated_at DESC
        """, (user_id,))
        return [dict(r) for r in cursor.fetchall()]

def get_generated_pdf_by_id(user_id: int, pdf_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, career_id, filename, file_path, generated_at
            FROM generated_pdfs
            WHERE id = ? AND user_id = ?
        """, (pdf_id, user_id))
        row = cursor.fetchone()
        if row:
            return dict(row)
    return None


# ================= USER ACTIVITY & TIMELINE =================

def log_activity(user_id: int, action_type: str, action_detail: str = "") -> None:
    now_iso = datetime.utcnow().isoformat()
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_activity (user_id, action_type, action_detail, created_at)
                VALUES (?, ?, ?, ?)
            """, (user_id, action_type, action_detail, now_iso))
            conn.commit()
    except Exception:
        pass

def get_user_activities(user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, action_type, action_detail, created_at
            FROM user_activity
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        """, (user_id, limit))
        return [dict(r) for r in cursor.fetchall()]

def calculate_user_streak(user_id: int) -> int:
    """Calculates active consecutive daily activity streak."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT DISTINCT substr(created_at, 1, 10) as act_date
            FROM user_activity
            WHERE user_id = ?
            ORDER BY act_date DESC
        """, (user_id,))
        rows = [r["act_date"] for r in cursor.fetchall()]
        if not rows:
            return 0
        
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        yesterday_str = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
        
        # Streak must start today or yesterday
        if rows[0] != today_str and rows[0] != yesterday_str:
            return 0
        
        streak = 1
        current = datetime.strptime(rows[0], "%Y-%m-%d")
        for r_date_str in rows[1:]:
            d = datetime.strptime(r_date_str, "%Y-%m-%d")
            if (current - d).days == 1:
                streak += 1
                current = d
            else:
                break
        return streak


# ================= ACHIEVEMENTS & BADGES =================

ALL_BADGES = {
    "first_assessment": {
        "title": "Pathfinder",
        "description": "Completed your first comprehensive career assessment",
        "icon": "compass"
    },
    "first_resume": {
        "title": "Document Pro",
        "description": "Uploaded and parsed your verified PDF resume",
        "icon": "file-text"
    },
    "first_quiz": {
        "title": "Diagnostic Pioneer",
        "description": "Tested your skills with a career diagnostic quiz",
        "icon": "help-circle"
    },
    "roadmap_started": {
        "title": "Journey Begun",
        "description": "Initiated your first milestone execution roadmap",
        "icon": "flag"
    },
    "roadmap_stage_completed": {
        "title": "Milestone Master",
        "description": "Successfully completed a sequential roadmap stage",
        "icon": "award"
    },
    "five_careers_explored": {
        "title": "Broad Horizons",
        "description": "Explored or bookmarked 5 or more industry career paths",
        "icon": "star"
    }
}

def award_badge(user_id: int, badge_key: str) -> bool:
    if badge_key not in ALL_BADGES:
        return False
    now_iso = datetime.utcnow().isoformat()
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO achievements (user_id, badge_key, earned_at)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id, badge_key) DO NOTHING
            """, (user_id, badge_key, now_iso))
            conn.commit()
            return cursor.rowcount > 0
    except Exception:
        return False

def get_user_achievements(user_id: int) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT badge_key, earned_at FROM achievements WHERE user_id = ?", (user_id,))
        earned_map = {r["badge_key"]: r["earned_at"] for r in cursor.fetchall()}
        
        badge_list = []
        for key, meta in ALL_BADGES.items():
            is_unlocked = key in earned_map
            badge_list.append({
                "key": key,
                "title": meta["title"],
                "description": meta["description"],
                "icon": meta["icon"],
                "unlocked": is_unlocked,
                "earned_at": earned_map.get(key)
            })
        return badge_list

def check_and_unlock_achievements(user_id: int) -> None:
    """Evaluates rules and awards any unlocked badges for the user."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # 1. First Assessment
        cursor.execute("SELECT 1 FROM profiles WHERE user_id = ?", (user_id,))
        if cursor.fetchone():
            award_badge(user_id, "first_assessment")
        
        # 2. First Resume
        cursor.execute("SELECT 1 FROM user_activity WHERE user_id = ? AND action_type = 'resume_uploaded'", (user_id,))
        if cursor.fetchone():
            award_badge(user_id, "first_resume")
        
        # 3. First Quiz
        cursor.execute("SELECT 1 FROM quiz_history WHERE user_id = ?", (user_id,))
        if cursor.fetchone():
            award_badge(user_id, "first_quiz")
        
        # 4. Roadmap Started / Completed
        cursor.execute("SELECT COUNT(*) as cnt FROM progress WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        if row and row["cnt"] > 0:
            award_badge(user_id, "roadmap_started")
            award_badge(user_id, "roadmap_stage_completed")
        
        # 5. Five Careers Explored / Bookmarked
        cursor.execute("SELECT COUNT(DISTINCT career_title) as cnt FROM favorites WHERE user_id = ?", (user_id,))
        fav_cnt = cursor.fetchone()["cnt"]
        cursor.execute("SELECT COUNT(DISTINCT career_id) as cnt FROM bookmarked_careers WHERE user_id = ?", (user_id,))
        bm_cnt = cursor.fetchone()["cnt"]
        if max(fav_cnt, bm_cnt) >= 5:
            award_badge(user_id, "five_careers_explored")


# ================= FULL DATA EXPORT =================

def get_full_user_data_export(user_id: int) -> Dict[str, Any]:
    user = get_user_by_id(user_id)
    profile = get_profile(user_id)
    recommendations = get_recommendations(user_id)
    favorites = get_favorites(user_id)
    progress = get_all_progress(user_id)
    quiz_hist = get_quiz_history(user_id, limit=100)
    activities = get_user_activities(user_id, limit=200)
    achievements = get_user_achievements(user_id)
    certifications = get_certifications(user_id)
    pdfs = get_generated_pdfs(user_id)
    
    return {
        "export_date": datetime.utcnow().isoformat(),
        "account": user,
        "user": user,
        "profile": profile,
        "recommendations": recommendations,
        "favorites": favorites,
        "learning_progress": progress,
        "quiz_history": quiz_hist,
        "activity_log": activities,
        "achievements": achievements,
        "certifications": certifications,
        "generated_pdfs": pdfs
    }

# Initialize database schema on startup
init_db()

