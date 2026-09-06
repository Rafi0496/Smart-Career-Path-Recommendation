import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please upload a PDF resume." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF resumes are supported." },
        { status: 400 }
      );
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

    // Proxy multipart to Python service
    const pyFormData = new FormData();
    pyFormData.append("file", file, file.name);

    const pyRes = await fetch(`${pythonServiceUrl}/resume/parse`, {
      method: "POST",
      body: pyFormData,
      signal: AbortSignal.timeout(12000), // 12s timeout for PDF processing
    });

    if (!pyRes.ok) {
      const errData = await pyRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.detail || "Resume parsing failed on ML service." },
        { status: pyRes.status }
      );
    }

    const data = await pyRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Resume parse proxy error:", err);
    return NextResponse.json(
      {
        error: "Unable to connect to resume parser service. Please ensure the Python microservice is running or fill the form manually.",
        details: err?.message,
      },
      { status: 502 }
    );
  }
}
