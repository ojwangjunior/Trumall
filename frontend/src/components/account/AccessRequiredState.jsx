import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const AccessRequiredState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Access Required
        </h3>
        <p className="text-slate-600 mb-6">
          Please log in to view your account details
        </p>
        <Link
          to="/signin"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default AccessRequiredState;
