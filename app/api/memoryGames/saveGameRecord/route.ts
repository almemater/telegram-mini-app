import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import MemoryGame from "@/models/memoryGame";
import GlobalGameData from "@/models/global_game_data";
import PointsData from "@/models/pointsdata";

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
    // Save game record
    const newGameRecord = await MemoryGame.create({
      gameId,
      userId,
      score,
      timeTaken,
      flips,
      isWin,
    });

    // Update user points
    const pointsdata = await PointsData.findOneAndUpdate(
      { id: userId },
      { $inc: { points: score, daily_points: score } },
      { new: true }
    );

    if (!pointsdata) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update global highest score if the current score is higher
    let globalGameData = await GlobalGameData.findOne();
    if (!globalGameData) {
      globalGameData = new GlobalGameData({ highest_score: score });
    } else if (score > globalGameData.highest_score) {
      globalGameData.highest_score = score;
    }
    await globalGameData.save();

    return NextResponse.json(
      { message: "Game record saved successfully", gameRecord: newGameRecord, pointsdata, globalGameData },
      { status: 201 }
    );

  } catch (e) {
    console.error("Error saving game record", e);
    return NextResponse.json({ message: "Error saving game record" }, { status: 500 });
  }
}