import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { CartContext } from "../context/CartProvider";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (priceCents, currency) => {
    const displayCurrency = currency || "USD";
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
  };

  // Use the first image from the images array, or a placeholder
  const imageUrl =
    product.images && product.images.length > 0
      ? `http://localhost:8080${product.images[0].image_url}`
      : `https://via.placeholder.com/300x300?text=${encodeURIComponent(
          product.title
        )}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{product.discount}%
            </div>
          )}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 flex-1">
            {product.title}
          </h3>

          {/* Display full description, it will be truncated by CSS line-clamp-3 if too long */}
          {product.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-1 mb-2">
            <Rating rating={product.rating || 4.5} />
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviewCount || "0"})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price_cents, product.currency)}
            </span>
            {product.original_price_cents && (
              <span className="text-sm text-gray-500 line-through">
                {formatOriginalPrice(
                  product.original_price_cents,
                  product.currency
                )}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Stock: {product.stock}
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;