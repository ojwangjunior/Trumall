/**
 * Enhanced MpesaPaymentModal with Shipping Preview
 *
 * NEW FEATURES:
 * 1. Shipping cost preview before checkout
 * 2. Dynamic shipping methods from database
 * 3. Real-time cost updates when method changes
 * 4. Better error handling
 * 5. Loading states for shipping calculation
 *
 * To use: Rename this file to MpesaPaymentModal.jsx
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Phone,
  Loader2,
  AlertCircle,
  CreditCard,
  MapPin,
  Truck,
  Package,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import axios from "axios";

const MpesaPaymentModal = ({
  showModal,
  onClose,
  totalAmount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Shipping states
  const [availableShippingMethods, setAvailableShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState("");

  // Fetch addresses every time modal opens to get latest changes
  useEffect(() => {
    if (showModal) {
      fetchAddresses();
      // Reset states when modal opens
      setPhoneNumber("");
      setPhoneError("");
      setPaymentMethod("");
      setShippingError("");
    }
  }, [showModal, fetchAddresses]);

  // Fetch available shipping methods when address is selected
  useEffect(() => {
    if (selectedAddressId && totalAmount > 0) {
      fetchAvailableShippingMethods();
    }
  }, [selectedAddressId, totalAmount, fetchAvailableShippingMethods]);

  // Calculate shipping cost when method changes
  useEffect(() => {
    if (selectedAddressId && selectedShippingMethod) {
      calculateShippingCost();
    }
  }, [selectedAddressId, selectedShippingMethod, calculateShippingCost]);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/addresses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Handle both array response and object with addresses property
      const addressList = Array.isArray(response.data)
        ? response.data
        : response.data.addresses || [];

      setAddresses(addressList);

      if (addressList.length > 0) {
        const defaultAddress = addressList.find((addr) => addr.is_default);
        setSelectedAddressId(
          defaultAddress ? defaultAddress.id : addressList[0].id
        );
      } else {
        setSelectedAddressId("");
        setAvailableShippingMethods([]);
        setSelectedShippingMethod(null);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showToast("Failed to load addresses.", "error");
      setAddresses([]);
    }
  }, [setAddresses, setSelectedAddressId, setAvailableShippingMethods, setSelectedShippingMethod, showToast]);

  const fetchAvailableShippingMethods = useCallback(async () => {
    setIsLoadingShipping(true);
    setShippingError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/shipping/methods`,
        {
          params: { address_id: selectedAddressId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const methods = response.data.shipping_methods || [];
      setAvailableShippingMethods(methods);

      // Auto-select first method or standard if available
      if (methods.length > 0) {
        const standardMethod = methods.find(m => m.method_code === 'standard');
        setSelectedShippingMethod(standardMethod || methods[0]);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
      setShippingError("Failed to load shipping options");
      // Fallback to basic methods if API fails
      setAvailableShippingMethods([
        { method_code: 'standard', method_name: 'Standard Shipping', delivery_days_min: 3, delivery_days_max: 5 },
        { method_code: 'express', method_name: 'Express Shipping', delivery_days_min: 1, delivery_days_max: 2 }
      ]);
      setSelectedShippingMethod({ method_code: 'standard', method_name: 'Standard Shipping' });
    } finally {
      setIsLoadingShipping(false);
    }
  }, [selectedAddressId, setAvailableShippingMethods, setSelectedShippingMethod, setIsLoadingShipping, setShippingError]);

  const calculateShippingCost = useCallback(async () => {
    if (!selectedAddressId || !selectedShippingMethod) return;

    setIsLoadingShipping(true);
    setShippingError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/shipping/calculate`,
        {
          address_id: selectedAddressId,
          shipping_method: selectedShippingMethod.method_code,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShippingCost(response.data.shipping_cost_cents || 0);
      setEstimatedDelivery(response.data.estimated_delivery || "");

      if (response.data.is_free_shipping) {
        showToast("Free shipping applied!", "success");
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      setShippingError("Failed to calculate shipping cost");
      setShippingCost(0);
    } finally {
      setIsLoadingShipping(false);
    }
  }, [selectedAddressId, selectedShippingMethod, setIsLoadingShipping, setShippingError, setShippingCost, setEstimatedDelivery, showToast]);

  const validatePhone = (phone) => {
    const phoneRegex = /^(?:\+?254|0)?([17]\d{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("0")) {
      return "254" + cleaned.slice(1);
    } else if (cleaned.startsWith("+254")) {
      return cleaned.slice(1);
    } else if (cleaned.startsWith("254")) {
      return cleaned;
    }
    return "254" + cleaned;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setPhoneError("");

    if (value && !validatePhone(value)) {
      setPhoneError("Please enter a valid Kenyan phone number");
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      showToast("Please select a payment method", "error");
      return;
    }

    if (paymentMethod === "mpesa") {
      if (!phoneNumber || !validatePhone(phoneNumber)) {
        setPhoneError("Please enter a valid phone number");
        return;
      }
      if (!selectedAddressId) {
        showToast("Please select a delivery address.", "error");
        return;
      }
      if (!selectedShippingMethod) {
        showToast("Please select a shipping method.", "error");
        return;
      }

      setIsProcessing(true);
      try {
        const formattedPhone = formatPhone(phoneNumber);

        // Initiate checkout
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart/checkout`,
          {
            phone: formattedPhone,
            address_id: selectedAddressId,
            shipping_method: selectedShippingMethod.method_code,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const {
          order_id,
          checkout_request_id,
          shipping_cost_cents,
          estimated_delivery,
        } = response.data;

        // Update shipping info from response
        setShippingCost(shipping_cost_cents);
        setEstimatedDelivery(estimated_delivery);

        showToast(
          "STK Push sent! Check your phone to complete payment.",
          "info"
        );
        setIsWaitingForConfirmation(true);
        setIsProcessing(false);

        // Poll for payment status
        let pollAttempts = 0;
        const maxPollAttempts = 20;
        const pollInterval = setInterval(async () => {
          pollAttempts++;
          if (pollAttempts > maxPollAttempts) {
            clearInterval(pollInterval);
            showToast(
              "Payment confirmation timed out. Please check your M-Pesa statement.",
              "error"
            );
            setIsWaitingForConfirmation(false);
            onPaymentError(new Error("Payment confirmation timed out"));
            return;
          }

          try {
            const statusResponse = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/payments/status`,
              {
                params: {
                  orderId: order_id,
                  checkoutRequestId: checkout_request_id,
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            const paymentStatus = statusResponse.data.status;

            if (paymentStatus === "paid") {
              clearInterval(pollInterval);
              onPaymentSuccess();
              showToast("Payment confirmed successfully!", "success");
              setIsWaitingForConfirmation(false);
              onClose();
            } else if (paymentStatus === "failed") {
              clearInterval(pollInterval);
              showToast("Payment failed. Please try again.", "error");
              setIsWaitingForConfirmation(false);
              onPaymentError(new Error("Payment failed"));
            }
          } catch (pollError) {
            console.error("Polling error:", pollError);
          }
        }, 3000);
      } catch (err) {
        console.error("Checkout error:", err);
        onPaymentError(err);
        showToast(
          err.response?.data?.error || "Payment failed to start. Please try again.",
          "error"
        );
        setIsWaitingForConfirmation(false);
        setIsProcessing(false);
      }
    } else {
      showToast(
        `Payment method "${paymentMethod}" not implemented yet`,
        "info"
      );
    }
  };

  const closeModal = () => {
    if (!isProcessing && !isWaitingForConfirmation) {
      onClose();
      setPhoneNumber("");
      setPhoneError("");
      setPaymentMethod("");
    }
  };

  if (!showModal) return null;

  const finalTotal = totalAmount + shippingCost / 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Complete Your Payment
            </h2>
            <p className="text-sm text-gray-500">
              Choose delivery and payment options
            </p>
          </div>
        </div>

        {/* Address Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivery Address
          </label>
          {addresses.length > 0 ? (
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
              disabled={isProcessing || isWaitingForConfirmation}
            >
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.label}: {addr.street}, {addr.city}, {addr.country}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-gray-500 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              No addresses found. Please add one in your profile.
            </div>
          )}
        </div>

        {/* Shipping Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping Method
            {isLoadingShipping && (
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
            )}
          </label>

          {shippingError ? (
            <div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {shippingError}
            </div>
          ) : availableShippingMethods.length > 0 ? (
            <div className="space-y-2">
              {availableShippingMethods.map((method) => (
                <label
                  key={method.method_code}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedShippingMethod?.method_code === method.method_code
                      ? "bg-green-50 border-green-500"
                      : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={method.method_code}
                      checked={selectedShippingMethod?.method_code === method.method_code}
                      onChange={() => setSelectedShippingMethod(method)}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                      disabled={isProcessing || isWaitingForConfirmation || isLoadingShipping}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {method.method_name}
                        {method.is_free_shipping && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            FREE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {method.delivery_days_min}-{method.delivery_days_max} days
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Loading shipping options...
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Cart Subtotal:</span>
            <span className="font-semibold text-gray-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              Shipping
              {selectedShippingMethod && (
                <span className="text-xs text-gray-500">
                  ({selectedShippingMethod.method_name})
                </span>
              )}:
            </span>
            <span className="font-semibold text-gray-900">
              {isLoadingShipping ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : shippingCost === 0 ? (
                "FREE"
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(shippingCost / 100)
              )}
            </span>
          </div>

          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
            <span>Total Amount:</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(finalTotal)}
            </span>
          </div>

          {estimatedDelivery && (
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                Estimated Delivery:
              </span>
              <span className="font-semibold text-gray-900">
                {new Date(estimatedDelivery).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-green-50 has-[:checked]:border-green-500 cursor-pointer">
              <input
                type="radio"
                value="mpesa"
                name="paymentMethod"
                checked={paymentMethod === "mpesa"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span>M-Pesa</span>
            </label>
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-green-50 has-[:checked]:border-green-500 cursor-pointer opacity-50">
              <input
                type="radio"
                value="card"
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                disabled
              />
              <span>Credit/Debit Card (Coming Soon)</span>
            </label>
          </div>
        </div>

        {/* M-Pesa Phone Input */}
        {paymentMethod === "mpesa" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="0712345678 or 254712345678"
                className={`
                  w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${
                    phoneError
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-300 focus:ring-green-500/20 focus:border-green-500"
                  }
                `}
                disabled={isProcessing || isWaitingForConfirmation}
              />
            </div>
            {phoneError && (
              <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{phoneError}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              You will receive an STK push notification on this number
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex gap-3">
          <button
            onClick={closeModal}
            disabled={isProcessing || isWaitingForConfirmation}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={
              isProcessing ||
              isWaitingForConfirmation ||
              isLoadingShipping ||
              !paymentMethod ||
              !selectedAddressId ||
              !selectedShippingMethod ||
              (paymentMethod === "mpesa" && (!phoneNumber || !!phoneError))
            }
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
              ${
                isProcessing ||
                isWaitingForConfirmation ||
                isLoadingShipping ||
                !selectedShippingMethod ||
                (paymentMethod === "mpesa" && (!phoneNumber || !!phoneError))
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : isWaitingForConfirmation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for confirmation...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(finalTotal)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MpesaPaymentModal;
