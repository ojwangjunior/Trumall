import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Rating from "../components/common/Rating";
import { CartContext } from "../context/CartProvider";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`
        );
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(
            `${import.meta.env.VITE_API_BASE_URL}${
              response.data.images[0].image_url
            }`
          );
        } else {
          setMainImage(
            `https://via.placeholder.com/600x400?text=${encodeURIComponent(
              response.data.title
            )}`
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isOwner =
    user && product && product.store && user.id === product.store.owner_id;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        navigate(`/mystores`); // or to the store page
      } catch (error) {
        console.error("Error deleting product:", error);
        // Handle error display to user
      }
    }
  };

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
    addToCart({ ...product, quantity, id: product.id }); // Pass product.id explicitly
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Gallery */}
        <div>
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg mb-4"
          />
          <div className="flex gap-2 overflow-x-auto">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_API_BASE_URL}${img.image_url}`}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
                    mainImage ===
                    `${import.meta.env.VITE_API_BASE_URL}${img.image_url}`
                      ? "border-2 border-orange-500"
                      : ""
                  }`}
                  onClick={() =>
                    setMainImage(
                      `${import.meta.env.VITE_API_BASE_URL}${img.image_url}`
                    )
                  }
                />
              ))
            ) : (
              <img
                src={`https://via.placeholder.com/100x100?text=No+Image`}
                alt="No Image"
                className="w-24 h-24 object-cover rounded-md"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
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
          ))
        </ul>
      </div> */}
    </div>
  );
};

export default ProductDetailPage;
