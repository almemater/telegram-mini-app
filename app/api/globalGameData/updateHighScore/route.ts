import connectMongoDB from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import GlobalGameData from "@/models/global_game_data";


export async function POST(request: NextRequest) {
    await connectMongoDB();
  
    const { highest_score } = await request.json();
  
    try {
      let globalGameData = await GlobalGameData.findOne();
      if (!globalGameData) {
        globalGameData = new GlobalGameData({ highest_score });
      } else if (highest_score > globalGameData.highest_score) {
        globalGameData.highest_score = highest_score;
      }
      await globalGameData.save();
      return NextResponse.json({globalGameData});
    } catch (error) {
      return NextResponse.json({ error: "Failed to update highest score" }, { status: 500 });
    }
  }