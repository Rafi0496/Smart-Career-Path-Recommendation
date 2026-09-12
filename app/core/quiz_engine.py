import random
from typing import List, Dict, Any

QUIZ_CACHE: Dict[str, List[Dict[str, Any]]] = {}

SKILL_QUESTION_BANK = {
    "Docker": [
        {
            "question": "What is the primary benefit of using multi-stage Docker builds?",
            "options": [
                "It drastically reduces the final container image size by separating build tools from production runtime.",
                "It forces all containers to share the host's root filesystem.",
                "It enables Docker containers to bypass kernel virtualization layers.",
                "It prevents containers from opening outbound network sockets."
            ],
            "correct_answer": 0,
            "explanation": "Multi-stage builds leave compiler SDKs and build caches behind, resulting in lean, secure production images."
        },
        {
            "question": "In a Dockerfile, how does 'COPY' differ from 'ADD'?",
            "options": [
                "'COPY' simply duplicates local files, whereas 'ADD' can unpack local tarballs and fetch remote URLs.",
                "'COPY' runs during container startup, while 'ADD' runs during build time.",
                "'ADD' is deprecated and cannot be used in modern Docker builds.",
                "'COPY' only works for binary files, while 'ADD' is for text files."
            ],
            "correct_answer": 0,
            "explanation": "Best practices recommend using 'COPY' for clarity unless automatic local tar extraction is explicitly required."
        }
    ],
    "SQL": [
        {
            "question": "What is the key performance difference between an INNER JOIN and a subquery with IN?",
            "options": [
                "Modern query planners optimize INNER JOINs to hash/merge joins, whereas subqueries can sometimes result in nested loop scans if not indexed.",
                "INNER JOINs cannot utilize composite indexes.",
                "Subqueries with IN always execute faster on PostgreSQL.",
                "There is no difference; all SQL engines execute them identically in O(1) time."
            ],
            "correct_answer": 0,
            "explanation": "Joins give the query optimizer greater flexibility to reorder operations and select optimal physical join algorithms."
        },
        {
            "question": "Which isolation level prevents 'Dirty Reads' but still permits 'Non-Repeatable Reads'?",
            "options": [
                "Read Committed",
                "Read Uncommitted",
                "Repeatable Read",
                "Serializable"
            ],
            "correct_answer": 0,
            "explanation": "'Read Committed' ensures only committed data is visible, but data read multiple times within a transaction may change."
        }
    ],
    "Python": [
        {
            "question": "How does Python's Global Interpreter Lock (GIL) impact multi-threaded CPU-bound programs?",
            "options": [
                "It restricts execution to one native thread at a time per interpreter, limiting multi-core CPU scaling.",
                "It prevents network I/O requests from running concurrently.",
                "It automatically distributes threads across separate CPU cores using hyper-threading.",
                "It converts all recursive functions into iterative bytecode loops."
            ],
            "correct_answer": 0,
            "explanation": "Because of the GIL, CPU-bound parallelism in standard CPython requires multiprocessing rather than threading."
        },
        {
            "question": "What is the time complexity of searching a key in a standard Python dictionary?",
            "options": [
                "O(1) average case, O(n) worst case on hash collisions.",
                "O(log n) binary search on sorted keys.",
                "O(n) linear scan through all key-value tuples.",
                "O(n log n) because keys are re-hashed on lookup."
            ],
            "correct_answer": 0,
            "explanation": "Python dictionaries are hash tables offering O(1) average lookup and insertion performance."
        }
    ],
    "Machine Learning": [
        {
            "question": "Why is L1 regularization (Lasso) effective for feature selection compared to L2 (Ridge)?",
            "options": [
                "L1 drives less relevant feature coefficients exactly to zero due to its diamond-shaped constraint geometry.",
                "L1 penalizes larger weights exponentially more than small weights.",
                "L1 cannot be used with gradient descent optimizers.",
                "L1 produces an infinite number of non-zero support vectors."
            ],
            "correct_answer": 0,
            "explanation": "The sharp corners on L1's diamond-shaped constraint boundary encourage sparse weight vectors with exact zeroes."
        },
        {
            "question": "When evaluating an imbalanced fraud detection dataset, why is ROC-AUC often preferred over Accuracy?",
            "options": [
                "A naive model predicting 'No Fraud' 100% of the time can achieve 99% accuracy while providing zero predictive utility.",
                "Accuracy is mathematically impossible to calculate on continuous features.",
                "ROC-AUC does not require a ground truth label.",
                "Accuracy requires symmetric neural networks."
            ],
            "correct_answer": 0,
            "explanation": "Accuracy is misleading when negative class instances vastly outnumber positive class instances."
        }
    ]
}

def generate_quiz_questions(
    career_id: str,
    career_title: str,
    skills_to_develop: List[str]
) -> List[Dict[str, Any]]:
    cache_key = f"{career_id}:{','.join(sorted(skills_to_develop))}"
    if cache_key in QUIZ_CACHE:
        return QUIZ_CACHE[cache_key]

    target_skills = skills_to_develop[:3] if skills_to_develop else ["Core Problem Solving", "System Design"]
    questions: List[Dict[str, Any]] = []

    for skill in target_skills:
        # Check if known skill in bank
        matched_bank = None
        for bank_key, bank_qs in SKILL_QUESTION_BANK.items():
            if bank_key.lower() in skill.lower() or skill.lower() in bank_key.lower():
                matched_bank = bank_qs
                break

        if matched_bank:
            for q in matched_bank:
                questions.append({
                    "skill": skill,
                    "question": q["question"],
                    "options": q["options"],
                    "correct_answer": q["correct_answer"],
                    "explanation": q["explanation"]
                })
        else:
            # Generate high-yield template questions for domain skill
            questions.append({
                "skill": skill,
                "question": f"When applying '{skill}' in modern production workflows, which methodology represents an essential industry standard?",
                "options": [
                    f"Implementing modular, decoupled architectures supported by automated unit tests and telemetry.",
                    f"Skipping peer code reviews and testing to shorten initial deployment timelines.",
                    f"Storing unencrypted API credentials directly in public version control commits.",
                    f"Avoiding standardized documentation and issue trackers."
                ],
                "correct_answer": 0,
                "explanation": f"Industry standards for {skill} emphasize architectural modularity, test-driven validation, and clean observability."
            })
            questions.append({
                "skill": skill,
                "question": f"Which strategy best mitigates systemic risk and technical debt when adopting '{skill}'?",
                "options": [
                    f"Continuous integration, incremental refactoring, and benchmarked stress testing.",
                    f"Deploying unmonitored changes directly into client-facing environments.",
                    f"Eliminating error boundaries and exception logging mechanisms.",
                    f"Refusing to update dependencies or patch security vulnerabilities."
                ],
                "correct_answer": 0,
                "explanation": f"Automated CI pipelines, code reviews, and structured stress testing keep implementations of {skill} robust."
            })

    QUIZ_CACHE[cache_key] = questions
    return questions
