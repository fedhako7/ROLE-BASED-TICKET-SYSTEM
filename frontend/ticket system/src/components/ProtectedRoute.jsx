import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRoute = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (isAdminRoute && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default ProtectedRoute;
