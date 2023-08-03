import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Follower from "@/models/Follower";

export async function GET(request, context) {
  try {
    await mongooseConnect();

    const { searchParams } = new URL(request?.url);
    const username = searchParams.get("username");

    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;

    const user = userID
      ? await User.findById(userID)
      : await User.findOne({ username });

    const follow = await Follower.findOne({
      source: userID,
      destination: user._id,
    });

    return NextResponse.json({ user, follow });
  } catch (error) {
    return NextResponse.error(error);
  }
}

export async function PUT(request, context) {
  try {
    await mongooseConnect();

    const { username } = await request.json();
    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;

    await User.findByIdAndUpdate(userID, { username });
    return new Response("okk");
  } catch (error) {
    return NextResponse.error(error);
  }
}
