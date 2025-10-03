import React from "react";
import { Package, ShoppingBag, Settings } from "lucide-react";

const SellerDashboardTabs = ({
  activeTab,
  setActiveTab,
  showTooltip,
  hideTooltip,
}) => {
  return (
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
      <button
        className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition-all text-sm sm:text-base ${
          activeTab === "settings"
            ? "bg-orange-500 text-white"
            : "text-slate-600 hover:bg-slate-50"
        }`}
        onClick={() => setActiveTab("settings")}
        onMouseEnter={(e) => showTooltip(e, "Store settings and warehouse location")}
        onMouseLeave={hideTooltip}
      >
        <div className="flex items-center justify-center gap-2">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Settings</span>
        </div>
      </button>
    </div>
  );
};

export default SellerDashboardTabs;
