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
    const recommendations = getRecommendations(body);
    return NextResponse.json({ recommendations });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
