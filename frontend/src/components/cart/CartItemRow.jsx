import React from "react";

const CartItemRow = ({
  item,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) => {
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => decreaseQuantity(item.Product.id)}
            className="px-2 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => increaseQuantity(item.Product.id)}
            className="px-2 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            +
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
          className="text-red-600 hover:text-red-900"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItemRow;
