import React, { useState } from "react";
import { CartContext } from "./cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    console.log("Received product in CartContext.addToCart:", product);
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      let newItems;
      if (itemInCart) {
        newItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        newItems = [
          ...prevItems,
          { ...product, quantity: product.quantity || 1 },
        ];
      }
      console.log("Cart items after update:", newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId) => {
    console.log("Removing product from cart:", productId);
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      console.log("Cart items after removal:", updatedItems);
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
