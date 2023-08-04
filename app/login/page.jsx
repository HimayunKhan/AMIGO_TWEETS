"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data, status } = useSession();
  if (status === "loading") {
    return "";
  }
  if (status === "authenticated") {
    router.push("/");
  }
  return (
    <div className="flex items-center justify-center h-screen">

      <div>
      <Image src="/twitter_logo1.png" alt="twitter_logo"  width={300} height={200} className="" />

      
      <button
        onClick={async () => {
          await signIn("google");
        }}
        className="bg-twitterBorder  pl-3 pr-5 py-2 text-white rounded-lg mx-auto flex justify-center items-center"
      >
        <img src="/google.png" alt="google_logo" className="h-8" />
        Sign in with Google
      </button>
    </div>
    </div>
  );
}

