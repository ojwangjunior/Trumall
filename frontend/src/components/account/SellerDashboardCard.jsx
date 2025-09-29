import React from "react";
import { Link } from "react-router-dom";
import { Store, ChevronRight } from "lucide-react";

const SellerDashboardCard = ({ user }) => {
  return (
    user.roles &&
    user.roles.includes("seller") && (
      <Link
        to="/seller/dashboard"
        className="block bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Seller Dashboard
                </h2>
                <p className="text-green-100">
                  Manage your stores, products, and orders
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white opacity-70" />
          </div>
        </div>
      </Link>
    )
  );
};

export default SellerDashboardCard;
