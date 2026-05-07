interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint?: string;
}

export const SliderField = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  hint,
}: SliderFieldProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="label mb-0">
          {label}
        </label>
        <span className="text-sm font-semibold text-brand-700">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
};
