import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import MemoryGame from "@/models/memoryGame";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  await connectMongoDB();

  const gameRecords = await MemoryGame.find({ userId });

  if (!gameRecords || gameRecords.length === 0) {
    return NextResponse.json(
      { message: "No game records found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Game records retrieved successfully", gameRecords },
    { status: 200 }
  );
}