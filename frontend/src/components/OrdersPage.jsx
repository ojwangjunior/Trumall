import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

const OrdersPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock order data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-09-15",
      status: "delivered",
      total: 299.99,
      items: 3,
      estimatedDelivery: "2024-09-18",
      trackingNumber: "TRK123456789",
      products: [
        { name: "Wireless Headphones Pro", image: "🎧", price: 199.99 },
        { name: "USB-C Cable", image: "🔌", price: 29.99 },
        { name: "Phone Case", image: "📱", price: 69.99 },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-09-12",
      status: "shipped",
      total: 149.5,
      items: 2,
      estimatedDelivery: "2024-09-19",
      trackingNumber: "TRK987654321",
      products: [
        { name: "Smart Watch Band", image: "⌚", price: 49.99 },
        { name: "Wireless Charger", image: "🔋", price: 99.51 },
      ],
    },
    {
      id: "ORD-2024-003",
      date: "2024-09-10",
      status: "processing",
      total: 89.99,
      items: 1,
      estimatedDelivery: "2024-09-22",
      trackingNumber: null,
      products: [{ name: "Bluetooth Speaker", image: "🔊", price: 89.99 }],
    },
    {
      id: "ORD-2024-004",
      date: "2024-09-08",
      status: "pending",
      total: 449.97,
      items: 4,
      estimatedDelivery: "2024-09-25",
      trackingNumber: null,
      products: [
        { name: "Gaming Mouse", image: "🖱️", price: 129.99 },
        { name: "Keyboard", image: "⌨️", price: 199.99 },
        { name: "Mouse Pad", image: "📋", price: 39.99 },
        { name: "Webcam HD", image: "📹", price: 79.99 },
      ],
    },
  ];

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

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "all" || order.status === activeFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const filterButtons = [
    { key: "all", label: "All Orders", count: orders.length },
    {
      key: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      key: "processing",
      label: "Processing",
      count: orders.filter((o) => o.status === "processing").length,
    },
    {
      key: "shipped",
      label: "Shipped",
      count: orders.filter((o) => o.status === "shipped").length,
    },
    {
      key: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your recent purchases
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeFilter === filter.key
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
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
                        <h3 className="font-bold text-lg text-gray-900">
                          {order.id}
                        </h3>
                        <p className="text-gray-600">
                          Ordered on {formatDate(order.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`px-3 py-1 rounded-full border font-medium text-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">
                          ${order.total}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.items} items
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
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="text-2xl">{product.image}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {product.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              ${product.price}
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
                          {formatDate(order.estimatedDelivery)}
                        </span>
                      </p>
                      {order.trackingNumber && (
                        <p className="text-gray-600 text-sm">
                          Tracking:{" "}
                          <span className="font-mono text-blue-600">
                            {order.trackingNumber}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Order Summary
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">
                            ${(order.total * 0.9).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-medium">
                            ${(order.total * 0.1).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t border-green-200">
                          <span>Total:</span>
                          <span>${order.total}</span>
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
                    {order.trackingNumber && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Truck className="w-4 h-4" />
                        Track Package
                      </button>
                    )}
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
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || activeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start shopping to see your orders here"}
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
