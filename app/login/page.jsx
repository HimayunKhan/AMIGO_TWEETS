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
    <div className="flex items-center bg-[#07142D] justify-center h-screen">
      <div className="mx-auto">
        <Image
          src="/logo4.png"
          width={100}
          height={100}
          alt="logo"
          className="mx-auto"
          priority={true}
          style={{ width: "auto", height: "auto" }}
        />

        <Image
          src="/logo3.png"
          width={180}
          height={100}
          alt="logo"
          className="mx-auto"
          priority={true}
          style={{ width: "auto", height: "auto" }}
        />

        <button
          onClick={async () => {
            await signIn("google");
          }}
          className="bg-twitterBorder mt-6 pl-3 pr-5 py-2 text-white rounded-lg mx-auto flex justify-center items-center"
        >
          <img src="/google.png" alt="google_logo" className="h-8" />
          Sign in with Google
        </button>


        <p className="text-center text-md  italic p-8"> Experience the joy of expressive tweeting, discover new connections, and stay connected with a refreshing feed.<br/> Join our community and redefine your social media experience today.</p>
      </div>
    </div>
  );
}
