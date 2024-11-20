import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Connect to MongoDB
    await connectMongoDB();

    // Fetch top 50 users in descending order of points
    const pointsdata = await PointsData.find(
      {},
      { id: 1, full_name: 1, username: 1, points: 1, daily_points: 1 }
    ).sort({ points: -1, _id: 1 }).limit(50);

    if (!pointsdata) {
      console.error("Error fetching users");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    let userRank = null;
    if (userId) {
      // Fetch the user's points
      const user = await PointsData.findOne({ id: userId }, { points: 1 });
      if (user) {
        // Count the number of users with more points than the current user
        const higherPointsCount = await PointsData.countDocuments({
          $or: [
            { points: { $gt: user.points } },
            { points: user.points, _id: { $lt: user._id } }
          ]
        });
        userRank = higherPointsCount + 1;
      }
    }

    // Return the top 50 users and optionally the user's rank in the response
    return NextResponse.json({ pointsdata, userRank });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}