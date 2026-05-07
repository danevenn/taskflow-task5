import { useCallback, useMemo, useState } from 'react';
import { api, ApiError } from '../api/client';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { ErrorView, LoadingView } from '../components/StateViews';
import { useApi } from '../hooks/useApi';
import { useDreamLife } from '../context/DreamLifeContext';
import { formatCurrency } from '../utils/format';
import type { CreateExpenseInput, Expense } from '../types/api';

export const ExpensesPage = () => {
  const { data, loading, error, refetch, setData } = useApi<Expense[]>(
    () => api.listExpenses(),
    [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { hydrateFromExpenses } = useDreamLife();

  const total = useMemo(
    () => (data ?? []).reduce((acc, e) => acc + e.amount, 0),
    [data],
  );

  const handleCreate = useCallback(
    async (input: CreateExpenseInput) => {
      setSubmitting(true);
      setActionError(null);
      try {
        const created = await api.createExpense(input);
        setData((prev) => [...(prev ?? []), created]);
      } catch (err) {
        setActionError(
          err instanceof ApiError ? err.message : 'No se pudo crear el gasto',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [setData],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      setActionError(null);
      try {
        await api.deleteExpense(id);
        setData((prev) => (prev ?? []).filter((e) => e.id !== id));
      } catch (err) {
        setActionError(
          err instanceof ApiError
            ? err.message
            : 'No se pudo eliminar el gasto',
        );
      } finally {
        setDeletingId(null);
      }
    },
    [setData],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gastos mensuales</h2>
          <p className="text-sm text-slate-500">
            Añade tus categorías de gasto. La suma se sincronizará con la
            calculadora.
          </p>
        </div>
        {data && data.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => hydrateFromExpenses(total)}
          >
            Usar total ({formatCurrency(total)}) en calculadora
          </button>
        )}
      </header>

      <ExpenseForm onSubmit={handleCreate} submitting={submitting} />

      {actionError && (
        <ErrorView message={actionError} onRetry={() => setActionError(null)} />
      )}

      {loading && <LoadingView label="Cargando gastos..." />}
      {error && !loading && <ErrorView message={error} onRetry={refetch} />}
      {!loading && !error && data && (
        <ExpenseList
          expenses={data}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  );
};
