import React from "react";
import { CheckCircle } from "lucide-react";

const KeyFeatures = ({ product }) => {
  // Check if key_features exists and has items
  if (!product.key_features || product.key_features.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Key Features</h2>
      <ul className="space-y-3">
        {product.key_features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyFeatures;
