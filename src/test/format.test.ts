import { describe, expect, it } from 'vitest';
import { formatCurrency, formatPct } from '../utils/format';

describe('formatCurrency', () => {
  it('renders the integer amount and the euro symbol', () => {
    const formatted = formatCurrency(1500);
    expect(formatted).toMatch(/1[\. \s]?500/);
    expect(formatted).toContain('€');
  });
  it('renders cents when withCents=true', () => {
    const formatted = formatCurrency(1500.5, true);
    expect(formatted).toMatch(/[,\.]50/);
  });
});

describe('formatPct', () => {
  it('rounds to integer percentage', () => {
    expect(formatPct(15.7)).toBe('16%');
    expect(formatPct(0)).toBe('0%');
  });
});
