import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const CartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-md w-full">
        <div className="relative mb-6">
          <FaShoppingCart className="text-gray-400 text-6xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500">
            <span className="text-white text-xl">+</span>
          </div>
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">
          Your cart is empty!
        </p>
        <p className="text-gray-500 mb-6">
          Browse our categories and discover our best deals!
        </p>
        <button className="px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default CartPage;
