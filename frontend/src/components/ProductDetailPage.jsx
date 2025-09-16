import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Rating from "./Rating";
import { CartContext } from "../context/cart";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
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
            src={`https://via.placeholder.com/300x300?text=${product.Title}`}
            alt={product.Title}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.Title}</h1>
          <div className="flex items-center mb-4">
            {/* Add rating if available in the product data */}
            {/* <Rating rating={product.rating} /> */}
            {/* <span className="text-gray-500 ml-2">({product.reviews} reviews)</span> */}
          </div>
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-orange">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: product.Currency,
              }).format(product.PriceCents / 100)}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{product.Description}</p>

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
      {/* Add specifications if available in the product data */}
      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {product.specifications.map((spec) => (
            <li key={spec.name} className="p-4 flex">
              <span className="font-bold w-1/3">{spec.name}</span>
              <span className="w-2/3">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default ProductDetailPage;
