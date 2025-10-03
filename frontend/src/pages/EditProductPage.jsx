import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { useToast } from "../context/ToastContext"; // Import useToast

import EditProductHeader from "../components/product/EditProductHeader";
import EditProductForm from "../components/product/EditProductForm";

const EditProductPage = () => {
  const { id } = useParams();
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [storeId, setStoreId] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [brand, setBrand] = useState("");
  const [whatsInBox, setWhatsInBox] = useState([]);
  const [warrantyInfo, setWarrantyInfo] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast(); // Initialize useToast

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

        // Load key features
        setKeyFeatures(product.key_features || []);

        // Load specifications (convert from JSON object to array format)
        if (product.specifications) {
          const specsObj = typeof product.specifications === 'string'
            ? JSON.parse(product.specifications)
            : product.specifications;
          const specsArray = Object.entries(specsObj).map(([key, value]) => ({ key, value }));
          setSpecifications(specsArray);
        }

        // Load additional fields
        setBrand(product.brand || "");
        setWhatsInBox(product.whats_in_box || []);
        setWarrantyInfo(product.warranty_info || "");
        setOriginalPrice(product.original_price_cents ? (product.original_price_cents / 100).toString() : "");
        setDiscount(product.discount ? product.discount.toString() : "");
      } catch (error) {
        console.error("Error fetching product:", error);
        showToast("Failed to fetch product data.", "error");
      }
    };

    fetchProduct();
  }, [id, user, navigate, showToast]); // Add showToast to dependency array

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setImagePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);

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

    // Add brand
    if (brand.trim() !== "") {
      formData.append("brand", brand);
    }

    // Add what's in the box (filter out empty values)
    const validBoxItems = whatsInBox.filter(item => item.trim() !== "");
    if (validBoxItems.length > 0) {
      formData.append("whats_in_box", JSON.stringify(validBoxItems));
    }

    // Add warranty info
    if (warrantyInfo.trim() !== "") {
      formData.append("warranty_info", warrantyInfo);
    }

    // Add original price
    if (originalPrice && parseFloat(originalPrice) > 0) {
      formData.append("original_price_cents", Math.round(parseFloat(originalPrice) * 100));
    }

    // Add discount
    if (discount && parseInt(discount) > 0) {
      formData.append("discount", parseInt(discount));
    }

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
      showToast("Product updated successfully!", "success"); // Use showToast for success
      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating item:", error);
      showToast("Error updating item. Please try again.", "error"); // Use showToast for error
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <EditProductHeader />

        {/* <SellSuccessDisplay submissionSuccess={submissionSuccess} /> */}
        {/* <SellErrorDisplay error={error} /> */}
        {/* These displays are no longer needed as Toast handles notifications */}

        <EditProductForm
          itemName={itemName}
          setItemName={setItemName}
          itemPrice={itemPrice}
          setItemPrice={setItemPrice}
          itemDescription={itemDescription}
          setItemDescription={setItemDescription}
          stock={stock}
          setStock={setStock}
          keyFeatures={keyFeatures}
          setKeyFeatures={setKeyFeatures}
          specifications={specifications}
          setSpecifications={setSpecifications}
          brand={brand}
          setBrand={setBrand}
          whatsInBox={whatsInBox}
          setWhatsInBox={setWhatsInBox}
          warrantyInfo={warrantyInfo}
          setWarrantyInfo={setWarrantyInfo}
          originalPrice={originalPrice}
          setOriginalPrice={setOriginalPrice}
          discount={discount}
          setDiscount={setDiscount}
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
