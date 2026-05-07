# Capa de red en el frontend

## Cliente HTTP tipado

Todo el tráfico HTTP del frontend pasa por un único módulo:
[`src/api/client.ts`](../src/api/client.ts).

### Diseño

```ts
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1';
```

- En **desarrollo** la base es `/api/v1` y Vite redirige al backend gracias
  al `proxy` configurado en `vite.config.ts`.
- En **producción** el frontend y el backend conviven en el mismo dominio
  (Vercel), por lo que `/api/v1` también funciona sin variable de entorno.
- Si por algún motivo se quiere apuntar a otro origen (por ejemplo un
  backend en Render), basta con poner `VITE_API_BASE_URL` en `.env`.

### Función `request<T>`

```ts
async function request<T>(path: string, init: RequestInit = {}): Promise<T>
```

- Inyecta `Content-Type: application/json` por defecto.
- Diferencia tres casos:
  - `204 No Content` → devuelve `undefined as T`.
  - `2xx` → parsea JSON y lo devuelve tipado.
  - error → lanza una `ApiError` con `status`, `code` y `details`.
- Si `fetch` falla por red (sin servidor), lanza `ApiError` con `status: 0`
  y mensaje en español.

### Clase `ApiError`

```ts
class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string>;
}
```

Permite que la UI distinga, por ejemplo, un `400` de validación de un `500`
del servidor.

### Métodos públicos

```ts
api.health()
api.listExpenses()
api.createExpense(input)
api.updateExpense(id, input)
api.deleteExpense(id)
api.listScenarios()
api.createScenario(input)
api.deleteScenario(id)
api.calculate(input)
```

Cada uno está tipado y devuelve una `Promise` del tipo correcto, así que la
UI nunca trabaja con `any`.

## Contrato de tipos

Los tipos del frontend viven en
[`src/types/api.ts`](../src/types/api.ts) y reflejan exactamente los DTO del
backend en
[`server/src/types/dto.ts`](../server/src/types/dto.ts):

| Frontend | Backend |
|---|---|
| `Expense` | `ExpenseDTO` |
| `CreateExpenseInput` | `CreateExpenseDTO` |
| `Scenario` | `ScenarioDTO` |
| `CreateScenarioInput` | `CreateScenarioDTO` |
| `CalcRequest` | `CalcRequestDTO` |
| `CalcResponse` | `CalcResponseDTO` |
| `ApiErrorBody` | (formato de error consistente) |

**Por qué duplicarlos**: el repositorio es un monorepo plano sin
workspaces, así que importar tipos desde `server/` al frontend rompería el
sandbox de Vite. La duplicación es controlada (cada DTO se actualiza en
ambos sitios al cambiar el contrato) y mucho más simple que montar un
paquete `shared/`.

Si el proyecto creciera, la solución natural sería pasar a un
**Turborepo**/**pnpm workspaces** con un paquete `@app/shared` que exporte
los DTO una sola vez.

## Estados de red en la UI

Cada página que consume el API gestiona los **tres estados**: cargando,
éxito y error. Se hace mediante el custom hook `useApi`:

```tsx
const { data, loading, error, refetch } = useApi(() => api.listExpenses(), []);

if (loading) return <LoadingView />;
if (error) return <ErrorView message={error} onRetry={refetch} />;
return <ExpenseList expenses={data ?? []} ... />;
```

Componentes auxiliares en
[`src/components/StateViews.tsx`](../src/components/StateViews.tsx):

- `LoadingView` con spinner.
- `ErrorView` con mensaje + botón "Reintentar".
- `EmptyView` para listas vacías con call-to-action.

### Validación en error

Cuando el backend devuelve `400` con `details`, la UI se queda con el
`message` resumen ("Validation failed") y muestra los detalles inline si
los necesita. Para el resto de errores, se muestra el mensaje del backend
literalmente.

## Mutación optimista

Crear y borrar entidades hacen **mutación optimista** local con
`setData` del `useApi`, sin re-fetch:

```tsx
// crear
const created = await api.createExpense(input);
setData(prev => [...(prev ?? []), created]);

// borrar
await api.deleteExpense(id);
setData(prev => (prev ?? []).filter(e => e.id !== id));
```

Si la petición falla, el estado se queda como estaba y se muestra un
`ErrorView`. No hay rollback porque solo se aplica la mutación tras la
respuesta `2xx`.

## Sin LocalStorage como fuente de verdad

El enunciado pedía explícitamente eliminar `localStorage` como
almacenamiento de datos persistentes. Aquí solo se usa para guardar las
**preferencias del usuario** en la calculadora (los inputs), no los
recursos del API. Los gastos y los escenarios viven exclusivamente en el
backend.
