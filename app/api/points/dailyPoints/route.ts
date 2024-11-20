import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Connect to MongoDB
    await connectMongoDB();

    // Fetch top 25 users in descending order of points
    const pointsdata = await PointsData.find(
      {},
      { id: 1, full_name: 1, username: 1, points: 1, daily_points: 1 }
    ).sort({ daily_points: -1, _id: 1 }).limit(50);

    if (!pointsdata) {
      console.error("Error fetching users");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    let userDailyRank = null;
    if (userId) {
      // Fetch the user's points
      const user = await PointsData.findOne({ id: userId }, { points: 1 });
      if (user) {
        // Count the number of users with more points than the current user
        const higherPointsCount = await PointsData.countDocuments({
          $or: [
            { daily_points: { $gt: user.daily_points } },
            { daily_points: user.daily_points, _id: { $lt: user._id } }
          ]
        });
        userDailyRank = higherPointsCount + 1;
      }
    }

    // Return the top 50 users and optionally the user's rank in the response
    return NextResponse.json({ pointsdata, userDailyRank });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}