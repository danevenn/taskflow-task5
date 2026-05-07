import type { Expense } from '../types/api';
import { formatCurrency } from '../utils/format';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export const ExpenseList = ({
  expenses,
  onDelete,
  deletingId,
}: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-slate-500">
        Aún no has añadido ningún gasto.
      </div>
    );
  }

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="card overflow-hidden">
      <ul className="divide-y divide-slate-200">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">
                {expense.category}
              </p>
              <p className="text-xs text-slate-500">
                Añadido el{' '}
                {new Date(expense.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(expense.amount, true)}
              </span>
              <button
                type="button"
                onClick={() => onDelete(expense.id)}
                disabled={deletingId === expense.id}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="bg-slate-50 px-4 py-3 flex justify-between text-sm font-semibold text-slate-900">
        <span>Total mensual</span>
        <span>{formatCurrency(total, true)}</span>
      </div>
    </div>
  );
};
