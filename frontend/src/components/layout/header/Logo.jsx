import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <div className="flex-shrink-0">
    <Link to="/" className="flex items-center">
      <div className="bg-orange-500 text-white p-1.5 lg:p-2 rounded-lg mr-1 lg:mr-2">
        <svg
          className="w-5 h-5 lg:w-6 lg:h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <span className="text-xl lg:text-2xl font-bold text-orange-500">
        TrustMall
      </span>
    </Link>
  </div>
);

export default Logo;
