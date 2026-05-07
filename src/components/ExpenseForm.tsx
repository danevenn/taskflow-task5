import { useState, type FormEvent } from 'react';
import type { CreateExpenseInput } from '../types/api';

interface ExpenseFormProps {
  onSubmit: (input: CreateExpenseInput) => Promise<void> | void;
  submitting?: boolean;
}

export const ExpenseForm = ({ onSubmit, submitting }: ExpenseFormProps) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!category.trim()) next.category = 'La categoría es obligatoria';
    if (category.trim().length > 40) next.category = 'Máximo 40 caracteres';
    const amt = Number(amount);
    if (!amount || Number.isNaN(amt))
      next.amount = 'Introduce un importe válido';
    else if (amt < 0) next.amount = 'El importe no puede ser negativo';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ category: category.trim(), amount: Number(amount) });
    setCategory('');
    setAmount('');
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-4 grid gap-3 md:grid-cols-[1fr_160px_auto] md:items-end"
    >
      <div>
        <label htmlFor="exp-category" className="label">
          Categoría
        </label>
        <input
          id="exp-category"
          className="input"
          placeholder="Ej. Vivienda, Transporte..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={40}
        />
        {errors.category && (
          <p className="mt-1 text-xs text-red-600">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="exp-amount" className="label">
          Importe (€/mes)
        </label>
        <input
          id="exp-amount"
          type="number"
          inputMode="decimal"
          className="input"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          step="0.01"
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
        )}
      </div>
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Añadiendo...' : 'Añadir gasto'}
      </button>
    </form>
  );
};
