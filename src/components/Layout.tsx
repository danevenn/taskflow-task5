import { NavLink, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
  }`;

export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
              €
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900">
                Dream Life Calculator
              </h1>
              <p className="text-xs text-slate-500">
                Planifica el ingreso para vivir tu mejor vida
              </p>
            </div>
          </div>
          <nav className="flex gap-1">
            <NavLink to="/" className={navLinkClasses} end>
              Inicio
            </NavLink>
            <NavLink to="/expenses" className={navLinkClasses}>
              Gastos
            </NavLink>
            <NavLink to="/calculator" className={navLinkClasses}>
              Calculadora
            </NavLink>
            <NavLink to="/scenarios" className={navLinkClasses}>
              Escenarios
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              Acerca
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children ?? <Outlet />}
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} Dream Life Calculator</span>
          <span>Construido con React + Express</span>
        </div>
      </footer>
    </div>
  );
};
