import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const StoreDetailHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to My Account
      </button>
    </div>
  );
};

export default StoreDetailHeader;
