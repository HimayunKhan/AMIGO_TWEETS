import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { MdLibraryBooks } from "react-icons/md";
import { AiOutlineComment } from "react-icons/ai";
import Link from "next/link";
import Dropdown from "./Dropdown";
import axios from "axios";
import Image from "next/image";

const Navbar = ({ setmenuopen, setAllUsersData, userInfo, url }) => {
  const [navState, setNavState] = useState(false);
  const handleSearch = () => {
    setmenuopen(true);
    const fetchUSer = () => {
      const AllUser = axios.get("/api/allusers").then((response) => {
        setAllUsersData(response?.data?.user);
      });
    };
    fetchUSer();
  };

  const onNavScroll = () => {
    if (window.scrollY > 30) {
      setNavState(true);
    } else {
      setNavState(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", onNavScroll);

    return () => {
      window.removeEventListener("scroll", onNavScroll);
    };
  }, []);
  return (
    <>
      <div>
        <div
          className={
            !navState
              ? "relative flex items-center h-[10vh] md:h-[11vh]  justify-between  border-b mb-4 opacity-100 z-50 "
              : "fixed top-0 left-0 right-0 h-[10vh] flex items-center  gap-0 md:gap-6  justify-center opacity-100 z-[200]  backdrop-blur-md blur-effect-theme"
          }
        >
          <Link href={"/"}>
            <div className="">
              <Image
                src="/ert.png"
                width={100}
                height={80}
                alt="logo"
                className="ml-4 -mt-2"
                priority={true}
                style={{ width: "80px", height: "50px" }}
              />

              <div className="-mt-5 ml-8">
                <p>Amigo</p>
              </div>
            </div>
          </Link>

          <Link href={`/allposts`}>
            <button className={`text-xl rounded-full font-bold py-2 px-4`}>
              <MdLibraryBooks
                className={`${url == "allposts" ? "text-twitterBlue" : ""}`}
                size={32}
              />
            </button>
          </Link>

          <Link href={`/activity`}>
            <button className="text-xl  rounded-full font-bold py-2 px-4">
              <AiOutlineComment
                className={`${url == "activity" ? "text-twitterBlue" : ""}`}
                size={32}
              />
            </button>
          </Link>


          <button onClick={handleSearch}>
            <h1 className="text-md font-bold p-4">
              {" "}
              <HiOutlineSearch size={32} />
            </h1>
          </button>

          {userInfo && (
            <div className="p-5 text-center border-t border-twitterBorder">
              <Dropdown />
            </div>
          )}



          
        </div>
      </div>
    </>
  );
};

export default Navbar;
