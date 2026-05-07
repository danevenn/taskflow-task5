# Retrospectiva

## Qué construí

Una aplicación fullstack llamada **Dream Life Calculator** que estima el
salario que necesitas para vivir tu vida ideal a partir de tus gastos
mensuales y tus metas de ahorro/inversión/estilo de vida.

- **Frontend**: React 18 + TypeScript + Tailwind CSS + React Router 6.
- **Backend**: Express 4 con arquitectura por capas
  (`routes` → `controllers` → `services`).
- **Cliente API tipado** que comparte contrato con el backend.
- **Estado global** con Context API y persistencia en `localStorage` para
  preferencias del usuario.
- **Custom hooks** (`useApi`, `useDebouncedValue`).
- **Tests** con Vitest.
- **Docs completas** en `docs/`.

## Qué aprendí

### Sobre arquitectura fullstack

- La diferencia entre **estado de servidor** (gastos, escenarios) y
  **estado de cliente** (preferencias del usuario, UI ephemeral) ya no es
  abstracta: la viví al decidir qué iba a `localStorage` y qué iba al
  backend.
- La **arquitectura por capas** en Express paga dividendos en cuanto se
  añade el segundo recurso. Crear `scenarios` después de `expenses` fue
  trivial porque ya tenía la plantilla `routes → controller → service`.
- **Validar en la frontera de red** (controllers) y dejar los services
  asumiendo datos válidos hace el código de negocio mucho más legible.

### Sobre TypeScript fullstack

- Los **DTO duplicados** entre frontend y backend son un coste real cuando
  el monorepo es plano. La duplicación funciona si vas con cuidado, pero
  un workspace `shared/` sería claramente mejor en cuanto el proyecto
  crezca.
- Los tipos del cliente API forman un **contrato vivo**: si cambias el
  backend y olvidas el frontend, TypeScript te lo dice al instante. Vale
  cada minuto invertido en escribir las interfaces.

### Sobre React

- Los **custom hooks** dejan el código de las páginas mucho más limpio.
  `useApi` aplanó las páginas a leer `data | loading | error` en lugar de
  manejar `useState` + `useEffect` + flags manualmente.
- `useMemo` y `useCallback` no son magia. Solo merecen la pena cuando hay
  un coste real (cálculos costosos, evitar re-renders cascada, romper
  ciclos de dependencias).
- Context API es **suficiente** para la mayoría de aplicaciones de tamaño
  medio. No hace falta saltar a Zustand o Redux a la primera.

## Conexión frontend ↔ backend ↔ API

El flujo crítico es la calculadora:

1. El usuario arrastra un slider → `setInputs` actualiza el contexto.
2. El contexto se persiste en `localStorage` (preferencia local).
3. Un `useEffect` con `useDebouncedValue` espera 250 ms.
4. Si el valor estable, llama a `api.calculate()` (cliente tipado).
5. `api.calculate()` hace `fetch` a `/api/v1/calc`.
6. En dev, Vite proxy redirige a `localhost:3001`. En prod, mismo dominio.
7. Express enruta a `calcRouter` → `calcController.compute`.
8. El controller valida con `requireNumber`/`optionalNumber`.
9. Llama a `calcService.compute()` que devuelve un `CalcResponseDTO`.
10. La respuesta JSON vuelve al frontend tipada como `CalcResponse`.
11. La UI actualiza los `StatCard` y el breakdown.

Que cada paso esté **tipado en su frontera** hace que cuando algo cambia
(por ejemplo, añadir un nuevo campo) tengas que cambiar exactamente cinco
sitios y el compilador te recuerda los cinco.

## Principales problemas que me encontré

### 1. Locale y tests

`Intl.NumberFormat('es-ES', { style: 'currency' })` se comporta distinto en
el browser que en el Node de los tests (jsdom no incluye datos ICU
completos). El test inicial buscaba `1.500 €` y recibió `1500 €`. Solución:
hacer la regex del test tolerante a varios separadores de miles.

### 2. Refetch infinito en `useApi`

Mi primera versión metía el `fetcher` directamente en las dependencias del
`useEffect`. Cada render creaba una función nueva → re-fetch → re-render →
re-fetch infinito. Lo arreglé con un `fetcherRef.current = fetcher` que
mantiene siempre la última versión sin invalidar el efecto.

### 3. Diseñar el DTO de calc

Tuve que decidir si `taxRatePct` formaba parte del input persistido o solo
del cálculo. Al final lo guardo en el contexto del usuario (puede querer
recordar su tipo impositivo) pero **no** en los escenarios guardados (cada
escenario cambia los porcentajes de ahorro/inversión, no los impuestos).
Es la clase de decisión que se ve obvia *después* de tomarla.

### 4. CORS en local

El primer arranque dio CORS errors al hacer fetch desde
`localhost:5173`. Lo solucioné configurando el `vite.config.ts` con un
`proxy` que redirige `/api` al backend, así el cliente cree que hablan
con el mismo origen y no hay preflight.

## Cómo usé IA durante el desarrollo

- **Generación de boilerplate**: tipos DTO, helpers de validación,
  scaffolding de componentes y configuración de Tailwind y Vite. La IA me
  ahorró tiempo en partes mecánicas que conocía bien.
- **Revisión de patrones React**: pedí explicaciones sobre cuándo usar
  `useMemo` vs `useCallback`, y sobre cómo evitar el patrón antipático de
  initializar Context con un valor "falso".
- **Ideas de UI**: la decisión de hacer la calculadora reactiva (sin botón)
  con debounce salió de una conversación sobre ergonomía con el asistente.
- **Búsqueda de bugs**: cuando me apareció el refetch infinito, pegar el
  hook al asistente me ayudó a localizar el origen rápido.
- **Documentación**: la primera versión de cada `docs/*.md` la generé con
  IA y luego la edité para que reflejara mis decisiones reales del
  proyecto. Sin la IA, escribir 14 documentos hubiera consumido el doble
  de tiempo.

Lo que **no** delegué a la IA:

- Las decisiones de arquitectura (qué va a localStorage, dónde validar,
  qué fórmula usar para el cálculo).
- La verificación manual de la app: probé yo todos los flujos.
- La estructura del repositorio y el plan de despliegue.

## Si volviera a empezar

1. **Workspace para tipos compartidos** desde el día uno, aunque añada
   complejidad al setup. La duplicación de DTO escala mal.
2. **Tests de integración** para el backend con `supertest`. Hubieran
   pillado el bug de validación más rápido que `curl` manual.
3. **Storybook** para los componentes reutilizables. Documentar visualmente
   cada uno haría la sección de `components.md` mucho más útil.
4. **Persistencia real desde el principio**, aunque sea SQLite. El store
   en memoria es engañosamente simple y oculta problemas reales (reset
   tras deploy, concurrencia, transacciones).

## Conclusión

El proyecto cumple los objetivos: una aplicación fullstack con frontend
tipado, backend en capas, contrato común y documentación completa. Lo más
valioso para mí no fue ninguna pieza individual, sino sentir cómo encajan:
TypeScript propaga el tipo de un slider hasta el cálculo del salario y de
vuelta a la pantalla, sin que en ningún punto haya que confiar en
suposiciones.
