import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { CartContext } from "../context/cart";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const formatPrice = (priceCents, currency) => {
    const displayCurrency = currency || 'USD'; // Default to 'USD' if currency is undefined
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: displayCurrency,
    }).format(priceCents / 100);
  };

  const handleAddToCart = () => {
    console.log("Adding to cart from ProductCard:", product);
    addToCart(product);
  };

  const imageUrl = `https://via.placeholder.com/300x300?text=${product.title}`;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between group">
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden aspect-square">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold truncate">{product.title}</h2>
          {product.description && (
            <p className="text-gray-600 text-sm mt-1 truncate">
              {product.description}
            </p>
          )}
          <div className="flex items-center my-2">
            <span className="text-xl font-bold text-orange">
              {formatPrice(product.price_cents, product.currency)}
            </span>
          </div>
          {/* Add rating if available in the product data */}
          {/* <Rating rating={product.rating} /> */}
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange text-white py-2 rounded-md hover:bg-orange-dark transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
