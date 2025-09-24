import React from "react";
import { useNavigate } from "react-router-dom";
import { Store, Edit } from "lucide-react";

const StoreInfoCard = ({ store, isOwner, id }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{store.name}</h1>
              <p className="text-blue-100">{store.description}</p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => navigate(`/store/${id}/edit`)}
              className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Store
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;
