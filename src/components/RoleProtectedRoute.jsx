import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-950 text-white'>
        Checking your permissions...{' '}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
