import React from "react";
import { ShoppingCart, Store, CheckCircle } from "lucide-react";

const AccountTypeDropdown = ({
  role,
  setRole,
  isDropdownOpen,
  setIsDropdownOpen,
  accountTypes,
  selectedAccountType,
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Account Type
      </label>
      <div className="relative">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center">
            <selectedAccountType.icon className="w-5 h-5 text-gray-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">
                {selectedAccountType.label.split(" - ")[0]}
              </div>
              <div className="text-sm text-gray-500">
                {selectedAccountType.description}
              </div>
            </div>
          </div>
          <div
            className={`transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-400"
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
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
            {accountTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150 ${
                  role === type.value
                    ? "bg-orange-50 border-r-2 border-orange-500"
                    : ""
                }`}
                onClick={() => {
                  setRole(type.value);
                  setIsDropdownOpen(false);
                }}
              >
                <type.icon className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">
                    {type.label.split(" - ")[0]}
                  </div>
                  <div className="text-sm text-gray-500">
                    {type.description}
                  </div>
                </div>
                {role === type.value && (
                  <CheckCircle className="w-5 h-5 text-orange-500 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTypeDropdown;
