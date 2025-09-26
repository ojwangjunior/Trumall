import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, Shield } from "lucide-react";
import MpesaPaymentModal from "./MpesaPaymentModal";
import { CartContext } from "../../context/cart-context";

const CartSummary = ({ calculateTotal, cartItems }) => {
  // const { showToast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {

    setShowPaymentModal(false);
    navigate("/orders");
    clearCart();
    // showToast("Payment completed successfully!", "success");
  };

  const handlePaymentError = (error) => {
    // Logic to run after payment failure
    console.error("Payment process error in CartSummary:", error);
    // MpesaPaymentModal already shows an error toast
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

      {/* Mpesa Payment Modal */}
      <MpesaPaymentModal
        showModal={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={totalAmount}
        currency={currency}
        cartItems={cartItems}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!paymentMethod) return alert("Please select a payment method");
    if (cartItems.length === 0) return;

    if (paymentMethod === "mpesa") {
      try {
        setLoading(true);
        setError("");

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart/checkout`,
          {
            order_id: Date.now().toString(),
            phone,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        alert("✅ STK Push sent! Check your phone to complete payment.");
        setShowModal(false);
        setPhone("");
        setPaymentMethod("");
      } catch (err) {
        console.error("Checkout error:", err);
        setError("Payment failed to start. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert(`Payment method "${paymentMethod}" not implemented yet`);
    }
  };

  return (
    <div className="mt-8 flex justify-end items-center">
      <div className="text-lg font-bold mr-4">
        Total:{" "}
        {new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: cartItems[0]?.Product.currency || "KES",
        }).format(calculateTotal() / 100)}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
      >
        Proceed to Checkout
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>

            {/* Payment options */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="mpesa"
                  checked={paymentMethod === "mpesa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>M-Pesa</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {/* M-Pesa form */}
            {paymentMethod === "mpesa" && (
              <form onSubmit={handleCheckout} className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Number
                </label>
                <input
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay with M-Pesa"}
                </button>
              </form>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
