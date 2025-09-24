import React, { useContext } from "react";
import { CartContext } from "../context/CartProvider";

import CartHeader from "../components/cart/CartHeader";
import EmptyCartState from "../components/cart/EmptyCartState";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CartHeader />

      {cartItems.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8">
          <CartTable
            cartItems={cartItems}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeFromCart={removeFromCart}
          />

          <CartSummary calculateTotal={calculateTotal} cartItems={cartItems} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
