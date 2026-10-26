import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Clock3,
  History,
  MapPin,
  Navigation,
  Plus,
  Route,
  Wallet,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useRides } from '../hooks/useRides';

import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

import {
  formatCurrency,
  formatDate,
  formatDistance,
} from '../utils/formatters';

const ACTIVE_STATUSES = [
  'REQUESTED',
  'ACCEPTED',
  'DRIVER_ASSIGNED',
  'IN_PROGRESS',
];

function normalizeStatus(status) {
  return String(status ?? '')
    .trim()
    .toUpperCase();
}

function getRideId(ride) {
  return ride.id ?? ride.rideId;
}

function getRideDate(ride) {
  return ride.createdAt ?? ride.requestedAt ?? ride.updatedAt ?? null;
}

function getRideFare(ride) {
  return ride.finalFare ?? ride.estimatedFare;
}

function RideRoute({ ride }) {
  return (
    <div className='flex min-w-0 gap-3'>
      <div className='flex flex-col items-center pt-1'>
        <span className='h-3 w-3 rounded-full border-2 border-emerald-400' />

        <span className='my-1 min-h-6 w-px flex-1 border-l border-dashed border-slate-600' />

        <span className='h-3 w-3 rounded-full border-2 border-rose-400' />
      </div>

      <div className='min-w-0 flex-1 space-y-3'>
        <div>
          <p className='text-xs text-slate-500'>PICKUP</p>

          <p className='mt-1 break-words text-sm text-slate-200'>
            {ride.pickupAddress || 'Pickup location unavailable'}
          </p>
        </div>

        <div>
          <p className='text-xs text-slate-500'>DROP-OFF</p>

          <p className='mt-1 break-words text-sm text-slate-200'>
            {ride.dropoffAddress || 'Drop-off location unavailable'}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecentRideCard({ ride }) {
  const rideId = getRideId(ride);
  const status = normalizeStatus(ride.status);

  return (
    <article className='rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700 sm:p-5'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400'>
            <CarFront size={20} />
          </div>

          <div className='min-w-0'>
            <h3 className='font-semibold text-white'>Ride #{rideId}</h3>

            <p className='mt-1 text-xs text-slate-500'>
              {formatDate(getRideDate(ride))}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className='mt-5'>
        <RideRoute ride={ride} />
      </div>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4'>
        <div className='flex flex-wrap gap-4 text-xs text-slate-400'>
          <span className='inline-flex items-center gap-1.5'>
            <Route size={14} />
            {formatDistance(ride.distanceKm)}
          </span>

          <span className='inline-flex items-center gap-1.5'>
            <Clock3 size={14} />
            {status === 'COMPLETED'
              ? 'Completed'
              : status === 'CANCELLED'
                ? 'Cancelled'
                : 'Ride status'}
          </span>
        </div>

        <p className='text-base font-bold text-white'>
          ₹{formatCurrency(getRideFare(ride))}
        </p>
      </div>
    </article>
  );
}

function QuickAction({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='group flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-indigo-500/40 hover:bg-slate-900 sm:p-5'
    >
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20'>
        <Icon size={23} />
      </div>

      <div className='min-w-0 flex-1'>
        <h3 className='font-semibold text-white'>{title}</h3>

        <p className='mt-1 text-sm leading-5 text-slate-400'>{description}</p>
      </div>

      <ArrowRight
        size={18}
        className='shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-400'
      />
    </button>
  );
}

function EmptyRecentRides({ onBookRide }) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-10 text-center'>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400'>
        <CarFront size={26} />
      </div>

      <h3 className='mt-4 font-semibold text-white'>No rides yet</h3>

      <p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400'>
        Your recent journeys will appear here after you book a ride.
      </p>

      <button
        type='button'
        onClick={onBookRide}
        className='mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500'
      >
        <Plus size={17} />
        Book your first ride
      </button>
    </div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { rides, loading, error, refreshRides } = useRides();

  const stats = useMemo(() => {
    const activeRides = rides.filter((ride) =>
      ACTIVE_STATUSES.includes(normalizeStatus(ride.status))
    );

    const completedRides = rides.filter(
      (ride) => normalizeStatus(ride.status) === 'COMPLETED'
    );

    const cancelledRides = rides.filter(
      (ride) => normalizeStatus(ride.status) === 'CANCELLED'
    );

    const totalSpent = completedRides.reduce((total, ride) => {
      const fare = Number(getRideFare(ride));

      return total + (Number.isFinite(fare) ? fare : 0);
    }, 0);

    return {
      total: rides.length,
      active: activeRides.length,
      completed: completedRides.length,
      cancelled: cancelledRides.length,
      totalSpent,
    };
  }, [rides]);

  const recentRides = useMemo(() => {
    return [...rides]
      .sort((a, b) => {
        const dateA = new Date(getRideDate(a) ?? 0).getTime();
        const dateB = new Date(getRideDate(b) ?? 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 3);
  }, [rides]);

  const displayName =
    user?.fullName || user?.name || user?.firstName || 'there';

  return (
    <div className='mx-auto w-full max-w-7xl space-y-8 pb-8'>
      {/* Welcome section */}
      <section className='relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 sm:p-8 lg:p-10'>
        <div className='pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl' />

        <div className='relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center'>
          <div className='max-w-2xl'>
            <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-300'>
              <Navigation size={14} />
              Your personal ride dashboard
            </div>

            <h1 className='text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl'>
              Welcome back, {displayName}!
            </h1>

            <p className='mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base'>
              Plan your next journey, manage your bookings, and keep all your
              rides in one place.
            </p>

            <button
              type='button'
              onClick={() => navigate('/book-ride')}
              className='mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950'
            >
              <Plus size={18} />
              Book a ride
              <ArrowRight size={16} />
            </button>
          </div>

          <div className='hidden shrink-0 items-center justify-center md:flex'>
            <div className='flex h-36 w-36 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10'>
              <CarFront size={72} className='text-indigo-300' />
            </div>
          </div>
        </div>
      </section>

      {/* API errors */}
      {error && <ErrorAlert message={error} onRetry={refreshRides} />}

      {/* Statistics */}
      <section>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-white'>
            Your ride overview
          </h2>

          <p className='mt-1 text-sm text-slate-400'>
            A summary of your bookings and completed journeys.
          </p>
        </div>

        {loading && rides.length === 0 ? (
          <div className='flex min-h-40 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50'>
            <LoadingSpinner message='Loading your dashboard...' />
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <StatCard
              title='Total rides'
              value={stats.total}
              icon={CarFront}
              description='All your bookings'
              iconClassName='bg-indigo-500/10 text-indigo-400'
            />

            <StatCard
              title='Active rides'
              value={stats.active}
              icon={Navigation}
              description='Awaiting pickup or underway'
              iconClassName='bg-sky-500/10 text-sky-400'
            />

            <StatCard
              title='Completed rides'
              value={stats.completed}
              icon={CheckCircle2}
              description='Successfully completed'
              iconClassName='bg-emerald-500/10 text-emerald-400'
            />

            <StatCard
              title='Completed ride fares'
              value={`${formatCurrency(stats.totalSpent)}`}
              icon={Wallet}
              description='Sum of recorded completed fares'
              iconClassName='bg-amber-500/10 text-amber-400'
            />
          </div>
        )}
      </section>

      {/* Recent rides */}
      <section>
        <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2 className='text-lg font-semibold text-white'>Recent rides</h2>

            <p className='mt-1 text-sm text-slate-400'>
              Your three most recent bookings.
            </p>
          </div>

          {rides.length > 0 && (
            <button
              type='button'
              onClick={() => navigate('/my-rides')}
              className='inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition hover:text-indigo-300'
            >
              View all rides
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {loading && rides.length === 0 ? (
          <div className='flex min-h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50'>
            <LoadingSpinner />
          </div>
        ) : recentRides.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
            {recentRides.map((ride) => (
              <RecentRideCard key={getRideId(ride)} ride={ride} />
            ))}
          </div>
        ) : !error ? (
          <EmptyRecentRides onBookRide={() => navigate('/book-ride')} />
        ) : null}
      </section>

      {/* Quick actions */}
      <section>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-white'>Quick actions</h2>

          <p className='mt-1 text-sm text-slate-400'>
            Get where you need to go with fewer steps.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <QuickAction
            icon={Plus}
            title='Book a ride'
            description='Enter your pickup and destination to request a journey.'
            onClick={() => navigate('/book-ride')}
          />

          <QuickAction
            icon={History}
            title='View ride history'
            description='Search your rides and review their current statuses.'
            onClick={() => navigate('/my-rides')}
          />

          <QuickAction
            icon={MapPin}
            title='Manage your profile'
            description='Review your account information and profile details.'
            onClick={() => navigate('/profile')}
          />

          <QuickAction
            icon={Wallet}
            title='Review completed fares'
            description='See the recorded fares for your completed rides.'
            onClick={() => navigate('/my-rides')}
          />
        </div>
      </section>

      {/* Footer note */}
      <div className='flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4'>
        <Route size={18} className='mt-0.5 shrink-0 text-indigo-400' />

        <p className='text-xs leading-5 text-slate-400'>
          Ride totals and fare summaries are calculated from the ride records
          returned by the server. The displayed completed-fare total is a
          customer-facing summary, not a payment ledger.
        </p>
      </div>
    </div>
  );
}
