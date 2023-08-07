"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import TopNavLink from "@/components/TopNavLink";
import { PulseLoader } from "react-spinners";

export default function PostPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [post, setPost] = useState();
  const [replies, setReplies] = useState([]);
  const [repliesLikedByMe, setRepliesLikedByMe] = useState([]);
  const { userInfo } = useUserInfo();
  const [flag, setFlag] = useState(true);

  function fetchData() {
    axios.get("/api/posts?id=" + id).then((response) => {
      setPost(response?.data?.post);
      setFlag(false);
    });
    axios.get("/api/posts?parent=" + id).then((response) => {
      setReplies(response?.data?.posts);
      setRepliesLikedByMe(response?.data?.idsLikedByMe);
      setFlag(false);
    });
  }

  function forwardtoHome() {
    router.back();
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchData();
  }, [id]);

  return (
    <>
      {!!post?._id && (
        <div className="px-5 py-2">
          <TopNavLink />
          {post?.parent && (
            <div className="pb-1">
              <PostContent
                {...post.parent}
                userInfo={userInfo}
                onPost={() => {
                  forwardtoHome();
                }}
              />
              <div className="ml-5 h-12 relative">
                <div
                  className="h-20 border-l-2 border-twitterBorder absolute -top-5"
                  style={{ marginLeft: "2px" }}
                ></div>
              </div>
            </div>
          )}
          <div>
            <PostContent
              {...post}
              big
              userInfo={userInfo}
              onPost={() => {
                forwardtoHome();
              }}
            />
          </div>
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder py-5">
          <PostForm
            onPost={fetchData}
            parent={id}
            compact
            placeholder={"Tweet your reply"}
            setFlag={setFlag}
          />
        </div>
      )}
      <div className="">
        {!flag ? (
          <>
            {replies?.map((reply) => (
              <div
                className="p-5 border-t border-twitterBorder"
                key={reply?._id}
              >
                <PostContent
                  {...reply}
                  likedByMe={repliesLikedByMe.includes(reply?._id)}
                  userInfo={userInfo}
                  onPost={() => {
                    forwardtoHome();
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className=" flex items-center justify-center">
                  <PulseLoader size={14} color={"#fff"} />
                </div>
          
          </>
        )}
      </div>
    </>
  );
}
