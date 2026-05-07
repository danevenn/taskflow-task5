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

export interface CalcRequestDTO {
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
  taxRatePct?: number;
}

export interface CalcResponseDTO {
  netMonthly: number;
  grossMonthly: number;
  grossYearly: number;
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
