import React from "react";

const BuyPageCartDisplay = ({ cart }) => {
  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Your Cart</h3>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-gray-800">{item.name}</span>
              <span className="font-semibold text-blue-600">${item.price}</span>
            </li>
          ))}
          <li className="flex justify-between items-center py-2 mt-4 font-bold text-lg">
            <span>Total:</span>
            <span>
              ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default BuyPageCartDisplay;
