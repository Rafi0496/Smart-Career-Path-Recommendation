import { NextResponse } from "next/server";
import { buildCareerPdfArrayBuffer } from "@/lib/pdf-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { career, user_name } = body;

    if (!career || !career.careerTitle) {
      return NextResponse.json(
        { error: "career and careerTitle are required" },
        { status: 400 }
      );
    }

    const titleSlug = career.careerTitle.replace(/[^a-zA-Z0-9_\-]+/g, "_");
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

    // 1. First attempt to fetch from Python microservice if running
    try {
      const pyRes = await fetch(`${pythonServiceUrl}/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career, user_name }),
        signal: AbortSignal.timeout(3000), // Quick 3s timeout before falling back to built-in generator
      });

      if (pyRes.ok) {
        const pdfBuffer = await pyRes.arrayBuffer();
        return new Response(pdfBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${titleSlug}_Roadmap.pdf"`,
          },
        });
      }
    } catch {
      // Python service not reachable or timed out; continue to built-in high quality PDF generator
    }

    // 2. Built-in standalone PDF generator (100% reliable, zero external dependencies)
    const fallbackBuffer = buildCareerPdfArrayBuffer(career, user_name || "Candidate");

    return new Response(fallbackBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${titleSlug}_Roadmap.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF export route error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF.", details: err?.message },
      { status: 500 }
    );
  }
}
