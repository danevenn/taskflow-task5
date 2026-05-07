# Gestión del proyecto

## Tablero

Para organizar el trabajo de Dream Life Calculator se utiliza un tablero de
**Trello** público. La URL debe colocarse en el `README.md` y en este
documento. Sustituye el placeholder antes de hacer push:

> **Tablero**: `https://trello.com/b/<id-del-tablero>/dream-life-calculator`

## Metodología elegida: Kanban ligero

Como el proyecto es individual y las tareas son muy heterogéneas (documentación,
código frontend, código backend, despliegue), se ha optado por **Kanban**
con tres columnas:

1. **Por hacer (To Do)**: tareas pendientes priorizadas de arriba hacia abajo.
2. **En progreso (In Progress)**: tareas en las que se está trabajando ahora
   mismo. **WIP limit = 2** para evitar el cambio de contexto excesivo.
3. **Hecho (Done)**: tareas completadas y verificadas.

Razones para descartar Scrum:

- No tengo Product Owner externo: yo decido qué hacer.
- Las tareas no se prestan a sprints rígidos de dos semanas; algunas son de
  10 minutos (escribir un README), otras de medio día.
- Las ceremonias de Scrum (planning, daily, review, retro) tendrían poco
  valor para una persona.

## Backlog inicial (resumen)

| # | Tarea | Estado |
|---|---|---|
| 1 | Investigación de Agile / Scrum / Kanban | Done |
| 2 | Definición de la idea y el usuario | Done |
| 3 | Setup del proyecto Vite + React + TS + Tailwind | Done |
| 4 | Estructura de carpetas (src/, server/, docs/) | Done |
| 5 | Backend Express con arquitectura por capas | Done |
| 6 | Cliente API tipado en frontend | Done |
| 7 | Context global (DreamLifeContext) | Done |
| 8 | Custom hooks (useApi, useDebouncedValue) | Done |
| 9 | Páginas: Home, Expenses, Calculator, Scenarios, About, 404 | Done |
| 10 | Componentes reutilizables (Layout, StatCard, SliderField, Modal, ...) | Done |
| 11 | Documentación en docs/ | Done |
| 12 | Tests con vitest | Done |
| 13 | Despliegue en Vercel | Pendiente |
| 14 | Retrospectiva final | Pendiente |

## Definición de "Hecho" (Definition of Done)

Una tarea solo se mueve a *Done* si cumple todos los puntos aplicables:

- [ ] El código compila sin warnings de TypeScript.
- [ ] El componente o endpoint se ha probado manualmente.
- [ ] Si introduce código frontend, se ha verificado en el navegador.
- [ ] Si introduce código backend, se ha verificado con `curl` o desde la UI.
- [ ] La documentación correspondiente en `docs/` se ha actualizado.
- [ ] El cambio se ha commiteado con un mensaje descriptivo.

## Flujo diario

1. Mirar la columna *In Progress*: ¿hay algo bloqueado?
2. Si una tarea está terminada, validarla contra la DoD y moverla a *Done*.
3. Coger la tarea de mayor prioridad de *To Do* y moverla a *In Progress*.
4. Trabajar en ella hasta acabar o quedar bloqueada.
5. Antes de cerrar la sesión, anotar en la tarjeta lo que falta.

## Métricas

- **Cycle time**: días desde que una tarea entra en *In Progress* hasta que
  llega a *Done*.
- **Throughput**: tareas completadas por semana.

Estas métricas se anotan informalmente en cada tarjeta de Trello.
