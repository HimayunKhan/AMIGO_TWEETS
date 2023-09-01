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
        <div className="  absolute  right-0 z-[200] flex flex-col items-center gap-1  py-2 text-xl text-white opacity-100   backdrop-blur-md blur-effect-theme">
          <button
            onClick={handleButtonClick}
            className="block w-full bg-gray-900  text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-twitterBlue border border-gray-500"
          >
            <p> {userInfo?.name}</p>
            <p className="text-[14px] text-twitterLightGray">
              {" "}
              {userInfo?.email}
            </p>
          </button>
          <button
            onClick={logout}
            className=" w-full flex bg-gray-900 text-white text-left py-2 px-4 rounded hover:bg-gray-900 hover:text-twitterBlue  border border-gray-500"
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
