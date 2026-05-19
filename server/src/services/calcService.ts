import type { CalcRequestDTO, CalcResponseDTO } from '../types/dto.js';
import {
  grossFromNetYearly,
  taxesFromGrossYearly,
} from './irpfBrackets.js';

const DEFAULT_MANUAL_TAX_RATE = 24;

export const calcService = {
  compute(input: CalcRequestDTO): CalcResponseDTO {
    const expenses = input.monthlyExpenses;
    const lifestyle = input.lifestyleExtras;

    const baseLifestyle = expenses + lifestyle;
    const savings = baseLifestyle * (input.savingsGoalPct / 100);
    const investments = baseLifestyle * (input.investmentGoalPct / 100);
    const netMonthly = baseLifestyle + savings + investments;

    const taxMode = input.taxMode ?? 'auto';

    let grossMonthly: number;
    let taxesMonthly: number;
    let effectiveTaxRatePct: number;

    if (taxMode === 'manual') {
      const rate = (input.taxRatePct ?? DEFAULT_MANUAL_TAX_RATE) / 100;
      // Evita divisiones inestables cuando rate >= 1.
      const safeRate = Math.min(Math.max(rate, 0), 0.99);
      grossMonthly = netMonthly / (1 - safeRate);
      taxesMonthly = grossMonthly - netMonthly;
      effectiveTaxRatePct =
        grossMonthly > 0 ? (taxesMonthly / grossMonthly) * 100 : 0;
    } else {
      const netYearly = netMonthly * 12;
      const grossYearly = grossFromNetYearly(netYearly);
      grossMonthly = grossYearly / 12;
      const taxesYearly = taxesFromGrossYearly(grossYearly);
      taxesMonthly = taxesYearly / 12;
      effectiveTaxRatePct =
        grossYearly > 0 ? (taxesYearly / grossYearly) * 100 : 0;
    }

    const grossYearly = grossMonthly * 12;

    return {
      netMonthly: round(netMonthly),
      grossMonthly: round(grossMonthly),
      grossYearly: round(grossYearly),
      effectiveTaxRatePct: round(effectiveTaxRatePct),
      taxMode,
      breakdown: {
        expenses: round(expenses),
        savings: round(savings),
        investments: round(investments),
        lifestyle: round(lifestyle),
        taxes: round(taxesMonthly),
      },
    };
  },
};

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
