import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const CartItemRow = ({
  item,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) => {
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      // You can add a custom updateQuantity function if needed
      // For now, we'll keep using increase/decrease
    }
  };

  return (
    <tr key={item.ID}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16">
            <img
              className="h-16 w-16 rounded-md object-cover"
              src={
                item.Product.images && item.Product.images.length > 0
                  ? `${import.meta.env.VITE_API_BASE_URL}${
                      item.Product.images[0].image_url
                    }`
                  : `https://via.placeholder.com/150?text=${item.Product.title}`
              }
              alt={item.Product.title}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {item.Product.title}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: item.Product.currency || "KES",
        }).format(item.price / 100)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="inline-flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => decreaseQuantity(item.Product.id)}
            disabled={item.quantity <= 1}
            className="px-3 py-2 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-gray-900 bg-white border-x border-gray-300">
            {item.quantity}
          </span>
          <button
            onClick={() => increaseQuantity(item.Product.id)}
            className="px-3 py-2 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: item.Product.currency || "KES",
        }).format((item.price * item.quantity) / 100)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => removeFromCart(item.ID)}
          className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove item from cart"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove</span>
        </button>
      </td>
    </tr>
  );
};

export default CartItemRow;
