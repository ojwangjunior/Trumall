import React from "react";
import { Link } from "react-router-dom";

const StoreListDisplay = ({ stores }) => {
  return (
    <ul className="space-y-4">
      {stores.map((store) => (
        <li key={store.id} className="border-b pb-4 last:border-b-0">
          <Link
            to={`/store/${store.id}`}
            className="block hover:bg-gray-50 p-2 rounded"
          >
            <h3 className="text-xl font-semibold text-blue-600">
              {store.name}
            </h3>
            <p className="text-gray-600 mt-1">{store.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default StoreListDisplay;
