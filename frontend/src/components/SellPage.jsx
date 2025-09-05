import React, { useState } from 'react';

const SellPage = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const handleSell = () => {
    // Handle sell logic here
    console.log('Selling item:', { itemName, itemPrice, itemDescription });
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Sell Item</h2>
        <div className="mb-4">
          <label htmlFor="itemName" className="block text-gray-700 font-bold mb-2">
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="itemPrice" className="block text-gray-700 font-bold mb-2">
            Item Price
          </label>
          <input
            type="text"
            id="itemPrice"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="itemDescription" className="block text-gray-700 font-bold mb-2">
            Item Description
          </label>
          <textarea
            id="itemDescription"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          onClick={handleSell}
        >
          Sell Item
        </button>
      </div>
    </div>
  );
};

export default SellPage;
