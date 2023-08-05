import { useEffect, useRef, useState } from "react";
import useUserInfo from "@/hooks/useUserInfo";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfo, setUserInfo, status: userInfoStatus } = useUserInfo();
  const router = useRouter();
  const dropdownRef = useRef();

  useEffect(() => {
    // Function to handle mousedown events outside the dropdown
    const handleMouseDownOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleMouseDownOutside);
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [isDropdownOpen]);

  async function logout() {
    setIsDropdownOpen(false);
    setUserInfo(null);
    await signOut();
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleButtonClick = () => {
    router.push(`/${userInfo.username}`);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <img
        src={userInfo?.image}
        alt="profilepic"
        onClick={handleDropdownToggle}
        className="w-8 h-8 rounded-full cursor-pointer"
      />

      {isDropdownOpen && (
        // <div className="absolute z-30 top-10 font-bold right-0  rounded-lg shadow-md p-4 bg-twitterDarkGray">
        <div className="fixed  absolute  right-0 z-[50] flex flex-col items-center gap-1 bg-dark/20 py-2 text-xl text-white backdrop-blur-md">
          <button
            onClick={handleButtonClick}
            className="block w-full  text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-twitterBlue border border-gray-500"
          >
            <p> {userInfo?.name}</p>
            <p className="text-[14px] text-twitterLightGray">
              {" "}
              {userInfo?.email}
            </p>
          </button>
          <button
            onClick={logout}
            className="block w-full flex text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-twitterBlue  border border-gray-500"
          >
            <p>Sign Out</p>
            <FaSignOutAlt
              className="ml-4 text-red-500 bg-transparent"
              size={24}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
