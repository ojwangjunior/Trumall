import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const SellerProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!user.roles || !user.roles.includes('seller')) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default SellerProtectedRoute;
