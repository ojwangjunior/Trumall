import React from "react";
import { Shield } from "lucide-react";

const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "seller":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AccountProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
      <div className="bg-blue-500 px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {getInitials(user.name)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {user.name || "Welcome!"}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                  user.role
                )}`}
              >
                <Shield className="w-4 h-4 inline mr-1" />
                {user.roles && user.roles.length > 0
                  ? user.roles[0].charAt(0).toUpperCase() +
                    user.roles[0].slice(1)
                  : "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfileCard;
