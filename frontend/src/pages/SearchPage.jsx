import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/search`,
          {
            params: { q: query },
          }
        );

        setProducts(response.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          <p className="text-gray-600">
            {query && (
              <>
                Showing results for: <span className="font-semibold">"{query}"</span>
              </>
            )}
          </p>
          {!loading && products.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Found {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* No Query */}
        {!query && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Search
            </h2>
            <p className="text-gray-600">
              Enter a search term to find products
            </p>
          </div>
        )}

        {/* No Results */}
        {query && !loading && products.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}"
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Search Results Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${import.meta.env.VITE_API_BASE_URL}${product.images[0].image_url}`
                        : `https://via.placeholder.com/300?text=${encodeURIComponent(product.title)}`
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock_quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-orange-600">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.currency || 'KES',
                        }).format(product.price_cents / 100)}
                      </p>
                    </div>

                    {product.stock_quantity > 0 && (
                      <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
