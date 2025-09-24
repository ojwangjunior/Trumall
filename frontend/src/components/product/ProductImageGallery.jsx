import React from "react";

const ProductImageGallery = ({ product, mainImage, setMainImage }) => {
  return (
    <div>
      <img
        src={mainImage}
        alt={product.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />
      <div className="flex gap-2 overflow-x-auto">
        {product.images && product.images.length > 0 ? (
          product.images.map((img, index) => (
            <img
              key={index}
              src={`${import.meta.env.VITE_API_BASE_URL}${img.image_url}`}
              alt={`${product.title} thumbnail ${index + 1}`}
              className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
                mainImage ===
                `${import.meta.env.VITE_API_BASE_URL}${img.image_url}`
                  ? "border-2 border-orange-500"
                  : ""
              }`}
              onClick={() =>
                setMainImage(
                  `${import.meta.env.VITE_API_BASE_URL}${img.image_url}`
                )
              }
            />
          ))
        ) : (
          <img
            src={`https://via.placeholder.com/100x100?text=No+Image`}
            alt="No Image"
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
