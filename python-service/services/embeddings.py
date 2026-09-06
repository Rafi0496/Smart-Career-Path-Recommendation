import os
import json
import logging
from typing import List, Dict, Any, Optional
import numpy as np

logger = logging.getLogger("python-service.embeddings")

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "careers.json")
CACHE_VECTORS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "career_vectors.npy")

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.careers: List[Dict[str, Any]] = []
        self.career_texts: List[str] = []
        self.embeddings: Optional[np.ndarray] = None
        self.fallback_vectorizer = None
        self.is_sentence_transformer = False

    def load_data(self):
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Careers data file not found at {DATA_PATH}")

        with open(DATA_PATH, "r", encoding="utf-8") as f:
            self.careers = json.load(f)

        # Build rich textual representations for embedding each career
        self.career_texts = []
        for c in self.careers:
            skills_str = ", ".join(c.get("skills", []))
            summary = c.get("simpleSummary", "")
            desc = c.get("description", "")
            title = c.get("title", "")
            # Combine title, summary, description, and required skills for strong semantic representation
            text = f"Career Title: {title}. Description: {desc}. Summary: {summary}. Key Skills Required: {skills_str}."
            self.career_texts.append(text)

        logger.info(f"Loaded {len(self.careers)} careers from {DATA_PATH}")

    def initialize_model(self):
        """Loads sentence-transformers model or falls back to scikit-learn TF-IDF."""
        self.load_data()

        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading sentence-transformers model: {self.model_name}...")
            self.model = SentenceTransformer(self.model_name)
            self.is_sentence_transformer = True

            # Check if precomputed vectors exist on disk
            if os.path.exists(CACHE_VECTORS_PATH):
                try:
                    loaded_vectors = np.load(CACHE_VECTORS_PATH)
                    if len(loaded_vectors) == len(self.career_texts):
                        self.embeddings = loaded_vectors
                        logger.info("Loaded precomputed career vectors from cache.")
                        return
                except Exception as e:
                    logger.warning(f"Failed to load cached vectors: {e}. Recomputing...")

            # Compute and cache vectors
            logger.info("Encoding all career descriptions with sentence-transformers...")
            self.embeddings = self.model.encode(self.career_texts, convert_to_numpy=True, normalize_embeddings=True)
            try:
                np.save(CACHE_VECTORS_PATH, self.embeddings)
                logger.info(f"Cached career vectors to {CACHE_VECTORS_PATH}")
            except Exception as e:
                logger.warning(f"Could not write cache file: {e}")

        except Exception as e:
            logger.warning(f"sentence-transformers not available ({e}). Initializing scikit-learn TF-IDF fallback vectorizer...")
            from sklearn.feature_extraction.text import TfidfVectorizer
            self.fallback_vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
            self.embeddings = self.fallback_vectorizer.fit_transform(self.career_texts).toarray()
            # Normalize TF-IDF embeddings
            norms = np.linalg.norm(self.embeddings, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            self.embeddings = self.embeddings / norms
            self.is_sentence_transformer = False
            logger.info("TF-IDF fallback vectorizer initialized successfully.")

    def encode_query(self, text: str) -> np.ndarray:
        """Encodes user profile text into a normalized embedding vector."""
        if self.embeddings is None:
            self.initialize_model()

        if self.is_sentence_transformer and self.model is not None:
            vec = self.model.encode([text], convert_to_numpy=True, normalize_embeddings=True)[0]
            return vec
        elif self.fallback_vectorizer is not None:
            vec = self.fallback_vectorizer.transform([text]).toarray()[0]
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            return vec
        else:
            raise RuntimeError("Embedding service has not been initialized.")

    def compute_semantic_similarities(self, query_text: str) -> np.ndarray:
        """Computes cosine similarity between query and all careers."""
        if self.embeddings is None:
            self.initialize_model()

        query_vec = self.encode_query(query_text)
        # Cosine similarity: dot product of normalized vectors
        sims = np.dot(self.embeddings, query_vec)
        # Clip to [0.0, 1.0]
        sims = np.clip(sims, 0.0, 1.0)
        return sims

# Singleton instance
embedding_service = EmbeddingService()
