import React, { useState, useEffect } from "react"; // Added useEffect
import { Link } from "react-router-dom";
import {
  Phone,
  Loader2,
  AlertCircle,
  CreditCard,
  MapPin,
  Truck,
  Plus,
} from "lucide-react"; // Added MapPin, Truck, Plus
import { useToast } from "../../context/ToastContext";
import axios from "axios"; // Added axios

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
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
    useState(false);
  const [addresses, setAddresses] = useState([]); // New state for addresses
  const [selectedAddressId, setSelectedAddressId] = useState(""); // New state for selected address
  const [shippingMethod, setShippingMethod] = useState("standard"); // New state for shipping method
  const [shippingCost, setShippingCost] = useState(0); // New state for shipping cost
  const [estimatedDelivery, setEstimatedDelivery] = useState(""); // New state for estimated delivery

  // Fetch addresses when modal opens
  useEffect(() => {
    if (showModal) {
      const fetchAddresses = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/addresses`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Fetched addresses:", response.data);
          const addressList = Array.isArray(response.data) ? response.data : response.data.addresses || [];
          setAddresses(addressList);
          if (addressList.length > 0) {
            // Select the first address or default if available
            const defaultAddress = addressList.find(
              (addr) => addr.is_default
            );
            const selectedId = defaultAddress ? defaultAddress.id : addressList[0].id;
            console.log("Selected address ID:", selectedId);
            setSelectedAddressId(selectedId);
          } else {
            console.warn("No addresses available");
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
          showToast("Failed to load addresses.", "error");
        }
      };
      fetchAddresses();
    }
  }, [showModal, showToast]);

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

      setIsProcessing(true);
      try {
        const formattedPhone = formatPhone(phoneNumber);

        // Calculate final amount in cents
        const finalAmountCents = (totalAmount + shippingCost / 100) * 100;

        // Check for minimum M-Pesa amount (1 KES = 100 cents)
        if (finalAmountCents < 100) {
          showToast("M-Pesa minimum amount is 1 KES", "error");
          setIsProcessing(false);
          return;
        }

        console.log("Checkout request data:", {
          phone: formattedPhone,
          address_id: selectedAddressId,
          shipping_method: shippingMethod,
        });

        // Step 1: Initiate STK Push and get order_id and checkout_request_id
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart/checkout`,
          {
            phone: formattedPhone,
            address_id: selectedAddressId,
            shipping_method: shippingMethod,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { order_id, checkout_request_id, shipping_cost_cents, estimated_delivery } = response.data; // Assuming backend returns these IDs

        setShippingCost(shipping_cost_cents);
        setEstimatedDelivery(estimated_delivery);

        showToast(
          "STK Push sent! Check your phone to complete payment. Waiting for confirmation...",
          "info"
        );
        setIsWaitingForConfirmation(true);
        setIsProcessing(false); // STK push sent, no longer "processing" the request itself

        // Step 2: Start polling for payment status
        let pollAttempts = 0;
        const maxPollAttempts = 20; // Poll for up to 20 * 3 seconds = 60 seconds
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
            // Hypothetical backend endpoint to check payment status
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

            const paymentStatus = statusResponse.data.status; // Assuming backend returns { status: "paid" | "failed" | "pending" }

            if (paymentStatus === "paid") {
              clearInterval(pollInterval);
              onPaymentSuccess(); // Call onPaymentSuccess only after confirmation
              showToast("Payment confirmed successfully!", "success");
              setIsWaitingForConfirmation(false);
              onClose();
            } else if (paymentStatus === "failed") {
              clearInterval(pollInterval);
              showToast("Payment failed. Please try again.", "error");
              setIsWaitingForConfirmation(false);
              onPaymentError(new Error("Payment failed"));
            }
            // If status is "pending" or "initiated", continue polling
          } catch (pollError) {
            console.error("Polling error:", pollError);
            // Continue polling even if there's a temporary error
          }
        }, 3000); // Poll every 3 seconds
      } catch (err) {
        console.error("Checkout error:", err);
        console.error("Error response:", err.response?.data);
        onPaymentError(err);
        const errorMessage = err.response?.data?.error || "Payment failed to start. Please try again.";
        showToast(errorMessage, "error");
        setIsWaitingForConfirmation(false); // Reset if error occurs before confirmation
        setIsProcessing(false); // Reset processing state on error
      }
    } else {
      showToast(
        `Payment method "${paymentMethod}" not implemented yet`,
        "info"
      );
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
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Complete Your Payment
            </h2>
            <p className="text-sm text-gray-500">
              Choose a payment method to proceed
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal:</span>
            <span className="font-semibold text-gray-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(totalAmount)}
            </span>
          </div>
          {shippingCost > 0 && (
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Shipping ({shippingMethod}):</span>
              <span className="font-semibold text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(shippingCost / 100)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
            <span>Total Amount:</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(totalAmount + shippingCost / 100)}
            </span>
          </div>
          {estimatedDelivery && (
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Estimated Delivery:</span>
              <span className="font-semibold text-gray-900">
                {new Date(estimatedDelivery).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Address Selection */}
        <div className="mb-6">
          <label
            htmlFor="address-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Delivery Address
          </label>
          {addresses.length > 0 ? (
            <>
              <select
                id="address-select"
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                disabled={isProcessing || isWaitingForConfirmation}
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label}: {addr.street}, {addr.city}, {addr.country}{" "}
                    {addr.postal_code}
                  </option>
                ))}
              </select>
              <Link
                to="/account/addresses"
                className="mt-2 inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </Link>
            </>
          ) : (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-900 mb-2">
                No delivery addresses found. Add your first address to continue.
              </p>
              <Link
                to="/account/addresses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Delivery Address
              </Link>
            </div>
          )}
        </div>

        {/* Shipping Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
              <input
                type="radio"
                value="standard"
                name="shippingMethod"
                checked={shippingMethod === "standard"}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                disabled={isProcessing || isWaitingForConfirmation}
              />
              <span>Standard Shipping (3-5 days)</span>
            </label>
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
              <input
                type="radio"
                value="express"
                name="shippingMethod"
                checked={shippingMethod === "express"}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                disabled={isProcessing || isWaitingForConfirmation}
              />
              <span>Express Shipping (1-2 days)</span>
            </label>
          </div>
        </div>
        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
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
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
              <input
                type="radio"
                value="card"
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span>Credit/Debit Card</span>
            </label>
            <label className="flex items-center space-x-2 p-3 border rounded-lg has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
              <input
                type="radio"
                value="cod"
                name="paymentMethod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span>Cash on Delivery</span>
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
              !paymentMethod ||
              (paymentMethod === "mpesa" && (!phoneNumber || !!phoneError))
            }
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
              ${
                isProcessing ||
                isWaitingForConfirmation ||
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
