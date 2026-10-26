import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Navigation,
  CalendarDays,
  IndianRupee,
  CarFront,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  Route,
  History,
} from 'lucide-react';

import { cancelRide } from '../api/rideApi';
import { useRides } from '../hooks/useRides';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import StatusBadge from '../components/common/StatusBadge';
import {
  formatDate,
  formatCurrency,
  formatDistance,
} from '../utils/formatters';

const ACTIVE_STATUSES = [
  'REQUESTED',
  'ACCEPTED',
  'DRIVER_ASSIGNED',
  'IN_PROGRESS',
];

const STATUS_FILTERS = [
  { label: 'All rides', value: 'ALL' },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Driver assigned', value: 'DRIVER_ASSIGNED' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

function normalizeStatus(status) {
  return String(status ?? '')
    .trim()
    .toUpperCase();
}

function getRideDate(ride) {
  return ride.createdAt ?? ride.requestedAt ?? ride.updatedAt ?? null;
}

function getRideId(ride) {
  return ride.id ?? ride.rideId;
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className='rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-sm text-slate-400'>{title}</p>

          <p className='mt-2 text-2xl font-bold text-white sm:text-3xl'>
            {value}
          </p>

          <p className='mt-1 text-xs text-slate-500'>{description}</p>
        </div>

        <div className='rounded-xl bg-indigo-500/10 p-3 text-indigo-400'>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onBookRide, hasFilters }) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-5 py-12 text-center sm:py-16'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400'>
        <CarFront size={30} />
      </div>

      <h3 className='mt-5 text-lg font-semibold text-white'>
        {hasFilters ? 'No matching rides' : 'Your journey starts here'}
      </h3>

      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400'>
        {hasFilters
          ? 'Try changing your search term or selecting a different ride status.'
          : "You haven't booked any rides yet. Book your first ride and track its progress here."}
      </p>

      <button
        type='button'
        onClick={onBookRide}
        className='mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950'
      >
        <Plus size={18} />
        Book a ride
      </button>
    </div>
  );
}

