"use client";
import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import Link from "next/link";
import SearchUsers from "./SearchUsers";

const Search = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = users?.filter((item) =>
      item?.name?.toLocaleLowerCase().includes(searchQuery?.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  return (
    <>
      <div className="flex  w-[90%] md:w-[40%] mb-4 h-10 inline-flex  items-center justify-between relative">
        <input
          onChange={handleSearch}
          value={searchQuery}
          className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none focus-visible:border-amazon_yellow"
          type="text"
          placeholder="Search "
        />
        <span className="w-12 h-full bg-customGold text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md">
          <HiOutlineSearch />
        </span>
        {/* ========== Searchfield ========== */}
        {searchQuery && (
          <div className=" mild-black absolute z-30 left-0 top-12 w-full mx-auto h-[260px] bg-color1 rounded-lg overflow-y-scroll cursor-pointer text-black">
            {filteredProducts.length > 0 ? (
              <>
                {searchQuery &&
                  filteredProducts.map((item) => (
                    <Link
                      key={item._id}
                      className="w-full border-b-[1px] border-b-gray-400 flex items-center gap-4"
                      href={"/" + item?.username}
                      onClick={() => setSearchQuery("")}
                    >
                      <SearchUsers item={item} />
                    </Link>
                  ))}
              </>
            ) : (
              <div className="bg-gray-50 flex items-center justify-center py-10 rounded-lg shadow-lg">
                <p className="text-xl  ml-2 font-semibold animate-bounce">
                  Nothing is matches with your search keywords. Please try
                  again!
                </p>
              </div>
            )}
          </div>
        )}
        {/* ========== Searchfield ========== */}
      </div>
    </>
  );
};

export default Search;
