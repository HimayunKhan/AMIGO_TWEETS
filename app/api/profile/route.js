import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/models/User";




export async function PUT(request, context) {
  try {
    await mongooseConnect();
   
    const {bio, name, username } = await request.json();
    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;


    await User.findByIdAndUpdate(userID, { bio,name,username });
    return new Response("okk");
  } catch (error) {
    return NextResponse.error(error);
  }
}
