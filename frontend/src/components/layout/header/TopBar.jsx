import React from "react";
import { Link } from "react-router-dom";

const TopBarLink = ({ to, children, isMobile = false }) => (
  <Link
    to={to}
    className={`flex items-center hover:text-orange-500 transition-colors duration-200 ${
      isMobile ? "text-xs" : "text-sm"
    }`}
  >
    {children}
  </Link>
);

const SellIcon = () => (
  <svg
    className="w-4 h-4 mr-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const HelpIcon = () => (
  <svg
    className="w-4 h-4 mr-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrackIcon = () => (
  <svg
    className="w-4 h-4 mr-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TopBar = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        {/* Desktop Top bar */}
        <div className="hidden md:flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <TopBarLink to="/sell">
              <SellIcon />
              <span className="hidden lg:inline">Sell on TrustMall</span>
              <span className="lg:hidden">Sell</span>
            </TopBarLink>
            <TopBarLink to="/help">
              <HelpIcon />
              Help
            </TopBarLink>
          </div>
          <div className="flex items-center space-x-4">
            <TopBarLink to="/track">
              <TrackIcon />
              <span className="hidden lg:inline">Track Order</span>
              <span className="lg:hidden">Track</span>
            </TopBarLink>
          </div>
        </div>
        {/* Mobile Top bar */}
        <div className="md:hidden flex justify-center items-center text-xs text-gray-600 space-x-6">
          <TopBarLink to="/sell" isMobile>
            <SellIcon />
            Sell
          </TopBarLink>
          <TopBarLink to="/help" isMobile>
            <HelpIcon />
            Help
          </TopBarLink>
          <TopBarLink to="/track" isMobile>
            <TrackIcon />
            Track
          </TopBarLink>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
