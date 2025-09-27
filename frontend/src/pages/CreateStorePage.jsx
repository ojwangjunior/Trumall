import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

import CreateStoreHeader from "../components/store/CreateStoreHeader";
import CreateStoreForm from "../components/store/CreateStoreForm";

const CreateStorePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/stores`,
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Store created:", response.data);
      showToast("Store created successfully!", "success"); // Use showToast for success
      navigate("/mystores");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error creating store. Please try again.";
      showToast(errorMessage, "error"); // Use showToast for error
      console.error("Error creating store:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <CreateStoreHeader />

        <CreateStoreForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          handleCreateStore={handleCreateStore}
        />
      </div>
    </div>
  );
};

export default CreateStorePage;
