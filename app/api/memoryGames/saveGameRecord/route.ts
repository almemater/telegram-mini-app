import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import MemoryGame from "@/models/memoryGame";

export async function POST(request: NextRequest) {
  const { gameId, userId, score, timeTaken, flips, isWin } = await request.json();
  
  await connectMongoDB();

  const existingGame = await MemoryGame.findOne({ gameId });

  if (existingGame) {
    return NextResponse.json(
      { message: "Game record already exists" },
      { status: 409 }
    );
  }

  const newGameRecord = await MemoryGame.create({
    gameId,
    userId,
    score,
    timeTaken,
    flips,
    isWin,
  });

  return NextResponse.json(
    { message: "Game record saved successfully", gameRecord: newGameRecord },
    { status: 201 }
  );
}