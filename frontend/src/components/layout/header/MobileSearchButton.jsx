import React from "react";

const MobileSearchButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="lg:hidden p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
    aria-label="Search"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </button>
);

export default MobileSearchButton;
