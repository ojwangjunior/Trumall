import React from "react";
import { AlertCircle } from "lucide-react";

const DeleteConfirmationModal = ({
  showDeleteModal,
  setShowDeleteModal,
  productToDelete,
  handleDeleteProduct,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">
            Delete Product
          </h3>
        </div>
        <p className="text-slate-600 mb-6 text-sm sm:text-base">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={() => {
              setShowDeleteModal(false);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteProduct(productToDelete)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
