import React from "react";
import ImageUploadPreview from "../sell/ImageUploadPreview";
import { Plus, X } from "lucide-react";

const EditProductForm = ({
  itemName,
  setItemName,
  itemPrice,
  setItemPrice,
  itemDescription,
  setItemDescription,
  stock,
  setStock,
  keyFeatures,
  setKeyFeatures,
  specifications,
  setSpecifications,
  handleFileChange,
  imagePreviews,
  isSubmitting,
  handleUpdate,
}) => {
  // Handle adding a key feature
  const addKeyFeature = () => {
    setKeyFeatures([...keyFeatures, ""]);
  };

  // Handle removing a key feature
  const removeKeyFeature = (index) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  // Handle updating a key feature
  const updateKeyFeature = (index, value) => {
    const updated = [...keyFeatures];
    updated[index] = value;
    setKeyFeatures(updated);
  };

  // Handle adding a specification
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  // Handle removing a specification
  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Handle updating a specification
  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="mb-5">
        <label
          htmlFor="itemName"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Item Name
        </label>
        <input
          type="text"
          id="itemName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Vintage Leather Jacket"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="itemPrice"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Item Price (KES)
        </label>
        <input
          type="number"
          id="itemPrice"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 99.99"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="stock"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Stock
        </label>
        <input
          type="number"
          id="stock"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 10"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value === "" ? 0 : parseInt(e.target.value))
          }
          required
          min="0"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="itemDescription"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Item Description
        </label>
        <textarea
          id="itemDescription"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-32 resize-none"
          placeholder="Describe your item in detail..."
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />
      </div>

      {/* Key Features Section */}
      <div className="mb-5 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-gray-700 text-sm font-bold">
              Key Features
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Add 3-5 key features that make your product stand out (e.g., "15.6-inch Display", "8GB RAM")
            </p>
          </div>
          <button
            type="button"
            onClick={addKeyFeature}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateKeyFeature(index, e.target.value)}
                placeholder={`Feature ${index + 1} (e.g., "15.6-inch Display")`}
                className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeKeyFeature(index)}
                className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          {keyFeatures.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No features added yet. Click "Add" to add key features.
            </p>
          )}
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mb-5 bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-gray-700 text-sm font-bold">
              Specifications
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Add technical specifications (e.g., Brand: Samsung, Weight: 2.5kg)
            </p>
          </div>
          <button
            type="button"
            onClick={addSpecification}
            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpecification(index, "key", e.target.value)}
                placeholder="Specification name (e.g., Brand)"
                className="w-1/3 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpecification(index, "value", e.target.value)}
                placeholder="Value (e.g., Samsung)"
                className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          {specifications.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No specifications added yet. Click "Add" to add specifications.
            </p>
          )}
        </div>
      </div>

      <ImageUploadPreview
        handleFileChange={handleFileChange}
        imagePreviews={imagePreviews}
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating Item..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditProductForm;
