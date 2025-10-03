import React from 'react';

const ProductSpecifications = ({ product }) => {
  // Parse specifications if it's a string
  const specs = typeof product.specifications === 'string'
    ? JSON.parse(product.specifications)
    : product.specifications;

  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Specifications</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex flex-col border-b border-gray-200 pb-3">
            <dt className="font-semibold text-gray-700 mb-1">{key}</dt>
            <dd className="text-gray-600">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProductSpecifications;
