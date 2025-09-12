import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Rating from "./Rating";
import { CartContext } from "../context/cart";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    console.log("Adding to cart from ProductDetailPage:", {
      ...product,
      quantity,
    });
    addToCart({ ...product, quantity });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Rating rating={product.rating} />
            <span className="text-gray-500 ml-2">
              ({product.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-orange">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through ml-2">
                {product.originalPrice}
              </span>
            )}
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

          <button
            onClick={handleAddToCart}
            className="w-full bg-orange text-white py-3 rounded-md hover:bg-orange-dark"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {product.specifications && product.specifications.map((spec) => (
            <li key={spec.name} className="p-4 flex">
              <span className="font-bold w-1/3">{spec.name}</span>
              <span className="w-2/3">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailPage;
