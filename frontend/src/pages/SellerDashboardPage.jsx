import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";

const SellerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, text: "", x: 0, y: 0 });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/seller/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      setOrders(orders.map((order) => (order.id === orderId ? data : order)));
      showToast("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("Failed to update order status. Please try again.", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
      processing: <Package className="w-3 h-3 sm:w-4 sm:h-4" />,
      shipped: <Truck className="w-3 h-3 sm:w-4 sm:h-4" />,
      delivered: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
    };
    return icons[status] || icons.pending;
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalRevenue: orders.reduce(
      (sum, order) => sum + order.total_cents / 100,
      0
    ),
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/seller/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/seller/products`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/seller/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(products.filter((product) => product.id !== productId));
      setShowDeleteModal(false);
      setProductToDelete(null);
      showToast("Product deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Failed to delete product. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.text}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
            <div className="border-4 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            )}
            <span className="font-medium text-sm sm:text-base flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="hover:opacity-80 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                Delete Product
              </h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm sm:text-base">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Manage your orders and products efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {stats.totalOrders}
                </p>
              </div>
              <div
                className="bg-blue-100 p-3 sm:p-4 rounded-xl flex-shrink-0 cursor-help"
                onMouseEnter={(e) =>
                  showTooltip(e, "Total number of orders received")
                }
                onMouseLeave={hideTooltip}
              >
                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">
                  Pending Orders
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {stats.pendingOrders}
                </p>
              </div>
              <div
                className="bg-amber-100 p-3 sm:p-4 rounded-xl flex-shrink-0 cursor-help"
                onMouseEnter={(e) =>
                  showTooltip(e, "Orders awaiting processing")
                }
                onMouseLeave={hideTooltip}
              >
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  KES {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div
                className="bg-green-100 p-3 sm:p-4 rounded-xl flex-shrink-0 cursor-help"
                onMouseEnter={(e) =>
                  showTooltip(e, "Total revenue from all orders")
                }
                onMouseLeave={hideTooltip}
              >
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition-all text-sm sm:text-base ${
                activeTab === "orders"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("orders")}
              onMouseEnter={(e) => showTooltip(e, "View and manage orders")}
              onMouseLeave={hideTooltip}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Orders</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition-all text-sm sm:text-base ${
                activeTab === "products"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("products")}
              onMouseEnter={(e) => showTooltip(e, "View and manage products")}
              onMouseLeave={hideTooltip}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Products</span>
              </div>
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "orders" && (
              <div>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-base sm:text-lg">
                      No orders yet
                    </p>
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
                                  <span className="capitalize">
                                    {order.status}
                                  </span>
                                </span>
                              </div>
                              <p className="text-slate-600 text-xs sm:text-sm">
                                <span className="font-medium">Buyer:</span>{" "}
                                {order.buyer.name}
                              </p>
                              <p className="text-slate-500 text-xs mt-1">
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Status Dropdown - Full Width on Mobile */}
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
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
            )}

            {activeTab === "products" && (
              <div>
                {loadingProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">
                      No products yet
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base mb-4">
                      Start adding products to your store.
                    </p>
                    <a
                      href="/sell"
                      className="mt-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Add Product
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${
                            product.images[0].image_url
                          }`}
                          alt={product.title}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-1 truncate">
                            {product.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm mb-3 truncate">
                            {product.store.name}
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-orange-600">
                            {(product.price_cents / 100).toLocaleString()}{" "}
                            {product.currency}
                          </p>
                          <div className="flex justify-end gap-2 mt-4">
                            <a
                              href={`/product/${product.id}/edit`}
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                              onMouseEnter={(e) =>
                                showTooltip(e, "Edit product")
                              }
                              onMouseLeave={hideTooltip}
                            >
                              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                            <button
                              onClick={() => {
                                setProductToDelete(product.id);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                              onMouseEnter={(e) =>
                                showTooltip(e, "Delete product")
                              }
                              onMouseLeave={hideTooltip}
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
