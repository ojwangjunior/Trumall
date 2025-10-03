import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/cart-context";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfoSection from "../components/product/ProductInfoSection";
import ProductLoadingState from "../components/product/ProductLoadingState";
import ProductNotFoundState from "../components/product/ProductNotFoundState";
import AboutThisItem from "../components/product/AboutThisItem";
import ProductSpecifications from "../components/product/ProductSpecifications";
import ProductReviews from "../components/product/ProductReviews";
import KeyFeatures from "../components/product/KeyFeatures";
import WhatsInTheBox from "../components/product/WhatsInTheBox";
import WarrantyInfo from "../components/product/WarrantyInfo";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

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
        showToast("Failed to load product details.", "error");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, showToast]);

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
        showToast("Failed to delete product. Please try again.", "error");
      }
    }
  };

  if (loading) {
    return <ProductLoadingState />;
  }

  if (!product) {
    return <ProductNotFoundState />;
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
      {/* Product Images & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ProductImageGallery
          product={product}
          mainImage={mainImage}
          setMainImage={setMainImage}
        />

        <ProductInfoSection
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          isOwner={isOwner}
          handleDelete={handleDelete}
          handleAddToCart={handleAddToCart}
          id={id}
        />
      </div>
      
      {/* About This Item Section */}
      <AboutThisItem product={product} />

      {/* Key Features Section */}
      <KeyFeatures product={product} />

      {/* Specifications Section */}
      <ProductSpecifications product={product} />

      {/* What's in the Box Section */}
      <WhatsInTheBox product={product} />

      {/* Warranty Information */}
      <WarrantyInfo product={product} />

      {/* Reviews Section */}
      <ProductReviews product={product} />
    </div>
  );
};

export default ProductDetailPage;
