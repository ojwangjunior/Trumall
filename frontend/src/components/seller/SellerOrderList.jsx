import React from "react";
import { ShoppingBag, Package, Clock, CheckCircle, Truck } from "lucide-react";

const SellerOrderList = ({
  loadingOrders,
  orders,
  handleStatusChange,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <div>
      {loadingOrders ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-base sm:text-lg">No orders yet</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Orders will appear here once customers make purchases
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200 hover:border-orange-300 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col space-y-3 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      <span className="font-medium">Buyer:</span>{" "}
                      {order.buyer.name}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Status Dropdown - Full Width on Mobile */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-slate-700 text-sm sm:text-base font-medium focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  Order Items
                </h4>
                <ul className="space-y-2">
                  {order.order_items &&
                    order.order_items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-start sm:items-center gap-2 py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-slate-700 font-medium text-xs sm:text-sm flex-1 min-w-0 break-words">
                          {item.product.title}
                        </span>
                        <span className="text-slate-600 text-xs sm:text-sm bg-slate-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                          Qty: {item.quantity}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Order Total */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-slate-600 font-medium text-sm sm:text-base">
                  Total Amount
                </span>
                <span className="text-xl sm:text-2xl font-bold text-orange-600">
                  {order.total_cents / 100} {order.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrderList;
