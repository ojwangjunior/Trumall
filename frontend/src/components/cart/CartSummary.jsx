import React, { useState } from "react";
import axios from "axios";

const CartSummary = ({ calculateTotal, cartItems }) => {
  const handleCheckout = async () => {
  if (cartItems.length === 0) return;

  try {
    const phone = prompt("Enter your M-Pesa number (format: 2547XXXXXXXX)");
   

 
  return (
    <div className="mt-8 flex justify-end items-center">
      <div className="text-lg font-bold mr-4">
        Total:{" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: cartItems[0]?.Product.currency || "KES",
        }).format(calculateTotal() / 100)}
      </div>
      <button onClick={handleCheckout} className="px-6 py-3 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
