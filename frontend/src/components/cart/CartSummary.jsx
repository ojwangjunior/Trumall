import React, { useState } from "react";
import axios from "axios";

const CartSummary = ({ calculateTotal, cartItems }) => {
  