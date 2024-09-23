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

  try {
    const newGameRecord = await MemoryGame.create({
      gameId,
      userId,
      score,
      timeTaken,
      flips,
      isWin,
    });
  
    console.log(`Game completed for user ${userId} with gameid ${gameId}`);
  
    return NextResponse.json(
      { message: "Game record saved successfully", gameRecord: newGameRecord },
      { status: 201 }
    );

  } catch (e) {
    console.error("Error saving game record", e);
    return NextResponse.json({ message: "Error saving game record" }, { status: 500 });
  }
}