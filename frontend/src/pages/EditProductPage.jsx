import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

import EditProductHeader from "../components/product/EditProductHeader";
import SellSuccessDisplay from "../components/sell/SellSuccessDisplay"; // Reusing from sell
import SellErrorDisplay from "../components/sell/SellErrorDisplay"; // Reusing from sell
import EditProductForm from "../components/product/EditProductForm";

const EditProductPage = () => {
  const { id } = useParams();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [storeId, setStoreId] = useState("");
  // const [stores, setStores] = useState([]);
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

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`
        );
        const product = response.data;
        setItemName(product.title);
        setItemPrice((product.price_cents / 100).toString());
        setItemDescription(product.description);
        setStock(product.stock);
        setStoreId(product.store_id);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product data.");
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setImagePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleUpdate = async (e) => {
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
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Updating item:", response.data);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Error updating item. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <EditProductHeader />

        <SellSuccessDisplay submissionSuccess={submissionSuccess} />

        <SellErrorDisplay error={error} />

        <EditProductForm
          itemName={itemName}
          setItemName={setItemName}
          itemPrice={itemPrice}
          setItemPrice={setItemPrice}
          itemDescription={itemDescription}
          setItemDescription={setItemDescription}
          stock={stock}
          setStock={setStock}
          storeId={storeId}
          // setStoreId={setStoreId} // storeId is not being set in this form
          handleFileChange={handleFileChange}
          imagePreviews={imagePreviews}
          isSubmitting={isSubmitting}
          handleUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};

export default EditProductPage;
