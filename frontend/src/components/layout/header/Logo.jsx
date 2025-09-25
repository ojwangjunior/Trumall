import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
  <div className="flex-shrink-0">
    <Link to="/" className="flex items-center">
      <div className="flex items-center justify-start">
        <img
          src="/images/Mall-logo.png"
          alt="TrustMall Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
          loading="lazy"
        />
      </div>
      <span className="text-xl lg:text-2xl font-bold text-orange-500">
        TrustMall
      </span>
    </Link>
  </div>
);

export default Logo;
