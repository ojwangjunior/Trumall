import React from "react";
import { FileText } from "lucide-react";

const AboutThisItem = ({ product }) => {
  if (!product.description) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">About This Item</h2>
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default AboutThisItem;
