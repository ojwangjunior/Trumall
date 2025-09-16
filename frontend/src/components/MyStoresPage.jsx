import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const MyStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // --- CHANGE START ---
        // Use the new, more efficient endpoint that only returns the user's stores.
        const response = await axios.get(
          "http://localhost:8080/api/me/stores",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // No more client-side filtering needed! The backend does the work.
        setStores(response.data.data);
        // --- CHANGE END ---
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStores();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My Stores</h2>
          <Link to="/createstore">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create New Store
            </button>
          </Link>
        </div>
        {stores.length === 0 ? (
          <p>
            You haven't created any stores yet. Click the button above to get
            started!
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default MyStoresPage;
