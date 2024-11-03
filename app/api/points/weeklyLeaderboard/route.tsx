import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import MemoryGame from "@/models/memoryGame";
import User from "@/models/user";

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const topPerformer = await MemoryGame.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: "$userId", gamesPlayed: { $sum: 1 } } },
      { $sort: { gamesPlayed: -1 } },
      { $limit: 1 },
    ]);

    const topScorer = await MemoryGame.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: "$userId", highestScore: { $max: "$score" } } },
      { $sort: { highestScore: -1 } },
      { $limit: 1 },
    ]);

    let topPerformerUser = null;
    let topScorerUser = null;

    if (topPerformer.length > 0) {
      topPerformerUser = await User.findOne({ id: topPerformer[0]._id }).select(
        "id first_name username"
      );
    }

    if (topScorer.length > 0) {
      topScorerUser = await User.findOne({ id: topScorer[0]._id }).select(
        "id first_name username"
      );
    }

    console.log("Top Performer:", topPerformerUser);
    console.log("Top Scorer:", topScorerUser);

    return NextResponse.json({
      topPerformer: topPerformerUser,
      topScorer: topScorerUser,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}