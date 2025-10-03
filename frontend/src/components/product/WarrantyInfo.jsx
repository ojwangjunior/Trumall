import React from "react";
import { Shield } from "lucide-react";

const WarrantyInfo = ({ product }) => {
  // Check if warranty_info exists
  if (!product.warranty_info) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
      <div className="flex items-start gap-3">
        <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Warranty Information
          </h2>
          <p className="text-gray-700 leading-relaxed">{product.warranty_info}</p>
        </div>
      </div>
    </div>
  );
};

export default WarrantyInfo;
