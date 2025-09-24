import React from "react";
import { Link } from "react-router-dom";

const MyStoresHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">My Stores</h2>
      <Link to="/createstore">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Store
        </button>
      </Link>
    </div>
  );
};

export default MyStoresHeader;
