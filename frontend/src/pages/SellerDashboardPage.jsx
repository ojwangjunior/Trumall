import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    if (activeTab === "orders") {
      fetchOrders();
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

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

      <div className="flex border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === "orders" ? "border-b-2 border-orange-500" : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "products" ? "border-b-2 border-orange-500" : ""
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Incoming Orders</h2>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-4 rounded-lg shadow-md mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">
                        Order ID: {order.id}
                      </h3>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    <p className="text-gray-600">Buyer: {order.buyer.name}</p>
                    <p className="text-gray-600">
                      Order Date:{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <h4 className="font-bold">Order Items:</h4>
                      <ul>
                        {order.order_items &&
                          order.order_items.map((item) => (
                            <li key={item.id} className="flex justify-between">
                              <span>{item.product.title}</span>
                              <span>Qty: {item.quantity}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <p className="text-right font-bold mt-2">
                      Total: {order.total_cents / 100} {order.currency}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "products" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Products</h2>
            {/* Products content will go here */}
            <p>No products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardPage;
