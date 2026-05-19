interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface SegmentedToggleProps<T extends string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  hint?: string;
}

export const SegmentedToggle = <T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: SegmentedToggleProps<T>) => {
  return (
    <div>
      {label && <div className="label">{label}</div>}
      <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex w-full rounded-lg border border-slate-300 bg-white p-1"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={opt.hint}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
};
