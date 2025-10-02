import React, { useState, useEffect } from 'react';
import { Plus, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import AddressCard from '../components/address/AddressCard';
import AddressModal from '../components/address/AddressModal';

const AddressManagementPage = () => {
  const token = localStorage.getItem('token');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add or update address
  const handleSaveAddress = async (addressData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const url = editingAddress
        ? `http://localhost:8080/api/addresses/${editingAddress.id}`
        : 'http://localhost:8080/api/addresses';

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save address');
      }

      // Refresh addresses list
      await fetchAddresses();

      // Close modal and reset
      setIsModalOpen(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setDeletingId(addressId);
      setError(null);

      const response = await fetch(`http://localhost:8080/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      // Refresh addresses list
      await fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      setError(null);

      const response = await fetch(`http://localhost:8080/api/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      // Refresh addresses list
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Failed to set default address. Please try again.');
    }
  };

  // Open modal for editing
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingAddress(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-orange-600" />
              My Addresses
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your delivery addresses for faster checkout
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first delivery address to enable shipping and checkout
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
                isDeleting={deletingId === address.id}
              />
            ))}
          </div>
        )}

        {/* Info Box */}
        {addresses.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              💡 Shipping Zone Matching
            </h4>
            <p className="text-sm text-blue-700">
              Your addresses are matched to shipping zones based on city and country.
              Make sure to select the correct city for accurate shipping costs and delivery estimates.
            </p>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingAddress}
        onSave={handleSaveAddress}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AddressManagementPage;
