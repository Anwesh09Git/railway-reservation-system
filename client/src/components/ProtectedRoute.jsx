import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullPage message="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  if (!adminOnly && !user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
