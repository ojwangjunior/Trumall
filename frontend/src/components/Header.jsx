import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const getFirstName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.split(" ");
  return parts.length > 0 ? parts[0] : "";
};

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountDropdownRef]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <Link
                to="/sell"
                className="hover:text-orange-500 transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Sell on TrustMall
              </Link>
              <Link
                to="/help"
                className="hover:text-orange-500 transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Help
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/track"
                className="hover:text-orange-500 transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="bg-orange-500 text-white p-2 rounded-lg mr-2">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-orange-500">
                TrustMall
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands and categories"
                  className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                />
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
                  <span className="ml-2 hidden sm:inline">Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center space-x-6">
            {/* Account Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={toggleAccountDropdown}
                className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 group focus:outline-none"
              >
                <div className="relative">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 group-hover:text-orange-500">
                    {user ? `Hi, ${getFirstName(user.name)}` : "Hi User"}
                  </span>
                  <span className="text-sm font-medium">Account</span>
                </div>
                <svg
                  className={`w-4 h-4 ml-1 text-gray-400 transform transition-transform duration-200 ${
                    isAccountDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    {!user ? (
                      <>
                        {/* Sign In Button for non-authenticated users */}
                        <div className="px-4 pb-2">
                          <Link
                            to="/signin"
                            className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            Sign In
                          </Link>
                        </div>
                        <div className="px-4 pb-2">
                          <Link
                            to="/signup"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* User info for authenticated users */}
                        <div className="px-4 pb-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-orange-500 capitalize">
                            {user.role}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="border-t border-gray-100"></div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {user ? (
                        <>
                          <Link
                            to="/account"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            My Account
                          </Link>

                          <Link
                            to="/orders"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            Orders
                          </Link>

                          <Link
                            to="/wishlist"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            Wishlist
                          </Link>

                          <Link
                            to="/pending-reviews"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                            Pending Reviews
                          </Link>

                          <div className="border-t border-gray-100 my-1"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/account"
                            className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed"
                            onClick={(e) => e.preventDefault()}
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            My Account
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/help"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 group"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 group-hover:text-orange-500">
                  Need
                </span>
                <span className="text-sm font-medium">Help</span>
              </div>
              <svg
                className="w-4 h-4 ml-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>

            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 relative group"
            >
              <div className="relative">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {/* Cart count badge */}
                <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 group-hover:text-orange-500">
                  My
                </span>
                <span className="text-sm font-medium">Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
