import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Follower from "@/models/Follower";

export async function GET(request, context) {
  try {
    await mongooseConnect();
  
    const user = await User.find();

    return NextResponse.json({ user });
  } catch (error) {
    // return NextResponse.error(error);
  }
}
