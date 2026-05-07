# Context API

## Objetivo

Compartir entre páginas y componentes los **inputs de la calculadora**
(gastos mensuales, % de ahorro, % de inversión, extras de estilo de vida y
tipo impositivo) sin tener que pasarlos como props a través de toda la
jerarquía (*prop drilling*).

## Implementación

El contexto vive en
[`src/context/DreamLifeContext.tsx`](../src/context/DreamLifeContext.tsx) y
expone:

```ts
interface DreamLifeContextValue {
  inputs: DreamLifeInputs;
  setInputs: (next: Partial<DreamLifeInputs>) => void;
  resetInputs: () => void;
  hydrateFromExpenses: (totalExpenses: number) => void;
}
```

Tres piezas:

1. `createContext<DreamLifeContextValue | undefined>(undefined)` con el valor
   inicial `undefined` para detectar uso fuera del Provider.
2. `DreamLifeProvider` que hace `useState` del estado, lo persiste en
   `localStorage` con un `useEffect` y lo expone vía `Provider`.
3. Hook `useDreamLife()` que envuelve `useContext` y lanza un error claro si
   no se usa dentro del Provider:

   ```ts
   if (!ctx) throw new Error('useDreamLife must be used inside DreamLifeProvider');
   ```

El value del Provider está envuelto en `useMemo` para evitar re-renders
innecesarios de los consumidores cuando el Provider se renderiza.

## Persistencia

Se usa `localStorage` con la clave `dreamLifeInputs:v1` (versionada por si en
el futuro cambian los campos). Si el JSON guardado está corrupto se cae al
valor por defecto sin romper la app.

## Consumidores

- [`CalculatorPage`](../src/pages/CalculatorPage.tsx): lee `inputs` y los
  modifica con `setInputs`. Llama a `resetInputs` desde el botón "Reset".
- [`ExpensesPage`](../src/pages/ExpensesPage.tsx): llama a
  `hydrateFromExpenses(total)` para volcar el total real de gastos en la
  calculadora.
- [`ScenariosPage`](../src/pages/ScenariosPage.tsx): cuando el usuario carga
  un escenario, llama a `setInputs(...)` con los valores del escenario y
  navega a la calculadora.

## ¿Cuándo es útil Context?

Context es ideal cuando:

- Un dato lo consumen **muchos componentes en niveles distintos** del árbol.
- Pasar el dato como prop a través de varios niveles intermedios sería
  ruidoso.
- El dato cambia con frecuencia razonable, **pero no extremadamente alta**:
  cada cambio re-renderiza a todos los consumidores.

Casos típicos: **tema** (light/dark), **idioma**, **usuario logueado**,
**preferencias** del usuario, **estado del carrito** en un e-commerce.

### ¿Cuándo NO es buena idea?

- Cuando el dato cambia a 60 fps (animaciones, scroll). Mejor usar refs.
- Cuando solo lo consume un componente y un hijo directo: pasarlo como prop
  es más simple.
- Cuando hay muchas piezas independientes de estado global con relaciones
  complejas: una librería como Zustand, Jotai o Redux Toolkit puede ser más
  apropiada.

En este proyecto solo hay un *slice* de estado global y es relativamente
estable, así que Context con `useState` interno es suficiente.

## Anti-patrones evitados

- **Inicializar el contexto con un valor falso**: si el value es `undefined`
  fuera del Provider, el hook `useDreamLife` lo detecta y lanza un error
  claro.
- **Pasar funciones inline al value**: causa que el value cambie en cada
  render. Aquí se usan `useCallback` + `useMemo`.
- **Persistir todo en `localStorage`**: solo se persiste lo que vale la
  pena (los inputs del usuario). Los gastos viven en el backend.
