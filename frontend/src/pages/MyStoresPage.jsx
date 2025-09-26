import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import MyStoresHeader from "../components/store/MyStoresHeader";
import StoreListDisplay from "../components/store/StoreListDisplay";
import EmptyMyStoresState from "../components/store/EmptyMyStoresState";
import LoadingState from "../components/account/LoadingState";

const MyStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/me/stores`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStores(response.data.data || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
        showToast("Failed to fetch your stores.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStores();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <MyStoresHeader />

        {stores.length === 0 ? (
          <EmptyMyStoresState />
        ) : (
          <StoreListDisplay stores={stores} />
        )}
      </div>
    </div>
  );
};

export default MyStoresPage;
