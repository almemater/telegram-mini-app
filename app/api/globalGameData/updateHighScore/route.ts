import connectMongoDB from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import GlobalGameData from "@/models/global_game_data";


export async function POST(request: NextRequest) {
    await connectMongoDB();
  
    const { highestScore } = await request.json();
  
    try {
      let globalGameData = await GlobalGameData.findOne();
      if (!globalGameData) {
        globalGameData = new GlobalGameData({ highestScore });
      } else if (highestScore > globalGameData.highestScore) {
        globalGameData.highestScore = highestScore;
      }
      await globalGameData.save();
      return NextResponse.json({globalGameData});
    } catch (error) {
      return NextResponse.json({ error: "Failed to update highest score" }, { status: 500 });
    }
  }