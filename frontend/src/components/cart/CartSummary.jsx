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
  );
};

export default CartSummary;
