import React, { useState } from "react";

const BuyPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);

  const handleSearch = () => {
    // Handle search logic here
    console.log("Searching for:", searchKeyword);
    // Mock search results (ideally from backend)
    setSearchResults([
      {
        id: 1,
        name: "Laptop",
        price: 1200,
        description: "A powerful laptop",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "Keyboard",
        price: 75,
        description: "A mechanical keyboard",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        name: "Mouse",
        price: 25,
        description: "Wireless mouse",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        name: "Monitor",
        price: 300,
        description: "27-inch 4K monitor",
        image: "https://via.placeholder.com/150",
      },
    ]);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Browse and Buy Items
      </h2>

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
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  ${item.price}
                </span>
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
                <span className="font-semibold text-blue-600">
                  ${item.price}
                </span>
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
    </div>
  );
};

export default BuyPage;
