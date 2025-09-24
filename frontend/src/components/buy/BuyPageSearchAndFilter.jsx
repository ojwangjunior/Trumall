import React from "react";

const BuyPageSearchAndFilter = ({
  searchKeyword,
  setSearchKeyword,
  handleSearch,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex w-full md:w-2/3">
        <input
          type="text"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for items..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-r-lg hover:bg-blue-700 transition duration-300"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {/* Placeholder for Filters/Sort */}
      <div className="w-full md:w-1/3">
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Sort by: Relevance</option>
          <option>Sort by: Price Low to High</option>
          <option>Sort by: Price High to Low</option>
          <option>Sort by: Newest</option>
        </select>
      </div>
    </div>
  );
};

export default BuyPageSearchAndFilter;
