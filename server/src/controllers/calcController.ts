import type { Request, Response } from 'express';
import { calcService } from '../services/calcService.js';
import {
  ensureValid,
  optionalNumber,
  requireNumber,
} from '../middleware/validate.js';
import type { CalcRequestDTO, TaxMode } from '../types/dto.js';

const VALID_TAX_MODES: ReadonlyArray<TaxMode> = ['auto', 'manual'];

export const calcController = {
  compute(req: Request, res: Response) {
    const errors: Record<string, string> = {};
    const body = (req.body ?? {}) as Record<string, unknown>;

    let taxMode: TaxMode | undefined;
    if (body.taxMode !== undefined && body.taxMode !== null) {
      if (
        typeof body.taxMode !== 'string' ||
        !VALID_TAX_MODES.includes(body.taxMode as TaxMode)
      ) {
        errors.taxMode = `taxMode debe ser uno de: ${VALID_TAX_MODES.join(', ')}`;
      } else {
        taxMode = body.taxMode as TaxMode;
      }
    }

    const payload: CalcRequestDTO = {
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
      taxMode,
      taxRatePct: optionalNumber(body, 'taxRatePct', errors, {
        min: 0,
        max: 80,
      }),
    };
    ensureValid(errors);
    res.status(200).json(calcService.compute(payload));
  },
};
