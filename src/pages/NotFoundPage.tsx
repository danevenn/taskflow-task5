import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="text-center py-16">
    <p className="text-sm font-semibold text-brand-600">404</p>
    <h1 className="mt-2 text-3xl font-bold text-slate-900">
      Página no encontrada
    </h1>
    <p className="mt-2 text-slate-600">
      La URL que buscas no existe o ha sido movida.
    </p>
    <Link to="/" className="btn-primary mt-6 inline-flex">
      Volver al inicio
    </Link>
  </div>
);
