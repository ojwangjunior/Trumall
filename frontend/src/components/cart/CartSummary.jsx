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
          