export default function StatCard({ label, title, value, hint, icon: Icon, color = 'amber' }) {
  const colorClasses = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const displayLabel = title || label;
  const colorClass = colorClasses[color] || colorClasses.amber;

  return (
    <div className={`${colorClass} border rounded-2xl p-6 space-y-3`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{displayLabel}</p>
          <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
        </div>
        {Icon && <Icon className="text-2xl opacity-50" />}
      </div>
      {hint && <p className="text-xs opacity-60 mt-1">{hint}</p>}
    </div>
  );
}
