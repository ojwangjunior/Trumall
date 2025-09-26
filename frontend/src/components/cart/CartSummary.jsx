import React, { useState } from "react";
import axios from "axios";

const CartSummary = ({ calculateTotal, cartItems }) => {
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
                