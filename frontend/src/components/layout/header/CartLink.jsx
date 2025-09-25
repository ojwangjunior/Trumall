import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../../context/CartProvider';

const CartLink = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <>
      {/* Desktop Cart Link */}
      <Link
        to="/cart"
        className="hidden lg:flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 relative group"
      >
        <div className="relative">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 group-hover:text-orange-500">My</span>
          <span className="text-sm font-medium">Cart</span>
        </div>
      </Link>

      {/* Mobile Cart Icon */}
      <Link
        to="/cart"
        className="lg:hidden flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 relative p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItems.length}
        </span>
      </Link>
    </>
  );
};

export default CartLink;
