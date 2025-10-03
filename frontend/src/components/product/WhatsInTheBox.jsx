import React from "react";
import { Package } from "lucide-react";

const WhatsInTheBox = ({ product }) => {
  // Check if whats_in_box exists and has items
  if (!product.whats_in_box || product.whats_in_box.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">What's in the Box</h2>
      </div>
      <ul className="space-y-2">
        {product.whats_in_box.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-orange-500 font-bold">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatsInTheBox;
