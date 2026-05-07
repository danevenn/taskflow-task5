import type { Request, Response } from 'express';
import { scenarioService } from '../services/scenarioService';
import {
  ensureValid,
  requireNumber,
  requireString,
} from '../middleware/validate';
import type { CreateScenarioDTO } from '../types/dto';

export const scenarioController = {
  list(_req: Request, res: Response) {
    res.status(200).json(scenarioService.list());
  },

  get(req: Request, res: Response) {
    const item = scenarioService.get(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Scenario not found', code: 'NOT_FOUND' });
      return;
    }
    res.status(200).json(item);
  },

  create(req: Request, res: Response) {
    const errors: Record<string, string> = {};
    const body = (req.body ?? {}) as Record<string, unknown>;
    const payload: CreateScenarioDTO = {
      name: requireString(body, 'name', errors, { max: 60 }),
      monthlyExpenses: requireNumber(body, 'monthlyExpenses', errors, {
        min: 0,
        max: 1_000_000,
      }),
      savingsGoalPct: requireNumber(body, 'savingsGoalPct', errors, {
        min: 0,
        max: 100,
      }),
      investmentGoalPct: requireNumber(body, 'investmentGoalPct', errors, {
        min: 0,
        max: 100,
      }),
      lifestyleExtras: requireNumber(body, 'lifestyleExtras', errors, {
        min: 0,
        max: 1_000_000,
      }),
    };
    ensureValid(errors);
    const created = scenarioService.create(payload);
    res.status(201).json(created);
  },

  remove(req: Request, res: Response) {
    const ok = scenarioService.delete(req.params.id);
    if (!ok) {
      res.status(404).json({ message: 'Scenario not found', code: 'NOT_FOUND' });
      return;
    }
    res.status(204).end();
  },
};
