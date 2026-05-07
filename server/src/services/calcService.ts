import type { CalcRequestDTO, CalcResponseDTO } from '../types/dto.js';

const DEFAULT_TAX_RATE = 24;

export const calcService = {
  compute(input: CalcRequestDTO): CalcResponseDTO {
    const taxRate = input.taxRatePct ?? DEFAULT_TAX_RATE;
    const expenses = input.monthlyExpenses;
    const lifestyle = input.lifestyleExtras;

    const baseLifestyle = expenses + lifestyle;
    const savings = baseLifestyle * (input.savingsGoalPct / 100);
    const investments = baseLifestyle * (input.investmentGoalPct / 100);

    const netMonthly = baseLifestyle + savings + investments;
    const grossMonthly = netMonthly / (1 - taxRate / 100);
    const taxes = grossMonthly - netMonthly;
    const grossYearly = grossMonthly * 12;

    return {
      netMonthly: round(netMonthly),
      grossMonthly: round(grossMonthly),
      grossYearly: round(grossYearly),
      breakdown: {
        expenses: round(expenses),
        savings: round(savings),
        investments: round(investments),
        lifestyle: round(lifestyle),
        taxes: round(taxes),
      },
    };
  },
};

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
