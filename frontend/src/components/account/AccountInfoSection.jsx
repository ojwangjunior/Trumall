import React from "react";
import { User, Mail, Shield } from "lucide-react";

const AccountInfoSection = ({ user }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Account Information
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <User className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-900">Full Name</p>
              <p className="text-sm text-slate-600">
                {user.name || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-900">
                Email Address
              </p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-900">Account Type</p>
              <p className="text-sm text-slate-600">
                {user.roles && user.roles.includes("seller")
                  ? "Seller"
                  : "Buyer"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoSection;
