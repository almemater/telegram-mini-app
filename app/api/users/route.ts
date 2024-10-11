import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all users in descending order of points
    const users = await User.find(
      {},
      { first_name: 1, last_name: 1, username: 1 }
    );

    
    if (!users) {
      console.error("Error fetching users");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    // Return the users in the response with cache control headers
    const response = NextResponse.json({ users });

    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}