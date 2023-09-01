"use client";
import { useRouter } from "next/navigation";
import TopNavLink from "@/components/TopNavLink";
import { useEffect, useState } from "react";
import axios from "axios";
import Cover from "@/components/Cover";
import Avatar from "@/components/Avatar";
import PostContent from "@/components/PostContent";
import useUserInfo from "@/hooks/useUserInfo";
import { MdPermMedia } from "react-icons/md";

export default function UserPage({ params }) {
  const { username } = params;
  const [profileInfo, setProfileInfo] = useState();
  const [originalUserInfo, setOriginalUserInfo] = useState();
  const { userInfo } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);


 

  useEffect(() => {
    if (!username) {
      return;
    }
    axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
      setOriginalUserInfo(response.data.user);
      setIsFollowing(!!response.data.follow);
    });
  }, [username]);



  function fetchProfilePosts(){
    axios.get("/api/posts?author=" + profileInfo._id).then((response) => {
      setPosts(response.data.posts);
      setPostsLikedByMe(response.data.idsLikedByMe);
    });
  }

  useEffect(() => {
    if (!profileInfo?._id) {
      return;
    }

    

    fetchProfilePosts()
   
  }, [profileInfo]);

  function updateUserImage(type, src) {
    setProfileInfo((prev) => ({ ...prev, [type]: src }));
  }


  
  async function updateProfile() {
    const { bio, name, username } = profileInfo;
    await axios.put("/api/profile", {
      bio,
      name,
      username,
    });
    setEditMode(false);
  }

  function cancel() {
    setProfileInfo((prev) => {
      const { bio, name, username } = originalUserInfo;
      return { ...prev, bio, name, username };
    });
    setEditMode(false);
  }

  function toggleFollow() {
    setIsFollowing((prev) => !prev);
    axios.post("/api/followers", {
      destination: profileInfo?._id,
    });
  }

  const isMyProfile = profileInfo?._id === userInfo?._id;

  function onChange(e) {
    e.preventDefault();

    const file = e.target.files[0];

    const data = new FormData();
    data.append("image", file);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      const json = await response?.json();
      window.location.reload();
    });
  }

  function onChangeCover(e) {
    e.preventDefault();

    const file = e.target.files[0];

    const data = new FormData();
    data.append("cover", file);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      const json = await response?.json();
      window.location.reload();
    });
  }

  return (
    <>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2 ">
            <TopNavLink title={profileInfo?.name} />
          </div>
          <Cover
            src={profileInfo.cover}
            editable={isMyProfile}
            onChange={(src) => updateUserImage("cover", src)}
          />
          <div >
            {isMyProfile && (
              <label className=" relative flex justify-end  mr-2  text-white mt-[-30px]">
                <MdPermMedia size={25} />
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="formFile"
                  multiple
                  onChange={onChangeCover}
                />
              </label>
            )}
          </div>

          <div className="flex justify-between  ">
            <div className="ml-5 relative ">
              <div className="absolute -top-12 border-4 rounded-full border-black overflow-hidden ">
                <Avatar
                  big
                  src={profileInfo.image}
                  editable={isMyProfile}
                  onChange={(src) => updateUserImage("image", src)}
                />
              </div>
            </div>
            {isMyProfile && (
              <label className="absolute  ml-[120px]  text-twitterBorder mt-7">
                <MdPermMedia size={25} />
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="formFile"
                  multiple
                  onChange={onChange}
                />
              </label>
            )}
            <div className="p-2">
              {!isMyProfile && (
                <button
                  onClick={toggleFollow}
                  className={
                    (isFollowing
                      ? "bg-twitterWhite text-black"
                      : "bg-twitterBlue text-white") + " py-2 px-5 rounded-full"
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
              {isMyProfile && (
                <div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-twitterBlue text-white mt-5 py-2 px-5 rounded-full"
                    >
                      Edit profile
                    </button>
                  )}
                  {editMode && (
                    <div>
                      <button
                        onClick={() => cancel()}
                        className="bg-twitterWhite text-black py-2 px-5 rounded-full mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateProfile()}
                        className="bg-twitterBlue text-white py-2 px-5 rounded-full"
                      >
                        Save profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 mt-2 border-b border-gray-500">
            {!editMode && (
              <h1 className="font-bold text-xl leading-5">
                {profileInfo.name}
              </h1>
            )}
            {editMode && (
              <div>
                <input
                  type="text"
                  value={profileInfo.name}
                  onChange={(ev) =>
                    setProfileInfo((prev) => ({
                      ...prev,
                      name: ev.target.value,
                    }))
                  }
                  className="bg-twitterBorder p-2 mb-2 rounded-full"
                />
              </div>
            )}
            {!editMode && (
              <h2 className="text-twitterLightGray text-sm ">
                @{profileInfo.username}
              </h2>
            )}
            {editMode && (
              <div >
                <input
                  type="text"
                  value={profileInfo.username}
                  onChange={(ev) =>
                    setProfileInfo((prev) => ({
                      ...prev,
                      username: ev.target.value,
                    }))
                  }
                  className="bg-twitterBorder p-2 mb-2 rounded-full"
                />
              </div>
            )}
            {!editMode && (
              <div className="text-sm mt-2 mb-2">{profileInfo.bio}</div>
            )}
            {editMode && (
              <div>
                <textarea
                  value={profileInfo.bio}
                  onChange={(ev) =>
                    setProfileInfo((prev) => ({
                      ...prev,
                      bio: ev.target.value,
                    }))
                  }
                  className="bg-twitterBorder p-2 mb-2 rounded-2xl w-full block "
                />
              </div>
            )}
          </div>
        </div>
      )}
      {posts?.length > 0 ? (
        posts?.map((post) => (
          <div className="p-5 border-t border-twitterBorder" key={post?._id}>
            <PostContent
              {...post}
              likedByMe={postsLikedByMe.includes(post?._id)}
              userInfo={userInfo}
              onPost={() => {
                fetchProfilePosts();
              }}
            />
          </div>
        ))) : <>
        
        <h1 className="text-3xl flex justify-center mt-10 mx-auto text-twitterBorder ">No Activity Yet...</h1>
        </>}
    </>
  );
}
