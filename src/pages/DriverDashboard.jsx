import {
  CarFront,
  ClipboardList,
  History,
  ShieldCheck,
  ShieldAlert,
  Clock3,
  MapPin,
  ArrowUpRight,
  Power,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function DriverDashboard() {
  const { user } = useAuth();

  // Placeholder until the backend availability API is implemented.
  const isOnline = false;

  const stats = [
    {
      label: 'My Vehicles',
      value: '—',
      description: 'Registered vehicles',
      icon: CarFront,
    },
    {
      label: 'Ride Requests',
      value: '—',
      description: 'Waiting for your response',
      icon: ClipboardList,
    },
    {
      label: 'Completed Rides',
      value: '—',
      description: 'Your ride history',
      icon: History,
    },
  ];

  return (
    <div className='space-y-8 text-white'>
      {/* Welcome */}
      <section>
        <h2 className='text-2xl font-bold sm:text-3xl'>
          Welcome back, {user?.fullName || 'Driver'}!
        </h2>

        <p className='mt-2 text-sm text-slate-400 sm:text-base'>
          Here's your driving activity and what needs your attention.
        </p>
      </section>

      {/* Availability and verification */}
      <section className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {/* Availability */}
        <div className='rounded-2xl border border-slate-800 bg-slate-900 p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm text-slate-400'>Driving Availability</p>

              <h2 className='mt-2 text-xl font-semibold'>
                {isOnline ? "You're Online" : "You're Offline"}
              </h2>

              <p className='mt-2 text-sm text-slate-400'>
                {isOnline
                  ? "You're available to receive ride requests."
                  : "Go online when you're ready to drive."}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Power size={24} />
            </div>
          </div>

          <button
            type='button'
            disabled
            title='Availability updates will be enabled after the backend API is implemented.'
            className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white opacity-60'
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>

          <p className='mt-3 text-xs text-slate-500'>
            Availability controls will be enabled after the backend endpoint is
            implemented.
          </p>
        </div>

        {/* Verification */}
        <div className='rounded-2xl border border-slate-800 bg-slate-900 p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm text-slate-400'>Driver Verification</p>

              <h2 className='mt-2 text-xl font-semibold'>
                Verification Pending
              </h2>

              <p className='mt-2 text-sm leading-6 text-slate-400'>
                Your driving license must be verified before you can accept
                rides.
              </p>
            </div>

            <div className='rounded-xl bg-amber-500/10 p-3 text-amber-400'>
              <ShieldAlert size={24} />
            </div>
          </div>

          <div className='mt-6 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300'>
            <Clock3 size={18} />
            <span>Awaiting license verification</span>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <h2 className='mb-4 text-lg font-semibold'>Your Overview</h2>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className='rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500/40'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-400'>{stat.label}</span>

                  <div className='rounded-xl bg-indigo-500/10 p-3 text-indigo-400'>
                    <Icon size={21} />
                  </div>
                </div>

                <p className='mt-5 text-3xl font-bold'>{stat.value}</p>

                <p className='mt-2 text-sm text-slate-500'>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Getting Started */}
      <section className='rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8'>
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-indigo-500/10 p-3 text-indigo-400'>
            <ShieldCheck size={23} />
          </div>

          <div>
            <h2 className='text-lg font-semibold'>Get Ready to Drive</h2>

            <p className='mt-1 text-sm text-slate-400'>
              Complete these steps to prepare your driver account.
            </p>
          </div>
        </div>

        <div className='mt-6 space-y-4'>
          <div className='flex items-center gap-4 rounded-xl border border-slate-800 p-4'>
            <div className='rounded-lg bg-indigo-500/10 p-2 text-indigo-400'>
              <ShieldCheck size={20} />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='font-medium'>Submit your driving license</p>

              <p className='mt-1 text-sm text-slate-400'>
                Make sure your license details are correct.
              </p>
            </div>

            <Clock3 size={18} className='text-amber-400' />
          </div>

          <div className='flex items-center gap-4 rounded-xl border border-slate-800 p-4'>
            <div className='rounded-lg bg-indigo-500/10 p-2 text-indigo-400'>
              <CarFront size={20} />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='font-medium'>Register your vehicle</p>

              <p className='mt-1 text-sm text-slate-400'>
                Add your vehicle details and registration number.
              </p>
            </div>

            <ArrowUpRight size={18} className='text-slate-500' />
          </div>

          <div className='flex items-center gap-4 rounded-xl border border-slate-800 p-4'>
            <div className='rounded-lg bg-indigo-500/10 p-2 text-indigo-400'>
              <MapPin size={20} />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='font-medium'>Start receiving rides</p>

              <p className='mt-1 text-sm text-slate-400'>
                Complete verification before accepting rides.
              </p>
            </div>

            <Clock3 size={18} className='text-slate-500' />
          </div>
        </div>
      </section>
    </div>
  );
}
