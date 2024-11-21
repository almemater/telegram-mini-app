import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import PointsData from "@/models/pointsdata";
import { generateReferralCode } from "@/libs/generators";

export async function POST(request: NextRequest) {
  const {
    id,
    first_name,
    last_name,
    username,
    language_code,
    is_premium,
    points,
    completedTasks,
  } = await request.json();

  try {
    await connectMongoDB();

    // Check if user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 409 }
      );
    }

    // Handle missing username
    const validUsername = typeof username === "string" && username.trim() !== "" ? username : null;

    const referralCode = generateReferralCode(id, validUsername);

    const newUser = await User.create({
      id,
      first_name,
      last_name,
      username: validUsername,
      language_code,
      is_premium,
      completedTasks,
      referralCode,
    });

    const full_name = last_name ? `${first_name} ${last_name}` : first_name;

    const newPointsData = await PointsData.create({
      id,
      full_name,
      username: validUsername,
      points,
      daily_points: 0, // Ensure daily_points is initialized
    });

    console.log(`User created: ${newUser} ${newPointsData}`);

    return NextResponse.json(
      { message: "User created successfully", user: newUser, pointsdata: newPointsData },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error creating user", e);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}