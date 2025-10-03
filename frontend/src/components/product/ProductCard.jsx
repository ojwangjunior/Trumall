import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Rating from "../common/Rating";
import { CartContext } from "../../context/cart-context";
import { AuthContext } from "../../context/auth-context";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const formatPrice = (priceCents, currency) => {
    const displayCurrency = currency || "KES";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: displayCurrency,
    }).format(priceCents / 100);
  };

  const formatOriginalPrice = (originalPriceCents, currency) => {
    if (!originalPriceCents) return null;
    const displayCurrency = currency || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: displayCurrency,
    }).format(originalPriceCents / 100);
  };

  // Check favorite status on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/favorites/check/${product.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsFavorite(response.data.is_favorite);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, product.id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login or show message
      window.location.href = "/signin";
      return;
    }

    setIsTogglingFavorite(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/favorites/${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/favorites`,
          { product_id: product.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Use the first image from the images array, or a placeholder
  const imageUrl =
    product.images && product.images.length > 0
      ? `${import.meta.env.VITE_API_BASE_URL}${product.images[0].image_url}`
      : `https://via.placeholder.com/300x300?text=${encodeURIComponent(
          product.title
        )}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{product.discount}%
            </div>
          )}
          {/* Like/Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-gray-600 hover:bg-gray-50"
            } ${isTogglingFavorite ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <div className="p-3">
          {/* Title - Truncated to 2 lines */}
          <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 h-10">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-orange-500">
              {formatPrice(product.price_cents, product.currency)}
            </span>
            {product.original_price_cents && (
              <span className="text-xs text-gray-500 line-through">
                {formatOriginalPrice(
                  product.original_price_cents,
                  product.currency
                )}
              </span>
            )}
          </div>

          {/* Rating & Reviews - Compact */}
          <div className="flex items-center gap-1 mb-2">
            <Rating rating={product.average_rating || product.rating || 0} />
            <span className="text-xs text-gray-500">
              ({product.review_count || product.reviewCount || 0})
            </span>
          </div>

          {/* Stock Status - Only critical states */}
          {product.stock === 0 && (
            <div className="text-xs text-red-600 font-semibold">
              Out of stock
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="text-xs text-orange-600 font-semibold">
              Only {product.stock} left
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        >
          {product.stock === 0
            ? "Out of Stock"
            : isAdding
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
