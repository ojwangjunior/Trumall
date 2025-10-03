import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { useToast } from "../context/ToastContext"; // Import useToast

import SellPageHeader from "../components/sell/SellPageHeader";
import SellForm from "../components/sell/SellForm";

const SellPage = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast(); // Initialize useToast

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
          showToast("You need to create a store first.", "info"); // Use showToast
          navigate("/createstore");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        showToast("Error fetching your stores.", "error"); // Use showToast
      }
    };

    if (user) {
      fetchStores();
    }
  }, [user, navigate, showToast]); // Add showToast to dependency array

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setImagePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("store_id", storeId);
    formData.append("title", itemName);
    formData.append("description", itemDescription);
    formData.append("price_cents", Math.round(parseFloat(itemPrice) * 100));
    formData.append("stock", parseInt(stock));
    formData.append("currency", "KES");

    // Add key features (filter out empty values)
    const validKeyFeatures = keyFeatures.filter(f => f.trim() !== "");
    if (validKeyFeatures.length > 0) {
      formData.append("key_features", JSON.stringify(validKeyFeatures));
    }

    // Add specifications (convert array format to JSON object, filter out empty values)
    const validSpecs = specifications.filter(s => s.key.trim() !== "" && s.value.trim() !== "");
    if (validSpecs.length > 0) {
      const specsObj = validSpecs.reduce((acc, spec) => {
        acc[spec.key] = spec.value;
        return acc;
      }, {});
      formData.append("specifications", JSON.stringify(specsObj));
    }

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
      showToast("Product listed successfully!", "success"); // Use showToast for success
      setItemName("");
      setItemPrice("");
      setItemDescription("");
      setStock(1);
      setKeyFeatures([]);
      setSpecifications([]);
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error selling item:", error);
      showToast("Error selling item. Please try again.", "error"); // Use showToast for error
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <SellPageHeader />

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
          keyFeatures={keyFeatures}
          setKeyFeatures={setKeyFeatures}
          specifications={specifications}
          setSpecifications={setSpecifications}
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
