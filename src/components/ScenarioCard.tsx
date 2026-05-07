import type { Scenario } from '../types/api';
import { formatCurrency, formatPct } from '../utils/format';

interface ScenarioCardProps {
  scenario: Scenario;
  onLoad: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
}

export const ScenarioCard = ({
  scenario,
  onLoad,
  onDelete,
}: ScenarioCardProps) => {
  return (
    <article className="card p-4 flex flex-col gap-3">
      <header>
        <h3 className="text-base font-semibold text-slate-900">
          {scenario.name}
        </h3>
        <p className="text-xs text-slate-500">
          Guardado el{' '}
          {new Date(scenario.createdAt).toLocaleDateString('es-ES')}
        </p>
      </header>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Gastos</dt>
          <dd className="font-medium">
            {formatCurrency(scenario.monthlyExpenses)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Extras</dt>
          <dd className="font-medium">
            {formatCurrency(scenario.lifestyleExtras)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Ahorro</dt>
          <dd className="font-medium">{formatPct(scenario.savingsGoalPct)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Inversión</dt>
          <dd className="font-medium">
            {formatPct(scenario.investmentGoalPct)}
          </dd>
        </div>
      </dl>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onLoad(scenario)}
          className="btn-primary flex-1"
        >
          Cargar
        </button>
        <button
          type="button"
          onClick={() => onDelete(scenario.id)}
          className="btn-secondary"
          aria-label={`Eliminar escenario ${scenario.name}`}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
};
