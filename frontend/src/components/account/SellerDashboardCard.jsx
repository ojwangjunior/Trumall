import React from "react";
import { Link } from "react-router-dom";
import { Store, ChevronRight } from "lucide-react";

const SellerDashboardCard = ({ user, stores }) => {
  return (
    user.roles &&
    user.roles.includes("seller") && (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Seller Dashboard</h2>
              <p className="text-green-100">Manage your stores and products</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-4">
            {stores.length > 0 ? (
              stores.map((store) => (
                <Link
                  key={store.id}
                  to={`/store/${store.id}`}
                  className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {store.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {store.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </Link>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-600 mb-4">
                  You haven't created any stores yet.
                </p>
                <Link
                  to="/createstore"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create a Store
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default SellerDashboardCard;
