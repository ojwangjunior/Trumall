import React, { useState } from 'react';

const BuyPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);

  const handleSearch = () => {
    // Handle search logic here
    console.log('Searching for:', searchKeyword);
    // Mock search results(ideally from backend)
    setSearchResults([
      { id: 1, name: 'Laptop', price: 1200, description: 'A powerful laptop' },
      { id: 2, name: 'Keyboard', price: 75, description: 'A mechanical keyboard' },
    ]);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Buy Items</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for items..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg ml-2 hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
            <p className="text-gray-700 mb-2">${item.price}</p>
            <p className="text-gray-600">{item.description}</p>
            <button
              className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Cart</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BuyPage;
