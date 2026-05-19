export interface ExpenseDTO {
  id: string;
  category: string;
  amount: number;
  createdAt: string;
}

export interface CreateExpenseDTO {
  category: string;
  amount: number;
}

export interface UpdateExpenseDTO {
  category?: string;
  amount?: number;
}

export interface ScenarioDTO {
  id: string;
  name: string;
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
  createdAt: string;
}

export interface CreateScenarioDTO {
  name: string;
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
}

export type TaxMode = 'auto' | 'manual';

export interface CalcRequestDTO {
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
  /** 'auto' = aplica tramos IRPF España; 'manual' = usa taxRatePct fijo. */
  taxMode?: TaxMode;
  /** Tipo manual en %. Solo se usa cuando taxMode === 'manual'. */
  taxRatePct?: number;
}

export interface CalcResponseDTO {
  netMonthly: number;
  grossMonthly: number;
  grossYearly: number;
  /** Tipo efectivo realmente aplicado (impuestos / bruto). */
  effectiveTaxRatePct: number;
  taxMode: TaxMode;
  breakdown: {
    expenses: number;
    savings: number;
    investments: number;
    lifestyle: number;
    taxes: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
