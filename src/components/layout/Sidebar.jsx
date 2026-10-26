import { NavLink } from 'react-router-dom';
import {
  Navigation,
  LayoutDashboard,
  CarFront,
  History,
  UserRound,
  LogOut,
  X,
  UserRoundCheck,
  ClipboardList,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const customerNavigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Book a Ride',
    path: '/book-ride',
    icon: CarFront,
  },
  {
    label: 'My Rides',
    path: '/my-rides',
    icon: History,
  },
  {
    label: 'My Profile',
    path: '/profile',
    icon: UserRound,
  },
  {
    label: 'Become a Driver',
    path: '/register-driver',
    icon: UserRoundCheck,
  },
];

const driverNavigation = [
  {
    label: 'Driver Dashboard',
    path: '/driver-dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Driver Profile',
    path: '/driver-profile',
    icon: UserRound,
  },
  {
    label: 'My Vehicles',
    path: '/vehicles',
    icon: CarFront,
  },
  {
    label: 'Ride Requests',
    path: '/driver/ride-requests',
    icon: ClipboardList,
  },
  {
    label: 'Ride History',
    path: '/driver/ride-history',
    icon: History,
  },
  {
    label: 'Earnings',
    path: '/driver/earnings',
    icon: Wallet,
  },
  {
    label: 'My Account',
    path: '/profile',
    icon: UserRound,
  },
];

const adminNavigation = [
  {
    label: 'Admin Dashboard',
    path: '/admin-dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Driver Verification',
    path: '/admin/drivers',
    icon: UserRoundCheck,
  },
  {
    label: 'Vehicle Verification',
    path: '/admin/vehicles',
    icon: ShieldCheck,
  },
];

export default function Sidebar({ open, onClose, onLogout }) {
  const { user } = useAuth();

  const role = user?.role;

  let navigationItems = customerNavigation;
  let roleLabel = 'Customer';

  if (role === 'DRIVER') {
    navigationItems = driverNavigation;
    roleLabel = 'Driver';
  } else if (role === 'ADMIN') {
    navigationItems = adminNavigation;
    roleLabel = 'Administrator';
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type='button'
          aria-label='Close navigation menu'
          onClick={onClose}
          className='fixed inset-0 z-40 bg-black/60 lg:hidden'
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-800
          bg-slate-950 text-white
          transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen
          lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className='flex h-20 items-center justify-between border-b border-slate-800 px-6'>
          <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-indigo-600 p-2.5'>
              <Navigation size={22} />
            </div>

            <div>
              <h1 className='text-xl font-bold tracking-tight'>RideFlow</h1>

              <p className='text-xs text-slate-500'>{roleLabel} Portal</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type='button'
            onClick={onClose}
            aria-label='Close sidebar'
            className='rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden'
          >
            <X size={20} />
          </button>
        </div>

        {/* Role-based navigation */}
        <nav className='flex-1 space-y-1 overflow-y-auto px-4 py-6'>
          <p className='mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500'>
            Navigation
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className='border-t border-slate-800 p-4'>
          <button
            type='button'
            onClick={onLogout}
            className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400'
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>

          <p className='mt-4 text-center text-xs text-slate-600'>
            RideFlow © 2026
          </p>
        </div>
      </aside>
    </>
  );
}
