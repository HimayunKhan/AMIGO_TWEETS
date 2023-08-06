import useUserInfo from "../hooks/useUserInfo";
import { useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";
import Upload from "./Upload";
import { PulseLoader } from "react-spinners";
import { MdPermMedia } from "react-icons/md";

export default function PostEditForm({
  onPost,
  compact,
  parent,
  placeholder = "What's happening?",
  onClose,
  particularPostID,
}) {
  const { userInfo, status } = useUserInfo();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  let [imagesArray, setImagesArray] = useState([]);

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
	
    files?.forEach((file) => {
		const reader = new FileReader();
		imagesArray.push(file);
		console.log("hwwwww");

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result]);
          console.log("aaaaaaaaaaaaaaa", images);
        }
      };

      reader.readAsDataURL(file);
    });

    imagesArray.forEach((item) => {
      const data = new FormData();
      data.append("file", item);
      data.append("upload_preset", "twitterpic");
      data.append("clound_name", "dlyoovaha");
      fetch("https://api.cloudinary.com/v1_1/dlyoovaha/image/upload", {
        method: "post",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          images.push(data?.url);
        })
        .catch((error) => console.log(error));
    });
  };

  async function handlePostSubmit(e) {
    e.preventDefault();

    if (images[0]?.includes("cloudinary")) {
      await axios.put("/api/posts?editID=" + particularPostID, {
        text,
        parent,
        images,
      });
      setText("");
      setImages([]);
      if (onPost) {
        onPost();
      }
      if (onClose) {
        onClose();
      }
    } else {
      console.log("yuyuyuyuyuyu", text, parent, images);
      await axios.put("/api/posts?editID=" + particularPostID, {
        text,
        parent,
        images,
      });
      setText("");
      setImages([]);
      setImagesArray([]);
      if (onPost) {
        onPost();
      }
      if (onClose) {
        onClose();
      }
    }
  }

  if (status === "loading") {
    return "";
  }
  return (
    <form className="mx-5  " onSubmit={handlePostSubmit}>
      <div className={(compact ? "items-center" : "") + " flex"}>
        <div className="">
          <Avatar src={userInfo?.image} />
        </div>

        <div className="grow pl-2 ">
          <Upload onUploadFinish={(src) => setImages((prev) => [...prev, src])}>
            {({ isUploading }) => (
              <div>
                <div className="relative">
                  <label
                    className={
                      (compact ? "top-[20px]" : "top-[75px]") +
                      " absolute   right-3 flex justify-end"
                    }
                    htmlFor="formFile12"
                  >
                    <MdPermMedia size={25} />
                  </label>
                  <textarea
                    className={
                      (compact ? "h-10 mt-1" : "h-24") +
                      " w-full p-2 pl-2 bg-transparent text-twitterWhite"
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                  />
                </div>

                <input
                  type="file"
                  style={{ display: "none" }}
                  id="formFile12"
                  multiple
                  onChange={onChange}
                />
                <div className="flex -mx-2">
                  {images?.length > 0 &&
                    images?.map((img) => (
                      <div className="h-24 m-2" key={img}>
                        <img src={img} alt="" className="h-24" />
                      </div>
                    ))}
                  {isUploading && (
                    <div className="h-24 w-24 m-2 bg-twitterBorder flex items-center justify-center">
                      <PulseLoader size={14} color={"#fff"} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </Upload>

          {!compact && (
            <div className="flex justify-end border-t border-twitterBorder pt-2 pb-2">
              <button className="bg-twitterBlue text-white px-5 py-1 rounded-full">
                Tweet
              </button>
            </div>
          )}
        </div>
        {compact && (
          <div className="pl-2">
            <button className="bg-twitterBlue  text-white px-5 py-1 rounded-full">
              Tweet
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
