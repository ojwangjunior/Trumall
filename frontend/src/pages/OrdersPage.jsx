import React, { useState } from "react";
import OrderHeader from "../components/orders/OrderHeader";
import OrderSearchAndFilter from "../components/orders/OrderSearchAndFilter";
import OrderItem from "../components/orders/OrderItem";
import EmptyOrdersState from "../components/orders/EmptyOrdersState";

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
        <OrderHeader />

        <OrderSearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterButtons={filterButtons}
        />

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))
          ) : (
            <EmptyOrdersState
              searchQuery={searchQuery}
              activeFilter={activeFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
