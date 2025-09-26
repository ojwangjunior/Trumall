import React, { useState } from "react";
import {
  ShoppingCart,
  CreditCard,
  Phone,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
// import axios from "axios";
import { useToast } from "../../context/ToastContext";

const CartSummary = ({ calculateTotal, cartItems }) => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone) => {
    // Kenyan phone number validation
    const phoneRegex = /^(?:\+?254|0)?([17]\d{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const formatPhone = (phone) => {
    // Convert to international format
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

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    setShowPaymentModal(true);
  };

  const handleCheckout = async () => {
    if (!phoneNumber || !validatePhone(phoneNumber)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);
    try {
      const formattedPhone = formatPhone(phoneNumber);

      // Replace with your actual axios import and API call
      const axios = (await import("axios")).default;

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/checkout`,
        {
          order_id: Date.now().toString(),
          phone: formattedPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Success feedback
      setShowPaymentModal(false);
      setPhoneNumber("");
      // You might want to show a success toast here instead
      showToast("STK Push sent! Check your phone to complete payment.", "success");
    } catch (err) {
      console.error("Checkout error:", err);
      // You might want to show an error toast here instead
      showToast("Payment failed to start. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    if (!isProcessing) {
      setShowPaymentModal(false);
      setPhoneNumber("");
      setPhoneError("");
    }
  };

  const totalAmount = calculateTotal() / 100;
  const currency = cartItems[0]?.Product.currency || "KES";
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
        {/* Order Summary Header */}
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
        </div>

        {/* Order Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items ({itemCount})</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(totalAmount)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckoutClick}
          disabled={cartItems.length === 0}
          className={`
            w-full flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white rounded-xl
            shadow-lg transition-all duration-200 transform
            ${
              cartItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-500/30"
            }
          `}
        >
          <CreditCard className="w-5 h-5" />
          {cartItems.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Secure checkout powered by M-Pesa</span>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  M-Pesa Payment
                </h2>
                <p className="text-sm text-gray-500">
                  Enter your phone number to proceed
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Amount to Pay:</span>
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                  }).format(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-green-600">
                  M-Pesa STK Push
                </span>
              </div>
            </div>

            {/* Phone Input */}
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
                  disabled={isProcessing}
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

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || !phoneNumber || !!phoneError}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
                  ${
                    isProcessing || !phoneNumber || !!phoneError
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
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSummary;