function RideCard({ ride, cancellingId, onCancel }) {
  const rideId = getRideId(ride);
  const status = normalizeStatus(ride.status);
  const isCancelling = String(cancellingId) === String(rideId);

  const canCancel = status === 'REQUESTED';

  return (
    <article className='overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 transition hover:border-slate-700'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-5'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400'>
            <CarFront size={22} />
          </div>

          <div className='min-w-0'>
            <p className='truncate font-semibold text-white'>Ride #{rideId}</p>

            <p className='mt-1 flex items-center gap-1.5 text-xs text-slate-400'>
              <CalendarDays size={13} />
              {formatDate(getRideDate(ride))}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className='grid gap-5 p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-center'>
        <div className='min-w-0 space-y-5'>
          <div className='flex gap-3'>
            <div className='flex flex-col items-center pt-1'>
              <span className='h-3 w-3 rounded-full border-2 border-emerald-400' />

              <span className='my-1 min-h-8 w-px flex-1 border-l border-dashed border-slate-600' />

              <span className='h-3 w-3 rounded-full border-2 border-rose-400' />
            </div>

            <div className='min-w-0 flex-1 space-y-4'>
              <div>
                <p className='text-xs text-slate-500'>PICKUP LOCATION</p>

                <p className='mt-1 break-words text-sm font-medium text-slate-200'>
                  {ride.pickupAddress || 'Pickup location unavailable'}
                </p>
              </div>

              <div>
                <p className='text-xs text-slate-500'>DROP-OFF LOCATION</p>

                <p className='mt-1 break-words text-sm font-medium text-slate-200'>
                  {ride.dropoffAddress || 'Drop-off location unavailable'}
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800 pt-4 text-sm text-slate-400'>
            <span className='inline-flex items-center gap-1.5'>
              <Route size={15} />
              {formatDistance(ride.distanceKm)}
            </span>

            <span className='inline-flex items-center gap-1.5'>
              <Clock3 size={15} />
              {status === 'COMPLETED'
                ? 'Journey completed'
                : status === 'CANCELLED'
                  ? 'Ride cancelled'
                  : 'Ride requested'}
            </span>
          </div>
        </div>

        <div className='flex flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4 md:min-w-36 md:flex-col md:items-end md:border-t-0 md:pt-0'>
          <div>
            <p className='text-xs text-slate-500'>ESTIMATED FARE</p>

            <p className='mt-1 flex items-center text-xl font-bold text-white'>
              <IndianRupee size={19} />
              {formatCurrency(ride.finalFare ?? ride.estimatedFare)}
            </p>
          </div>

          {canCancel && (
            <button
              type='button'
              onClick={() => onCancel(ride)}
              disabled={isCancelling}
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-3 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isCancelling ? (
                <>
                  <RefreshCw size={15} className='animate-spin' />
                  Cancelling
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  Cancel ride
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyRides() {
  const navigate = useNavigate();

  const { rides, setRides, loading, error, refreshRides } = useRides();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const filteredRides = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return rides.filter((ride) => {
      const status = normalizeStatus(ride.status);

      const matchesSearch =
        !search ||
        String(getRideId(ride) ?? '')
          .toLowerCase()
          .includes(search) ||
        String(ride.pickupAddress ?? '')
          .toLowerCase()
          .includes(search) ||
        String(ride.dropoffAddress ?? '')
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        selectedStatus === 'ALL' || status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [rides, searchTerm, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: rides.length,
      active: rides.filter((ride) =>
        ACTIVE_STATUSES.includes(normalizeStatus(ride.status))
      ).length,
      completed: rides.filter(
        (ride) => normalizeStatus(ride.status) === 'COMPLETED'
      ).length,
      cancelled: rides.filter(
        (ride) => normalizeStatus(ride.status) === 'CANCELLED'
      ).length,
    };
  }, [rides]);

  async function handleCancel(ride) {
    const rideId = getRideId(ride);

    if (rideId == null) {
      setActionError('Unable to cancel this ride because its ID is missing.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel ride #${rideId}?`
    );

    if (!confirmed) return;

    setActionError('');
    setCancellingId(rideId);

    try {
      await cancelRide(rideId);

      // Update the UI immediately after the server confirms cancellation.
      setRides((currentRides) =>
        currentRides.map((currentRide) =>
          String(getRideId(currentRide)) === String(rideId)
            ? { ...currentRide, status: 'CANCELLED' }
            : currentRide
        )
      );

      // Reconcile the displayed data with the server.
      await refreshRides();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Unable to cancel the ride. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  }

  function clearFilters() {
    setSearchTerm('');
    setSelectedStatus('ALL');
  }

  const hasFilters = searchTerm.trim().length > 0 || selectedStatus !== 'ALL';

  return (
    <div className='mx-auto w-full max-w-7xl space-y-6 pb-8'>
      {/* Page heading */}
      <section className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <div className='mb-2 flex items-center gap-2 text-sm text-indigo-400'>
            <History size={16} />
            Ride history
          </div>

          <h1 className='text-2xl font-bold tracking-tight text-white sm:text-3xl'>
            My Rides
          </h1>

          <p className='mt-2 text-sm leading-6 text-slate-400'>
            Manage your bookings and keep track of your journeys.
          </p>
        </div>

        <div className='flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={refreshRides}
            disabled={loading}
            className='inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50'
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type='button'
            onClick={() => navigate('/book-ride')}
            className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500'
          >
            <Plus size={17} />
            Book a ride
          </button>
        </div>
      </section>

      {/* Error states */}
      {error && <ErrorAlert message={error} onRetry={refreshRides} />}

      {actionError && (
        <ErrorAlert
          message={actionError}
          onDismiss={() => setActionError('')}
        />
      )}

      {/* Statistics */}
      <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          title='Total rides'
          value={stats.total}
          icon={CarFront}
          description='All your bookings'
        />

        <StatCard
          title='Active rides'
          value={stats.active}
          icon={Navigation}
          description='Currently underway or awaiting pickup'
        />

        <StatCard
          title='Completed'
          value={stats.completed}
          icon={CheckCircle2}
          description='Successfully completed journeys'
        />

        <StatCard
          title='Cancelled'
          value={stats.cancelled}
          icon={XCircle}
          description='Cancelled bookings'
        />
      </section>

      {/* Search and filter */}
      <section className='rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px_auto]'>
          <div className='relative'>
            <Search
              size={18}
              className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500'
            />

            <input
              type='search'
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Search ride ID or location...'
              aria-label='Search rides by ID or location'
              className='w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            />
          </div>

          <div className='relative'>
            <Filter
              size={16}
              className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500'
            />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              aria-label='Filter rides by status'
              className='w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              type='button'
              onClick={clearFilters}
              className='rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800'
            >
              Clear filters
            </button>
          )}
        </div>

        <div className='mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500'>
          <span>
            Showing {filteredRides.length} of {rides.length} rides
          </span>

          {hasFilters && (
            <span className='text-indigo-400'>Filters applied</span>
          )}
        </div>
      </section>

      {/* Ride list */}
      <section className='space-y-4'>
        {loading && rides.length === 0 ? (
          <div className='flex min-h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50'>
            <LoadingSpinner />
          </div>
        ) : filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <RideCard
              key={getRideId(ride)}
              ride={ride}
              cancellingId={cancellingId}
              onCancel={handleCancel}
            />
          ))
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onBookRide={() => navigate('/book-ride')}
          />
        )}
      </section>

      {/* Footer information */}
      {rides.length > 0 && (
        <div className='flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4'>
          <div className='mt-0.5 text-indigo-400'>
            <ArrowRight size={17} />
          </div>

          <p className='text-xs leading-5 text-slate-400'>
            Ride statuses and fares are provided by the RideFlow server.
            Cancellation is available only for rides that are still in the
            requested state. Your server must validate ownership and status
            before processing a cancellation.
          </p>
        </div>
      )}
    </div>
  );
}
