import React from "react";

const ImageUploadPreview = ({ handleFileChange, imagePreviews }) => {
  return (
    <div className="mb-5">
      <label
        htmlFor="images"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Item Images (JPEG, PNG, WebP)
      </label>
      <input
        type="file"
        id="images"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
        onChange={handleFileChange}
        multiple
        accept=".jpg,.jpeg,.png,.webp"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            className="w-24 h-24 object-cover rounded-md"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploadPreview;
