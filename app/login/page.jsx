"use client";
import { signIn, useSession } from "next-auth/react";
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
      <button
        onClick={async () => {
          await signIn("google");
        }}
        className="bg-twitterWhite pl-3 pr-5 py-2 text-black rounded-full flex items-center"
      >
        <img src="/google.png" alt="" className="h-8" />
        Sign in with Google
      </button>
    </div>
  );
}

