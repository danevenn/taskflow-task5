import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: 'default' | 'brand' | 'success' | 'warning';
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  default: 'text-slate-900',
  brand: 'text-brand-700',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
};

export const StatCard = ({
  label,
  value,
  hint,
  accent = 'default',
}: StatCardProps) => {
  return (
    <div className="card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${accentStyles[accent]}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
};
