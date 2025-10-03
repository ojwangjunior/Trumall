import React from "react";

const AboutThisItem = ({ product }) => {
  if (!product.description && (!product.key_features || product.key_features.length === 0)) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">About this item</h2>

      <div className="space-y-6">
        {/* Description */}
        {product.description && (
          <div>
            <p className="text-gray-700 leading-relaxed text-base">
              {product.description}
            </p>
          </div>
        )}

        {/* Key Features */}
        {product.key_features && product.key_features.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Key Features</h3>
            <ul className="space-y-3">
              {product.key_features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutThisItem;
