import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Post from "@/models/Post";
import Like from "@/models/Like";

async function updateLikesCount(postId) {
  const post = await Post.findById(postId);
  post.likesCount = await Like.countDocuments({ post: postId });
  await post.save();
}

export async function POST(request, context) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;
    const { id } = await request.json();

    const postId = id;
    const userId = userID;

    const existingLike = await Like.findOne({ author: userId, post: postId });

    if (existingLike) {
      await existingLike.deleteOne();
      await updateLikesCount(postId);
      return NextResponse.json(null);
    } else {
      const like = await Like.create({ author: userId, post: postId });
      await updateLikesCount(postId);
      return NextResponse.json({ like });
    }
  } catch (error) {
    // return NextResponse.error(error);
  }
}
