# Metodologías de desarrollo

## ¿Qué es Agile?

Agile es una **filosofía de desarrollo de software** que prioriza la entrega
continua de valor al usuario por encima de la planificación rígida y la
documentación exhaustiva. Surge en 2001 con la firma del *Manifiesto Ágil* por
parte de un grupo de ingenieros que estaban cansados de que los proyectos
fracasaran al seguir modelos en cascada (waterfall) demasiado lentos.

Sus cuatro valores principales son:

1. **Individuos e interacciones** sobre procesos y herramientas.
2. **Software funcionando** sobre documentación extensa.
3. **Colaboración con el cliente** sobre negociación de contratos.
4. **Responder al cambio** sobre seguir un plan.

### Objetivo de Agile en el desarrollo de software

El objetivo es **adaptarse rápido a los cambios** del mercado, del cliente o
del propio equipo, entregando software útil en ciclos cortos. Esto reduce el
riesgo de construir un producto que nadie quiere y permite ajustar el rumbo
con feedback real.

Agile no es una metodología en sí: es un paraguas bajo el cual viven distintos
*frameworks* concretos como Scrum, Kanban, XP o Lean.

---

## ¿Qué es Scrum?

Scrum es uno de los frameworks ágiles más usados. Define un conjunto fijo de
roles, eventos y artefactos para que un equipo pueda entregar incrementos de
producto cada pocas semanas.

### Roles principales

- **Product Owner**: representa al cliente y al negocio. Decide qué se
  construye, prioriza el backlog y asegura que el equipo entiende los
  objetivos.
- **Scrum Master**: facilita el proceso, elimina bloqueos y protege al equipo
  de interrupciones. No es un jefe, es un *coach*.
- **Equipo de desarrollo**: las personas que diseñan, programan y prueban el
  software. Suele ser multidisciplinar (frontend, backend, QA, diseño...).

### Conceptos clave

- **Sprint**: ciclo de trabajo corto y de duración fija (1–4 semanas, 2 es lo
  habitual). Al final del sprint debe haber un incremento de producto
  potencialmente entregable.
- **Product Backlog**: lista priorizada de todo lo que podría hacerse en el
  producto. Es viva: cambia constantemente.
- **Sprint Backlog**: subconjunto del backlog que el equipo se compromete a
  entregar en el sprint actual.
- **Sprint Planning**: reunión al inicio del sprint para decidir qué entrará
  en él.
- **Daily Scrum**: reunión diaria de unos 15 minutos donde el equipo se
  sincroniza sobre el progreso y los bloqueos.
- **Sprint Review**: al final del sprint, el equipo muestra el incremento al
  Product Owner y *stakeholders*. Se recoge feedback.
- **Retrospective**: el equipo reflexiona sobre cómo ha trabajado y qué puede
  mejorar para el próximo sprint.

---

## ¿Qué es Kanban?

Kanban es un método de gestión visual del trabajo que pone el foco en el
**flujo continuo** en lugar de en ciclos fijos. Viene del japonés
*かんばん* (cartel, tablero) y se popularizó en Toyota antes de adoptarse en
software.

La idea central es:

1. **Visualizar el trabajo** en un tablero con columnas (típicamente *To Do*,
   *In Progress*, *Done*; pero se pueden añadir más).
2. **Limitar el WIP (Work In Progress)** en cada columna para evitar
   sobrecarga y cuellos de botella.
3. **Gestionar el flujo**: medir cuánto tarda una tarea en cruzar el tablero
   (lead time, cycle time) y mejorar continuamente.
4. **Hacer las políticas explícitas** (qué significa "terminado", quién mueve
   las tarjetas, etc.).

A diferencia de Scrum, Kanban no impone roles ni eventos. Las tareas entran y
salen del tablero según se acaban.

---

## Diferencias entre Scrum y Kanban

| Aspecto | Scrum | Kanban |
|---|---|---|
| **Ritmo** | Sprints de duración fija (1–4 semanas) | Flujo continuo, sin sprints |
| **Roles** | Product Owner, Scrum Master, equipo | No define roles |
| **Compromiso** | El equipo se compromete con el sprint backlog | No hay compromiso por bloque |
| **Métricas** | Velocity (puntos por sprint), burn-down | Lead time, cycle time, WIP |
| **Cambios** | Difíciles dentro de un sprint | Se pueden introducir en cualquier momento |
| **Tablero** | Se reinicia cada sprint | Persistente |
| **Reuniones** | Planning, daily, review, retro | Solo las que el equipo decida |

En la práctica muchos equipos usan **Scrumban**, una mezcla: ceremonias
ligeras de Scrum + tablero estilo Kanban con WIP limits.

---

## ¿Cuándo usar cada metodología?

### Cuándo usar Scrum
- El producto está en construcción y se necesita iterar con feedback regular.
- El equipo es estable y dedicado a un mismo producto.
- Hay un Product Owner claro que puede priorizar y tomar decisiones.
- El alcance puede acotarse en sprints (no hay urgencias diarias constantes).

### Cuándo usar Kanban
- El trabajo es operativo o de soporte (bugs, peticiones, mantenimiento) y
  llega de forma impredecible.
- Las prioridades cambian constantemente y no se pueden congelar dos semanas.
- Equipos pequeños o que comparten miembros entre proyectos.
- Se quiere optimizar el flujo y reducir tiempo de entrega de tareas
  individuales.

### Cuándo combinar (Scrumban)
- El equipo necesita previsibilidad pero también flexibilidad para incidencias
  urgentes.
- Hay una mezcla de trabajo planificado y reactivo.

---

## Aplicación a este proyecto

Para Dream Life Calculator se utilizó un enfoque **Kanban** sobre un tablero
de Trello con tres columnas (`Por hacer`, `En progreso`, `Hecho`). Se
explica con más detalle en [project-management.md](./project-management.md).
La razón principal: al trabajar en solitario y con tareas muy variadas
(documentación, código, despliegue), tener un sprint fijo añadía ceremonia
sin valor real. Un flujo continuo con WIP limit de 2 fue más eficiente.
