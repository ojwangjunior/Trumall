import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { useToast } from "../context/ToastContext"; // Import useToast

import StoreDetailHeader from "../components/store/StoreDetailHeader";
import StoreInfoCard from "../components/store/StoreInfoCard";
import StoreProductsSection from "../components/store/StoreProductsSection";
import StoreLoadingState from "../components/store/StoreLoadingState";
import StoreNotFoundState from "../components/store/StoreNotFoundState";
import UnauthorizedAccessState from "../components/store/UnauthorizedAccessState";

const StoreDetailPage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { showToast } = useToast(); // Initialize useToast

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/stores/${id}`
        );
        setStore(storeResponse.data);

        const productsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/stores/${id}/products`
        );
        setProducts(productsResponse.data);
      } catch (err) {
        showToast(err.response?.data?.error || "Error fetching store data.", "error"); // Use showToast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]); // Add showToast to dependency array

  if (loading) {
    return <StoreLoadingState />;
  }

  if (!store) {
    return <StoreNotFoundState />;
  }

  const isOwner = user && user.id === store.owner_id;

  if (user && !isOwner) {
    return <UnauthorizedAccessState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <StoreDetailHeader />

          <StoreInfoCard store={store} isOwner={isOwner} id={id} />

          <StoreProductsSection products={products} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
