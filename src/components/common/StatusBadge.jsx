const STATUS_STYLES = {
  REQUESTED: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  ACCEPTED: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  DRIVER_ASSIGNED: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  IN_PROGRESS: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  COMPLETED: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  CANCELLED: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
};

const STATUS_LABELS = {
  REQUESTED: 'Requested',
  ACCEPTED: 'Accepted',
  DRIVER_ASSIGNED: 'Driver assigned',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function StatusBadge({ status }) {
  const normalizedStatus = String(status ?? 'UNKNOWN')
    .trim()
    .toUpperCase();

  const styles =
    STATUS_STYLES[normalizedStatus] ??
    'border-slate-700 bg-slate-800 text-slate-300';

  const label =
    STATUS_LABELS[normalizedStatus] ??
    normalizedStatus.replaceAll('_', ' ').toLowerCase();

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${styles}`}
    >
      <span className='mr-2 h-1.5 w-1.5 rounded-full bg-current' />
      {label}
    </span>
  );
}
