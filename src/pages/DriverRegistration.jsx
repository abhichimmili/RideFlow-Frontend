import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  licenseNumber: '',
};

export default function DriverRegistration() {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        '/api/auth/register-driver',
        formData
      );

      setSuccess(
        `Driver profile created successfully. Profile ID: ${response.data.id}`
      );

      setFormData(initialForm);

      // Registration does not automatically log the driver in.
      // The driver can sign in through the existing login page.
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        responseData?.message ||
          responseData?.error ||
          'Driver registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-slate-950 px-4 py-10 text-white'>
      <div className='mx-auto max-w-lg'>
        <div className='mb-8 text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.3em] text-sky-400'>
            RideFlow
          </p>

          <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>
            Become a Driver
          </h1>

          <p className='mt-3 text-slate-400'>
            Create your driver account and submit your license details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8'
        >
          {error && (
            <div
              role='alert'
              className='rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300'
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role='status'
              className='rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300'
            >
              {success}
            </div>
          )}

          <div>
            <label htmlFor='fullName' className='mb-2 block text-sm'>
              Full name
            </label>

            <input
              id='fullName'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              required
              maxLength={100}
              autoComplete='name'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500'
              placeholder='Enter your full name'
            />
          </div>

          <div>
            <label htmlFor='email' className='mb-2 block text-sm'>
              Email address
            </label>

            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={150}
              autoComplete='email'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label htmlFor='password' className='mb-2 block text-sm'>
              Password
            </label>

            <input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={72}
              autoComplete='new-password'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500'
              placeholder='At least 8 characters'
            />
          </div>

          <div>
            <label htmlFor='phone' className='mb-2 block text-sm'>
              Phone number
            </label>

            <input
              id='phone'
              name='phone'
              type='tel'
              inputMode='numeric'
              value={formData.phone}
              onChange={handleChange}
              required
              pattern='[0-9]{10}'
              maxLength={10}
              autoComplete='tel'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-sky-500'
              placeholder='10-digit mobile number'
            />
          </div>

          <div>
            <label htmlFor='licenseNumber' className='mb-2 block text-sm'>
              Driving license number
            </label>

            <input
              id='licenseNumber'
              name='licenseNumber'
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              maxLength={50}
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 uppercase outline-none focus:border-sky-500'
              placeholder='Enter license number'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? 'Registering...' : 'Register as Driver'}
          </button>

          <p className='text-center text-sm text-slate-400'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-sky-400 hover:text-sky-300'
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
