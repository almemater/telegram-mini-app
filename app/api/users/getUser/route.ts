import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import PointsData from "@/models/pointsdata";

export async function GET(request : NextRequest) {
    // console.log("API route /api/users/getUser hit");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('userid');

    await connectMongoDB();

    const user = await User.findOne({ id });
    const pointsdata = await PointsData.findOne({ id });

    if (!user || !pointsdata) {
        // console.log(`Couldn't find user with username: ${username}`);
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // console.log(`Found user: ${JSON.stringify(user)}`);
    return NextResponse.json({ message: "User fetched successfully", user, pointsdata }, { status: 200 });
}