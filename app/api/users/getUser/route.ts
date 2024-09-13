import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";

export async function GET(request : NextRequest) {
    // console.log("API route /api/users/getUser hit");

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // console.log(`Received request to get user with username: ${username}`);

    await connectMongoDB();

    // console.log("Connected to MongoDB");

    const user = await User.findOne({ username });

    if (!user) {
        // console.log(`Couldn't find user with username: ${username}`);
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // console.log(`Found user: ${JSON.stringify(user)}`);
    return NextResponse.json({ message: "User fetched successfully", user }, { status: 200 });
}