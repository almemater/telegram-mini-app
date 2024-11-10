import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import PointsData from "@/models/pointsdata";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  const { id, points, task } = await request.json();
  await connectMongoDB();

  try {

    const pointsdata = await PointsData.findOneAndUpdate(
      { id },
      { $inc: { points: points, daily_points: points } },
      { new: true }
    );

    if (!pointsdata) {
      console.error("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (task) {
      const user = await User.findOneAndUpdate(
        { id },
        { $push: { completedTasks: task } },
        { new: true }
      );
      return NextResponse.json(
        { message: "User updated successfully", user, pointsdata },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "User updated successfully", pointsdata },
        { status: 200 }
      );
    }
  } catch (e) {
    console.error("Error updating user", e);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }

  // return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
}
