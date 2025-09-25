import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const MobileMenu = ({ closeMenu }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
      <div className="px-4 py-2">
        {/* User Info Section */}
        {user ? (
          <div className="py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-orange-500 capitalize">{user.role}</p>
          </div>
        ) : (
          <div className="py-3 border-b border-gray-100 space-y-2">
            <Link to="/signin" className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium" onClick={closeMenu}>
              Sign In
            </Link>
            <Link to="/signup" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-md transition-colors duration-200 font-medium" onClick={closeMenu}>
              Sign Up
            </Link>
          </div>
        )}

        {/* Menu Links */}
        <div className="py-2 space-y-1">
          {user && (
            <>
              <Link to="/account" className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200 rounded-md" onClick={closeMenu}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                My Account
              </Link>
              <Link to="/orders" className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200 rounded-md" onClick={closeMenu}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                My Orders
              </Link>
              <Link to="/wishlist" className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200 rounded-md" onClick={closeMenu}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Wishlist
              </Link>
              <Link to="/pending-reviews" className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors duration-200 rounded-md" onClick={closeMenu}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                Pending Reviews
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <button onClick={handleLogout} className="flex items-center w-full px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 rounded-md">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
