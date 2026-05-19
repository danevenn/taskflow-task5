# Gestión del proyecto

## Organización del trabajo

El proyecto Dream Life Calculator se ha desarrollado en solitario sin
herramientas externas de gestión de tareas. La planificación y el
seguimiento viven dentro del propio repositorio:

- **Backlog** y estado de las tareas: la tabla "Backlog inicial" más abajo
  en este mismo documento.
- **Historial de cambios**: los commits del repositorio, con mensajes
  descriptivos del *qué* y del *por qué*.
- **Discusiones de diseño**: la carpeta [`docs/`](.) — cada decisión
  importante queda escrita.

Esta aproximación encaja con el estilo de proyectos solo: el coste de
mantener un tablero externo sincronizado con el repo no compensa cuando
ambos los lleva la misma persona.

## Metodología elegida: Kanban ligero

Como el proyecto es individual y las tareas son muy heterogéneas
(documentación, código frontend, código backend, despliegue), se ha
optado por un **Kanban informal** con tres estados conceptuales:

1. **Por hacer (To Do)**: tareas pendientes priorizadas de arriba hacia abajo.
2. **En progreso (In Progress)**: tarea en la que estoy trabajando ahora
   mismo. **WIP limit = 1–2** para evitar el cambio de contexto excesivo.
3. **Hecho (Done)**: tareas completadas y verificadas.

Razones para descartar Scrum:

- No hay Product Owner externo: yo decido qué hacer.
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
| 13 | Despliegue en Vercel | Done |
| 14 | Retrospectiva final | Done |

## Definición de "Hecho" (Definition of Done)

Una tarea solo se considera *Done* si cumple todos los puntos aplicables:

- [ ] El código compila sin warnings de TypeScript.
- [ ] El componente o endpoint se ha probado manualmente.
- [ ] Si introduce código frontend, se ha verificado en el navegador.
- [ ] Si introduce código backend, se ha verificado con `curl` o desde la UI.
- [ ] La documentación correspondiente en `docs/` se ha actualizado.
- [ ] El cambio se ha commiteado con un mensaje descriptivo.

## Flujo diario

1. Revisar qué tarea estaba *In Progress* la sesión anterior.
2. Si está terminada, validarla contra la DoD y marcarla como *Done*.
3. Coger la tarea de mayor prioridad de *To Do* y pasarla a *In Progress*.
4. Trabajar en ella hasta acabar o quedar bloqueada.
5. Antes de cerrar la sesión, dejar una nota mental (o en commit) de lo
   que falta.

## Métricas

- **Cycle time**: días desde que una tarea entra en *In Progress* hasta que
  llega a *Done*.
- **Throughput**: tareas completadas por semana.

En un proyecto en solitario estas métricas son orientativas, no objetivos
duros. Sirven para detectar tareas que se atascan más de lo esperado.
