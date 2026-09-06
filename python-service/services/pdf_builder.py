import os
import io
import logging
from typing import Dict, Any
from jinja2 import Environment, FileSystemLoader

logger = logging.getLogger("python-service.pdf")

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "..", "templates")
jinja_env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

class PDFBuilder:
    def __init__(self):
        self.template = jinja_env.get_template("roadmap.html")

    def render_html(self, roadmap_data: Dict[str, Any], user_name: str = "") -> str:
        """Renders Jinja2 HTML roadmap template with provided career data."""
        # Ensure learningPath is list
        career = dict(roadmap_data)
        if "learningPath" not in career:
            career["learningPath"] = []
        return self.template.render(career=career, user_name=user_name)

    def generate_pdf(self, roadmap_data: Dict[str, Any], user_name: str = "") -> bytes:
        """Renders HTML template and converts it to PDF using WeasyPrint with fallback."""
        html_content = self.render_html(roadmap_data, user_name)

        try:
            from weasyprint import HTML
            pdf_bytes = HTML(string=html_content).write_pdf()
            logger.info("Successfully generated PDF roadmap using WeasyPrint.")
            return pdf_bytes
        except Exception as e:
            logger.warning(f"WeasyPrint PDF rendering unavailable ({e}). Generating pure-python valid PDF fallback...")
            return self._generate_pure_python_pdf(roadmap_data, user_name)

    def _generate_pure_python_pdf(self, career: Dict[str, Any], user_name: str) -> bytes:
        """Generates a valid standalone PDF document using standard PDF 1.4 primitives."""
        title = career.get("careerTitle", "Career Roadmap")
        desc = career.get("description", "")
        timeline = career.get("estimatedTimeline") or career.get("timeline") or "6-12 Months"
        salary = career.get("salaryRange", "Competitive")
        skills = ", ".join(career.get("requiredSkills", []))
        steps = career.get("learningPath", [])

        # Build lines of text
        lines = [
            f"SMART CAREER PATH RECOMMENDATION SYSTEM - V AI",
            f"CAREER ROADMAP: {title.upper()}",
            f"Prepared for: {user_name or 'Candidate'}",
            f"-" * 60,
            f"Timeline: {timeline}    |    Salary: {salary}",
            f"",
            f"Overview: {desc[:250]}",
            f"",
            f"Required Skills: {skills[:200]}",
            f"",
            f"SEQUENTIAL LEARNING ROADMAP:",
            f"-" * 60,
        ]

        for s in steps[:4]:
            order = s.get("order", 1)
            stitle = s.get("title", "")
            sdur = s.get("duration", "")
            sdesc = s.get("description", "")
            lines.append(f"[Stage {order}] {stitle} ({sdur})")
            lines.append(f"   What to do: {sdesc[:140]}")
            proc = s.get("procedure", [])
            if proc:
                lines.append(f"   Step 1: {proc[0][:120]}")
            res = s.get("resources", [])
            if res:
                lines.append(f"   Resources: {', '.join(res[:3])}")
            lines.append("")

        # Format stream with PDF text operators
        text_ops = []
        text_ops.append("BT")
        text_ops.append("/F1 10 Tf")
        text_ops.append("50 780 Td")
        text_ops.append("14 TL")

        for line in lines:
            safe_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            text_ops.append(f"({safe_line}) '")

        text_ops.append("ET")
        stream_content = "\n".join(text_ops).encode("latin1", errors="replace")

        # Assemble PDF objects
        objects = []
        objects.append(b"%PDF-1.4\n")
        
        # Object 1: Catalog
        obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        # Object 2: Pages
        obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        # Object 3: Page
        obj3 = (
            b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] "
            b"/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
        )
        # Object 4: Content stream
        obj4 = (
            f"4 0 obj\n<< /Length {len(stream_content)} >>\nstream\n".encode("latin1")
            + stream_content
            + b"\nendstream\nendobj\n"
        )
        # Object 5: Standard Font
        obj5 = b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

        all_objs = [obj1, obj2, obj3, obj4, obj5]

        # Calculate xref offsets
        offsets = [0]
        curr_offset = len(objects[0])
        for o in all_objs:
            offsets.append(curr_offset)
            curr_offset += len(o)

        xref = f"xref\n0 {len(all_objs) + 1}\n0000000000 65535 f \n".encode("latin1")
        for off in offsets[1:]:
            xref += f"{off:010d} 00000 n \n".encode("latin1")

        trailer = (
            f"trailer\n<< /Size {len(all_objs) + 1} /Root 1 0 R >>\n"
            f"startxref\n{curr_offset}\n%%EOF\n"
        ).encode("latin1")

        return b"".join(objects + all_objs + [xref, trailer])

pdf_builder = PDFBuilder()
