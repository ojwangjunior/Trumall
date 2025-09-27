import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";
import { useToast } from "./ToastContext";

import { CartContext } from "./cart-context";

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems(response.data);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 204)
      ) {
        // Cart is empty or not found, which is not an error in this context
        setCartItems([]);
      } else {
        console.error("Error fetching cart:", error);
        showToast("Failed to fetch cart items.", "error");
      }
    }
  }, [setCartItems, showToast]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCart]);

  const addToCart = async (product) => {
    try {
      await axios.post(
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
      fetchCart();
      showToast("Item added to cart!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data && error.response.data.error) {
        showToast(error.response.data.error, "error");
      } else {
        showToast("Failed to add item to cart.", "error");
      }
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
      showToast("Item removed from cart!", "success");
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast("Failed to remove item from cart.", "error");
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
    } catch (error) {
      console.error("Error increasing quantity:", error);
      showToast("Failed to increase quantity.", "error");
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
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      showToast("Failed to decrease quantity.", "error");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItems([]);
      showToast("Cart cleared successfully!", "success");
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast("Failed to clear cart.", "error");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
