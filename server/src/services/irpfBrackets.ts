/**
 * Tramos del IRPF general en España (ejercicio 2024/2025).
 *
 * Son los tipos marginales aplicados sobre la base liquidable general,
 * combinando aproximadamente la escala estatal y autonómica (media nacional).
 * Estos tramos varían ligeramente entre comunidades autónomas, así que aquí se
 * usa la escala estatal de referencia. El tipo "efectivo" devuelto por la
 * calculadora será siempre menor que el marginal más alto aplicado.
 *
 * Fuente: Agencia Tributaria — escala general estatal.
 */
export interface IrpfBracket {
  from: number;
  rate: number;
}

export const IRPF_BRACKETS: ReadonlyArray<IrpfBracket> = [
  { from: 0, rate: 0.19 },
  { from: 12450, rate: 0.24 },
  { from: 20200, rate: 0.3 },
  { from: 35200, rate: 0.37 },
  { from: 60000, rate: 0.45 },
  { from: 300000, rate: 0.47 },
];

/**
 * Calcula el impuesto total dado un bruto anual aplicando los tramos
 * marginales (cada euro paga el tipo de su tramo).
 */
export function taxesFromGrossYearly(grossYearly: number): number {
  if (grossYearly <= 0) return 0;
  let tax = 0;
  for (let i = 0; i < IRPF_BRACKETS.length; i++) {
    const bracket = IRPF_BRACKETS[i];
    const next = IRPF_BRACKETS[i + 1];
    const top = next ? next.from : Number.POSITIVE_INFINITY;
    if (grossYearly <= bracket.from) break;
    const taxableInBracket = Math.min(grossYearly, top) - bracket.from;
    tax += taxableInBracket * bracket.rate;
    if (grossYearly <= top) break;
  }
  return tax;
}

/**
 * Invierte la fórmula anterior: dado un neto anual, devuelve el bruto anual
 * necesario tal que gross - taxes(gross) == net. Como los tramos son
 * lineales por trozos, la inversa se resuelve analíticamente tramo a tramo
 * sin necesidad de iteración numérica.
 */
export function grossFromNetYearly(netYearly: number): number {
  if (netYearly <= 0) return 0;
  let accumulatedTax = 0;
  for (let i = 0; i < IRPF_BRACKETS.length; i++) {
    const bracket = IRPF_BRACKETS[i];
    const next = IRPF_BRACKETS[i + 1];
    const top = next ? next.from : Number.POSITIVE_INFINITY;
    // Neto máximo que se puede alcanzar si el bruto cae justo en `top`.
    const netAtTop = top - (accumulatedTax + (top - bracket.from) * bracket.rate);
    if (netYearly <= netAtTop || top === Number.POSITIVE_INFINITY) {
      // gross - (accumulatedTax + (gross - bracket.from) * rate) = net
      // gross * (1 - rate) = net + accumulatedTax - bracket.from * rate
      return (
        (netYearly + accumulatedTax - bracket.from * bracket.rate) /
        (1 - bracket.rate)
      );
    }
    accumulatedTax += (top - bracket.from) * bracket.rate;
  }
  return netYearly;
}
