import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { generateReferralCode } from '@/libs/generators';

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
  
    await connectMongoDB();
  
    // Check if user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 409 } 
      );
    }
  
    const referralCode = generateReferralCode(id, username);
  
    const newUser = await User.create({
      id,
      first_name,
      last_name,
      username,
      language_code,
      is_premium,
      points,
      completedTasks,
      referralCode
    });
  
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  }