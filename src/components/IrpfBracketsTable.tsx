import { formatCurrency } from '../utils/format';

/** Tramos del IRPF general en España (ejercicio 2024/2025).
 *  Espejo de los del backend: ../../server/src/services/irpfBrackets.ts */
const FRONTEND_BRACKETS: ReadonlyArray<{ from: number; rate: number }> = [
  { from: 0, rate: 0.19 },
  { from: 12450, rate: 0.24 },
  { from: 20200, rate: 0.3 },
  { from: 35200, rate: 0.37 },
  { from: 60000, rate: 0.45 },
  { from: 300000, rate: 0.47 },
];

interface IrpfBracketsTableProps {
  highlightYearlyGross?: number;
}

export const IrpfBracketsTable = ({
  highlightYearlyGross,
}: IrpfBracketsTableProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-700">
        Tramos IRPF general (estatal · base liquidable)
      </p>
      <ul className="mt-2 space-y-1 text-xs text-slate-600">
        {FRONTEND_BRACKETS.map((b, i) => {
          const next = FRONTEND_BRACKETS[i + 1];
          const isActive =
            highlightYearlyGross !== undefined &&
            highlightYearlyGross > b.from &&
            (!next || highlightYearlyGross <= next.from);
          return (
            <li
              key={b.from}
              className={`flex items-center justify-between rounded px-2 py-0.5 ${
                isActive ? 'bg-brand-100 font-semibold text-brand-800' : ''
              }`}
            >
              <span>
                {next
                  ? `${formatCurrency(b.from)} – ${formatCurrency(next.from)}`
                  : `> ${formatCurrency(b.from)}`}
              </span>
              <span>{(b.rate * 100).toFixed(0)}%</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11px] text-slate-500 leading-snug">
        El tipo efectivo (impuestos / bruto) es siempre menor que el marginal
        más alto que apliques.
      </p>
    </div>
  );
};
