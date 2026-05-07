# Hooks de React

Este documento explica los hooks usados en Dream Life Calculator: tanto los
*built-in* de React como los **custom hooks** que vivimos en
[`src/hooks/`](../src/hooks).

## Hooks built-in usados

### `useState`

Estado local de un componente. Se usa, por ejemplo, en
[`ExpenseForm.tsx`](../src/components/ExpenseForm.tsx) para los inputs:

```tsx
const [category, setCategory] = useState('');
const [amount, setAmount] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});
```

Cada llamada a `setX` provoca un re-render del componente. React garantiza
que el estado se mantiene entre renders.

### `useEffect`

Ejecuta side-effects después del render. Cleanup opcional vía return.

Ejemplo en [`Modal.tsx`](../src/components/Modal.tsx) — añade un listener
global de teclado y lo retira al desmontar:

```tsx
useEffect(() => {
  if (!open) return;
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [open, onClose]);
```

Otro uso típico: persistir el contexto en `localStorage`
([`DreamLifeContext.tsx`](../src/context/DreamLifeContext.tsx)) cuando los
inputs cambian.

### `useMemo`

Memoiza valores derivados costosos para evitar recalcularlos en cada render.

En [`ExpensesPage.tsx`](../src/pages/ExpensesPage.tsx):

```tsx
const total = useMemo(
  () => (data ?? []).reduce((acc, e) => acc + e.amount, 0),
  [data],
);
```

Sin `useMemo`, el `reduce` se ejecutaría en cada render aunque `data` no
hubiese cambiado.

En [`CalculatorPage.tsx`](../src/pages/CalculatorPage.tsx) se usa para
construir el array `breakdownItems`, que solo debe recalcularse cuando
`data` (la respuesta del cálculo) cambia.

### `useCallback`

Memoiza una función para que su referencia no cambie entre renders. Útil
cuando esa función se pasa como prop a componentes hijos memoizados o se
usa como dependencia de otros hooks.

Ejemplo en [`ExpensesPage.tsx`](../src/pages/ExpensesPage.tsx):

```tsx
const handleDelete = useCallback(
  async (id: string) => { /* ... */ },
  [setData],
);
```

### `useContext`

Lee el valor de un Context. Se encapsula en el helper `useDreamLife()` que
también lanza error si se llama fuera del provider.

```tsx
const { inputs, setInputs } = useDreamLife();
```

### `useRef`

Referencia mutable persistente. Se usa en `useApi` para:

- Saber si el componente sigue montado y evitar `setState` después de
  desmontar (`mounted.current`).
- Mantener una referencia siempre actualizada al `fetcher` sin que cambios
  en su identidad disparen el `useEffect`.

## Custom hooks

### `useApi<T>(fetcher, deps)`

Encapsula el patrón estándar de carga de datos asíncronos: estado de
`loading`, `error`, `data` + `refetch`.

Firma:

```ts
useApi<T>(fetcher: () => Promise<T>, deps: unknown[]): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: (next: T | ((prev: T | null) => T)) => void;
}
```

Características:

- Inicia `loading=true` automáticamente.
- Captura errores tipados (`ApiError`) y devuelve un mensaje en español.
- Evita `setState` tras desmontar mediante `useRef` + cleanup.
- Permite **mutación optimista** desde fuera con `setData(prev => ...)`,
  útil al crear o eliminar entidades sin esperar a un refetch.
- `refetch` está disponible para reintentos manuales (botón "Reintentar"
  del `ErrorView`).

Uso típico:

```tsx
const { data, loading, error, refetch, setData } = useApi(
  () => api.listExpenses(),
  [],
);
```

### `useDebouncedValue<T>(value, delayMs)`

Devuelve una versión retardada del valor que solo cambia tras `delayMs`
milisegundos sin variación. Útil para no hacer una llamada al API en cada
ajuste de un slider.

```tsx
const debounced = useDebouncedValue(inputs, 250);
useEffect(() => {
  void api.calculate(debounced).then(setData);
}, [debounced]);
```

### Por qué dos custom hooks

El enunciado pedía al menos uno; he añadido dos porque resuelven dos
necesidades reales y muy distintas:

1. `useApi` → eliminar boilerplate de fetch + estados de red en cada página.
2. `useDebouncedValue` → optimización: evita llamadas excesivas al backend
   mientras el usuario arrastra los sliders.

Ambos son **agnósticos del dominio**: no saben nada de gastos ni de
calculadoras, solo de patrones genéricos.
