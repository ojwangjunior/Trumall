import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold truncate">{product.name}</h2>
          <div className="flex items-center my-2">
            <span className="text-xl font-bold text-orange">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.originalPrice}
              </span>
            )}
          </div>
          <Rating rating={product.rating} />
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button className="w-full bg-orange text-white py-2 rounded-md hover:bg-orange-dark">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
