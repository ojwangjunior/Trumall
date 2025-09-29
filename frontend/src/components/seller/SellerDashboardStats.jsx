import React from "react";
import { ShoppingBag, Clock, TrendingUp } from "lucide-react";

const SellerDashboardStats = ({ stats, showTooltip, hideTooltip }) => {
  return (
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
            onMouseEnter={(e) => showTooltip(e, "Orders awaiting processing")}
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
  );
};

export default SellerDashboardStats;
