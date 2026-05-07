import type { Request, Response } from 'express';
import { expenseService } from '../services/expenseService';
import {
  ensureValid,
  requireNumber,
  requireString,
  optionalNumber,
} from '../middleware/validate';
import type { CreateExpenseDTO, UpdateExpenseDTO } from '../types/dto';

export const expenseController = {
  list(_req: Request, res: Response) {
    res.status(200).json(expenseService.list());
  },

  get(req: Request, res: Response) {
    const expense = expenseService.get(req.params.id);
    if (!expense) {
      res.status(404).json({ message: 'Expense not found', code: 'NOT_FOUND' });
      return;
    }
    res.status(200).json(expense);
  },

  create(req: Request, res: Response) {
    const errors: Record<string, string> = {};
    const body = (req.body ?? {}) as Record<string, unknown>;
    const payload: CreateExpenseDTO = {
      category: requireString(body, 'category', errors, { max: 40 }),
      amount: requireNumber(body, 'amount', errors, { min: 0, max: 1_000_000 }),
    };
    ensureValid(errors);
    const created = expenseService.create(payload);
    res.status(201).json(created);
  },

  update(req: Request, res: Response) {
    const errors: Record<string, string> = {};
    const body = (req.body ?? {}) as Record<string, unknown>;
    const payload: UpdateExpenseDTO = {};
    if (body.category !== undefined) {
      payload.category = requireString(body, 'category', errors, { max: 40 });
    }
    const amt = optionalNumber(body, 'amount', errors, {
      min: 0,
      max: 1_000_000,
    });
    if (amt !== undefined) payload.amount = amt;
    ensureValid(errors);

    const updated = expenseService.update(req.params.id, payload);
    if (!updated) {
      res.status(404).json({ message: 'Expense not found', code: 'NOT_FOUND' });
      return;
    }
    res.status(200).json(updated);
  },

  remove(req: Request, res: Response) {
    const ok = expenseService.delete(req.params.id);
    if (!ok) {
      res.status(404).json({ message: 'Expense not found', code: 'NOT_FOUND' });
      return;
    }
    res.status(204).end();
  },
};
