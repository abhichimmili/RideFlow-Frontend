export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClassName = 'bg-indigo-500/10 text-indigo-400',
}) {
  return (
    <div className='rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700 sm:p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-sm text-slate-400'>{title}</p>

          <p className='mt-2 break-words text-2xl font-bold text-white sm:text-3xl'>
            {value}
          </p>

          {description && (
            <p className='mt-1 text-xs leading-5 text-slate-500'>
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`shrink-0 rounded-xl p-3 ${iconClassName}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );
}
