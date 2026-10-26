import {
  CarFront,
  Users,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Drivers',
    value: '—',
    description: 'Connected to backend soon',
    icon: Users,
  },
  {
    label: 'Registered Vehicles',
    value: '—',
    description: 'Connected to backend soon',
    icon: CarFront,
  },
  {
    label: 'Total Rides',
    value: '—',
    description: 'Connected to backend soon',
    icon: MapPin,
  },
];

function StatCard({ label, value, description, icon: Icon }) {
  return (
    <div className='rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-500/50'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-slate-400'>{label}</p>
        <div className='rounded-xl bg-indigo-500/10 p-3 text-indigo-400'>
          <Icon size={21} />
        </div>
      </div>

      <h3 className='mt-5 text-3xl font-bold text-white'>{value}</h3>

      <p className='mt-2 text-xs text-slate-500'>{description}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className='space-y-8'>
      <section className='relative isolate overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 sm:rounded-3xl sm:p-8 lg:p-10'>
        <div className='relative z-10 max-w-2xl'>
          <span className='rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300'>
            SMART MOBILITY PLATFORM
          </span>

          <h1 className='mt-5 text-3xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl'>
            Your journey to smarter mobility starts here.
          </h1>

          <p className='mt-4 max-w-xl text-sm leading-6 text-slate-300 md:text-base'>
            Manage drivers, vehicles, and rides from one central workspace.
            Build a connected and efficient ride-booking experience.
          </p>

          <div className='mt-7 flex flex-wrap gap-3'>
            <button className='flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500'>
              Explore Dashboard
              <ArrowUpRight size={17} />
            </button>

            <div className='flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300'>
              <Clock3 size={17} />
              Development environment
            </div>
          </div>
        </div>

        <div className='pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl' />
      </section>

      <section>
        <div className='mb-5'>
          <h2 className='text-xl font-semibold text-white'>
            Platform Overview
          </h2>
          <p className='mt-1 text-sm text-slate-400'>
            Live database metrics will be connected after API integration.
          </p>
        </div>

        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className='grid gap-5 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-800 bg-slate-900 p-6'>
          <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-emerald-500/10 p-3 text-emerald-400'>
              <TrendingUp size={22} />
            </div>

            <div>
              <h3 className='font-semibold text-white'>Ride Analytics</h3>
              <p className='text-sm text-slate-400'>
                Ride statistics will appear here.
              </p>
            </div>
          </div>

          <div className='mt-6 flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500'>
            Waiting for backend integration
          </div>
        </div>

        <div className='rounded-2xl border border-slate-800 bg-slate-900 p-6'>
          <h3 className='font-semibold text-white'>Quick Actions</h3>
          <p className='mt-1 text-sm text-slate-400'>
            Your main management modules will be available here.
          </p>

          <div className='mt-6 space-y-3'>
            {[
              ['Manage Drivers', 'Create and review driver profiles'],
              ['Manage Vehicles', 'Register vehicles for drivers'],
              ['Manage Rides', 'Review and create ride requests'],
            ].map(([title, description]) => (
              <div
                key={title}
                className='rounded-xl border border-slate-800 p-4 transition hover:border-indigo-500/40'
              >
                <h4 className='text-sm font-medium text-white'>{title}</h4>
                <p className='mt-1 text-xs text-slate-400'>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
