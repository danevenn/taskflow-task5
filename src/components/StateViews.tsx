import type { ReactNode } from 'react';

export const LoadingView = ({ label = 'Cargando...' }: { label?: string }) => (
  <div className="flex items-center justify-center py-10 text-slate-500">
    <svg
      className="animate-spin h-5 w-5 mr-2 text-brand-600"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span>{label}</span>
  </div>
);

export const ErrorView = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
    <div className="font-medium">Algo salió mal</div>
    <p className="mt-1">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="btn-secondary mt-3 text-red-700 border-red-300 hover:bg-red-100"
      >
        Reintentar
      </button>
    )}
  </div>
);

export const EmptyView = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="text-center py-10">
    <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
      ∅
    </div>
    <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
