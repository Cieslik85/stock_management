// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ children, roles = [] }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
