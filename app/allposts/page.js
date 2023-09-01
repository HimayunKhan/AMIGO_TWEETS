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

export default function Allposts({ params }) {
  const { userInfo, setUserInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikedByMe] = useState([]);
  const router = useRouter();
  const [menuopen, setmenuopen] = useState(false);
  const [AllUsersData, setAllUsersData] = useState([]);
  const [flag, setFlag] = useState(true);

  function fetchHomePosts() {
    axios.get("/api/posts").then((response) => {
      setFlag(false);
      setPosts(response.data.posts);
      setIdsLikedByMe(response.data.idsLikedByMe);
    });
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
          url={"allposts"}
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
              {posts?.length > 0 ? (
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
                ))
              ) : (
                <>
                  <div className="border-t-2 border-twitterBorder px-5">
                    <h1 className="text-2xl flex justify-center text-center mt-10 mx-auto text-twitterBorder   ">
                      Users can view posts exclusively from the people they
                      follow, ensuring they stay connected with their desired
                      network.
                    </h1>{" "}
                    <br />
                    <span className="  text-2xl flex justify-center text-center mt-10 mx-auto text-twitterBorder">
                      <h1>
                        {" "}
                        No posts yet... Please do post or follow others to see
                        any activity here.
                      </h1>
                    </span>
                  </div>
                </>
              )}
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
