import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SellPage = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [stock, setStock] = useState(1);
  const [storeId, setStoreId] = useState('');
  const [stores, setStores] = useState([]);
  const [images, setImages] = useState([]); // Changed to array for multiple images
  const [imagePreviews, setImagePreviews] = useState([]); // For displaying image previews
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }

    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/me/stores', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userStores = response.data.data;
        setStores(userStores);
        if (userStores.length > 0) {
          setStoreId(userStores[0].id);
        } else {
          navigate('/createstore');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    if (user) {
      fetchStores();
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);

    // Generate image previews
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError(null);

    const formData = new FormData();
    formData.append('store_id', storeId);
    formData.append('title', itemName);
    formData.append('description', itemDescription);
    formData.append('price_cents', Math.round(parseFloat(itemPrice) * 100));
    formData.append('stock', stock);
    formData.append('currency', 'USD');

    images.forEach((image, index) => {
      formData.append(`images`, image); // Append each image with the key 'images'
    });

    try {
      const response = await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      setStock(1);
      setImages([]); // Clear selected images
      setImagePreviews([]); // Clear image previews
    } catch (error) {
      console.error('Error selling item:', error);
      setError('Error selling item. Please try again.');
      setIsSubmitting(false);
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
            <label htmlFor="store" className="block text-gray-700 text-sm font-bold mb-2">
              Store
            </label>
            <select
              id="store"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

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
              required
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

          <div className="mb-5">
            <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
              Item Images (JPEG, PNG, WebP)
            </label>
            <input
              type="file"
              id="images"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
              multiple // Allow multiple file selection
              accept=".jpg,.jpeg,.png,.webp" // Accept specific image types
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md" />
              ))}
            </div>
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