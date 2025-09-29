import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const SellerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/seller/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(response.data);
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/seller/products`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(response.data);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/seller/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(
        orders.map((order) => (order.id === orderId ? response.data : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
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
      pending: <Clock className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-slate-600">
            Manage your orders and products efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="bg-amber-100 p-4 rounded-xl">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab("products")}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                <span>Products</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "orders" && (
              <div>
                            {loadingOrders ? (
                              <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                              </div>
                            ) : orders.length === 0 ? (
                              <div className="text-center py-12">
                                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">No orders yet</p>
                                <p className="text-slate-400 text-sm mt-2">
                                  Orders will appear here once customers make purchases
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-orange-300 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-slate-800">
                                Order #{order.id}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              </span>
                            </div>
                            <p className="text-slate-600 text-sm">
                              <span className="font-medium">Buyer:</span>{" "}
                              {order.buyer.name}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Order Items
                          </h4>
                          <ul className="space-y-2">
                            {order.order_items &&
                              order.order_items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                                >
                                  <span className="text-slate-700 font-medium">
                                    {item.product.title}
                                  </span>
                                  <span className="text-slate-600 text-sm bg-slate-100 px-3 py-1 rounded-full">
                                    Qty: {item.quantity}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-slate-600 font-medium">
                            Total Amount
                          </span>
                          <span className="text-2xl font-bold text-orange-600">
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
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">
                      No products yet
                    </h2>
                    <p className="text-slate-500">
                      Start adding products to your store.
                    </p>
                    <Link
                      to="/sell"
                      className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Add Product
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${product.images[0].image_url}`}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-slate-800 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-3">
                            {product.store.name}
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {product.price_cents / 100} {product.currency}
                          </p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Link
                              to={`/product/${product.id}/edit`}
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                              <Trash2 className="w-5 h-5" />
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
