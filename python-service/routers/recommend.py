import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from services.matcher import hybrid_matcher

logger = logging.getLogger("python-service.routers.recommend")

router = APIRouter(prefix="", tags=["Recommendations"])

@router.post("/recommend")
async def recommend_careers(payload: Dict[str, Any]):
    """
    ML-Based Hybrid Career Recommender endpoint.
    Embeds user profile with sentence-transformers, matches against 130+ careers,
    calculates cosine similarity and feature overlap, and returns top 5 matched careers.
    """
    try:
        # Handle payload if wrapped in { "profile": ... } or direct UserProfile
        profile = payload.get("profile", payload)

        if not profile or not any(k in profile for k in ["academics", "interests", "aspirations"]):
            raise HTTPException(
                status_code=400,
                detail="Invalid profile format. 'academics', 'interests', and 'aspirations' required."
            )

        recommendations = hybrid_matcher.rank_careers(profile, top_k=5)
        return {
            "success": True,
            "engine": "Hybrid (Sentence-Transformers all-MiniLM-L6-v2 + Rule Matching)",
            "recommendations": recommendations,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error computing recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")
