import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import TopBar from "./header/TopBar";
import Logo from "./header/Logo";
import DesktopSearchBar from "./header/DesktopSearchBar";
import MobileSearchButton from "./header/MobileSearchButton";
import MobileExpandedSearch from "./header/MobileExpandedSearch";
import AccountDropdown from "./header/AccountDropdown";
import CartLink from "./header/CartLink";
import MobileMenu from "./header/MobileMenu";
import HamburgerButton from "./header/HamburgerButton";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (!isMobileMenuOpen) {
      setIsSearchExpanded(false);
    }
  };

  const toggleSearchExpanded = () => {
    setIsSearchExpanded((prev) => !prev);
    if (!isSearchExpanded) {
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleMobileSearch = (query) => {
    console.log("Searching for:", query);
    setIsSearchExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMobileMenuOpen(false);
        setIsSearchExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[9999]">
      <TopBar />

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div ref={hamburgerRef}>
            <HamburgerButton
              onClick={toggleMobileMenu}
              isOpen={isMobileMenuOpen}
            />
          </div>

          <Logo />

          <DesktopSearchBar />

          <div className="flex items-center lg:hidden">
            <MobileSearchButton onClick={toggleSearchExpanded} />
            <CartLink />
          </div>

          {/* Desktop Account & Cart & Help */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <AccountDropdown />
            <Link
              to="/help"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200 group"
            >
              <svg
                className="w-6 h-6 mr-2"
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
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 group-hover:text-orange-500">
                  Need
                </span>
                <span className="text-sm font-medium">Help</span>
              </div>
            </Link>
            <CartLink />
          </div>
        </div>
      </div>

      {isSearchExpanded && (
        <MobileExpandedSearch onSearch={handleMobileSearch} />
      )}

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef}>
          <MobileMenu closeMenu={closeMobileMenu} />
        </div>
      )}
    </header>
  );
};

export default Header;
