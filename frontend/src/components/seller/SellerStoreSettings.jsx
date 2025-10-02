import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Save, AlertCircle } from 'lucide-react';

const SellerStoreSettings = ({ showToast }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    warehouse_street: '',
    warehouse_city: '',
    warehouse_state: '',
    warehouse_country: 'KE',
    warehouse_postal_code: '',
  });

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/my-stores`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const storeData = response.data[0]; // Assuming first store
      if (storeData) {
        setStore(storeData);
        setFormData({
          name: storeData.name || '',
          description: storeData.description || '',
          warehouse_street: storeData.warehouse_street || '',
          warehouse_city: storeData.warehouse_city || '',
          warehouse_state: storeData.warehouse_state || '',
          warehouse_country: storeData.warehouse_country || 'KE',
          warehouse_postal_code: storeData.warehouse_postal_code || '',
        });
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      showToast('Failed to load store information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    console.log('Submitting store update:', formData);
    console.log('Store ID:', store.id);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/stores/${store.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Update successful:', response.data);

      if (showToast) {
        showToast('Store settings updated successfully!', 'success');
      } else {
        console.warn('showToast is not available');
        alert('Store settings updated successfully!');
      }

      fetchStoreData(); // Refresh data
    } catch (error) {
      console.error('Error updating store:', error);
      console.error('Error response:', error.response?.data);

      if (showToast) {
        showToast('Failed to update store settings', 'error');
      } else {
        console.warn('showToast is not available');
        alert('Failed to update store settings');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">No Store Found</h3>
            <p className="text-yellow-700 text-sm">
              You need to create a store before you can manage settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Store Settings</h2>
        <p className="text-gray-600">
          Manage your store information and warehouse location for accurate shipping calculations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Store Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="My Store"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Brief description of your store"
              />
            </div>
          </div>
        </div>

        {/* Warehouse Location */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-800">Warehouse Location</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This location is used to calculate accurate shipping costs and delivery times based on the distance to your customers
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="warehouse_street"
                value={formData.warehouse_street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="warehouse_city"
                  value={formData.warehouse_city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nairobi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Region
                </label>
                <input
                  type="text"
                  name="warehouse_state"
                  value={formData.warehouse_state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nairobi County"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="warehouse_country"
                  value={formData.warehouse_country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="KE">Kenya</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="UG">Uganda</option>
                  <option value="TZ">Tanzania</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="warehouse_postal_code"
                  value={formData.warehouse_postal_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="00100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How shipping is calculated:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Same city delivery: 20% discount, faster delivery</li>
                  <li>Same country, different city: Standard rates</li>
                  <li>International shipping: 50% surcharge</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerStoreSettings;
