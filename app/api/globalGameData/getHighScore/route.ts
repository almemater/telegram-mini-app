import connectMongoDB from "@/libs/mongodb";
import GlobalGameData from "@/models/global_game_data";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  try {
    const globalGameData = await GlobalGameData.findOne();
    return NextResponse.json(globalGameData || { highest_score: 0 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch highest score" }, { status: 500 });
  }
}

