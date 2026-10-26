import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navigation, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [success] = useState(() => {
    if (!location.state?.registered) {
      return '';
    }

    return location.state.accountType === 'DRIVER'
      ? 'Driver account created successfully. Please sign in.'
      : 'Customer account created successfully. Please sign in.';
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const user = await login(formData);

      const defaultDestination =
        user?.role === 'DRIVER'
          ? '/driver-dashboard'
          : user?.role === 'ADMIN'
            ? '/admin-dashboard'
            : '/';

      const requestedPath = location.state?.from?.pathname;

      // Only restore a requested path if it is permitted for this role.
      const roleAllowedPaths = {
        CUSTOMER: ['/'],
        DRIVER: ['/driver-dashboard'],
        ADMIN: ['/admin-dashboard'],
      };

      const allowedPaths = roleAllowedPaths[user?.role] || [];
      const destination =
        requestedPath && allowedPaths.includes(requestedPath)
          ? requestedPath
          : defaultDestination;

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10'>
      <div className='w-full max-w-md'>
        <Link to='/' className='mb-8 flex items-center justify-center gap-3'>
          <div className='rounded-xl bg-indigo-600 p-3 text-white'>
            <Navigation size={23} />
          </div>

          <span className='text-2xl font-bold text-white'>RideFlow</span>
        </Link>

        <div className='rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl sm:p-9'>
          <h1 className='text-2xl font-bold text-white'>Welcome back</h1>

          <p className='mt-2 text-sm text-slate-400'>
            Sign in to continue to RideFlow.
          </p>

          {success && (
            <p className='mt-4 text-sm text-emerald-400'>{success}</p>
          )}

          <form onSubmit={handleSubmit} className='mt-7 space-y-5'>
            <div>
              <label className='mb-2 block text-sm text-slate-300'>
                Email address
              </label>

              <div className='relative'>
                <Mail
                  size={18}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                />

                <input
                  required
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='you@example.com'
                  autoComplete='email'
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm text-slate-300'>
                Password
              </label>

              <div className='relative'>
                <Lock
                  size={18}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                />

                <input
                  required
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  autoComplete='current-password'
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <div
                role='alert'
                className='rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300'
              >
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-slate-400'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='font-medium text-indigo-400 hover:text-indigo-300'
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
