import { randomUUID } from 'node:crypto';
import type { ExpenseDTO, ScenarioDTO } from '../types/dto';

interface DataStore {
  expenses: Map<string, ExpenseDTO>;
  scenarios: Map<string, ScenarioDTO>;
}

const seedExpenses = (): ExpenseDTO[] => {
  const now = new Date().toISOString();
  return [
    { id: randomUUID(), category: 'Vivienda', amount: 950, createdAt: now },
    { id: randomUUID(), category: 'Comida', amount: 350, createdAt: now },
    { id: randomUUID(), category: 'Transporte', amount: 120, createdAt: now },
    { id: randomUUID(), category: 'Suscripciones', amount: 60, createdAt: now },
    { id: randomUUID(), category: 'Ocio', amount: 200, createdAt: now },
  ];
};

const seedScenarios = (): ScenarioDTO[] => {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      name: 'Vida sencilla',
      monthlyExpenses: 1500,
      savingsGoalPct: 10,
      investmentGoalPct: 5,
      lifestyleExtras: 100,
      createdAt: now,
    },
    {
      id: randomUUID(),
      name: 'Vida ideal',
      monthlyExpenses: 2200,
      savingsGoalPct: 20,
      investmentGoalPct: 15,
      lifestyleExtras: 600,
      createdAt: now,
    },
  ];
};

export const store: DataStore = {
  expenses: new Map(seedExpenses().map((e) => [e.id, e])),
  scenarios: new Map(seedScenarios().map((s) => [s.id, s])),
};
