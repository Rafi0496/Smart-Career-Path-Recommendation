import os
import re
import logging
from typing import Dict, Any, List, Tuple
from services.embeddings import embedding_service

logger = logging.getLogger("python-service.matcher")

def clean_text(t: str) -> str:
    return re.sub(r"[^a-zA-Z0-9\s]", "", t).lower().strip()

def extract_tokens(text_list: List[str]) -> set:
    tokens = set()
    for item in text_list:
        clean = clean_text(item)
        if clean:
            tokens.add(clean)
            for part in clean.split():
                if len(part) >= 3:
                    tokens.add(part)
    return tokens

class HybridMatcher:
    def __init__(self):
        self.openai_client = None
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=api_key)
                logger.info("OpenAI client initialized for dynamic LLM reason generation.")
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI client: {e}")

    def build_profile_summary(self, profile: Dict[str, Any]) -> str:
        """Converts user profile into a rich textual narrative for semantic embedding."""
        academics = profile.get("academics", {})
        interests = profile.get("interests", {})
        aspirations = profile.get("aspirations", {})

        edu = academics.get("educationLevel", "")
        stream = academics.get("streamOrField", "")
        subjects = ", ".join(academics.get("subjects", []))
        strengths = ", ".join(academics.get("strengths", []))
        certs = ", ".join(academics.get("certifications", []))

        user_interests = ", ".join(interests.get("interests", []))
        hobbies = ", ".join(interests.get("hobbies", []))
        skills = ", ".join(interests.get("skills", []))
        work_style = ", ".join(interests.get("preferredWorkStyle", []))

        dream_roles = ", ".join(aspirations.get("dreamRoles", []))
        willing_to_do = ", ".join(aspirations.get("willingToDo", []))
        environment = ", ".join(aspirations.get("workEnvironment", []))
        priorities = ", ".join(aspirations.get("priorities", []))

        parts = [
            f"Candidate education background is {edu} in {stream}." if edu or stream else "",
            f"Academic subjects and strengths include: {subjects}. Key strengths: {strengths}." if subjects or strengths else "",
            f"Certifications earned: {certs}." if certs else "",
            f"Professional and personal interests: {user_interests}. Creative hobbies: {hobbies}." if user_interests or hobbies else "",
            f"Proficient technical and soft skills: {skills}." if skills else "",
            f"Aspires to pursue roles such as: {dream_roles}." if dream_roles else "",
            f"Willing to engage in: {willing_to_do}. Prefers work environment: {environment} and work style: {work_style}." if willing_to_do or environment or work_style else "",
            f"Career priorities: {priorities}." if priorities else "",
        ]
        return " ".join([p for p in parts if p]).strip()

    def calculate_feature_score(
        self, profile: Dict[str, Any], career: Dict[str, Any]
    ) -> Tuple[float, List[str], List[str], float]:
        """
        Computes rule-based feature overlap:
        - Required skills vs candidate skills
        - Dream role match
        - Interest/stream alignment
        Returns (feature_score [0..100], matching_skills, skills_to_develop, overlap_ratio [0..1])
        """
        academics = profile.get("academics", {})
        interests = profile.get("interests", {})
        aspirations = profile.get("aspirations", {})

        user_skills = set(clean_text(s) for s in interests.get("skills", []) if s)
        career_skills = career.get("skills", [])
        career_title = clean_text(career.get("title", ""))
        dream_roles = [clean_text(r) for r in aspirations.get("dreamRoles", []) if r]

        matching_skills = []
        skills_to_develop = []

        for req_skill in career_skills:
            clean_req = clean_text(req_skill)
            # Exact or substring match in user skills
            is_matched = any(
                clean_req in u or u in clean_req for u in user_skills
            )
            if is_matched:
                matching_skills.append(req_skill)
            else:
                skills_to_develop.append(req_skill)

        total_req = len(career_skills) or 1
        overlap_ratio = len(matching_skills) / total_req

        score = 40.0  # baseline

        # 1. Skill overlap score (up to 30 points)
        score += overlap_ratio * 30.0

        # 2. Dream role bonus (up to 25 points)
        for dream in dream_roles:
            if dream and (dream in career_title or career_title in dream):
                score += 25.0
                break

        # 3. Stream & Subject alignment (up to 15 points)
        stream = clean_text(academics.get("streamOrField", ""))
        career_desc = clean_text(career.get("description", ""))
        if stream and (stream in career_desc or stream in career_title):
            score += 15.0

        # 4. Interests alignment (up to 10 points)
        user_interests = extract_tokens(interests.get("interests", []))
        if any(token in career_desc for token in user_interests):
            score += 10.0

        clipped_score = max(35.0, min(99.0, score))
        return clipped_score, matching_skills, skills_to_develop, round(overlap_ratio, 2)

    def generate_reasons_llm(
        self, profile: Dict[str, Any], career: Dict[str, Any], matching_skills: List[str], skills_to_develop: List[str]
    ) -> List[str]:
        """Generates grounded natural-language match reasons using OpenAI if available."""
        if not self.openai_client:
            return self.generate_reasons_rule_based(profile, career, matching_skills, skills_to_develop)

        try:
            career_title = career.get("title", "")
            academics = profile.get("academics", {})
            user_stream = academics.get("streamOrField", "General")
            matched_str = ", ".join(matching_skills) if matching_skills else "none specified"

            prompt = (
                f"You are a career advisor. Briefly generate exactly 3 concise, bulleted reasons (1 sentence each) "
                f"explaining why the career '{career_title}' is an excellent fit for a candidate with a background in "
                f"'{user_stream}' and existing skills [{matched_str}]. Ground the response in real skills and market fit. "
                f"Return only the 3 bullet points without introductory text."
            )

            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7,
            )
            lines = response.choices[0].message.content.strip().split("\n")
            cleaned_reasons = [re.sub(r"^[\*\-\d\.\s]+", "", l).strip() for l in lines if l.strip()]
            return cleaned_reasons[:3] if cleaned_reasons else self.generate_reasons_rule_based(profile, career, matching_skills, skills_to_develop)
        except Exception as e:
            logger.warning(f"LLM reason generation failed: {e}. Falling back to rule-based reasons.")
            return self.generate_reasons_rule_based(profile, career, matching_skills, skills_to_develop)

    def generate_reasons_rule_based(
        self, profile: Dict[str, Any], career: Dict[str, Any], matching_skills: List[str], skills_to_develop: List[str]
    ) -> List[str]:
        """Dynamic grounded reasons builder based on exact matches."""
        reasons = []
        career_title = career.get("title", "")
        academics = profile.get("academics", {})
        stream = academics.get("streamOrField", "")
        dream_roles = profile.get("aspirations", {}).get("dreamRoles", [])

        # Check dream role
        for dream in dream_roles:
            if clean_text(dream) in clean_text(career_title) or clean_text(career_title) in clean_text(dream):
                reasons.append(f"Directly matches your target aspiration of '{dream}'.")
                break

        # Check matching skills
        if matching_skills:
            top_skills = ", ".join(matching_skills[:3])
            reasons.append(f"Strong skill alignment with your existing proficiency in {top_skills}.")
        elif stream:
            reasons.append(f"Builds effectively upon your academic background in {stream}.")

        # Check growth/learning step
        if skills_to_develop:
            top_dev = ", ".join(skills_to_develop[:2])
            reasons.append(f"Structured roadmap bridges your gap in high-demand skills like {top_dev}.")
        else:
            reasons.append("High readiness score with immediate transferable skills for entry-level roles.")

        reasons.append(f"Realistic timeline of {career.get('timeline', '6-12 months')} with verified industry-standard milestones.")
        return reasons[:3]

    def rank_careers(self, profile: Dict[str, Any], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Executes hybrid ranking:
        1. Encodes profile narrative and computes semantic similarity across all careers.
        2. Computes rule-based feature overlaps (skills, stream, dream roles).
        3. Combines into weighted hybrid score = 0.55 * semantic + 0.45 * feature.
        4. Sorts and returns top_k recommendations with enriched metadata.
        """
        query_text = self.build_profile_summary(profile)
        semantic_sims = embedding_service.compute_semantic_similarities(query_text)

        recommendations = []
        for i, career in enumerate(embedding_service.careers):
            # Semantic score (0..100)
            sem_score = float(semantic_sims[i]) * 100.0

            # Feature overlap score (0..100)
            feat_score, matching_skills, skills_to_develop, overlap_ratio = self.calculate_feature_score(profile, career)

            # Weighted Hybrid Score
            hybrid_score = round(0.55 * sem_score + 0.45 * feat_score)
            hybrid_score = max(45, min(99, hybrid_score))

            recommendations.append({
                "career": career,
                "hybrid_score": hybrid_score,
                "semantic_score": round(sem_score, 1),
                "feature_score": round(feat_score, 1),
                "overlap_ratio": overlap_ratio,
                "matching_skills": matching_skills,
                "skills_to_develop": skills_to_develop,
            })

        # Sort by hybrid score descending
        recommendations.sort(key=lambda x: x["hybrid_score"], reverse=True)
        top_picks = recommendations[:top_k]

        formatted_results = []
        for item in top_picks:
            c = item["career"]
            reasons = self.generate_reasons_llm(
                profile, c, item["matching_skills"], item["skills_to_develop"]
            )

            formatted_results.append({
                "careerTitle": c.get("title", ""),
                "matchScore": item["hybrid_score"],
                "skillOverlapPercent": int(item["overlap_ratio"] * 100),
                "semanticScore": item["semantic_score"],
                "featureScore": item["feature_score"],
                "description": c.get("description", ""),
                "simpleSummary": c.get("simpleSummary", ""),
                "whyRecommended": reasons,
                "requiredSkills": c.get("skills", []),
                "matchingSkills": item["matching_skills"],
                "skillsToDevelop": item["skills_to_develop"],
                "learningPath": [
                    {
                        "order": step.get("order", idx + 1),
                        "title": step.get("title", ""),
                        "description": step.get("description", ""),
                        "procedure": step.get("procedure", []),
                        "duration": step.get("duration", ""),
                        "resources": step.get("resources", []),
                        "completed": False,
                    }
                    for idx, step in enumerate(c.get("learningPath", []))
                ],
                "estimatedTimeline": c.get("timeline", ""),
                "salaryRange": c.get("salaryRange", ""),
            })

        return formatted_results

hybrid_matcher = HybridMatcher()
