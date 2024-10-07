import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all users in descending order of points
    const pointsdata = await PointsData.find(
      {},
      { id:1, full_name: 1, username: 1, points: 1 }
    ).sort({ points: -1, _id: 1 });

    if (!pointsdata) {
      console.error("Error fetching users");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (userId) {
      // Find the rank of the user
      const userRank = await pointsdata.findIndex(user => user.id === userId) + 1;
      return NextResponse.json({ pointsdata, userRank });
    }

    // Return the users and optionally the user's rank in the response
    return NextResponse.json({ pointsdata });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}