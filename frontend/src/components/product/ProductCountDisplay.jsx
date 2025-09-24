import React from "react";

const ProductCountDisplay = ({
  sortedProductsLength,
  productsLength,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-gray-600">
        Showing {sortedProductsLength} of {productsLength} products
        {searchTerm && (
          <span className="ml-2 text-orange-500">for "{searchTerm}"</span>
        )}
      </p>
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

export default ProductCountDisplay;
