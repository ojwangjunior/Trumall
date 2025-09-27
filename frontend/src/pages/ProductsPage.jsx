import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext"; // Import useToast

import ProductsHeader from "../components/product/ProductsHeader";
import ProductSearchAndSort from "../components/product/ProductSearchAndSort";
import ProductList from "../components/product/ProductList";
import ProductCountDisplay from "../components/product/ProductCountDisplay";
import EmptyProductsState from "../components/product/EmptyProductsState";
import LoadingState from "../components/account/LoadingState"; // Reusing from account

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { showToast } = useToast(); // Initialize useToast

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        showToast(error.message || "An error occurred while fetching products.", "error"); // Use showToast
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]); // Add showToast to dependency array

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price_cents - b.price_cents;
      case "price-high":
        return b.price_cents - a.price_cents;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ProductsHeader />

        <ProductSearchAndSort
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProductCountDisplay
          sortedProductsLength={sortedProducts.length}
          productsLength={products.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {sortedProducts.length === 0 ? (
          <EmptyProductsState searchTerm={searchTerm} />
        ) : (
          <ProductList products={sortedProducts} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
