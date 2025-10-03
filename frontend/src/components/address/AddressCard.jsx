import React from 'react';
import { MapPin, Home, Building2, GraduationCap, Edit2, Trash2, Check } from 'lucide-react';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault, isDeleting = false }) => {
  const getLabelIcon = (label) => {
    switch (label?.toLowerCase()) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'office':
        return <Building2 className="w-5 h-5" />;
      case 'school':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className={`
      bg-white rounded-lg border transition-all
      ${address.is_default
        ? 'border-orange-500 shadow-md'
        : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
      }
    `}>
      <div className="p-4">
        {/* Header with Label and Default Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-orange-600">
              {getLabelIcon(address.label)}
            </div>
            <h3 className="font-semibold text-gray-900">
              {address.label}
            </h3>
          </div>
          {address.is_default && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              Default
            </span>
          )}
        </div>

        {/* Address Details */}
        <div className="space-y-1 text-sm text-gray-600">
          <p className="text-gray-900 font-medium">{address.street}</p>
          <p>
            {address.city}
            {address.state && `, ${address.state}`}
          </p>
          <p>
            {address.country}
            {address.postal_code && ` ${address.postal_code}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          {!address.is_default && (
            <button
              onClick={() => onSetDefault(address.id)}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Set as Default
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onEdit(address)}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Edit address"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(address.id)}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete address"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
