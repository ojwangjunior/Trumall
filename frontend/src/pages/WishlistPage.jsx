import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { CartContext } from "../context/cart-context";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Rating from "../components/common/Rating";

const WishlistPage = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!user) {
      window.location.href = "/signin";
      return;
    }

    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/favorites`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingId(productId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/favorites/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFavorites(favorites.filter((fav) => fav.product.id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  const formatPrice = (priceCents, currency) => {
    const displayCurrency = currency || "KES";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: displayCurrency,
    }).format(priceCents / 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-gray-500">({favorites.length} items)</span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Save items you love by clicking the heart icon on products
          </p>
          <Link
            to="/buy"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map((favorite) => {
            const product = favorite.product;
            const imageUrl =
              product.images && product.images.length > 0
                ? `${import.meta.env.VITE_API_BASE_URL}${product.images[0].image_url}`
                : `https://via.placeholder.com/150?text=${encodeURIComponent(product.title)}`;

            return (
              <div
                key={favorite.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-500 mb-2">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Brand */}
                    {product.brand && (
                      <p className="text-sm text-gray-500 mb-2">
                        Brand: <span className="font-medium">{product.brand}</span>
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <Rating rating={product.average_rating || 0} />
                      <span className="text-sm text-gray-500">
                        ({product.review_count || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-orange-500">
                        {formatPrice(product.price_cents, product.currency)}
                      </span>
                      {product.original_price_cents && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price_cents, product.currency)}
                          </span>
                          {product.discount && (
                            <span className="text-sm text-red-500 font-semibold">
                              -{product.discount}% off
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock === 0 ? (
                      <p className="text-sm text-red-600 font-semibold mb-3">
                        Out of stock
                      </p>
                    ) : product.stock <= 5 ? (
                      <p className="text-sm text-orange-600 font-semibold mb-3">
                        Only {product.stock} left in stock
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 font-semibold mb-3">
                        In stock
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>

                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={removingId === product.id}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {removingId === product.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
