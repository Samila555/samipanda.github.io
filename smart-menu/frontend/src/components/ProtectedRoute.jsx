import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const loginPath = roles?.includes('cashier') ? '/cashier/login' : '/admin/login';
  if (loading) return <Loading fullScreen />;
  if (!user) return <Navigate to={loginPath} replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={loginPath} replace />;
  }
  return children;
}
