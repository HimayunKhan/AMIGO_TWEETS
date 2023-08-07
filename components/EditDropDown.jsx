import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
// import PostForm from "./PostForm";
import { BsX } from "react-icons/bs";
import PostEditForm from "./PostEditForm";

const EditDropDown = ({ postID, onPost, parent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [particularPostID,setparticularPostID]=useState("")

  useEffect(() => {
    const handleMouseDownOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleMouseDownOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [isDropdownOpen]);

  async function handleDelete(id, parent) {
    if (parent) {
      const parentpostID = parent?._id;

      const decCommentCount = axios
        .put("/api/posts?parentpostID=" + parentpostID)
        .then((response) => {
        });
    }

    const deletePost = axios
      .delete("/api/posts?postID=" + id)
      .then((response) => {
        setIsDropdownOpen(false);
        if (onPost) {
          onPost();
        }
      });
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = (id) => {
    setparticularPostID(id)
    setIsDropdownOpen(false); // Close the dropdown when opening the modal
    setIsEditModalOpen(true); // Open the modal
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={handleDropdownToggle}>
        <BsThreeDotsVertical size={24} className=" text-twitterLightGray" />
      </button>

      {isDropdownOpen && (
        <div className="fixed  absolute  right-4 z-[90] flex flex-col items-center gap-1 bg-dark/20 py-2 text-xl text-white backdrop-blur-md">
          <button
            // onClick={handleEdit}
            onClick={() => handleEdit(postID)}
            className="block w-full flex  ml-2 items-center text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-red-600  border border-gray-500"
          >
            <p>Edit</p>
            <FiEdit
              size={26}
              color="twitterDarkGray "
              className="ml-2 text-red-600"
            />
          </button>
          <button
            onClick={() => handleDelete(postID, parent)}
            className="block w-full flex ml-2  items-center text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-red-600  border border-gray-500"
          >
            <p>Delete</p>
            <MdDeleteOutline
              className="ml-2 text-red-600 bg-transparent"
              size={30}
            />
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <div className="mr-2 fixed z-[100] top-0 left-0 right-8 w-screen h-screen backdrop-blur-md  pt-30  p-8">
         
          <div className="bg-twitterDarkGray  w-full md:w-[50%]  px-2 py-4 rounded-lg mx-auto ">
            <PostEditForm
              onClose={() => setIsEditModalOpen(false)}
              EditMode={"Edit"}
              particularPostID={particularPostID}
              onPost={onPost}
            />
          </div>
<div className="flex justify-center items-center">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
            }}
            className="text-red-600 flex justify-center items-center "
          >
            <BsX size={72} />
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default EditDropDown;
