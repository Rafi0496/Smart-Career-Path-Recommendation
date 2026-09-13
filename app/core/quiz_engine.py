import random
from typing import List, Dict, Any, Optional

# Comprehensive Question Bank with realistic, high-yield technical and domain questions
QUESTION_BANK: Dict[str, List[Dict[str, Any]]] = {
    "Full Stack Developer": [
        {
            "question": "In a modern React application, what is the primary benefit of using React Server Components (RSC)?",
            "options": [
                "They render directly on the server without sending their component dependencies to the client bundle, reducing JS payload.",
                "They replace CSS stylesheets with server-side bitmap canvases.",
                "They eliminate the need for HTTP headers in API communication.",
                "They force all client state to be stored in browser cookies."
            ],
            "correct_answer": "They render directly on the server without sending their component dependencies to the client bundle, reducing JS payload.",
            "explanation": "React Server Components execute only on the server, keeping large dependencies out of the client-side JavaScript bundle."
        },
        {
            "question": "How does CORS (Cross-Origin Resource Sharing) protect web applications?",
            "options": [
                "It instructs browsers via HTTP headers to restrict cross-origin script requests unless explicitly permitted by the target server.",
                "It encrypts all database disk sectors using AES-256.",
                "It automatically compiles TypeScript into WebAssembly.",
                "It prevents users from taking screenshots of web pages."
            ],
            "correct_answer": "It instructs browsers via HTTP headers to restrict cross-origin script requests unless explicitly permitted by the target server.",
            "explanation": "CORS is a browser security mechanism that uses HTTP headers to tell browsers which cross-origin requests are allowed."
        },
        {
            "question": "What is the primary advantage of database indexing on frequently queried columns?",
            "options": [
                "It creates B-Tree or Hash lookups to reduce search complexity from O(N) table scans to O(log N) or O(1).",
                "It automatically compresses the table data into zip archives.",
                "It prevents all deadlocks from occurring during concurrent writes.",
                "It bypasses query authorization checks for faster execution."
            ],
            "correct_answer": "It creates B-Tree or Hash lookups to reduce search complexity from O(N) table scans to O(log N) or O(1).",
            "explanation": "Indexes build auxiliary data structures (typically B-Trees) allowing the database engine to find matching rows in logarithmic time."
        },
        {
            "question": "When designing a RESTful API, which HTTP status code should be returned after successfully creating a new resource?",
            "options": [
                "201 Created",
                "200 OK with no payload",
                "204 No Content",
                "302 Found"
            ],
            "correct_answer": "201 Created",
            "explanation": "HTTP 201 Created indicates that the request succeeded and a new resource has been provisioned."
        },
        {
            "question": "What is the purpose of connection pooling in backend database drivers?",
            "options": [
                "To reuse a cached set of active database connections, eliminating the high latency of establishing a new TCP/TLS handshake per request.",
                "To encrypt database passwords in browser local storage.",
                "To convert SQL queries into NoSQL JSON documents.",
                "To replicate data to backup disks during server shutdown."
            ],
            "correct_answer": "To reuse a cached set of active database connections, eliminating the high latency of establishing a new TCP/TLS handshake per request.",
            "explanation": "Connection pooling maintains open socket connections to avoid the heavy overhead of repeated connection handshakes."
        }
    ],
    "AI Engineer": [
        {
            "question": "In Transformer neural network architectures, what is the core purpose of the Self-Attention mechanism?",
            "options": [
                "It computes dynamic attention weights between all token pairs in a sequence, capturing long-range contextual relationships.",
                "It eliminates the need for matrix multiplications during backpropagation.",
                "It compresses all hidden states into a single scalar float.",
                "It forces weights to remain strictly positive."
            ],
            "correct_answer": "It computes dynamic attention weights between all token pairs in a sequence, capturing long-range contextual relationships.",
            "explanation": "Self-attention enables tokens to attend to other tokens across the entire sequence simultaneously regardless of positional distance."
        },
        {
            "question": "Why is Temperature used during LLM text generation sampling?",
            "options": [
                "It scales the logits before Softmax to control the randomness and entropy of token selection.",
                "It measures the GPU silicon thermal output during matrix multiplication.",
                "It controls the learning rate of the optimizer during inference.",
                "It truncates input prompts to fit within the context window."
            ],
            "correct_answer": "It scales the logits before Softmax to control the randomness and entropy of token selection.",
            "explanation": "Lower temperature makes generation more deterministic (greedy), while higher temperature flattens logits for creative diversity."
        },
        {
            "question": "In Retrieval-Augmented Generation (RAG) systems, what is the primary role of a Vector Database?",
            "options": [
                "To perform high-dimensional approximate nearest neighbor (ANN) similarity searches across embedded document chunks.",
                "To run relational SQL JOINs across normalized transaction tables.",
                "To train deep learning models from scratch without GPU accelerators.",
                "To convert audio streams into MP3 files."
            ],
            "correct_answer": "To perform high-dimensional approximate nearest neighbor (ANN) similarity searches across embedded document chunks.",
            "explanation": "Vector databases index embeddings using cosine similarity or Euclidean distance to retrieve semantically relevant context chunks."
        },
        {
            "question": "What is the key advantage of Low-Rank Adaptation (LoRA) for fine-tuning Large Language Models?",
            "options": [
                "It freezes base model weights and trains low-rank decomposition matrices, reducing trainable parameters and VRAM by up to 90%.",
                "It converts floating-point weights into 1-bit integers during training.",
                "It removes the need for training data during fine-tuning.",
                "It guarantees zero hallucinations in generated responses."
            ],
            "correct_answer": "It freezes base model weights and trains low-rank decomposition matrices, reducing trainable parameters and VRAM by up to 90%.",
            "explanation": "LoRA decomposes weight updates into two smaller rank matrices, making LLM fine-tuning accessible on consumer GPUs."
        },
        {
            "question": "When training deep neural networks, what problem does Batch Normalization directly mitigate?",
            "options": [
                "Internal Covariate Shift, stabilizing gradient flow and allowing higher learning rates.",
                "Overfitting on large datasets with millions of samples.",
                "Excessive disk memory consumption during dataset loading.",
                "The need for nonlinear activation functions like ReLU."
            ],
            "correct_answer": "Internal Covariate Shift, stabilizing gradient flow and allowing higher learning rates.",
            "explanation": "Batch normalization standardizes intermediate layer activations, smoothing the optimization landscape."
        }
    ],
    "Cloud Solutions Architect": [
        {
            "question": "In cloud architecture, what is the key difference between Horizontal Scaling and Vertical Scaling?",
            "options": [
                "Horizontal scaling adds more machine instances to distribute traffic; vertical scaling increases the CPU/RAM of a single machine.",
                "Horizontal scaling only works on Windows; vertical scaling works on Linux.",
                "Vertical scaling requires serverless containers, while horizontal scaling uses bare metal.",
                "There is no difference; both terms refer to database replication."
            ],
            "correct_answer": "Horizontal scaling adds more machine instances to distribute traffic; vertical scaling increases the CPU/RAM of a single machine.",
            "explanation": "Horizontal scaling (scale-out) enhances fault tolerance by adding nodes, whereas vertical scaling (scale-up) hits hardware ceilings."
        },
        {
            "question": "What is the primary function of an Amazon AWS / Azure Virtual Private Cloud (VPC)?",
            "options": [
                "To provide a logically isolated private virtual network where cloud resources can be securely provisioned with custom subnets and firewalls.",
                "To automatically write front-end React components.",
                "To convert SQL databases into static HTML pages.",
                "To provide free unlimited cloud storage."
            ],
            "correct_answer": "To provide a logically isolated private virtual network where cloud resources can be securely provisioned with custom subnets and firewalls.",
            "explanation": "A VPC isolates your cloud infrastructure with custom IP address ranges, subnets, route tables, and security gateways."
        },
        {
            "question": "In distributed microservices, how does the Circuit Breaker pattern prevent cascading failures?",
            "options": [
                "It detects service degradation and temporarily trips calls to return fast fallbacks instead of overwhelming the failing downstream service.",
                "It cuts physical electrical power to overheated server racks.",
                "It forces all microservices to share a single monolithic database.",
                "It prevents developers from making Git commits during incidents."
            ],
            "correct_answer": "It detects service degradation and temporarily trips calls to return fast fallbacks instead of overwhelming the failing downstream service.",
            "explanation": "The Circuit Breaker pattern stops requests to failing dependencies, allowing them time to recover while preventing thread exhaustion."
        },
        {
            "question": "What is the core principle of Infrastructure as Code (IaC) with tools like Terraform?",
            "options": [
                "Declaring infrastructure in version-controlled configuration files for automated, repeatable, and idempotent deployments.",
                "Manually clicking buttons in cloud web consoles.",
                "Compiling Python code into C++ binaries before deployment.",
                "Storing secrets in unencrypted plaintext files on desktops."
            ],
            "correct_answer": "Declaring infrastructure in version-controlled configuration files for automated, repeatable, and idempotent deployments.",
            "explanation": "IaC defines cloud topology declaratively, ensuring consistent environments and auditable version history."
        }
    ],
    "Cybersecurity Analyst": [
        {
            "question": "How does Public Key (Asymmetric) Cryptography differ from Symmetric Cryptography?",
            "options": [
                "Asymmetric uses a mathematically paired public key for encryption and private key for decryption; symmetric uses a single shared secret key.",
                "Asymmetric encryption only works on numbers, not text.",
                "Symmetric encryption is only used on mobile phones.",
                "Asymmetric encryption cannot be used over the internet."
            ],
            "correct_answer": "Asymmetric uses a mathematically paired public key for encryption and private key for decryption; symmetric uses a single shared secret key.",
            "explanation": "Asymmetric algorithms (e.g. RSA, ECC) eliminate the need to share private keys over unsecure channels."
        },
        {
            "question": "Which security measure is most effective at preventing SQL Injection (SQLi) vulnerabilities?",
            "options": [
                "Using Parameterized Queries (Prepared Statements) that separate SQL logic from untrusted user inputs.",
                "Hiding the database port number using firewall rules.",
                "Limiting input strings to 50 characters in frontend HTML.",
                "Changing the database table names daily."
            ],
            "correct_answer": "Using Parameterized Queries (Prepared Statements) that separate SQL logic from untrusted user inputs.",
            "explanation": "Parameterized queries ensure the database engine treats input strictly as literal data parameters, never executable code."
        },
        {
            "question": "What is the core philosophy of a Zero Trust Security Architecture?",
            "options": [
                "'Never trust, always verify'—every access request is authenticated, authorized, and encrypted regardless of network perimeter.",
                "Trust all requests originating from inside the office local area network.",
                "Disable passwords and allow anonymous access.",
                "Block all outbound internet traffic from corporate servers."
            ],
            "correct_answer": "'Never trust, always verify'—every access request is authenticated, authorized, and encrypted regardless of network perimeter.",
            "explanation": "Zero Trust assumes breach and requires strict identity verification and least-privilege access for all users and devices."
        }
    ],
    "Data Scientist": [
        {
            "question": "Why is cross-validation (e.g., K-Fold CV) essential when tuning machine learning models?",
            "options": [
                "It provides an unbiased estimate of generalization error across multiple unseen validation subsets, preventing data leakage.",
                "It increases the training dataset size by duplicating rows.",
                "It converts continuous variables into categorical labels.",
                "It guarantees a 100% R-squared score."
            ],
            "correct_answer": "It provides an unbiased estimate of generalization error across multiple unseen validation subsets, preventing data leakage.",
            "explanation": "K-Fold cross validation splits the dataset into K folds to validate that the model generalizes robustly without overfitting."
        },
        {
            "question": "What does a high p-value (p > 0.05) typically signify in a standard hypothesis test?",
            "options": [
                "There is insufficient evidence to reject the Null Hypothesis; the observed effect could reasonably occur by random chance.",
                "The research hypothesis is 100% proven true.",
                "The dataset must be discarded due to corruption.",
                "The sample size is too large."
            ],
            "correct_answer": "There is insufficient evidence to reject the Null Hypothesis; the observed effect could reasonably occur by random chance.",
            "explanation": "A p-value above alpha threshold (0.05) means the observed data is consistent with the null hypothesis."
        }
    ],
    "DevOps Engineer": [
        {
            "question": "In Kubernetes, what is the role of a ReplicaSet?",
            "options": [
                "To ensure a specified number of identical Pod replicas are running at all times across worker nodes.",
                "To encrypt cluster network traffic using SSL certificates.",
                "To manage physical hard drive partitioning on host nodes.",
                "To compile Go source code into Docker images."
            ],
            "correct_answer": "To ensure a specified number of identical Pod replicas are running at all times across worker nodes.",
            "explanation": "ReplicaSets maintain pod availability and automatically provision new pods if any instance terminates unexpectedly."
        },
        {
            "question": "What is the key advantage of a Blue-Green deployment strategy?",
            "options": [
                "Zero-downtime releases with instant traffic switching via load balancer and near-instantaneous rollback capability.",
                "It requires zero server resources or cloud instances.",
                "It automatically generates production test data.",
                "It compresses Docker images by 95%."
            ],
            "correct_answer": "Zero-downtime releases with instant traffic switching via load balancer and near-instantaneous rollback capability.",
            "explanation": "Blue-Green maintains two identical environments; once the new version (Green) is verified, router traffic is switched over instantaneously."
        }
    ]
}

