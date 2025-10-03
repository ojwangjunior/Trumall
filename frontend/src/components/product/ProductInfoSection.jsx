import React from "react";
import { useNavigate } from "react-router-dom";
import Rating from "../../components/common/Rating";
import { Package, Truck, Shield } from "lucide-react";

const ProductInfoSection = ({
  product,
  quantity,
  setQuantity,
  isOwner,
  handleDelete,
  handleAddToCart,
  id,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-500 mb-1">
            Brand: <span className="font-semibold text-orange-600">{product.brand}</span>
          </p>
        )}

        <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
        <div className="flex items-center gap-4 mb-2">
          <Rating rating={product.average_rating || 0} />
          <span className="text-gray-600">
            ({product.review_count || 0} {product.review_count === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        {product.store && (
          <p className="text-gray-600">
            Sold by <span className="font-semibold text-orange-600">{product.store.name}</span>
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 pb-4 border-b">
        <span className="text-4xl font-bold text-orange-500">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency || "KES",
          }).format(product.price_cents / 100)}
        </span>
        {product.original_price_cents && (
          <span className="text-xl text-gray-500 line-through">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: product.currency || "KES",
            }).format(product.original_price_cents / 100)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.stock === 0 ? (
          <span className="text-red-600 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Out of stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="text-orange-600 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Only {product.stock} left in stock - order soon
          </span>
        ) : (
          <span className="text-green-600 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            In stock
          </span>
        )}
      </div>

      {/* Quantity Selector & Add to Cart */}
      <div className="pt-4 border-t">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={product.stock}
              className="w-16 p-2 text-center border-x border-gray-300 focus:outline-none"
            />
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {isOwner ? (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/product/${id}/edit`)}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
            >
              Edit Product
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors"
            >
              Delete Product
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 font-semibold text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>

      {/* Shipping & Returns Info */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg mb-4">Shipping & Returns</h3>

        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Shipping calculated at checkout</p>
            <p className="text-sm text-gray-600 mt-1">Based on your location and selected shipping method</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Buyer protection</p>
            <p className="text-sm text-gray-600 mt-1">Secure payments & money-back guarantee</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Secure packaging</p>
            <p className="text-sm text-gray-600 mt-1">All items carefully packaged for safe delivery</p>
          </div>
        </div>

        {product.store && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Ships from: <span className="font-medium text-gray-900">{product.store.name}</span>
            </p>
            {product.store.warehouse_city && (
              <p className="text-xs text-gray-500 mt-1">
                {product.store.warehouse_city}, {product.store.warehouse_country || 'Kenya'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfoSection;
