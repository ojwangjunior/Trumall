import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Deals on Trumall!</h1>
          <p className="text-xl mb-8">Your one-stop shop for buying and selling goods.</p>
          <Link to="/buy">
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition duration-300">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section (Placeholder) */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300" alt="Product 1" className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Product Name 1</h3>
                <p className="text-gray-700 text-base mb-4">Short description of the product.</p>
                <span className="font-bold text-blue-600 text-lg">$99.99</span>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full">View Details</button>
              </div>
            </div>
            {/* Product Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300" alt="Product 2" className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Product Name 2</h3>
                <p className="text-gray-700 text-base mb-4">Short description of the product.</p>
                <span className="font-bold text-blue-600 text-lg">$149.99</span>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full">View Details</button>
              </div>
            </div>
            {/* Product Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="https://via.placeholder.com/300" alt="Product 3" className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Product Name 3</h3>
                <p className="text-gray-700 text-base mb-4">Short description of the product.</p>
                <span className="font-bold text-blue-600 text-lg">$79.99</span>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Selling */}
      <section className="bg-gray-800 text-white py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Items?</h2>
          <p className="text-lg mb-8">Join our community and start selling today!</p>
          <Link to="/sell">
            <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition duration-300">
              Start Selling
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;