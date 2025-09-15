import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import {
  User,
  Mail,
  Shield,
  Store,
  Settings,
  Edit3,
  LogOut,
  ChevronRight,
} from "lucide-react";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:8080/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Access Required
          </h3>
          <p className="text-slate-600 mb-6">
            Please log in to view your account details
          </p>
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My Account
            </h1>
            <p className="text-slate-600">
              Manage your profile and account settings
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
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
                      {user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : "User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Account Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Full Name
                          </p>
                          <p className="text-sm text-slate-600">
                            {user.name || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Email Address
                          </p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Account Type
                          </p>
                          <p className="text-sm text-slate-600">
                            {user.role || "Standard User"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Actions
                  </h3>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <Edit3 className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900">
                          Edit Profile
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900">
                          Account Settings
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">
                          Sign Out
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Dashboard Card */}
          {user.role === "seller" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Seller Dashboard
                    </h2>
                    <p className="text-green-100">
                      Manage your stores and products
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid gap-4">
                  <a
                    href="/mystores"
                    className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Store className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Manage My Stores
                        </p>
                        <p className="text-sm text-slate-600">
                          View and edit your store listings
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  </a>

                  <button className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Seller Settings
                        </p>
                        <p className="text-sm text-slate-600">
                          Configure your seller preferences
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
