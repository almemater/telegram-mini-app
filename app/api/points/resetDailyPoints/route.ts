import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";

export async function POST(request: NextRequest) {
  await connectMongoDB();

  try {
    // Update all records to set dailyPoints to 0
    await PointsData.updateMany({}, { $set: { dailyPoints: 0 } });

    return NextResponse.json({ message: "Daily points reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error resetting daily points:", error);
    return NextResponse.json({ message: "Error resetting daily points" }, { status: 500 });
  }
}