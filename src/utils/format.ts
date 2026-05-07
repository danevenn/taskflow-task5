const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const eurFormatterCents = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export const formatCurrency = (amount: number, withCents = false): string => {
  const formatter = withCents ? eurFormatterCents : eurFormatter;
  return formatter.format(amount);
};

export const formatPct = (value: number): string => `${value.toFixed(0)}%`;
