import React, { useState, useEffect, createContext } from "react"; // Import createContext
import axios from "axios";

export const CartContext = createContext(); // Define and export CartContext

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartError, setCartError] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(response.data);
      setCartError(null); // Clear any previous errors on successful fetch
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartError("Failed to fetch cart items."); // Set a generic error for fetching
    }
  };

  useEffect(() => {
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
      setCartError(null); // Clear any previous errors on successful add
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setCartError(error.response.data.error);
      } else {
        setCartError("Failed to add item to cart.");
      }
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCart(); // Re-fetch cart after successful removal
      setCartError(null); // Clear any previous errors on successful remove
    } catch (error) {
      console.error("Error removing from cart:", error);
      setCartError("Failed to remove item from cart."); // Set a generic error for removing
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartError, setCartError }}>
      {children}
    </CartContext.Provider>
  );
};
