import React from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "shipped":
      return <Truck className="w-5 h-5 text-blue-500" />;
    case "processing":
      return <Package className="w-5 h-5 text-orange-500" />;
    case "pending":
      return <Clock className="w-5 h-5 text-gray-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "processing":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "pending":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OrderItem = ({ order }) => {
  return (
    <div
      key={order.id}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {getStatusIcon(order.status)}
            <div>
              <h3 className="font-bold text-lg text-gray-900">{order.id}</h3>
              <p className="text-gray-600">
                Ordered on {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-3 py-1 rounded-full border font-medium text-sm ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-gray-900">
                KES {(order.total_cents / 100).toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm">
                {order.order_items.length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6">
        {/* Products */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Items in this order
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {order.order_items.map((orderItem) => (
              <div
                key={orderItem.product.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                  {orderItem.product.images &&
                  orderItem.product.images.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${orderItem.product.images[0].image_url}`}
                      alt={orderItem.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {orderItem.product.title} (x{orderItem.quantity})
                  </p>
                  <p className="text-gray-600 text-sm">
                    KES {(orderItem.unit_price_cents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h5 className="font-semibold text-gray-900 mb-2">
              Delivery Information
            </h5>
            <p className="text-gray-600 text-sm mb-1">
              Estimated delivery:{" "}
              <span className="font-medium">
                {/* Placeholder for estimated delivery, as it's not in backend data */}
                N/A
              </span>
            </p>
            {/* Placeholder for tracking number, as it's not in backend data */}
            {/* order.trackingNumber && (
              <p className="text-gray-600 text-sm">
                Tracking:{" "}
                <span className="font-mono text-blue-600">
                  {order.trackingNumber}
                </span>
              </p>
            )*/}
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <h5 className="font-semibold text-gray-900 mb-2">Order Summary</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  KES {(order.total_cents / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  KES 0.00{" "}
                  {/* Placeholder for shipping, as it's not in backend data */}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-green-200">
                <span>Total:</span>
                <span>KES {(order.total_cents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="w-4 h-4" />
            View Details
          </button>
          {/* Placeholder for tracking number, as it's not in backend data */}
          {/* order.trackingNumber && (
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Truck className="w-4 h-4" />
              Track Package
            </button>
          )*/}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
          {order.status === "delivered" && (
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
