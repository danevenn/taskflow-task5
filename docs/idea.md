# Idea: Dream Life Calculator

## Problema que intenta resolver

La mayoría de personas no sabe **cuánto dinero necesitaría ganar realmente**
para vivir la vida que aspira a tener. Cuando se negocia un sueldo, se pide
una cifra basada en la intuición o en lo que cobran otros, pero raramente en
un análisis honesto de los gastos actuales, los objetivos de ahorro, las
metas de inversión y los extras de estilo de vida (viajes, hobbies,
suscripciones).

Dream Life Calculator ataca este problema ofreciendo una herramienta visual
que permite traducir los objetivos de vida en una cifra concreta de salario
neto y bruto a final de mes.

## Usuario objetivo

- Personas entre **25 y 45 años** que están planificando un cambio de trabajo,
  un cambio de país o un cambio de estilo de vida.
- Personas que han empezado a interesarse por la **independencia financiera**
  o el FIRE pero todavía no tienen una hoja de ruta clara.
- Estudiantes y juniors que están entrando en el mercado laboral y quieren
  entender qué salario necesitan pedir.
- Parejas que quieren modelar escenarios conjuntos antes de tomar decisiones
  importantes (mudanza, hipoteca, hijos).

No está dirigida a expertos en finanzas: el lenguaje y los inputs son
deliberadamente sencillos.

## Funcionalidades principales (MVP)

1. **Registro de gastos mensuales por categoría** (vivienda, comida,
   transporte, ocio, etc.) con CRUD básico.
2. **Total de gastos calculado automáticamente** y reutilizable en la
   calculadora.
3. **Calculadora interactiva** con deslizadores para:
   - Meta de ahorro (% sobre gastos)
   - Meta de inversión (% sobre gastos)
   - Extras de estilo de vida (€/mes)
   - Tipo impositivo estimado (%)
4. **Cálculo en tiempo real** del salario neto, bruto mensual y bruto anual.
5. **Visualización del breakdown** del salario en gastos, ahorro, inversión,
   estilo de vida e impuestos.
6. **Guardado de escenarios** con un nombre, para comparar varias
   configuraciones.

## Funcionalidades opcionales

- Comparador lado a lado de dos escenarios.
- Importación / exportación de gastos en CSV.
- Recordatorios mensuales por email para revisar gastos.
- Modo pareja (suma de dos personas con porcentaje de aportación).
- Conversión de moneda (EUR / USD / GBP).
- Modo oscuro.

## Posibles mejoras futuras

- **Conexión con bancos vía Open Banking** (PSD2) para autoimportar gastos.
- **Proyección a 5/10 años** considerando inflación e incrementos salariales.
- **Plan de inversión sugerido** según el porcentaje de inversión elegido
  (cartera indexada, fondos, ETFs).
- **Cuentas multi-usuario** con autenticación y persistencia real en base de
  datos.
- **Modo offline** con sincronización en background.
- **Comparativa con datos públicos**: salario medio por sector y país.
- **Versión móvil** con React Native (compartiendo lógica de la calculadora
  con el frontend web).

## Tecnologías utilizadas

- **Frontend**: React 18 + TypeScript + Tailwind CSS + React Router 6
- **Backend**: Node.js + Express 4 (arquitectura por capas)
- **Almacenamiento**: en memoria (suficiente para el ejercicio); en una
  versión futura se migraría a una base de datos del Vercel Marketplace
  (Neon Postgres o Upstash Redis).
- **Despliegue**: Vercel (frontend + serverless functions del backend).

## Repositorio

- **Repositorio**: https://github.com/danevenn/taskflow-task5
- **Aplicación desplegada**: https://taskflow-task5.vercel.app
