import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navigation,
  UserRound,
  CarFront,
  UserRoundPlus,
  Mail,
  Lock,
  Phone,
  IdCard,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  licenseNumber: '',
};

export default function Register() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('CUSTOMER');
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  function handleAccountTypeChange(type) {
    setAccountType(type);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (accountType === 'DRIVER' && !formData.licenseNumber.trim()) {
      setError('Please enter your driving license number.');
      return;
    }

    const endpoint =
      accountType === 'DRIVER'
        ? '/api/auth/register-driver'
        : '/api/auth/register';

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
    };

    if (accountType === 'DRIVER') {
      payload.licenseNumber = formData.licenseNumber.trim();
    }

    try {
      setLoading(true);

      await axiosInstance.post(endpoint, payload);

      navigate('/login', {
        replace: true,
        state: {
          registered: true,
          accountType,
        },
      });
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        responseData?.message ||
          responseData?.detail ||
          responseData?.error ||
          'Registration failed. Please try again.'
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
        {/* RideFlow Branding */}
        <Link
          to='/login'
          className='mb-8 flex items-center justify-center gap-3'
        >
          <div className='rounded-xl bg-indigo-600 p-3 text-white'>
            <Navigation size={23} />
          </div>

          <span className='text-2xl font-bold text-white'>RideFlow</span>
        </Link>

        {/* Registration Card */}
        <div className='rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-9'>
          <h1 className='text-2xl font-bold text-white'>Create your account</h1>

          <p className='mt-2 text-sm text-slate-400'>
            Join RideFlow and start your journey.
          </p>

          {/* Account Type Selector */}
          <div className='mt-6'>
            <p className='mb-3 text-sm font-medium text-slate-300'>
              Choose your account type
            </p>

            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => handleAccountTypeChange('CUSTOMER')}
                aria-pressed={accountType === 'CUSTOMER'}
                className={`rounded-xl border p-4 text-left transition ${
                  accountType === 'CUSTOMER'
                    ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-slate-700 bg-slate-950 hover:border-slate-600'
                }`}
              >
                <UserRound
                  size={21}
                  className={
                    accountType === 'CUSTOMER'
                      ? 'text-indigo-400'
                      : 'text-slate-400'
                  }
                />

                <span className='mt-3 block text-sm font-semibold text-white'>
                  Customer
                </span>

                <span className='mt-1 block text-xs text-slate-400'>
                  Book rides
                </span>
              </button>

              <button
                type='button'
                onClick={() => handleAccountTypeChange('DRIVER')}
                aria-pressed={accountType === 'DRIVER'}
                className={`rounded-xl border p-4 text-left transition ${
                  accountType === 'DRIVER'
                    ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-slate-700 bg-slate-950 hover:border-slate-600'
                }`}
              >
                <CarFront
                  size={21}
                  className={
                    accountType === 'DRIVER'
                      ? 'text-indigo-400'
                      : 'text-slate-400'
                  }
                />

                <span className='mt-3 block text-sm font-semibold text-white'>
                  Driver
                </span>

                <span className='mt-1 block text-xs text-slate-400'>
                  Drive with us
                </span>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
            {/* Full Name */}
            <div>
              <label
                htmlFor='fullName'
                className='mb-2 block text-sm text-slate-300'
              >
                Full name
              </label>

              <div className='relative'>
                <UserRoundPlus
                  size={18}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                />

                <input
                  id='fullName'
                  required
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete='name'
                  placeholder='Enter your full name'
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='mb-2 block text-sm text-slate-300'
              >
                Email address
              </label>

              <div className='relative'>
                <Mail
                  size={18}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                />

                <input
                  id='email'
                  required
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={150}
                  autoComplete='email'
                  placeholder='you@example.com'
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor='phone'
                className='mb-2 block text-sm text-slate-300'
              >
                Phone number
              </label>

              <div className='relative'>
                <Phone
                  size={18}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                />

                <input
                  id='phone'
                  required
                  type='tel'
                  inputMode='numeric'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  pattern='[0-9]{10}'
                  maxLength={10}
                  autoComplete='tel'
                  placeholder='10-digit mobile number'
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor='password'
                className='mb-2 block text-sm text-slate-300'
              >
                Password
              </label>

              <div className='relative'>
                <Lock
                  size={18}
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                />

                <input
                  id='password'
                  required
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={72}
                  autoComplete='new-password'
                  placeholder='At least 8 characters'
                  className={inputClass}
                />
              </div>
            </div>

            {/* Driver-only Field */}
            {accountType === 'DRIVER' && (
              <div>
                <label
                  htmlFor='licenseNumber'
                  className='mb-2 block text-sm text-slate-300'
                >
                  Driving license number
                </label>

                <div className='relative'>
                  <IdCard
                    size={18}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                  />

                  <input
                    id='licenseNumber'
                    required
                    name='licenseNumber'
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder='Enter license number'
                    className={inputClass}
                  />
                </div>

                <p className='mt-2 text-xs leading-5 text-slate-500'>
                  Your license must be verified before you can accept rides.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                role='alert'
                className='rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300'
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading
                ? 'Creating account...'
                : accountType === 'DRIVER'
                  ? 'Register as Driver'
                  : 'Create Customer Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className='mt-6 text-center text-sm text-slate-400'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-indigo-400 hover:text-indigo-300'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
