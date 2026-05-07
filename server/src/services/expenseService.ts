import { randomUUID } from 'node:crypto';
import { store } from './store.js';
import type {
  CreateExpenseDTO,
  ExpenseDTO,
  UpdateExpenseDTO,
} from '../types/dto.js';

export const expenseService = {
  list(): ExpenseDTO[] {
    return Array.from(store.expenses.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  },

  get(id: string): ExpenseDTO | undefined {
    return store.expenses.get(id);
  },

  create(input: CreateExpenseDTO): ExpenseDTO {
    const expense: ExpenseDTO = {
      id: randomUUID(),
      category: input.category,
      amount: input.amount,
      createdAt: new Date().toISOString(),
    };
    store.expenses.set(expense.id, expense);
    return expense;
  },

  update(id: string, input: UpdateExpenseDTO): ExpenseDTO | undefined {
    const existing = store.expenses.get(id);
    if (!existing) return undefined;
    const updated: ExpenseDTO = {
      ...existing,
      ...input,
    };
    store.expenses.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return store.expenses.delete(id);
  },
};
