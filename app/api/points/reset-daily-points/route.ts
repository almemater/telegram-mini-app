import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";

export async function PUT(request: NextRequest) {
  await connectMongoDB();

  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.RESET_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Update all records to set dailyPoints to 0
    await PointsData.updateMany({}, { $set: { dailyPoints: 0 } });

    return NextResponse.json({ message: "Daily points reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error resetting daily points:", error);
    return NextResponse.json({ message: "Error resetting daily points" }, { status: 500 });
  }
}