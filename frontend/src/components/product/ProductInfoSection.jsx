import React from "react";
import { useNavigate } from "react-router-dom";
import Rating from "../../components/common/Rating";

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
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <div className="flex items-center mb-4">
        {/* Add rating if available in the product data */}
        {/* <Rating rating={product.rating} /> */}
        {/* <span className="text-gray-500 ml-2">({product.reviews} reviews)</span> */}
      </div>
      <div className="flex items-center mb-4">
        <span className="text-3xl font-bold text-orange-500">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency,
          }).format(product.price_cents / 100)}
        </span>
      </div>
      <p className="text-gray-700 mb-6">{product.description}</p>

      <div className="flex items-center mb-6">
        <span className="mr-4">Quantity:</span>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          className="w-16 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {isOwner ? (
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/product/${id}/edit`)}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Edit Product
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600"
          >
            Delete Product
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductInfoSection;
