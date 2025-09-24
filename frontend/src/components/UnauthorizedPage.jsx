import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowRight, Home, UserPlus } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse delay-1000"></div>

        <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
              <ShieldX className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>

            {/* Subtitle */}
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6 rounded-full"></div>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              You don't have the necessary permissions to view this page. To
              access seller features, please register as a seller.
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                to="/signup"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <UserPlus className="w-4 h-4" />
                Register as a Seller
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/"
                className="w-full border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:bg-orange-50"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Help text */}
            <p className="text-sm text-gray-500 mt-6">
              Need help?{" "}
              <span className="text-orange-500 hover:text-orange-600 cursor-pointer font-medium">
                Contact Support
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
