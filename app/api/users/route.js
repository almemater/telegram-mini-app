/*
id: user.id,
name: `${user.first_name} ${user.last_name || ''}`,
username: user.username || '',
points: 0,
completedTasks: []
*/

import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/user";

export async function POST(request) {
    const { id, name, username, points, completedTasks } = await request.json();
    // const user = { id, name, username, points, completedTasks };
    await connectMongoDB();
    await User.create({ id, name, username, points, completedTasks });
    return NextResponse.json({message: "User created successfully"}, {status: 201});
}