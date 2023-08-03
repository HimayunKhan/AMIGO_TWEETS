import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPhotosToCloudinary(path, name) {
  const pic = [
    cloudinary.v2.uploader.upload(path, { folder: "twitter/coverphotos" }),
  ];
  return await Promise.all(pic);
}

async function uploadPhotosToCloudinary1(path, name) {
  const pic = [
    cloudinary.v2.uploader.upload(path, { folder: "twitter/profilepic" }),
  ];
  return await Promise.all(pic);
}

export async function POST(request, context) {
  try {
    await mongooseConnect();

    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;

    const formData = await request.formData();

   
    const [formDataEntry] = formData;

    if (formDataEntry[0] === "cover") {
      const file = formDataEntry[1];
      const buffer = await file.arrayBuffer();
      const name = uuidv4();
      const ext = file.type.split("/")[1];
      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${name}.${ext}`);
      await fs.promises.writeFile(uploadDir, Buffer.from(buffer));
      const photos = await uploadPhotosToCloudinary(uploadDir, file.name);
      fs.unlinkSync(uploadDir);
      const coverUrl = photos[0]?.secure_url || null;
      const user = await User.findById(userID);
      user.cover = coverUrl;
      const updatedUser = await user.save();
      return NextResponse.json(updatedUser);
    }

    if (formDataEntry[0] === "image") {
      const file = formDataEntry[1];
      const buffer = await file.arrayBuffer();
      const name = uuidv4();
      const ext = file.type.split("/")[1];
      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${name}.${ext}`);
      await fs.promises.writeFile(uploadDir, Buffer.from(buffer));
      const photos = await uploadPhotosToCloudinary1(uploadDir, file.name);
      fs.unlinkSync(uploadDir);
      const imageURL = photos[0]?.secure_url || null;
      const user = await User.findById(userID);
      user.image = imageURL;
      const updatedUserpic = await user.save();
      return NextResponse.json(updatedUserpic);
    }

    if (formDataEntry[0] === "post") {
      const file = formDataEntry[1];
      const buffer = await file.arrayBuffer();
      const name = uuidv4();
      const ext = file.type.split("/")[1];
      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${name}.${ext}`);
      await fs.promises.writeFile(uploadDir, Buffer.from(buffer));
      const photos = await uploadPhotosToCloudinary1(uploadDir, file.name);
      fs.unlinkSync(uploadDir);
      const imageURL = photos[0]?.secure_url || null;
   
      return NextResponse.json(imageURL);
    }
    

    return new Response("posiiiiii")
  } catch (error) {
    return NextResponse.error(error);
  }
}
