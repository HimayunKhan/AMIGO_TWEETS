import Avatar from "./Avatar";
import Link from "next/link";
import PostButtons from "./PostButtons";
import TimeAgo from "timeago-react";
import EditDropDown from "./EditDropDown";
import Image from "next/image";
import { useState } from "react";

export default function PostContent({
  parent,
  onPost,
  userInfo,
  text,
  author,
  createdAt,
  _id,
  likesCount,
  likedByMe,
  commentsCount,
  images,
  big = false,
}) {
  const show = userInfo?._id == author?._id;
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedText =
    text.length > 150 && !isExpanded ? text.slice(0, 150)  : text;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleToggleCollapse = () => {
    setIsExpanded(false);

    const postContainer = document.getElementById(`post-${_id}`);
    if (postContainer) {
      postContainer.scrollIntoView({ behavior: "smooth" });
    }
  
  };

  function showImages() {
    if (!images?.length) {
      return "";
    }

    return (
      <div className="wrapper flex  overflow-x-auto">
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-auto h-auto mr-2"
            width={400}
            height={240}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full">
        <div>
          {!!author?.image && (
            <Link href={"/" + author?.username}>
              <div className="cursor-pointer">
                <Avatar src={author.image} />
              </div>
            </Link>
          )}
        </div>
        <div className="pl-2 grow " >
          <div className=" flex justify-between items-center">
            <div id={`post-${_id}`}>
              <Link href={"/" + author?.username}>
                <span className="font-bold pr-1 cursor-pointer">
                  {author?.name}
                </span>
              </Link>
              {big && <br />}
              <Link href={"/" + author?.username}>
                <span className="text-twitterLightGray cursor-pointer">
                  @{author?.username}
                </span>
              </Link>
              {createdAt && !big && (
                <span className="pl-1 text-twitterLightGray">
                  <TimeAgo datetime={createdAt} locale="en" />
                </span>
              )}
            </div>
            {show && (
              <div className="-mr-3">
                {" "}
                <EditDropDown
                  onPost={onPost}
                  postID={_id}
                  parent={parent}
                />{" "}
              </div>
            )}
          </div>
          {!big && (
            <div>
        
                <div className="w-full cursor-pointer">
                  {/* {text} */}

                  <Link href={`/${author?.username}/status/${_id}`}>
                     {truncatedText}
                     </Link>
                  {text.length > 150 &&
                    (isExpanded ? (
                      <span
                        className="text-twitterBlue cursor-pointer"
                        onClick={handleToggleCollapse}
                      >
                        {" "}
                        Less...
                      </span>
                    ) : (
                      <span
                        className="text-twitterBlue cursor-pointer"
                        onClick={handleToggleExpand}
                      >
                        {" "}
                        More...
                      </span>
                    ))}
                  {showImages()}
                </div>
             
              <PostButtons
                username={author?.username}
                id={_id}
                likesCount={likesCount}
                likedByMe={likedByMe}
                commentsCount={commentsCount}
              />
            </div>
          )}
        </div>
      </div>
      {big && (
        <div className="mt-2">
          <Link href={`/${author?.username}/status/${_id}`}>
            <div>
              {text}
              {showImages()}
            </div>
          </Link>
          {createdAt && (
            <div className="text-twitterLightGray text-sm">
              {new Date(createdAt)
                .toISOString()
                .replace("T", " ")
                .slice(0, 16)
                .split(" ")
                .reverse()
                .join(" ")}
            </div>
          )}
          <PostButtons
            username={author?.username}
            id={_id}
            likesCount={likesCount}
            likedByMe={likedByMe}
            commentsCount={commentsCount}
          />
        </div>
      )}
    </div>
  );
}
