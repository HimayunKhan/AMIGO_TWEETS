import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import axios from "axios";

const EditDropDown = ({ postID, onPost, parent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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
          console.log("reoo", response.data);
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

  const handleEdit = () => {};

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={handleDropdownToggle}>
        <BsThreeDotsVertical
          size={24}
          
          className=" text-twitterLightGray"
        />
      </button>

      {isDropdownOpen && (
        <div className="fixed  absolute  right-0 z-[90] flex flex-col items-center gap-1 bg-dark/20 py-2 text-xl text-white backdrop-blur-md">
          <button
            onClick={handleEdit}
            className="block w-full flex  items-center text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-red-500  border border-gray-500"
          >
            <p>Edit</p>
            <FiEdit size={28} color="twitterLightGray " className="ml-2" />
          </button>
          <button
            onClick={() => handleDelete(postID, parent)}
            className="block w-full flex  items-center text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-red-500  border border-gray-500"
          >
            <p>Delete</p>
            <MdDeleteOutline
              className="ml-2 text-red-500 bg-transparent"
              size={28}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditDropDown;
