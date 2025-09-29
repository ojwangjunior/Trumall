import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Clock, Package, ShoppingBag, Truck, CheckCircle } from "lucide-react";

// Import reusable components
import SellerDashboardHeader from "../components/seller/SellerDashboardHeader";
import SellerDashboardStats from "../components/seller/SellerDashboardStats";
import SellerDashboardTabs from "../components/seller/SellerDashboardTabs";
import SellerOrderList from "../components/seller/SellerOrderList";
import SellerProductList from "../components/seller/SellerProductList";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import ToastNotification from "../components/common/ToastNotification";
import Tooltip from "../components/common/Tooltip";

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
        showToast("Failed to fetch orders.", "error");
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
        showToast("Failed to fetch products.", "error");
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
      showToast("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("Failed to update order status. Please try again.", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/seller/products/${productId}`,
        {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Tooltip tooltip={tooltip} />
      <ToastNotification toast={toast} setToast={setToast} />
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        productToDelete={productToDelete}
        handleDeleteProduct={handleDeleteProduct}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <SellerDashboardHeader />
        <SellerDashboardStats
          stats={stats}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <SellerDashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <div className="p-4 sm:p-6">
            {activeTab === "orders" && (
              <SellerOrderList
                loadingOrders={loadingOrders}
                orders={orders}
                handleStatusChange={handleStatusChange}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            )}
            {activeTab === "products" && (
              <SellerProductList
                loadingProducts={loadingProducts}
                products={products}
                showTooltip={showTooltip}
                hideTooltip={hideTooltip}
                setProductToDelete={setProductToDelete}
                setShowDeleteModal={setShowDeleteModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
