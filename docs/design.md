# Diseño y arquitectura

## Visión general

Dream Life Calculator es una aplicación fullstack con dos partes en el
mismo repositorio:

```
taskflow-fase5/
├── src/                  Frontend React + TypeScript
│   ├── api/              Cliente HTTP tipado
│   ├── components/       Componentes UI reutilizables
│   ├── context/          Context API + Provider global
│   ├── hooks/            Custom hooks (useApi, useDebouncedValue)
│   ├── pages/            Páginas conectadas a rutas
│   ├── types/            Tipos compartidos (mirror del DTO del backend)
│   └── utils/            Utilidades puras (formatters)
└── server/               Backend Express
    └── src/
        ├── config/       Configuración (env)
        ├── controllers/  Capa de presentación HTTP
        ├── middleware/   Validación y manejo de errores
        ├── routes/       Definición de routers de Express
        ├── services/     Lógica de negocio + store en memoria
        └── types/        DTOs del API
```

## Componentes principales

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `Layout` | Estructural | Header con navegación, contenido y footer. |
| `StatCard` | Presentacional | Muestra una métrica con label, valor y hint. |
| `SliderField` | Reutilizable | Input range etiquetado con valor visible. |
| `ExpenseForm` | Reutilizable | Formulario controlado para crear gastos. |
| `ExpenseList` | Reutilizable | Lista paginable de gastos con total. |
| `ScenarioCard` | Reutilizable | Tarjeta de un escenario con acciones. |
| `Modal` | Reutilizable | Diálogo modal accesible (cierra con ESC). |
| `LoadingView` / `ErrorView` / `EmptyView` | Reutilizables | Tres estados de red. |

### Composición

- `App` compone `BrowserRouter` + `DreamLifeProvider` + `Routes`.
- `Routes` usa `Layout` como ruta padre con `<Outlet />` para anidar páginas.
- `CalculatorPage` compone `SliderField`, `StatCard`, `Modal` y los estados
  `LoadingView`/`ErrorView`.

## Gestión del estado

Se sigue una regla simple: **el estado vive lo más cerca posible de donde
se usa**. Solo se eleva al `Context` lo que de verdad se comparte entre
páginas.

- **Estado local (`useState`)**: estado de formularios, flags de UI (`open`,
  `submitting`), inputs temporales.
- **Estado global (`Context API`)**: parámetros del Dream Life
  (`monthlyExpenses`, `savingsGoalPct`, `investmentGoalPct`,
  `lifestyleExtras`, `taxRatePct`). Se persiste en `localStorage` para que el
  usuario no los pierda al recargar.
- **Estado de servidor**: gestionado por el custom hook `useApi`, que expone
  `data | loading | error | refetch`.

No se ha introducido Redux ni Zustand: el estado global es muy reducido y
Context es suficiente.

## API REST

El backend expone una API versionada bajo `/api/v1`. Convenciones:

- **Recursos en plural** (`/expenses`, `/scenarios`).
- **Verbos HTTP**: `GET` (leer), `POST` (crear), `PATCH` (actualizar parcial),
  `DELETE` (borrar).
- **Códigos de estado**: 200 (ok), 201 (created), 204 (no content), 400
  (validation), 404 (not found), 500 (internal error).

### Endpoints

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| `GET` | `/api/v1/health` | — | `{ status, uptime }` |
| `GET` | `/api/v1/expenses` | — | `Expense[]` |
| `POST` | `/api/v1/expenses` | `{ category, amount }` | `Expense` (201) |
| `PATCH` | `/api/v1/expenses/:id` | `{ category?, amount? }` | `Expense` |
| `DELETE` | `/api/v1/expenses/:id` | — | 204 |
| `GET` | `/api/v1/scenarios` | — | `Scenario[]` |
| `POST` | `/api/v1/scenarios` | `CreateScenarioInput` | `Scenario` (201) |
| `DELETE` | `/api/v1/scenarios/:id` | — | 204 |
| `POST` | `/api/v1/calc` | `CalcRequest` | `CalcResponse` |

Los contratos exactos se documentan en [api.md](./api.md).

## Persistencia

| Dato | Dónde vive | Por qué |
|---|---|---|
| Gastos (`Expense`) | Backend (memoria) | Datos compartidos, fuente de verdad. |
| Escenarios (`Scenario`) | Backend (memoria) | Igual, deben sobrevivir a recargas. |
| Inputs de la calculadora | `localStorage` | Son preferencias de UI personales. |

> ⚠️ El store en memoria **se pierde al reiniciar el servidor**. Es
> deliberado para mantener el ejercicio simple. En producción se sustituiría
> por una base de datos (Neon Postgres del Vercel Marketplace, por ejemplo).

## Diagrama de flujo de datos

```
┌──────────────┐   fetch JSON     ┌──────────────────┐
│              │ ───────────────▶ │  Express API     │
│   Frontend   │                  │  /api/v1/...     │
│  (React)     │ ◀─────────────── │                  │
└──────┬───────┘    JSON tipado   └────────┬─────────┘
       │                                   │
       │                                   ▼
       │                          ┌──────────────────┐
       │                          │ Controllers      │
       │                          │   ↓ validate     │
       │                          │ Services         │
       │                          │   ↓ pure logic   │
       │                          │ Store (Map)      │
       │                          └──────────────────┘
       │
       ▼
┌──────────────┐
│ localStorage │   ← solo inputs de la calculadora
└──────────────┘
```

## Decisiones de arquitectura

1. **Monorepo simple, sin workspaces**. Frontend y backend comparten un único
   `package.json` para simplificar el deploy y el `npm install`. Es viable
   porque el alcance es pequeño.
2. **Tipos duplicados pero alineados**. Los DTO del backend y los tipos del
   frontend están en archivos distintos para no forzar import-cross-package.
   Es un coste asumido del monorepo plano. Cuando crezca, se moverían a un
   paquete `shared/`.
3. **Validación en la frontera de red**. Los controllers validan el body
   antes de pasarlo al service. Los services asumen datos válidos.
4. **Estado global mínimo**. Solo los inputs del calculador. El resto es
   estado de servidor (vía `useApi`) o local.
5. **Separación de capas en el backend**:
   - `routes` solo declaran URLs y verbos.
   - `controllers` orquestan validación + delegación al service y formato de
     respuesta HTTP.
   - `services` contienen la lógica de negocio y hablan con el `store`.
   - `middleware` gestiona errores y validación reutilizable.
6. **API Gateway = Vite proxy en dev, mismo dominio en prod**. En desarrollo
   Vite redirige `/api` al puerto 3001. En producción ambos viven en Vercel.
