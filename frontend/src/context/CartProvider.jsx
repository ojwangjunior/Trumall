import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext(); // Define and export CartContext

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartError, setCartError] = useState(null);
  const [cartSuccess, setCartSuccess] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(response.data);
      setCartError(null); 
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartError("Failed to fetch cart items.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/add`,
        {
          product_id: product.id,
          quantity: product.quantity || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(response.data);
      setCartError(null);
      setCartSuccess("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setCartError(error.response.data.error);
      } else {
        setCartError("Failed to add item to cart.");
      }
      setCartSuccess(null); 
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCart();
      setCartError(null);
      setCartSuccess("Item removed from cart!");
    } catch (error) {
      console.error("Error removing from cart:", error);
      setCartError("Failed to remove item from cart.");
      setCartSuccess(null);
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/increase`,
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(response.data);
      setCartError(null);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      setCartError("Failed to increase quantity.");
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/decrease`,
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(response.data);
      setCartError(null);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      setCartError("Failed to decrease quantity.");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, cartError, setCartError, cartSuccess, setCartSuccess }}>
      {children}
    </CartContext.Provider>
  );
};
