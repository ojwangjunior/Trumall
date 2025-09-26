import React, { useState } from "react";
import { Phone, Loader2, AlertCircle, CreditCard } from "lucide-react";
import { useToast } from "../../context/ToastContext";

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
    if (!phoneNumber || !validatePhone(phoneNumber)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);
    try {
      const formattedPhone = formatPhone(phoneNumber);
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

      onPaymentSuccess();
      showToast(
        "STK Push sent! Check your phone to complete payment.",
        "success"
      );
      onClose(); 
    } catch (err) {
      console.error("Checkout error:", err);
      onPaymentError(err);
      showToast("Payment failed to start. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    if (!isProcessing) {
      onClose();
      setPhoneNumber("");
      setPhoneError("");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">M-Pesa Payment</h2>
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
  );
};

export default MpesaPaymentModal;
