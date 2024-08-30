// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ requiredRole }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && (!auth.user || auth.user.role !== requiredRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
