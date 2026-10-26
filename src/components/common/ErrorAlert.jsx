import { AlertCircle, RefreshCw, X } from 'lucide-react';

export default function ErrorAlert({ message, onRetry, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role='alert'
      className='flex flex-col gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 sm:flex-row sm:items-center sm:justify-between'
    >
      <div className='flex items-start gap-3'>
        <AlertCircle size={20} className='mt-0.5 shrink-0 text-rose-400' />

        <p className='break-words text-sm leading-6 text-rose-200'>{message}</p>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        {onRetry && (
          <button
            type='button'
            onClick={onRetry}
            className='inline-flex items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10'
          >
            <RefreshCw size={14} />
            Retry
          </button>
        )}

        {onDismiss && (
          <button
            type='button'
            onClick={onDismiss}
            aria-label='Dismiss error'
            className='rounded-lg p-2 text-rose-300 transition hover:bg-rose-500/10'
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
