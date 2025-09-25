import React from "react";
import { UserCheck } from "lucide-react";

const SignupHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserCheck className="w-8 h-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p className="text-gray-600">Join TrustMall and start shopping</p>
      <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-3 rounded-full"></div>
    </div>
  );
};

export default SignupHeader;
