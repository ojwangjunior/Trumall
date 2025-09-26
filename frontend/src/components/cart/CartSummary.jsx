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
        