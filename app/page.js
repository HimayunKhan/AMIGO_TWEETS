"use client";
import { useEffect, useState } from "react";
import UsernameForm from "@/components/UsernameForm";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import axios from "axios";
import PostContent from "@/components/PostContent";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import FullScreenMobileMenu from "@/components/FullScreenMobileMenu";
import Navbar from "@/components/Navbar";


export default function Home() {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  let [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikedByMe] = useState([]);
  const router = useRouter();
  const [menuopen, setmenuopen] = useState(false);
  const [AllUsersData, setAllUsersData] = useState([]);
  const [flag, setFlag] = useState(true);
  console.log("WELCOME TO QUESTT_TWEET")


  function fetchHomePosts() {
    axios.get("/api/allposts").then((response) => {
      setFlag(false);
      setPosts(response?.data?.posts);
      setIdsLikedByMe(response?.data?.idsLikedByMe);
    });
  }

  posts = posts.filter((item) => {
    return item.parent == undefined;
  });

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

  return (
    <>
      <>
        {menuopen && (
          <FullScreenMobileMenu setopen={setmenuopen} users={AllUsersData} />
        )}
      </>
      <>
        <Navbar
          setmenuopen={setmenuopen}
          userInfo={userInfo}
          setAllUsersData={setAllUsersData}
        />

        <PostForm
          onPost={() => {
            fetchHomePosts();
          }}
          setFlag={setFlag}
        />

        {!flag ? (
          <>
            <div className="">
              {posts?.length > 0 &&
                posts?.map((post) => (
                  <div
                    className="border-t border-twitterBorder p-5"
                    key={post?._id}
                  >
                    {post.parent && (
                      <div>
                        <PostContent
                          {...post.parent}
                          userInfo={userInfo}
                          onPost={() => {
                            fetchHomePosts();
                          }}
                        />
                        <div className="relative h-8">
                          <div className="border-l-2 border-twitterLightGray h-10 absolute ml-6 -top-4"></div>
                        </div>
                      </div>
                    )}
                    <PostContent
                      {...post}
                      likedByMe={idsLikedByMe.includes(post?._id)}
                      userInfo={userInfo}
                      onPost={() => {
                        fetchHomePosts();
                      }}
                    />
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <div className=" flex items-center justify-center">
              <PulseLoader size={14} color={"#fff"} />
            </div>
          </>
        )}
      </>
    </>
  );
}

