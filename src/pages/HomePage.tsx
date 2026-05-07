import { Link } from 'react-router-dom';

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="card p-5">
    <div className="text-2xl">{icon}</div>
    <h3 className="mt-2 font-semibold text-slate-900">{title}</h3>
    <p className="mt-1 text-sm text-slate-600">{description}</p>
  </div>
);

export const HomePage = () => {
  return (
    <div className="space-y-10">
      <section className="text-center max-w-2xl mx-auto">
        <span className="inline-block rounded-full bg-brand-100 text-brand-700 px-3 py-1 text-xs font-medium">
          Finanzas personales
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
          Calcula el salario que necesitas para tu vida ideal
        </h2>
        <p className="mt-3 text-slate-600">
          Define tus gastos mensuales, tus metas de ahorro e inversión, y los
          extras de estilo de vida para descubrir el ingreso bruto y neto que
          necesitas a final de mes.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/calculator" className="btn-primary">
            Abrir calculadora
          </Link>
          <Link to="/expenses" className="btn-secondary">
            Empezar por mis gastos
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Feature
          icon="📊"
          title="Seguimiento de gastos"
          description="Registra tus gastos mensuales por categoría y obtén un total automático."
        />
        <Feature
          icon="🎯"
          title="Metas de ahorro e inversión"
          description="Ajusta porcentajes con deslizadores para reflejar tus objetivos reales."
        />
        <Feature
          icon="💼"
          title="Salario objetivo"
          description="Calcula el bruto y el neto necesarios teniendo en cuenta los impuestos."
        />
      </section>
    </div>
  );
};
