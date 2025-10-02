import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import { getPrimaryRole, formatRole } from "../../../utils/roleHelpers";

const getFirstName = (fullName) => {
  if (!fullName) return "";
  return fullName.split(" ")[0];
};

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeDropdown();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 group focus:outline-none"
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 group-hover:text-orange-500">
            {user ? `Hi, ${getFirstName(user.name)}` : "Hi User"}
          </span>
          <span className="text-sm font-medium">Account</span>
        </div>
        <svg
          className={`w-4 h-4 ml-1 text-gray-400 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-[10000]">
          <div className="py-2">
            {!user ? (
              <>
                <div className="px-4 pb-2">
                  <Link
                    to="/signin"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                    onClick={closeDropdown}
                  >
                    Sign In
                  </Link>
                </div>
                <div className="px-4 pb-2">
                  <Link
                    to="/signup"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                    onClick={closeDropdown}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <div className="px-4 pb-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-orange-500">
                  {formatRole(getPrimaryRole(user.roles))}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100"></div>

            <div className="py-1">
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200"
                    onClick={closeDropdown}
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
                    onClick={closeDropdown}
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
                    onClick={closeDropdown}
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
                    onClick={closeDropdown}
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
