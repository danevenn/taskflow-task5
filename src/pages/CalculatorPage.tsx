import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../api/client';
import { SliderField } from '../components/SliderField';
import { StatCard } from '../components/StatCard';
import { ErrorView, LoadingView } from '../components/StateViews';
import { Modal } from '../components/Modal';
import { SegmentedToggle } from '../components/SegmentedToggle';
import { IrpfBracketsTable } from '../components/IrpfBracketsTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useDreamLife } from '../context/DreamLifeContext';
import { formatCurrency } from '../utils/format';
import type { CalcResponse, TaxMode } from '../types/api';

export const CalculatorPage = () => {
  const { inputs, setInputs, resetInputs } = useDreamLife();
  const debounced = useDebouncedValue(inputs, 250);
  const [data, setData] = useState<CalcResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingScenario, setSavingScenario] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.calculate(debounced);
        if (!cancelled) setData(result);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : 'Error al calcular el salario',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    if (!savedToast) return;
    const handle = window.setTimeout(() => setSavedToast(null), 2500);
    return () => window.clearTimeout(handle);
  }, [savedToast]);

  const breakdownItems = useMemo(() => {
    if (!data) return [];
    const total = data.netMonthly + data.breakdown.taxes;
    const entries: { label: string; value: number; color: string }[] = [
      { label: 'Gastos', value: data.breakdown.expenses, color: 'bg-brand-500' },
      { label: 'Estilo de vida', value: data.breakdown.lifestyle, color: 'bg-amber-500' },
      { label: 'Ahorro', value: data.breakdown.savings, color: 'bg-emerald-500' },
      { label: 'Inversión', value: data.breakdown.investments, color: 'bg-violet-500' },
      { label: 'Impuestos', value: data.breakdown.taxes, color: 'bg-slate-400' },
    ];
    return entries.map((e) => ({
      ...e,
      pct: total > 0 ? (e.value / total) * 100 : 0,
    }));
  }, [data]);

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) return;
    setSavingScenario(true);
    try {
      await api.createScenario({
        name: scenarioName.trim(),
        monthlyExpenses: inputs.monthlyExpenses,
        savingsGoalPct: inputs.savingsGoalPct,
        investmentGoalPct: inputs.investmentGoalPct,
        lifestyleExtras: inputs.lifestyleExtras,
      });
      setSavedToast(`Escenario "${scenarioName.trim()}" guardado`);
      setScenarioName('');
      setScenarioModalOpen(false);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el escenario',
      );
    } finally {
      setSavingScenario(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      <section className="card p-5 space-y-5 self-start">
        <header>
          <h2 className="text-lg font-semibold text-slate-900">
            Tus parámetros
          </h2>
          <p className="text-xs text-slate-500">
            Ajusta los deslizadores para ver el cálculo en tiempo real.
          </p>
        </header>

        <div>
          <label htmlFor="exp" className="label">
            Gastos mensuales (€)
          </label>
          <input
            id="exp"
            type="number"
            min={0}
            step="50"
            className="input"
            value={inputs.monthlyExpenses}
            onChange={(e) =>
              setInputs({ monthlyExpenses: Number(e.target.value) || 0 })
            }
          />
        </div>

        <SliderField
          id="savings"
          label="Meta de ahorro"
          value={inputs.savingsGoalPct}
          onChange={(v) => setInputs({ savingsGoalPct: v })}
          min={0}
          max={50}
          suffix="%"
          hint="Porcentaje de tus gastos que quieres ahorrar cada mes"
        />
        <SliderField
          id="investment"
          label="Meta de inversión"
          value={inputs.investmentGoalPct}
          onChange={(v) => setInputs({ investmentGoalPct: v })}
          min={0}
          max={50}
          suffix="%"
          hint="Porcentaje destinado a inversión"
        />
        <SliderField
          id="lifestyle"
          label="Extras de estilo de vida (€)"
          value={inputs.lifestyleExtras}
          onChange={(v) => setInputs({ lifestyleExtras: v })}
          min={0}
          max={5000}
          step={50}
          suffix="€"
          hint="Vacaciones, hobbies, salidas..."
        />
        <div className="space-y-3 rounded-lg border border-slate-200 p-3">
          <SegmentedToggle<TaxMode>
            label="Cálculo del IRPF"
            value={inputs.taxMode}
            onChange={(v) => setInputs({ taxMode: v })}
            options={[
              {
                value: 'auto',
                label: 'Auto · tramos España',
                hint: 'Calcula el IRPF aplicando los tramos oficiales sobre el bruto anual',
              },
              {
                value: 'manual',
                label: 'Manual · % fijo',
                hint: 'Aplica un tipo plano que tú eliges',
              },
            ]}
          />
          {inputs.taxMode === 'manual' ? (
            <SliderField
              id="tax"
              label="Tipo impositivo manual"
              value={inputs.taxRatePct}
              onChange={(v) => setInputs({ taxRatePct: v })}
              min={0}
              max={55}
              suffix="%"
              hint="Aproximación plana de IRPF + cotizaciones"
            />
          ) : (
            <IrpfBracketsTable highlightYearlyGross={data?.grossYearly} />
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={() => setScenarioModalOpen(true)}
          >
            Guardar escenario
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={resetInputs}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="space-y-6">
        {loading && !data && <LoadingView label="Calculando salario..." />}
        {error && <ErrorView message={error} onRetry={() => setError(null)} />}
        {data && (
          <>
            <div className="grid sm:grid-cols-3 gap-3">
              <StatCard
                label="Salario neto/mes"
                value={formatCurrency(data.netMonthly)}
                accent="success"
                hint="Lo que necesitas en cuenta"
              />
              <StatCard
                label="Salario bruto/mes"
                value={formatCurrency(data.grossMonthly)}
                accent="brand"
                hint={
                  data.taxMode === 'auto'
                    ? `${data.effectiveTaxRatePct.toFixed(1)}% efectivo (tramos España)`
                    : `${data.effectiveTaxRatePct.toFixed(1)}% impositivo (manual)`
                }
              />
              <StatCard
                label="Bruto anual"
                value={formatCurrency(data.grossYearly)}
                accent="default"
                hint="Salario objetivo en negociaciones"
              />
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Distribución del bruto mensual
              </h3>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
                {breakdownItems.map((item) => (
                  <div
                    key={item.label}
                    className={item.color}
                    style={{ width: `${item.pct}%` }}
                    title={`${item.label}: ${formatCurrency(item.value, true)}`}
                  />
                ))}
              </div>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                {breakdownItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.value, true)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>

      <Modal
        open={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        title="Guardar escenario"
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="scenario-name" className="label">
              Nombre
            </label>
            <input
              id="scenario-name"
              className="input"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Ej. Vida en Madrid"
              maxLength={60}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setScenarioModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveScenario}
              disabled={savingScenario || !scenarioName.trim()}
            >
              {savingScenario ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      {savedToast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-emerald-600 text-white px-4 py-2 shadow-lg text-sm">
          {savedToast}
        </div>
      )}
    </div>
  );
};
