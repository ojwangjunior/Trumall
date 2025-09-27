import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { useToast } from "../context/ToastContext"; // Import useToast

import EditStoreHeader from "../components/store/EditStoreHeader";
import EditStoreForm from "../components/store/EditStoreForm";
import StoreLoadingState from "../components/store/StoreLoadingState";
import StoreNotFoundState from "../components/store/StoreNotFoundState";
import UnauthorizedAccessState from "../components/store/UnauthorizedAccessState";

const EditStorePage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast(); // Initialize useToast

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/stores/${id}`
        );
        setStore(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
      } catch (err) {
        showToast(err.response?.data?.error || "Error fetching store data.", "error"); // Use showToast
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id, showToast]); // Add showToast to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/stores/${id}`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Store updated successfully!", "success"); // Use showToast for success
      navigate(`/store/${id}`);
    } catch (err) {
      showToast(err.response?.data?.error || "Error updating store.", "error"); // Use showToast for error
    }
  };

  if (loading) {
    return <StoreLoadingState />;
  }

  if (!store) {
    return <StoreNotFoundState />;
  }

  if (user.id !== store.owner_id) {
    return <UnauthorizedAccessState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <EditStoreHeader id={id} />

        <EditStoreForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EditStorePage;
