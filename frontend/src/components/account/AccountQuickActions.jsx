import React from "react";
import { Link } from "react-router-dom";
import { Settings, Edit3, LogOut, ChevronRight, MapPin } from "lucide-react";

const AccountQuickActions = ({ handleLogout }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-blue-600" />
        Quick Actions
      </h3>

      <div className="space-y-3">
        <Link
          to="/account/addresses"
          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">
              Manage Addresses
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </Link>

        <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
          <div className="flex items-center space-x-3">
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">
              Edit Profile
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </button>

        <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
          <div className="flex items-center space-x-3">
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">
              Account Settings
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default AccountQuickActions;
