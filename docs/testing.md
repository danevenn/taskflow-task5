# Testing

## Estrategia

Dada la escala del proyecto se usa una estrategia **mixta**: pruebas
manuales para los flujos completos y pruebas automáticas con Vitest para la
lógica pura más sensible (formateadores, fórmula del cálculo).

## Pruebas automáticas

Se han añadido tests con **Vitest + jsdom + @testing-library/jest-dom**.
Configuración en [`vite.config.ts`](../vite.config.ts) y setup en
[`src/test/setup.ts`](../src/test/setup.ts).

Ficheros:

- [`src/test/format.test.ts`](../src/test/format.test.ts) — validar
  `formatCurrency` y `formatPct`.
- [`src/test/calc-roundtrip.test.ts`](../src/test/calc-roundtrip.test.ts) —
  comprobar que la fórmula del cálculo cumple `net + taxes ≈ gross`.

Se ejecutan con:

```bash
npm test
```

Resultado esperado:

```
 Test Files  2 passed (2)
      Tests  4 passed (4)
```

## Pruebas manuales

Lista de comprobación que se ha repasado antes de marcar el proyecto como
*Done*. Cada uno se ha probado en Chrome desktop y en un viewport móvil
(DevTools, ancho 375px).

### Funcional

- [x] **Home**: muestra hero, tres features y los CTAs llevan a las rutas
      correctas.
- [x] **Gastos** GET: al entrar carga los 5 gastos seed.
- [x] **Gastos** POST: añadir un gasto con categoría y amount válidos lo
      hace aparecer en la lista y actualiza el total.
- [x] **Gastos** DELETE: eliminar un gasto lo retira de la lista.
- [x] **Gastos** validación: enviar categoría vacía o amount negativo
      muestra mensaje rojo bajo el input correspondiente.
- [x] **"Usar total en calculadora"**: cambia el monthlyExpenses del
      contexto y se ve reflejado al ir a `/calculator`.
- [x] **Calculadora**: arrastrar cualquier slider actualiza los stats al
      cabo de ~250 ms (debounce).
- [x] **Calculadora reset**: el botón "Reset" devuelve los valores por
      defecto.
- [x] **Calculadora persistencia**: tras un refresh se recuperan los
      valores guardados en `localStorage`.
- [x] **Calculadora guardar escenario**: el modal guarda y muestra un
      toast verde.
- [x] **Escenarios**: muestran los seed + el guardado y se pueden cargar y
      eliminar.
- [x] **Escenarios cargar**: aplica los inputs y navega a la calculadora.
- [x] **404**: una URL como `/whatever` muestra `NotFoundPage` con CTA al
      home.

### No funcional

- [x] **Responsive**: layout se reorganiza en una sola columna en móvil.
      Los stats pasan de 3 columnas a 1.
- [x] **Accesibilidad**: focus visible en botones, labels asociados a
      inputs, modal cierra con Escape, NavLink activo es identificable.
- [x] **Errores de red**: deteniendo el backend manualmente, las páginas
      muestran el `ErrorView` con botón "Reintentar".
- [x] **Consola**: no hay errores ni warnings en runtime al navegar entre
      todas las páginas (StrictMode activo).

## Comandos útiles

```bash
# arrancar frontend + backend en paralelo
npm run dev

# ejecutar lint
npm run lint

# ejecutar tests
npm test

# build de producción
npm run build

# arrancar el bundle de producción del backend
npm start
```

## Bugs encontrados y corregidos

| # | Bug | Solución |
|---|---|---|
| 1 | El locale `es-ES` no formatea miles en el entorno de tests (Node sin ICU completo). | El test ahora acepta `1500`, `1.500` o `1 500` con regex tolerante. |
| 2 | `useApi` perdía referencia del fetcher entre renders y disparaba refetch infinito. | Se introdujo `fetcherRef` para mantener la última versión sin invalidar el `useCallback`. |
| 3 | El modal no cerraba con Escape si se abría tras un teclado focuseado. | Añadido `event.preventDefault()` no era necesario; el bug era falsa alarma. Se documenta para no repetirlo. |
