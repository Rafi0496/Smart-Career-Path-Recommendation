import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { career_id, career_title, skills_to_develop } = body;

    if (!career_id) {
      return NextResponse.json(
        { error: "career_id is required" },
        { status: 400 }
      );
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

    try {
      const pyRes = await fetch(`${pythonServiceUrl}/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career_id,
          career_title: career_title || career_id,
          skills_to_develop: skills_to_develop || [],
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (pyRes.ok) {
        const data = await pyRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("Python service unreachable for quiz generation, generating fallback quiz...", e);
    }

    // Built-in fallback quiz if microservice is offline
    const skills = (skills_to_develop && skills_to_develop.length > 0)
      ? skills_to_develop.slice(0, 3)
      : ["Core Concepts", "Problem Solving"];

    const questions = skills.flatMap((skill: string) => [
      {
        skill,
        question: `When applying '${skill}' in practical projects, what is considered an essential best practice?`,
        options: [
          `Writing modular, well-tested code with proper documentation`,
          `Skipping automated unit tests to accelerate initial launch`,
          `Embedding secret credentials directly in repository commits`,
          `Avoiding source control tools like Git`
        ],
        correct_answer: 0,
        explanation: `Modular architecture, comprehensive unit tests, and security hygiene are the industry benchmarks for ${skill}.`
      },
      {
        skill,
        question: `Which approach best prevents technical debt and reliability issues in '${skill}'?`,
        options: [
          `Code reviews, continuous integration, and performance benchmarking`,
          `Writing code without error boundaries or exception logging`,
          `Deploying untested changes straight to production`,
          `Ignoring system telemetry and logs`
        ],
        correct_answer: 0,
        explanation: `Peer reviews, automated CI checks, and systematic telemetry prevent regressions when building with ${skill}.`
      }
    ]);

    return NextResponse.json({
      success: true,
      career_id,
      career_title,
      cached: false,
      questions,
    });
  } catch (err: any) {
    console.error("Quiz generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate skill-gap quiz", details: err?.message },
      { status: 500 }
    );
  }
}
