"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UsernameForm from "@/components/UsernameForm";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import axios from "axios";
import PostContent from "@/components/PostContent";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import FullScreenMobileMenu from "@/components/FullScreenMobileMenu";
import Logo from "@/components/Logo";
import { FaSignOutAlt } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

export default function Home() {
  const { data: session } = useSession();
  const { userInfo, setUserInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikedByMe] = useState([]);
  const router = useRouter();
  const [menuopen, setmenuopen] = useState(false);
  const [AllUsersData, setAllUsersData] = useState([]);

 

  function fetchHomePosts() {
    axios.get("/api/posts").then((response) => {
      setPosts(response.data.posts);
      setIdsLikedByMe(response.data.idsLikedByMe);
    });
  }

  async function logout() {
    setUserInfo(null);
    await signOut();
  }

  useEffect(() => {
    fetchHomePosts();
  }, []);

  if (userInfoStatus === "loading") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <PulseLoader size={14} color={"#fff"} />
      </div>
    );
  }

  if (userInfo && !userInfo?.username) {
    return <UsernameForm />;
  }

  if (!userInfo) {
    router.push("/login");

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <PulseLoader size={14} color={"#fff"} />
      </div>
    );
  }

  const handleSearch = () => {
    setmenuopen(true);
    const fetchUSer = () => {
      const AllUser = axios.get("/api/allusers").then((response) => {
        setAllUsersData(response.data.user);
      });
    };
    fetchUSer();
  };

  return (
    <>
      <>
        {menuopen && (
          <FullScreenMobileMenu setopen={setmenuopen} users={AllUsersData} />
        )}
      </>
      <>
        <div className="flex justify-between items-center">
          <div className="">
            <Link href={"/"}>
              <span className="sr-only text-twitterBlue">Questt</span>
              <Logo className={"ml-4 mt-2 w-20 pb-4 lg:w-28"} />
            </Link>
          </div>

          <Link href={`/allposts`}>
            <button className="text-md  rounded-full font-bold py-2 px-4">
              Posts
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
              <button
                onClick={logout}
                className="bg-black text-black px-2 py-2 rounded-lg "
              >
                <FaSignOutAlt
                  className="text-twitterLightGray bg-black"
                  size={32}
                />
              </button>
            </div>
          )}
        </div>

        <PostForm
          onPost={() => {
            fetchHomePosts();
          }}
        />
        <div className="">
          {posts.length > 0 &&
            posts.map((post) => (
              <div className="border-t border-twitterBorder p-5" key={post._id}>
                {post.parent && (
                  <div>
                    <PostContent {...post.parent} />
                    <div className="relative h-8">
                      <div className="border-l-2 border-twitterBorder h-10 absolute ml-6 -top-4"></div>
                    </div>
                  </div>
                )}
                <PostContent
                  {...post}
                  likedByMe={idsLikedByMe.includes(post._id)}
                />
              </div>
            ))}
        </div>
        {/* {userInfo && (
          <div className="p-5 text-center border-t border-twitterBorder">
            <button
              onClick={logout}
              className="bg-twitterWhite text-black px-5 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
        )} */}
      </>
    </>
  );
}
