import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  CarFront,
  ArrowRight,
  ArrowLeft,
  IndianRupee,
  Route,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react';

import axiosInstance from '../api/axiosInstance';

const BASE_FARE = 50;
const PER_KM_RATE = 12;

export default function BookRide() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    distanceKm: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const distance = Number(formData.distanceKm);

  const estimatedFare =
    formData.distanceKm.trim() !== '' &&
    Number.isFinite(distance) &&
    distance > 0
      ? BASE_FARE + distance * PER_KM_RATE
      : null;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  function validateForm() {
    if (!formData.pickupAddress.trim()) {
      return 'Please enter your pickup address.';
    }

    if (!formData.dropoffAddress.trim()) {
      return 'Please enter your destination address.';
    }

    if (
      formData.pickupAddress.trim().toLowerCase() ===
      formData.dropoffAddress.trim().toLowerCase()
    ) {
      return 'Pickup and destination must be different.';
    }

    if (
      formData.distanceKm.trim() === '' ||
      !Number.isFinite(distance) ||
      distance <= 0
    ) {
      return 'Please enter a valid distance greater than zero.';
    }

    if (distance > 1000) {
      return 'Please enter a distance of 1000 km or less.';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axiosInstance.post('/api/rides', {
        pickupAddress: formData.pickupAddress.trim(),
        dropoffAddress: formData.dropoffAddress.trim(),
        distanceKm: distance,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          (err.response?.status === 401
            ? 'Your session has expired. Please sign in again.'
            : err.response?.status === 403
              ? 'Your account is not permitted to request a ride.'
              : 'Unable to book your ride. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  if (success) {
    return (
      <div className='mx-auto max-w-2xl py-8'>
        {' '}
        <div className='rounded-3xl border border-emerald-500/20 bg-slate-900 p-8 text-center sm:p-12'>
          {' '}
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400'>
            {' '}
            <CheckCircle2 size={34} />{' '}
          </div>
          <h1 className='mt-6 text-2xl font-bold text-white'>
            Ride request submitted!
          </h1>
          <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400'>
            Your ride request has been submitted successfully. You can check its
            status in your ride history.
          </p>
          <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => navigate('/my-rides')}
              className='rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500'
            >
              View My Rides
            </button>

            <button
              type='button'
              onClick={() => navigate('/')}
              className='rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800'
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl space-y-7 text-white'>
      {/* Page introduction */}{' '}
      <section>
        {' '}
        <Link
          to='/'
          className='mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white'
        >
          {' '}
          <ArrowLeft size={17} />
          Back to Dashboard{' '}
        </Link>
        <div className='flex items-start gap-4'>
          <div className='rounded-2xl bg-indigo-500/10 p-4 text-indigo-400'>
            <CarFront size={28} />
          </div>

          <div>
            <h2 className='text-2xl font-bold sm:text-3xl'>Book a Ride</h2>

            <p className='mt-2 text-sm leading-6 text-slate-400 sm:text-base'>
              Enter your journey details to request your next ride.
            </p>
          </div>
        </div>
      </section>
      {/* Booking form and fare summary */}
      <div className='grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]'>
        <section className='rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-8'>
          <h3 className='text-lg font-semibold'>Journey Details</h3>

          <p className='mt-1 text-sm text-slate-400'>
            Where would you like to be picked up?
          </p>

          <form onSubmit={handleSubmit} className='mt-7 space-y-6'>
            {/* Pickup */}
            <div>
              <label
                htmlFor='pickupAddress'
                className='mb-2 block text-sm font-medium text-slate-300'
              >
                Pickup Address
              </label>

              <div className='relative'>
                <MapPin
                  size={19}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400'
                />

                <input
                  id='pickupAddress'
                  name='pickupAddress'
                  type='text'
                  required
                  maxLength={255}
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder='Enter your pickup location'
                  autoComplete='street-address'
                  className={inputClass}
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label
                htmlFor='dropoffAddress'
                className='mb-2 block text-sm font-medium text-slate-300'
              >
                Destination Address
              </label>

              <div className='relative'>
                <Navigation
                  size={19}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-red-400'
                />

                <input
                  id='dropoffAddress'
                  name='dropoffAddress'
                  type='text'
                  required
                  maxLength={255}
                  value={formData.dropoffAddress}
                  onChange={handleChange}
                  placeholder='Where do you want to go?'
                  className={inputClass}
                />
              </div>
            </div>

            {/* Distance */}
            <div>
              <label
                htmlFor='distanceKm'
                className='mb-2 block text-sm font-medium text-slate-300'
              >
                Estimated Distance
              </label>

              <div className='relative'>
                <Route
                  size={19}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400'
                />

                <input
                  id='distanceKm'
                  name='distanceKm'
                  type='number'
                  required
                  min='0.1'
                  max='1000'
                  step='0.1'
                  value={formData.distanceKm}
                  onChange={handleChange}
                  placeholder='Distance in kilometres'
                  className={inputClass}
                />
              </div>

              <p className='mt-2 text-xs leading-5 text-slate-500'>
                Enter an estimated distance for now. Route-based distance
                calculation can be integrated later.
              </p>
            </div>

            {/* Validation error */}
            {error && (
              <div
                role='alert'
                className='flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300'
              >
                <AlertCircle size={19} className='mt-0.5 shrink-0' />
                <p>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className='animate-spin' />
                  Submitting Request...
                </>
              ) : (
                <>
                  Confirm Ride Request
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Fare estimate */}
        <aside className='space-y-5'>
          <div className='overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 p-6'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-indigo-500/10 p-3 text-indigo-400'>
                <IndianRupee size={23} />
              </div>

              <div>
                <h3 className='font-semibold'>Fare Estimate</h3>
                <p className='text-xs text-slate-400'>Estimated journey cost</p>
              </div>
            </div>

            <p className='mt-7 text-sm text-slate-400'>Estimated fare</p>

            <p className='mt-2 text-4xl font-bold text-white'>
              {estimatedFare == null ? '₹ —' : formatFare(estimatedFare)}
            </p>

            <div className='mt-6 space-y-3 border-t border-slate-700 pt-5 text-sm'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-slate-400'>Base fare</span>
                <span className='text-slate-200'>{formatFare(BASE_FARE)}</span>
              </div>

              <div className='flex items-center justify-between gap-3'>
                <span className='text-slate-400'>Distance charge</span>
                <span className='text-slate-200'>
                  {estimatedFare == null
                    ? '₹ —'
                    : formatFare(distance * PER_KM_RATE)}
                </span>
              </div>

              <div className='flex items-center justify-between gap-3 border-t border-slate-700 pt-3 font-semibold'>
                <span>Total estimate</span>
                <span className='text-indigo-300'>
                  {estimatedFare == null ? '₹ —' : formatFare(estimatedFare)}
                </span>
              </div>
            </div>

            <p className='mt-5 text-xs leading-5 text-slate-500'>
              This is an indicative estimate using the current fare
              configuration. The server calculates the actual estimated fare
              when you submit your request.
            </p>
          </div>

          <div className='rounded-2xl border border-slate-800 bg-slate-900 p-5'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-emerald-500/10 p-3 text-emerald-400'>
                <CheckCircle2 size={21} />
              </div>

              <h3 className='font-semibold'>Booking Information</h3>
            </div>

            <ul className='mt-4 space-y-3 text-sm leading-6 text-slate-400'>
              <li>• Your request will be associated with your account.</li>
              <li>• Your fare is calculated by the backend.</li>
              <li>• You can check the request status in My Rides.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatFare(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}
