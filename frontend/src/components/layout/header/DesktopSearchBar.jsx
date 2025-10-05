import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DesktopSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const debounceTimerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search after navigating
    }
  };

  // Debounced search - triggers after user stops typing for 800ms
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search if query is empty or too short
    if (searchQuery.trim().length < 2) {
      setIsSearching(false);
      return;
    }

    // Show searching indicator
    setIsSearching(true);

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(false);
    }, 800); // 800ms delay after user stops typing

    // Cleanup timer on unmount or when searchQuery changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, navigate]);

  return (
    <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="flex">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands and categories"
              title="Search automatically as you type (min 2 characters)"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-r-md transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5"
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
            <span className="ml-2 hidden xl:inline">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DesktopSearchBar;
