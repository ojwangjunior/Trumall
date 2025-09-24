import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

import AccountHeader from "../components/account/AccountHeader";
import AccountProfileCard from "../components/account/AccountProfileCard";
import AccountInfoSection from "../components/account/AccountInfoSection";
import AccountQuickActions from "../components/account/AccountQuickActions";
import SellerDashboardCard from "../components/account/SellerDashboardCard";
import LoadingState from "../components/account/LoadingState";
import ErrorState from "../components/account/ErrorState";
import AccessRequiredState from "../components/account/AccessRequiredState";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(userResponse.data);

        if (userResponse.data.roles.includes("seller")) {
          const storesResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/my-stores`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStores(storesResponse.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!user) {
    return <AccessRequiredState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AccountHeader />

          <AccountProfileCard user={user} />

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <AccountInfoSection user={user} />
              <AccountQuickActions handleLogout={handleLogout} />
            </div>
          </div>

          <SellerDashboardCard user={user} stores={stores} />
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
