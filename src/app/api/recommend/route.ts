import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/career-engine";
import type { UserProfile } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UserProfile;
    if (!body.academics || !body.interests || !body.aspirations) {
      return NextResponse.json(
        { error: "Missing profile data (academics, interests, aspirations)" },
        { status: 400 }
      );
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

    try {
      // Proxy to Python FastAPI ML Microservice
      const pyRes = await fetch(`${pythonServiceUrl}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(7000), // 7s timeout
      });

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        if (pyData.recommendations && pyData.recommendations.length > 0) {
          return NextResponse.json({
            engine: pyData.engine || "Hybrid (Sentence-Transformers ML + Feature Matching)",
            recommendations: pyData.recommendations,
          });
        }
      }
    } catch (err) {
      console.warn("Python service unreachable or timed out. Falling back to local TS engine.", err);
    }

    // Graceful fallback to rule-scoring career-engine.ts
    const recommendations = getRecommendations(body);
    return NextResponse.json({
      engine: "Fallback (Local Career Engine)",
      recommendations,
    });
  } catch (e) {
    console.error("Failed to process recommendation request:", e);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
