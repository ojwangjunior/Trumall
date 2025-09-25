import React from "react";
import { useNavigate } from "react-router-dom";

const StoreErrorState = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-center">
      <div>
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StoreErrorState;
