import React from 'react';
import { ClipboardList } from 'lucide-react';

const ProductSpecifications = ({ product }) => {
  // Parse specifications if it's a string
  let specs = {};
  try {
    specs = typeof product.specifications === 'string'
      ? JSON.parse(product.specifications)
      : product.specifications || {};
  } catch (error) {
    console.error('Error parsing specifications:', error);
    return null;
  }

  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Specifications</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {Object.entries(specs).map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="py-3 px-4 font-semibold text-gray-700 w-1/3">
                  {key}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSpecifications;
