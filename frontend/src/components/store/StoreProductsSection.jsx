import React from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import ProductCard from "../product/ProductCard";

const StoreProductsSection = ({ products, isOwner }) => {
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center">
        <Package className="w-6 h-6 mr-2 text-blue-600" />
        Store Items
      </h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500">
            This store doesn't have any items yet.
          </p>
          {isOwner && (
            <button
              onClick={() => navigate("/sell")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add New Product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreProductsSection;
