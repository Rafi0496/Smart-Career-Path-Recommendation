import io
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from app.core.resume_parser import parse_resume_to_profile

def create_pdf(lines):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    y = 750
    for line in lines:
        c.drawString(72, y, line)
        y -= 25
    c.save()
    return buf.getvalue()

def run_resume_tests():
    print("=== Testing Accurate Resume Parser ===")

    # Test Case 1: Header starts with City/Location, Name is on line 2
    pdf1 = create_pdf([
        "Hyderabad, Telangana, India",
        "Shaik Rafi",
        "Full Stack & AI Engineer",
        "Email: shaik.rafi@example.com | Phone: +91 9876543210",
        "Education: Bachelor of Technology in Computer Science & Engineering (AI & ML)",
        "Core Coursework: Data Structures, Algorithms, Operating Systems, Database Management Systems",
        "Technical Skills: Python, FastAPI, React, TypeScript, Docker, PostgreSQL, Machine Learning, Git",
        "Certifications: AWS Certified Developer, TensorFlow Developer",
        "Strengths: Problem Solving, System Design, Analytical Thinking"
    ])
    p1 = parse_resume_to_profile(pdf1, filename="Shaik_Rafi_Resume.pdf")
    print("\n[Case 1: Location on top line]")
    print(f" Extracted Name: {p1['name']}")
    print(f" Education Level: {p1['academics']['educationLevel']}")
    print(f" Stream: {p1['academics']['streamOrField']}")
    print(f" Subjects: {p1['academics']['subjects']}")
    print(f" Skills ({len(p1['interests']['skills'])}): {p1['interests']['skills']}")
    print(f" Certifications: {p1['academics']['certifications']}")
    print(f" Dream Roles: {p1['aspirations']['dreamRoles']}")
    assert p1['name'] == "Shaik Rafi", f"Failed: got name '{p1['name']}' instead of 'Shaik Rafi'"
    assert "Hyderabad" not in p1['name'], f"Failed: city in name"
    assert p1['academics']['educationLevel'] == "Undergraduate"
    assert "AI & ML" in p1['academics']['streamOrField']
    assert "Python" in p1['interests']['skills']
    assert "FastAPI" in p1['interests']['skills']
    assert "React" in p1['interests']['skills']
    assert len(p1['academics']['certifications']) >= 1
    print(" [PASS] Case 1 passed perfectly!")

    # Test Case 2: Resume starts with "CURRICULUM VITAE", Name on line 2, location "Bangalore, India"
    pdf2 = create_pdf([
        "CURRICULUM VITAE",
        "Aarav Sharma",
        "Bangalore, Karnataka, India",
        "aarav.sharma@gmail.com",
        "Education: M.Tech in Data Science & Artificial Intelligence",
        "Skills: Python, PyTorch, Deep Learning, Pandas, NumPy, Machine Learning, SQL, Tableau",
        "Subjects: Natural Language Processing, Computer Vision, Big Data Analytics"
    ])
    p2 = parse_resume_to_profile(pdf2, filename="Aarav_Resume.pdf")
    print("\n[Case 2: CV Header on line 1]")
    print(f" Extracted Name: {p2['name']}")
    print(f" Education Level: {p2['academics']['educationLevel']}")
    print(f" Stream: {p2['academics']['streamOrField']}")
    print(f" Subjects: {p2['academics']['subjects']}")
    print(f" Skills: {p2['interests']['skills']}")
    assert p2['name'] == "Aarav Sharma", f"Failed: got name '{p2['name']}' instead of 'Aarav Sharma'"
    assert "Curriculum" not in p2['name'] and "Bangalore" not in p2['name']
    assert p2['academics']['educationLevel'] == "Postgraduate"
    assert "Data Science" in p2['academics']['streamOrField']
    print(" [PASS] Case 2 passed perfectly!")

    # Test Case 3: Resume with job title on line 1, Name on line 2
    pdf3 = create_pdf([
        "Senior Frontend Developer",
        "Priya Patel",
        "Mumbai, Maharashtra",
        "priya.patel@outlook.com",
        "Education: B.E in Information Technology",
        "Skills: React, Next.js, TypeScript, JavaScript, CSS3, HTML5, Redux, Tailwind CSS, Jest"
    ])
    p3 = parse_resume_to_profile(pdf3, filename="Priya_Patel_CV.pdf")
    print("\n[Case 3: Job Title on line 1]")
    print(f" Extracted Name: {p3['name']}")
    print(f" Education Level: {p3['academics']['educationLevel']}")
    print(f" Skills: {p3['interests']['skills']}")
    print(f" Dream Roles: {p3['aspirations']['dreamRoles']}")
    assert p3['name'] == "Priya Patel", f"Failed: got name '{p3['name']}' instead of 'Priya Patel'"
    assert "Developer" not in p3['name'] and "Mumbai" not in p3['name']
    assert "React" in p3['interests']['skills']
    assert "Next.js" in p3['interests']['skills']
    print(" [PASS] Case 3 passed perfectly!")

    print("\nAll resume parser tests passed with 100% accuracy!")

if __name__ == "__main__":
    run_resume_tests()
