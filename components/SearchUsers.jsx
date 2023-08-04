import React from "react";

const SearchUsers = ({ item }) => {
  return (
    <div className="flex items-center gap-4">
      <img className="w-24" src={item?.image} alt="productImage" style={{height:"70px"}} />
      <div>
        <p className="text-lg text-white font-medium">{item.name}</p>
      </div>
    </div>
  );
};

export default SearchUsers;
