import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import MemoryGame from "@/models/memoryGame";
import { BestGameRecordTypes } from "@/libs/constants";

export async function POST(request: NextRequest) {
  const { userId, type } = await request.json();
  
  await connectMongoDB();

  let gameRecord;

  switch (type) {
    case BestGameRecordTypes.RECENT:
      gameRecord = await MemoryGame.findOne({ userId }).sort({ createdAt: -1 });
      break;
    case BestGameRecordTypes.TIME:
      gameRecord = await MemoryGame.findOne({ userId }).sort({ timeTaken: 1 });
      break;
    case BestGameRecordTypes.FLIPS:
      gameRecord = await MemoryGame.findOne({ userId }).sort({ flips: 1 });
      break;
    case BestGameRecordTypes.HIGHSCORE:
      gameRecord = await MemoryGame.findOne({ userId }).sort({ score: -1 });
      break;
    default:
      return NextResponse.json(
        { message: "Invalid type" },
        { status: 400 }
      );
  }

  if (!gameRecord) {
    return NextResponse.json(
      { message: "No game records found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: `${type} game record retrieved successfully`, gameRecord },
    { status: 200 }
  );
}