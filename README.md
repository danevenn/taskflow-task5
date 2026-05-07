# Dream Life Calculator

> Calcula el salario que necesitas para vivir tu vida ideal.

Aplicación fullstack que permite estimar el sueldo neto, bruto mensual y
bruto anual a partir de tus gastos actuales, tus metas de ahorro/inversión
y tus extras de estilo de vida.

- **Frontend**: React 18 + TypeScript + Tailwind CSS + React Router 6
- **Backend**: Node.js + Express 4 con arquitectura por capas
- **Testing**: Vitest + Testing Library
- **Deploy**: Vercel (frontend + Vercel Function para el API)

## Enlaces

- 🌐 **Aplicación en producción**: https://testflow-task5.vercel.app
- 🔌 **API en producción**: https://testflow-task5.vercel.app/api/v1/health
- 📋 **Tablero de gestión (Trello)**: `https://trello.com/b/<id-del-tablero>/dream-life-calculator` *(rellenar)*
- 📁 **Repositorio GitHub**: https://github.com/danevenn/testflow-task5

## Funcionalidades

- 📊 Seguimiento mensual de gastos por categoría con CRUD.
- 🎯 Sliders interactivos para metas de ahorro, inversión y estilo de vida.
- 💼 Cálculo en tiempo real del salario neto, bruto mensual y bruto anual.
- 💾 Guardado de escenarios para comparar configuraciones distintas.
- 🌐 SPA con cinco rutas + página 404.

## Estructura

```
.
├── docs/                Documentación completa del proyecto
├── server/              Backend Express
│   └── src/
│       ├── config/      Configuración (env)
│       ├── controllers/ Capa HTTP
│       ├── middleware/  Validación y errores
│       ├── routes/      Routers Express
│       ├── services/    Lógica de negocio + store
│       └── types/       DTOs del API
├── src/                 Frontend React
│   ├── api/             Cliente HTTP tipado
│   ├── components/      UI reutilizable
│   ├── context/         Context API
│   ├── hooks/           Custom hooks
│   ├── pages/           Páginas (rutas)
│   ├── types/           Tipos compartidos con el backend
│   └── utils/           Helpers puros
├── index.html           Entrada del SPA
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Setup local

```bash
git clone https://github.com/danevenn/testflow-task5.git
cd testflow-task5
npm install
npm run dev
```

`npm run dev` arranca **a la vez**:

- Frontend Vite en [http://localhost:5173](http://localhost:5173)
- Backend Express en `http://localhost:3001`

Vite redirige todas las peticiones a `/api` al backend, así que el frontend
funciona sin configurar nada más.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Arranca frontend + backend en paralelo. |
| `npm run dev:client` | Solo frontend. |
| `npm run dev:server` | Solo backend (con `tsx watch`). |
| `npm run build` | Build de producción de cliente y servidor. |
| `npm run build:client` | Solo build de Vite. |
| `npm run build:server` | Solo `tsc` del backend a `server/dist`. |
| `npm start` | Arranca el bundle compilado del backend. |
| `npm run lint` | ESLint sobre todo el repo. |
| `npm test` | Ejecuta los tests con Vitest. |

## Variables de entorno

Crea un `.env` (opcional) basado en `.env.example`:

```env
# Backend
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_BASE_URL=/api/v1
```

## Documentación

| Archivo | Contenido |
|---|---|
| [docs/agile.md](docs/agile.md) | Investigación de Agile, Scrum y Kanban. |
| [docs/idea.md](docs/idea.md) | Idea, problema, usuario y funcionalidades. |
| [docs/project-management.md](docs/project-management.md) | Tablero y metodología. |
| [docs/design.md](docs/design.md) | Arquitectura y decisiones. |
| [docs/components.md](docs/components.md) | Componentes reutilizables. |
| [docs/hooks.md](docs/hooks.md) | Hooks built-in y custom. |
| [docs/context.md](docs/context.md) | Context API y persistencia. |
| [docs/routing.md](docs/routing.md) | Rutas y navegación. |
| [docs/forms.md](docs/forms.md) | Formularios y validación. |
| [docs/api.md](docs/api.md) | Endpoints y contratos del API. |
| [docs/api-client.md](docs/api-client.md) | Cliente HTTP tipado en frontend. |
| [docs/testing.md](docs/testing.md) | Estrategia de testing. |
| [docs/deployment.md](docs/deployment.md) | Despliegue en Vercel. |
| [docs/retrospective.md](docs/retrospective.md) | Reflexión final. |

## Licencia

MIT.
