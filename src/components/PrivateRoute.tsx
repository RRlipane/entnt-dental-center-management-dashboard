import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { UserRole } from './types';

interface Props {
  allowedRoles: UserRole[];
}

const PrivateRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { user } = useAuth();                     

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
