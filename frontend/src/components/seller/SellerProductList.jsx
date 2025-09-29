import React from "react";
import { Package, Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const SellerProductList = ({
  loadingProducts,
  products,
  showTooltip,
  hideTooltip,
  setProductToDelete,
  setShowDeleteModal,
}) => {
  return (
    <div>
      {loadingProducts ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">
            No products yet
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mb-4">
            Start adding products to your store.
          </p>
          <Link
            to="/sell"
            className="mt-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${
                  product.images[0].image_url
                }`}
                alt={product.title}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-1 truncate">
                  {product.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mb-3 truncate">
                  {product.store.name}
                </p>
                <p className="text-lg sm:text-xl font-bold text-orange-600">
                  {(product.price_cents / 100).toLocaleString()}{" "}
                  {product.currency}
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Link
                    to={`/product/${product.id}/edit`}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    onMouseEnter={(e) => showTooltip(e, "Edit product")}
                    onMouseLeave={hideTooltip}
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      setProductToDelete(product.id);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    onMouseEnter={(e) => showTooltip(e, "Delete product")}
                    onMouseLeave={hideTooltip}
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProductList;
