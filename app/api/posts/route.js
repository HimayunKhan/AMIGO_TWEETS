import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Post from "@/models/Post";
import User from "@/models/User";
import Like from "@/models/Like";
import Follower from "@/models/Follower";

export async function GET(request, context) {
  try {
    await mongooseConnect();

    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;
    const { searchParams } = new URL(request?.url);
    const { id } = Object.fromEntries(searchParams.entries());

    if (id) {
      const post = await Post.findById(id).populate("author").populate({
        path: "parent",
        populate: "author",
      });

      return NextResponse.json({ post });
    } else {
      const { searchParams } = new URL(request?.url);
      const parentD = searchParams.get("parent");
      const parent = parentD || null;
      const author = searchParams.get("author");

      let searchFilter;
      if (!author && !parent) {
        const myFollows = await Follower.find({
          source: userID,
        }).exec();
        const idsOfPeopleIFollow = myFollows.map((f) => f.destination);
        searchFilter = { author: [...idsOfPeopleIFollow, userID] };
      }

      if (author) {
        searchFilter = { author };
      }
      if (parent) {
        searchFilter = { parent };
      }

      const posts = await Post.find(searchFilter)
        .populate("author")
        .populate({
          path: "parent",
          populate: "author",
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();

      let postsLikedByMe = [];
      if (session) {
        postsLikedByMe = await Like.find({
          author: userID,
          post: posts.map((p) => p._id),
        });
      }

      let idsLikedByMe = postsLikedByMe.map((like) => like.post);

      return NextResponse.json({ posts, idsLikedByMe });
    }
  } catch (error) {
    // return NextResponse.error(error);
  }
}

export async function POST(request, context) {
  try {
    await mongooseConnect();
    const { text, parent, images } = await request.json();
    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;

    const post = await Post.create({
      author: userID,
      text,
      parent,
      images,
    });

    if (parent) {
      const parentPost = await Post.findById(parent);
      parentPost.commentsCount = await Post.countDocuments({ parent });
      await parentPost.save();
    }
    return NextResponse.json(post);
  } catch (error) {
    // return NextResponse.error(error);
  }
}

export async function DELETE(request, context) {
  const { searchParams } = new URL(request?.url);
  const id = searchParams.get("postID");

  try {
    await mongooseConnect();
    let post = await Post.find();
    if (!post) {
      return new Response("Post not found.", 404);
    }
    // await Post.deleteOne({ _id: id });
    await Post.deleteMany({
      $or: [{ _id: id }, { "parent._id": id }],
    });
    const res = {
      success: true,
      message: "posts deleted successfully",
    };

    return NextResponse.json(res);
  } catch (error) {
    console.log("error", error);
  }
}

export async function PUT(request, context) {
  try {
    await mongooseConnect();
    const { searchParams } = new URL(request?.url);
    const id = searchParams.get("parentpostID");
    if (id) {
      let post = await Post.findById(id);

      post.commentsCount = post.commentsCount - 1;
      await post.save();

      return new Response("okk");
    } else {
      const { searchParams } = new URL(request?.url);
      const editID = searchParams.get("editID");

      
      const{text,parent,images}=await request.json();

      await Post.findByIdAndUpdate(editID, { text,parent,images });
      return new Response("okk");


    }
  } catch (error) {}
}
