import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">LET US HELP YOU</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/track" className="text-gray-400 hover:text-white">Track your order</Link></li>
              <li><Link to="/return" className="text-gray-400 hover:text-white">Shipping & delivery</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">ABOUT TRUSTMALL</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Notice</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">MAKE MONEY WITH US</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sell" className="text-gray-400 hover:text-white">Sell on TrustMall</Link></li>
              <li><Link to="/affiliate" className="text-gray-400 hover:text-white">Become an Affiliate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">NEW TO TRUSTMALL?</h3>
            <p className="text-sm text-gray-400 mb-2">Subscribe to our newsletter to get updates on our latest offers!</p>
            <div className="flex">
              <input type="email" placeholder="Enter e-mail address" className="bg-gray-700 text-white px-3 py-2 rounded-l-md focus:outline-none" />
              <button className="bg-orange text-white px-4 py-2 rounded-r-md hover:bg-orange-dark">GO</button>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 pt-8 mt-8 border-t border-gray-700">
          <p>&copy; 2025 TrustMall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;