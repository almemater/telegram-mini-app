import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    const { id, points, task } = await request.json();
    await connectMongoDB();

    const updateData = await {
        $inc: { points: points },
        ...(task && { $push: { completedTasks: task } })
    };

    const user = await User.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
    );

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
}