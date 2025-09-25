import React from "react";
import ImageUploadPreview from "./ImageUploadPreview";

const SellForm = ({
  itemName,
  setItemName,
  itemPrice,
  setItemPrice,
  itemDescription,
  setItemDescription,
  stock,
  setStock,
  storeId,
  setStoreId,
  stores,
  handleFileChange,
  imagePreviews,
  isSubmitting,
  handleSell,
}) => {
  return (
    <form onSubmit={handleSell}>
      <div className="mb-5">
        <label
          htmlFor="store"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Store
        </label>
        <select
          id="store"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-32 resize-none"
          placeholder="Describe your item in detail..."
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />
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
        {isSubmitting ? "Listing Item..." : "Sell Item"}
      </button>
    </form>
  );
};

export default SellForm;
