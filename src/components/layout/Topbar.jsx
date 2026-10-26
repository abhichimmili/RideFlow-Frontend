import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Customer Dashboard',
  '/driver-dashboard': 'Driver Dashboard',
  '/admin-dashboard': 'Admin Dashboard',
  '/book-ride': 'Book a Ride',
  '/my-rides': 'My Rides',
  '/profile': 'My Profile',
  '/driver-profile': 'Driver Profile',
  '/vehicles': 'My Vehicles',
  '/driver/ride-requests': 'Ride Requests',
  '/driver/ride-history': 'Ride History',
  '/driver/earnings': 'My Earnings',
  '/admin/drivers': 'Driver Verification',
  '/admin/vehicles': 'Vehicle Verification',
};

export default function Topbar({ user, onMenuClick }) {
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'RideFlow';

  const initial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className='sticky top-0 z-20 flex min-h-20 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8'>
      {/* Current page title */}{' '}
      <div className='flex min-w-0 items-center gap-3'>
        {' '}
        <button
          type='button'
          onClick={onMenuClick}
          aria-label='Open navigation menu'
          className='shrink-0 rounded-xl border border-slate-800 p-2.5 text-slate-300 transition hover:bg-slate-900 md:hidden'
        >
          {' '}
          <Menu size={21} />{' '}
        </button>
        <h1 className='truncate text-lg font-semibold text-white sm:text-xl'>
          {pageTitle}
        </h1>
      </div>
      {/* Actions */}
      <div className='flex shrink-0 items-center gap-3'>
        <button
          type='button'
          aria-label='Notifications'
          className='relative rounded-xl border border-slate-800 p-2.5 text-slate-400 transition hover:bg-slate-900 hover:text-white'
        >
          <Bell size={19} />
        </button>

        {/* Profile avatar */}
        <div
          title={user?.fullName || 'User'}
          aria-label={`Profile for ${user?.fullName || 'User'}`}
          className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white'
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
