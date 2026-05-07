import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { ScenarioCard } from '../components/ScenarioCard';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { useApi } from '../hooks/useApi';
import { useDreamLife } from '../context/DreamLifeContext';
import type { Scenario } from '../types/api';

export const ScenariosPage = () => {
  const { data, loading, error, refetch, setData } = useApi<Scenario[]>(
    () => api.listScenarios(),
    [],
  );
  const { setInputs } = useDreamLife();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleLoad = useCallback(
    (scenario: Scenario) => {
      setInputs({
        monthlyExpenses: scenario.monthlyExpenses,
        savingsGoalPct: scenario.savingsGoalPct,
        investmentGoalPct: scenario.investmentGoalPct,
        lifestyleExtras: scenario.lifestyleExtras,
      });
      navigate('/calculator');
    },
    [setInputs, navigate],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setActionError(null);
      try {
        await api.deleteScenario(id);
        setData((prev) => (prev ?? []).filter((s) => s.id !== id));
      } catch (err) {
        setActionError(
          err instanceof ApiError
            ? err.message
            : 'No se pudo eliminar el escenario',
        );
      }
    },
    [setData],
  );

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Mis escenarios</h2>
        <p className="text-sm text-slate-500">
          Compara distintas configuraciones financieras y carga la que más te
          convenga en la calculadora.
        </p>
      </header>

      {actionError && (
        <ErrorView message={actionError} onRetry={() => setActionError(null)} />
      )}

      {loading && <LoadingView label="Cargando escenarios..." />}
      {error && !loading && <ErrorView message={error} onRetry={refetch} />}
      {!loading && !error && data && data.length === 0 && (
        <EmptyView
          title="No tienes escenarios guardados"
          description="Crea uno desde la calculadora para compararlo más tarde."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/calculator')}
            >
              Ir a la calculadora
            </button>
          }
        />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onLoad={handleLoad}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
