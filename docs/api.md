# API REST

Backend implementado con **Express 4** en
[`server/src/`](../server/src/) siguiendo arquitectura por capas
(`routes` → `controllers` → `services`).

- **Base URL en desarrollo**: `http://localhost:3001/api/v1`
- **Base URL en producción**: `https://testflow-task5.vercel.app/api/v1`
- **Formato**: JSON (`Content-Type: application/json`).

Todas las respuestas de error siguen el mismo formato:

```json
{
  "message": "string",
  "code": "VALIDATION_ERROR | NOT_FOUND | INTERNAL_ERROR",
  "details": { "field": "mensaje" }
}
```

## Health

### `GET /health`

```bash
curl http://localhost:3001/api/v1/health
```

Respuesta `200`:

```json
{ "status": "ok", "uptime": 12.345 }
```

## Expenses (gastos)

### `GET /expenses`

Lista todos los gastos ordenados por `createdAt` ascendente.

```json
[
  {
    "id": "8f6d...",
    "category": "Vivienda",
    "amount": 950,
    "createdAt": "2026-05-07T08:15:35.970Z"
  }
]
```

### `POST /expenses`

```json
{ "category": "Comida", "amount": 350 }
```

Respuesta `201`:

```json
{
  "id": "f0c8...",
  "category": "Comida",
  "amount": 350,
  "createdAt": "2026-05-07T08:20:42.136Z"
}
```

Errores: `400` si `category` está vacía o supera 40 caracteres, o si
`amount` no está en el rango `[0, 1_000_000]`.

### `PATCH /expenses/:id`

```json
{ "amount": 400 }
```

Respuesta `200` con el gasto actualizado. `404` si el id no existe.

### `DELETE /expenses/:id`

Respuesta `204` (sin body). `404` si el id no existe.

## Scenarios (escenarios guardados)

### `GET /scenarios`

```json
[
  {
    "id": "a1b2...",
    "name": "Vida ideal",
    "monthlyExpenses": 2200,
    "savingsGoalPct": 20,
    "investmentGoalPct": 15,
    "lifestyleExtras": 600,
    "createdAt": "2026-05-07T08:15:35.970Z"
  }
]
```

### `POST /scenarios`

```json
{
  "name": "Mi vida en Madrid",
  "monthlyExpenses": 1800,
  "savingsGoalPct": 15,
  "investmentGoalPct": 10,
  "lifestyleExtras": 400
}
```

Respuesta `201` con el escenario creado.

Reglas de validación:

| Campo | Tipo | Min | Max |
|---|---|---|---|
| `name` | string | 1 | 60 |
| `monthlyExpenses` | number | 0 | 1.000.000 |
| `savingsGoalPct` | number | 0 | 100 |
| `investmentGoalPct` | number | 0 | 100 |
| `lifestyleExtras` | number | 0 | 1.000.000 |

### `DELETE /scenarios/:id`

Respuesta `204`. `404` si el id no existe.

## Calc (cálculo del salario)

### `POST /calc`

Calcula el salario neto, bruto mensual y bruto anual a partir de los
parámetros del usuario. **No persiste nada**: es puro cálculo.

Body:

```json
{
  "monthlyExpenses": 1500,
  "savingsGoalPct": 15,
  "investmentGoalPct": 10,
  "lifestyleExtras": 300,
  "taxRatePct": 24
}
```

`taxRatePct` es opcional; si no se envía se usa 24.

Respuesta `200`:

```json
{
  "netMonthly": 2250,
  "grossMonthly": 2960.53,
  "grossYearly": 35526.32,
  "breakdown": {
    "expenses": 1500,
    "savings": 270,
    "investments": 180,
    "lifestyle": 300,
    "taxes": 710.53
  }
}
```

### Fórmula

```
base       = monthlyExpenses + lifestyleExtras
savings    = base * (savingsGoalPct / 100)
invest     = base * (investmentGoalPct / 100)
net        = base + savings + invest
gross      = net / (1 - taxRatePct/100)
taxes      = gross - net
yearGross  = gross * 12
```

## Códigos HTTP usados

| Código | Significado |
|---|---|
| 200 | OK con body |
| 201 | Created (POST exitoso) |
| 204 | No Content (DELETE exitoso) |
| 400 | Bad Request (validación falló, body inválido) |
| 404 | Not Found (id no existe o ruta desconocida) |
| 500 | Internal Server Error (excepción no controlada) |

## Validación

Implementada en
[`server/src/middleware/validate.ts`](../server/src/middleware/validate.ts)
con tres helpers:

- `requireString(body, field, errors, opts)`
- `requireNumber(body, field, errors, opts)`
- `optionalNumber(body, field, errors, opts)`

`ensureValid(errors)` lanza una `ValidationError` si encontró algún error.
El middleware `errorHandler` la captura y devuelve `400` con el detalle por
campo.
