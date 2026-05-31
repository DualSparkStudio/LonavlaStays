import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminAuthenticated } from '../../lib/adminAuth';

const AdminRoute: React.FC = () => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
