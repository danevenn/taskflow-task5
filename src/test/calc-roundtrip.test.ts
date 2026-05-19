import { describe, expect, it } from 'vitest';
import {
  grossFromNetYearly,
  taxesFromGrossYearly,
} from '../../server/src/services/irpfBrackets';

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

describe('IRPF brackets (Spain)', () => {
  const cases = [
    { gross: 10_000, expectedEffective: 19 },
    { gross: 20_000, expectedEffective: 20.89 },
    { gross: 30_000, expectedEffective: 23.89 },
    { gross: 50_000, expectedEffective: 28.4 },
    { gross: 80_000, expectedEffective: 33.63 },
  ];

  it.each(cases)(
    'gross $gross → effective rate ~ $expectedEffective%',
    ({ gross, expectedEffective }) => {
      const taxes = taxesFromGrossYearly(gross);
      const effective = (taxes / gross) * 100;
      expect(effective).toBeCloseTo(expectedEffective, 1);
    },
  );

  it('grossFromNetYearly is the inverse of net = gross - taxes', () => {
    for (const gross of [12_500, 25_000, 40_000, 70_000, 250_000]) {
      const net = gross - taxesFromGrossYearly(gross);
      const grossBack = grossFromNetYearly(net);
      expect(grossBack).toBeCloseTo(gross, 2);
    }
  });

  it('grossFromNetYearly returns 0 for non-positive net', () => {
    expect(grossFromNetYearly(0)).toBe(0);
    expect(grossFromNetYearly(-100)).toBe(0);
  });
});
