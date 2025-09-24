
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Store, Edit, ArrowLeft, Package } from 'lucide-react';
import ProductCard from './ProductCard';

const StoreDetailPage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stores/${id}`);
        setStore(storeResponse.data);

        const productsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stores/${id}/products`);
        setProducts(productsResponse.data);

      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching store data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Store not found</h2>
          <p className="text-slate-600 mb-6">The store you are looking for does not exist.</p>
          <button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === store.owner_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to My Account
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{store.name}</h1>
                    <p className="text-blue-100">{store.description}</p>
                  </div>
                </div>
                {isOwner && (
                  <button onClick={() => navigate(`/store/${id}/edit`)} className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Store
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="w-6 h-6 mr-2 text-blue-600" />
                Store Items
              </h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">This store doesn't have any items yet.</p>
                  {isOwner && (
                    <button onClick={() => navigate('/sell')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Add New Product
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
