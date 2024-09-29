import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all users in descending order of points
    const pointsdata = await PointsData.find(
      {},
      { full_name: 1, username: 1, points: 1 }
    ).sort({ points: -1 });
    
    if (!pointsdata) {
      console.error("Error fetching users");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    // Return the users in the response with cache control headers
    const response = NextResponse.json({ pointsdata });

    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}