# Generic High-Yield Universal Engineering Questions
UNIVERSAL_QUESTIONS = [
    {
        "question": "What is the primary characteristic of an idempotent API operation (such as HTTP PUT or DELETE)?",
        "options": [
            "Making the same request multiple times produces the identical server state as making it once.",
            "The request executes in exactly zero milliseconds.",
            "The request can only be executed once per user account lifetime.",
            "The server reboots after the request completes."
        ],
        "correct_answer": "Making the same request multiple times produces the identical server state as making it once.",
        "explanation": "Idempotence guarantees that repeated identical requests will not create unintended duplicate state changes."
    },
    {
        "question": "In asynchronous programming, what problem does an Event Loop solve?",
        "options": [
            "It manages non-blocking I/O operations by delegating them to the OS kernel and executing callbacks upon completion.",
            "It turns single-threaded programs into multi-threaded C++ executables.",
            "It forces all functions to execute synchronously in a loop.",
            "It disables memory garbage collection."
        ],
        "correct_answer": "It manages non-blocking I/O operations by delegating them to the OS kernel and executing callbacks upon completion.",
        "explanation": "The event loop continuously polls for completed asynchronous I/O events, enabling high concurrency on a single thread."
    },
    {
        "question": "Why is the Single Responsibility Principle (SRP) fundamental to maintainable software architecture?",
        "options": [
            "Each module or class has only one reason to change, making code easier to test, refactor, and decouple.",
            "It forces all project code to reside in a single file.",
            "It prevents classes from having more than one method.",
            "It restricts software development to a single engineer."
        ],
        "correct_answer": "Each module or class has only one reason to change, making code easier to test, refactor, and decouple.",
        "explanation": "SRP states that a class should encapsulate a single responsibility, reducing side-effects when requirements change."
    },
    {
        "question": "What is the primary purpose of a Reverse Proxy (such as Nginx or Traefik)?",
        "options": [
            "To sit in front of web servers, handling SSL termination, load balancing, compression, and request routing.",
            "To convert client HTTP requests into database binary logs.",
            "To replace browser rendering engines.",
            "To delete outdated files from client devices."
        ],
        "correct_answer": "To sit in front of web servers, handling SSL termination, load balancing, compression, and request routing.",
        "explanation": "Reverse proxies act as intermediaries to protect origin servers, distribute load, and optimize traffic throughput."
    }
]

