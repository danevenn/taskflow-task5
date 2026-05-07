import { describe, expect, it } from 'vitest';

describe('calc breakdown shape', () => {
  it('breakdown sum approximates net + taxes', () => {
    const monthlyExpenses = 1500;
    const lifestyle = 300;
    const savingsPct = 15;
    const investPct = 10;
    const taxPct = 24;

    const base = monthlyExpenses + lifestyle;
    const savings = base * (savingsPct / 100);
    const invest = base * (investPct / 100);
    const net = base + savings + invest;
    const gross = net / (1 - taxPct / 100);
    const taxes = gross - net;

    expect(net + taxes).toBeCloseTo(gross, 2);
  });
});
