import React from "react";

const EmptyProductsState = ({ searchTerm }) => {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {searchTerm ? "No Products Found" : "No Products Available"}
      </h3>
      <p className="text-gray-500">
        {searchTerm
          ? "Try adjusting your search terms or browse all products."
          : "Check back later for new products!"}
      </p>
    </div>
  );
};

export default EmptyProductsState;
