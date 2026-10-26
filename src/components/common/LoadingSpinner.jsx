import { LoaderCircle } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div
      role='status'
      className='flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-sm text-slate-400'
    >
      <LoaderCircle size={20} className='animate-spin' />
      {message}
    </div>
  );
}
