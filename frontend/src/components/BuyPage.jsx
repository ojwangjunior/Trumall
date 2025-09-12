import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/cart';

const BuyPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const { addToCart, cartItems } = useContext(CartContext);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setSearchResults(data);
      });
  }, []);

  const handleSearch = () => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Browse and Buy Items</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex w-full md:w-2/3">
          <input
            type="text"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for items..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-r-lg hover:bg-blue-700 transition duration-300"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {/* Placeholder for Filters/Sort */}
        <div className="w-full md:w-1/3">
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Sort by: Relevance</option>
            <option>Sort by: Price Low to High</option>
            <option>Sort by: Price High to Low</option>
            <option>Sort by: Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchResults.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                <button
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Display */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Your Cart</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-800">{item.name}</span>
                <span className="font-semibold text-blue-600">${item.price}</span>
              </li>
            ))}
            <li className="flex justify-between items-center py-2 mt-4 font-bold text-lg">
              <span>Total:</span>
              <span>${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
