import React from "react";
import { Package } from "lucide-react";

const EmptyOrdersState = ({ searchQuery, activeFilter }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No orders found
      </h3>
      <p className="text-gray-600 mb-6">
        {searchQuery || activeFilter !== "all"
          ? "Try adjusting your search or filters"
          : "Start shopping to see your orders here"}
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Start Shopping
      </button>
    </div>
  );
};

export default EmptyOrdersState;
