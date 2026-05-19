export interface Expense {
  id: string;
  category: string;
  amount: number;
  createdAt: string;
}

export interface CreateExpenseInput {
  category: string;
  amount: number;
}

export interface UpdateExpenseInput {
  category?: string;
  amount?: number;
}

export interface Scenario {
  id: string;
  name: string;
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
  createdAt: string;
}

export interface CreateScenarioInput {
  name: string;
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
}

export type TaxMode = 'auto' | 'manual';

export interface CalcRequest {
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
  taxMode?: TaxMode;
  taxRatePct?: number;
}

export interface CalcBreakdown {
  expenses: number;
  savings: number;
  investments: number;
  lifestyle: number;
  taxes: number;
}

export interface CalcResponse {
  netMonthly: number;
  grossMonthly: number;
  grossYearly: number;
  effectiveTaxRatePct: number;
  taxMode: TaxMode;
  breakdown: CalcBreakdown;
}

export interface ApiErrorBody {
  message: string;
  code?: string;
  details?: Record<string, string>;
}
