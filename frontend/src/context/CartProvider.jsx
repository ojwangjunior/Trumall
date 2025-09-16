import React, { useState, useEffect, createContext } from "react"; // Import createContext
import axios from "axios";

export const CartContext = createContext(); // Define and export CartContext

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/add",
        {
          product_id: product.id, // Changed from product.ID to product.id
          quantity: product.quantity || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
