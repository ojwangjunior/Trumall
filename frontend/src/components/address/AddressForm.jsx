import React, { useState, useEffect } from 'react';
import { MapPin, Home, Building2, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { KENYA_CITIES, KENYA_COUNTIES, COUNTRIES, ADDRESS_LABELS, getCitiesForCountry, getCountiesForCountry } from '../../data/kenyaCities';

const AddressForm = ({ initialData = {}, onSave, onCancel, isLoading = false }) => {
  const safeInitialData = initialData || {};
  const [formData, setFormData] = useState({
    label: safeInitialData.label || 'Home',
    customLabel: '',
    street: safeInitialData.street || '',
    city: safeInitialData.city || '',
    state: safeInitialData.state || '',
    country: safeInitialData.country || 'Kenya',
    postal_code: safeInitialData.postal_code || '',
    is_default: safeInitialData.is_default || false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  const [availableCounties, setAvailableCounties] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Update available cities when country changes
  useEffect(() => {
    const cities = getCitiesForCountry(formData.country);
    setAvailableCities(cities);
    const counties = getCountiesForCountry(formData.country);
    setAvailableCounties(counties);
  }, [formData.country]);

  // Validation function
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'label':
        if (!value || value.trim() === '') {
          error = 'Address label is required';
        }
        break;
      case 'street':
        if (!value || value.trim() === '') {
          error = 'Street address is required';
        } else if (value.trim().length < 5) {
          error = 'Street address is too short';
        }
        break;
      case 'city':
        if (!value || value.trim() === '') {
          error = 'City is required for shipping zone matching';
        }
        break;
      case 'country':
        if (!value) {
          error = 'Country is required';
        }
        break;
      case 'postal_code':
        if (value && formData.country === 'Kenya') {
          if (!/^\d{5}$/.test(value)) {
            error = 'Kenya postal code must be 5 digits';
          }
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const finalLabel = formData.label === 'Other' ? formData.customLabel : formData.label;

    newErrors.label = validateField('label', finalLabel);
    newErrors.street = validateField('street', formData.street);
    newErrors.city = validateField('city', formData.city);
    newErrors.country = validateField('country', formData.country);
    newErrors.postal_code = validateField('postal_code', formData.postal_code);

    // Filter out empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on change
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleCitySearch = (e) => {
    const value = e.target.value;
    setCitySearch(value);
    setFormData(prev => ({ ...prev, city: value }));
    setShowCityDropdown(true);
    setTouched(prev => ({ ...prev, city: true }));
  };

  const selectCity = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);
    setTouched(prev => ({ ...prev, city: true }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.city;
      return newErrors;
    });
  };

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes((citySearch || formData.city || '').toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateForm();
    setErrors(newErrors);

    // Mark all as touched
    setTouched({
      label: true,
      street: true,
      city: true,
      country: true,
      postal_code: true,
    });

    if (Object.keys(newErrors).length === 0) {
      // Prepare data
      const submitData = {
        ...formData,
        label: formData.label === 'Other' ? formData.customLabel : formData.label,
      };
      delete submitData.customLabel;

      onSave(submitData);
    }
  };

  const getLabelIcon = (label) => {
    const labelData = ADDRESS_LABELS.find(l => l.value === label);
    return labelData ? labelData.icon : '📍';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Address Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Label <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ADDRESS_LABELS.map((label) => (
            <button
              key={label.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, label: label.value }))}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors
                ${formData.label === label.value
                  ? 'bg-orange-50 border-orange-500 text-orange-700'
                  : 'border-gray-300 hover:border-orange-300 text-gray-700'
                }
              `}
            >
              <span>{label.icon}</span>
              <span>{label.value}</span>
            </button>
          ))}
        </div>
        {formData.label === 'Other' && (
          <input
            type="text"
            name="customLabel"
            value={formData.customLabel}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter custom label"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        )}
        {touched.label && errors.label && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.label}
          </p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="123 Main Street, Apt 4B"
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${errors.street && touched.street
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-gray-300 focus:ring-orange-500/20 focus:border-orange-500'
            }
          `}
        />
        {touched.street && errors.street && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.street}
          </p>
        )}
      </div>

      {/* City (Critical for zone matching) */}
      <div className="relative">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 ml-1">(Required for shipping zones)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="city"
            name="city"
            value={citySearch || formData.city}
            onChange={handleCitySearch}
            onBlur={(e) => {
              // Delay to allow click on dropdown
              setTimeout(() => setShowCityDropdown(false), 200);
              handleBlur(e);
            }}
            onFocus={() => setShowCityDropdown(true)}
            placeholder="Search or select city"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
              ${errors.city && touched.city
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-300 focus:ring-orange-500/20 focus:border-orange-500'
              }
            `}
          />
          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCities.slice(0, 10).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
        {touched.city && errors.city && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.city}
          </p>
        )}
        {formData.city && !errors.city && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            ✓ City selected for zone matching
          </p>
        )}
      </div>

      {/* State/County */}
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
          County/State (Optional)
        </label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="">Select county (optional)</option>
          {availableCounties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${errors.country && touched.country
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-gray-300 focus:ring-orange-500/20 focus:border-orange-500'
            }
          `}
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.name}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        {touched.country && errors.country && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.country}
          </p>
        )}
      </div>

      {/* Postal Code */}
      <div>
        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
          Postal Code
          {formData.country === 'Kenya' && (
            <span className="text-xs text-gray-500 ml-1">(5 digits)</span>
          )}
        </label>
        <input
          type="text"
          id="postal_code"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={formData.country === 'Kenya' ? '00100' : 'Enter postal code'}
          maxLength={formData.country === 'Kenya' ? 5 : 10}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${errors.postal_code && touched.postal_code
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-gray-300 focus:ring-orange-500/20 focus:border-orange-500'
            }
          `}
        />
        {touched.postal_code && errors.postal_code && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.postal_code}
          </p>
        )}
      </div>

      {/* Set as Default */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_default"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
          Set as default delivery address
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || Object.keys(errors).length > 0}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${isLoading || Object.keys(errors).length > 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Save Address
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
