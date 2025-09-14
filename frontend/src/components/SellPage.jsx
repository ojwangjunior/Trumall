import React, { useState } from 'react';
import axios from 'axios';

const SellPage = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState(null); // For image file
  const [stock, setStock] = useState(1);
  const [storeId, setStoreId] = useState('YOUR_STORE_ID'); // Hardcoded to be changed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSell = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError(null);

    try {
      const priceCents = Math.round(parseFloat(itemPrice) * 100);

      const response = await axios.post('http://localhost:8080/api/products', {
        store_id: storeId,
        title: itemName,
        description: itemDescription,
        price_cents: priceCents,
        stock: stock,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Selling item:', response.data);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      // Clear form after successful submission
      setItemName('');
      setItemPrice('');
      setItemDescription('');
      setItemImage(null);
      setStock(1);
    } catch (error) {
      console.error('Error selling item:', error);
      setError('Error selling item. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">List Your Item for Sale</h2>

        {submissionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your item has been listed for sale.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSell}>
          <div className="mb-5">
            <label htmlFor="itemName" className="block text-gray-700 text-sm font-bold mb-2">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Vintage Leather Jacket"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="itemPrice" className="block text-gray-700 text-sm font-bold mb-2">
              Item Price ($)
            </label>
            <input
              type="number"
              id="itemPrice"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 99.99"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10"
              value={stock}
              onChange={(e) => setStock(e.target.value === '' ? 0 : parseInt(e.target.value))}
              min="0"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="itemDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Item Description
            </label>
            <textarea
              id="itemDescription"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              placeholder="Describe your item in detail..."
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="itemImage" className="block text-gray-700 text-sm font-bold mb-2">
              Item Image
            </label>
            <input
              type="file"
              id="itemImage"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              onChange={handleImageChange}
              accept="image/*"
            />
            {itemImage && <p className="text-gray-600 text-xs mt-2">Selected file: {itemImage.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Listing Item...' : 'Sell Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellPage;
