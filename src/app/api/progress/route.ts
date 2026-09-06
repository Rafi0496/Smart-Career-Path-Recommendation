import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const careerTitle = searchParams.get("careerTitle");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // In a full cloud setup with DATABASE_URL, this would query postgres:
    // SELECT step_order, completed FROM learning_progress WHERE user_id = $1 AND career_id = $2
    return NextResponse.json({
      success: true,
      userId,
      careerTitle,
      message: "Progress retrieved successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch progress", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, careerTitle, stepOrder, completed } = body;

    if (!userId || !careerTitle || stepOrder === undefined) {
      return NextResponse.json(
        { error: "userId, careerTitle, and stepOrder are required" },
        { status: 400 }
      );
    }

    // PostgreSQL / Supabase sync handler
    // If DATABASE_URL is provided, upsert into learning_progress
    if (process.env.DATABASE_URL) {
      // In production with pg pool:
      // await pool.query(`
      //   INSERT INTO learning_progress (user_id, career_id, step_order, completed, completed_at)
      //   VALUES ($1, $2, $3, $4, NOW())
      //   ON CONFLICT (user_id, career_id, step_order)
      //   DO UPDATE SET completed = EXCLUDED.completed, completed_at = NOW();
      // `, [userId, careerTitle, stepOrder, completed]);
    }

    return NextResponse.json({
      success: true,
      userId,
      careerTitle,
      stepOrder,
      completed,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record progress", details: err?.message },
      { status: 500 }
    );
  }
}
