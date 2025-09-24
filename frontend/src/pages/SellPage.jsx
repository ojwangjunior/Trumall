import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

import SellPageHeader from "../components/sell/SellPageHeader";
import SellSuccessDisplay from "../components/sell/SellSuccessDisplay";
import SellErrorDisplay from "../components/sell/SellErrorDisplay";
import SellForm from "../components/sell/SellForm";

const SellPage = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }

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
        const userStores = response.data;
        setStores(userStores);
        if (userStores.length > 0) {
          setStoreId(userStores[0].id);
        } else {
          navigate("/createstore");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    if (user) {
      fetchStores();
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setImagePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setError(null);

    const formData = new FormData();
    formData.append("store_id", storeId);
    formData.append("title", itemName);
    formData.append("description", itemDescription);
    formData.append("price_cents", Math.round(parseFloat(itemPrice) * 100));
    formData.append("stock", parseInt(stock));
    formData.append("currency", "KES");

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Selling item:", response.data);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setItemName("");
      setItemPrice("");
      setItemDescription("");
      setStock(1);
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error selling item:", error);
      setError("Error selling item. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <SellPageHeader />

        <SellSuccessDisplay submissionSuccess={submissionSuccess} />

        <SellErrorDisplay error={error} />

        <SellForm
          itemName={itemName}
          setItemName={setItemName}
          itemPrice={itemPrice}
          setItemPrice={setItemPrice}
          itemDescription={itemDescription}
          setItemDescription={setItemDescription}
          stock={stock}
          setStock={setStock}
          storeId={storeId}
          setStoreId={setStoreId}
          stores={stores}
          handleFileChange={handleFileChange}
          imagePreviews={imagePreviews}
          isSubmitting={isSubmitting}
          handleSell={handleSell}
        />
      </div>
    </div>
  );
};

export default SellPage;
