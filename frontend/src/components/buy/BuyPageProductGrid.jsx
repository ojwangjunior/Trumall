import React from "react";
import ProductCard from "../product/ProductCard";

const BuyPageProductGrid = ({ searchResults }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {searchResults.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default BuyPageProductGrid;
