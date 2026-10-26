import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MyRides from './pages/MyRides';
import CustomerDashboard from './pages/CustomerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import BookRide from './pages/BookRide';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import DriverRegistration from './pages/DriverRegistration';

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className='flex min-h-screen bg-slate-950'>
      {' '}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} onLogout={logout} />
      <div className='min-w-0 flex-1'>
        <Topbar user={user} onMenuClick={() => setSidebarOpen(true)} />

        <main className='p-4 sm:p-6 lg:p-8'>{children}</main>
      </div>
    </div>
  );
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-950 text-white'>
        Loading...{' '}
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === 'DRIVER' ? '/driver-dashboard' : '/'}
        replace
      />
    );
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path='/login'
        element={
          <PublicOnlyRoute>
            {' '}
            <Login />{' '}
          </PublicOnlyRoute>
        }
      />

      <Route
        path='/register'
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        path='/register-driver'
        element={
          <PublicOnlyRoute>
            <DriverRegistration />
          </PublicOnlyRoute>
        }
      />

      {/* Routes requiring authentication */}
      <Route element={<ProtectedRoute />}>
        {/* Customer dashboard */}
        <Route element={<RoleProtectedRoute allowedRoles={['CUSTOMER']} />}>
          <Route
            path='/'
            element={
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path='/book-ride'
            element={
              <DashboardLayout>
                <BookRide />
              </DashboardLayout>
            }
          />
          <Route
            path='/my-rides'
            element={
              <DashboardLayout>
                <MyRides />
              </DashboardLayout>
            }
          />
        </Route>

        {/* Driver dashboard */}
        <Route element={<RoleProtectedRoute allowedRoles={['DRIVER']} />}>
          <Route
            path='/driver-dashboard'
            element={
              <DashboardLayout>
                <DriverDashboard />
              </DashboardLayout>
            }
          />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {' '}
      <AuthProvider>
        {' '}
        <AppRoutes />{' '}
      </AuthProvider>{' '}
    </BrowserRouter>
  );
}
