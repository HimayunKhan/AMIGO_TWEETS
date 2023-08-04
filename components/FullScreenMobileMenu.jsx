"use client";

import React from "react";
import { BsX } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Search from "./Search";

const FullScreenMobileMenu = ({ setopen, users }) => {

  const handleLinkClick = (path) => {
    setopen(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center gap-10 bg-dark/80 py-12 text-5xl text-white backdrop-blur-md">
      {/* <div onClick={() => handleLinkClick("/")}>Home</div> */}
      <div>Search</div>

      <Search users={users} />

      <button
        onClick={() => {
          setopen(false);
        }}
        className="mt-auto flex text-red-500 items-center gap-2 text-2xl"
      >
         <BsX  size={72} />
      </button>
    </div>
  );
};

export default FullScreenMobileMenu;