def generate_quiz_questions(
    career_id: str,
    career_title: str,
    skills_to_develop: Optional[List[str]] = None,
    num_questions: int = 5
) -> List[Dict[str, Any]]:
    """
    Generates dynamic, realistic technical diagnostic questions.
    Every time this is called:
    1. A fresh candidate pool of relevant domain and skill questions is compiled.
    2. Questions are randomly sampled.
    3. Options are randomly shuffled, and correct_index is accurately tracked.
    """
    candidate_pool: List[Dict[str, Any]] = []

    # 1. Match career title in question bank
    for bank_career, q_list in QUESTION_BANK.items():
        if bank_career.lower() in career_title.lower() or career_title.lower() in bank_career.lower():
            candidate_pool.extend(q_list)

    # 2. Match skills if provided
    if skills_to_develop:
        for skill in skills_to_develop:
            for bank_career, q_list in QUESTION_BANK.items():
                if skill.lower() in bank_career.lower():
                    candidate_pool.extend(q_list)

    # 3. If pool is small, add universal engineering questions
    candidate_pool.extend(UNIVERSAL_QUESTIONS)

    # 4. Deduplicate questions by question text
    unique_pool = []
    seen_texts = set()
    for q in candidate_pool:
        if q["question"] not in seen_texts:
            seen_texts.add(q["question"])
            unique_pool.append(q)

    # 5. Randomly sample requested number of questions
    selected_count = min(len(unique_pool), num_questions)
    sampled = random.sample(unique_pool, selected_count)

    formatted_questions: List[Dict[str, Any]] = []

    for q in sampled:
        correct_text = q["correct_answer"]
        all_options = list(q["options"])
        
        # Ensure correct answer is in options
        if correct_text not in all_options:
            all_options[0] = correct_text

        # Randomly shuffle options for realistic testing
        random.shuffle(all_options)
        new_correct_index = all_options.index(correct_text)

        formatted_questions.append({
            "skill": career_title,
            "question": q["question"],
            "options": all_options,
            "correct_index": new_correct_index,
            "correct_answer": new_correct_index,
            "explanation": q["explanation"]
        })

    return formatted_questions
