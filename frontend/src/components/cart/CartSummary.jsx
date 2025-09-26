import React, { useState } from "react";
import axios from "axios";

const CartSummary = ({ calculateTotal, cartItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
 