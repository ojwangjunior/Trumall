import React from "react";
import { Link } from "react-router-dom";

const EmptyCartState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-md">
      <p className="text-xl font-semibold text-gray-700 mb-2">
        Your cart is empty!
      </p>
      <p className="text-gray-500 mb-6">
        Browse our categories and discover our best deals!
      </p>
      <Link to="/products">
        <button className="px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
          Start Shopping
        </button>
      </Link>
    </div>
  );
};

export default EmptyCartState;
