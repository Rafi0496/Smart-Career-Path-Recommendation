import { NextResponse } from "next/server";

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

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

    const pyRes = await fetch(`${pythonServiceUrl}/export/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ career, user_name }),
      signal: AbortSignal.timeout(15000), // 15s timeout for PDF rendering
    });

    if (!pyRes.ok) {
      const errText = await pyRes.text();
      return NextResponse.json(
        { error: "PDF generation failed on Python service", details: errText },
        { status: pyRes.status }
      );
    }

    const pdfBuffer = await pyRes.arrayBuffer();
    const titleSlug = career.careerTitle.replace(/[^a-zA-Z0-9_\-]+/g, "_");

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${titleSlug}_Roadmap.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF export proxy error:", err);
    return NextResponse.json(
      { error: "Unable to generate PDF. Make sure python-service is active.", details: err?.message },
      { status: 500 }
    );
  }
}
