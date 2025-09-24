import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EditStoreHeader = ({ id }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(`/store/${id}`)}
        className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Store
      </button>
    </div>
  );
};

export default EditStoreHeader;
