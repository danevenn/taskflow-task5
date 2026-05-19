# Componentes

Todos los componentes están escritos en **TypeScript** y reciben sus props
como interfaces tipadas. Tailwind CSS se utiliza para los estilos. Aquí se
documenta cada componente reutilizable de la carpeta
[`src/components/`](../src/components).

## `Layout`

Estructura visual común a todas las páginas: header con el branding y la
navegación, área principal (`<Outlet />` de React Router) y footer.

- **Props**: `children?: ReactNode` (opcional, se usa `<Outlet/>` si no se
  pasa).
- **Reutilizable porque**: cualquier nueva ruta puede colgarse bajo el mismo
  `Layout` simplemente añadiendo un `<Route>` hijo.

## `StatCard`

Tarjeta con una métrica destacada.

```tsx
<StatCard
  label="Salario neto/mes"
  value={formatCurrency(2500)}
  hint="Lo que necesitas en cuenta"
  accent="success"
/>
```

- **Props**: `label`, `value`, `hint?`, `accent?` (`default | brand | success
  | warning`).
- **Composición**: la prop `value` acepta `ReactNode`, así que puede contener
  iconos o texto enriquecido.

## `SliderField`

Campo `<input type="range">` con label, valor visible y hint opcional.

```tsx
<SliderField
  id="savings"
  label="Meta de ahorro"
  value={value}
  onChange={setValue}
  min={0}
  max={50}
  suffix="%"
/>
```

- **Props**: `id`, `label`, `value`, `onChange(value: number)`, `min`, `max`,
  `step?`, `suffix?`, `hint?`.
- **Reutilizable**: se usa cuatro veces en `CalculatorPage` con distintos
  rangos.

## `ExpenseForm`

Formulario controlado para crear un gasto. Realiza validación local antes de
llamar a `onSubmit`.

- **Props**: `onSubmit(input: CreateExpenseInput)`, `submitting?: boolean`.
- **Validación**: categoría no vacía, máximo 40 caracteres; importe numérico
  ≥ 0.
- **Mensajes de error** en rojo bajo cada campo cuando falla la validación.

## `ExpenseList`

Lista de gastos con total mensual al pie. Si no hay gastos, muestra estado
vacío.

- **Props**: `expenses: Expense[]`, `onDelete(id: string)`, `deletingId?:
  string | null`.

## `ScenarioCard`

Tarjeta de un escenario guardado, con dos acciones (cargar / eliminar).

- **Props**: `scenario: Scenario`, `onLoad(scenario: Scenario)`, `onDelete(id:
  string)`.

## `Modal`

Diálogo modal accesible. Cierra con tecla **Escape** o clic en el overlay.
Contiene un botón de cierre con `aria-label="Cerrar"`.

- **Props**: `open: boolean`, `onClose()`, `title: string`, `children`.
- **Detalles**: usa `role="dialog"` y `aria-modal="true"`. El click dentro
  del contenido no propaga al overlay.

## `SegmentedToggle<T>`

Toggle segmentado tipado por genérico. Útil para alternar entre 2–4
opciones mutuamente excluyentes (modo claro/oscuro, auto/manual, etc.).

```tsx
<SegmentedToggle<TaxMode>
  label="Cálculo del IRPF"
  value={mode}
  onChange={setMode}
  options={[
    { value: 'auto', label: 'Auto · tramos España' },
    { value: 'manual', label: 'Manual · % fijo' },
  ]}
/>
```

- **Props**: `label?`, `value`, `onChange(value)`, `options`, `hint?`.
- **Accesibilidad**: usa `role="radiogroup"` y `role="radio"` con
  `aria-checked` por opción.
- **Reutilizable**: el tipo del valor es un genérico `<T extends string>`,
  así que se puede instanciar con cualquier *union* de strings sin perder
  la inferencia de tipos.

## `IrpfBracketsTable`

Tabla informativa con los tramos oficiales del IRPF en España. Resalta el
tramo correspondiente al `grossYearly` actual.

- **Props**: `highlightYearlyGross?: number`.
- Aparece en la calculadora cuando el usuario elige el modo de IRPF
  **automático**. Refleja la misma escala que el helper del backend en
  [`server/src/services/irpfBrackets.ts`](../server/src/services/irpfBrackets.ts).

## `StateViews` (`LoadingView`, `ErrorView`, `EmptyView`)

Tres pequeños componentes que cubren los estados de red estándar:

- `LoadingView`: spinner + label configurable.
- `ErrorView`: card roja con mensaje y botón opcional de reintentar.
- `EmptyView`: estado vacío con icono, título, descripción y *call to
  action*.

```tsx
{loading && <LoadingView />}
{error && <ErrorView message={error} onRetry={refetch} />}
{!loading && !error && data?.length === 0 && (
  <EmptyView title="Sin gastos" />
)}
```

## Convenciones aplicadas

- Todos los componentes son **funciones puras** (`const C = (...) => ...`).
- Los handlers de eventos siguen el patrón `onX` en props y `handleX` en
  estado interno.
- Las clases de Tailwind se agrupan por orden: layout → spacing → tipografía
  → color → estado.
- Cuando un componente acepta `children` se tipa explícitamente como
  `ReactNode`.
- Los componentes que disparan side-effects (modal con event listener) usan
  `useEffect` con cleanup.
