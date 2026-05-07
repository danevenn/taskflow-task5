# Despliegue

## Plataforma: Vercel

Se despliega frontend y backend en el mismo proyecto de Vercel. El frontend
se sirve como un build estático de Vite y el backend como una **Vercel
Function** (Fluid Compute, runtime Node.js).

## Estructura del proyecto en Vercel

```
/                  ← repositorio
├── api/           ← punto de entrada de la función serverless
│   └── index.ts   ← re-exporta la app Express con `export default app`
├── server/        ← código del backend (capas)
├── src/           ← código del frontend
└── vercel.ts      ← configuración del deploy
```

## Archivo `vercel.ts`

```ts
import { routes, type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build:client',
  outputDirectory: 'dist',
  rewrites: [
    routes.rewrite('/api/(.*)', '/api/$1'),
  ],
};
```

> Nota: si se usa la versión clásica `vercel.json`, su contenido equivalente
> es el mismo `rewrites` y `framework: "vite"`.

## Punto de entrada serverless

Crea `api/index.ts` (al lado de las carpetas `src/` y `server/`):

```ts
import { buildApp } from '../server/src/app';

export default buildApp();
```

Vercel detectará automáticamente el archivo y lo expondrá como una
Vercel Function. Al adjuntar la app de Express directamente, se reusa la
misma capa de routes/controllers/services del backend local.

## Variables de entorno

Para este proyecto **no son necesarias** en producción (el backend no se
conecta a servicios externos). Solo se configuran en local:

| Variable | Lugar | Valor por defecto | Descripción |
|---|---|---|---|
| `PORT` | local | 3001 | Puerto del Express en dev. |
| `CORS_ORIGIN` | local | `*` | Origen permitido. |
| `VITE_API_BASE_URL` | local opcional | `/api/v1` | Base URL del API si quieres apuntar a otra cosa. |

En el futuro, si se añade base de datos, se gestionarían con
`vercel env pull` y `vercel env add` (ver
[env-vars.md](https://vercel.com/docs)).

## Flujo de despliegue

### Primera vez

```bash
# 1. Asegúrate de tener la CLI instalada
npm i -g vercel

# 2. Vincula el repo al proyecto
vercel link

# 3. Despliegue de prueba
vercel

# 4. Despliegue a producción
vercel --prod
```

### Despliegues posteriores

Vercel está conectado a GitHub, así que cada push a `main` dispara un
deploy a producción y cada push a otra rama crea un *preview*.

## URLs

Una vez desplegado, las URLs serán:

- **Frontend (producción)**: `https://<tu-app>.vercel.app`
- **API (producción)**: `https://<tu-app>.vercel.app/api/v1/health`
- **Frontend (preview)**: cada PR genera una URL `*-git-<branch>.vercel.app`.

Sustituye `<tu-app>` por el slug real del proyecto en Vercel y añade ambas
URLs al `README.md` y a la sección "URLs" de
[idea.md](./idea.md).

## Comprobaciones post-deploy

1. Abrir el frontend y verificar que carga la home.
2. Navegar a `/calculator` y comprobar que las llamadas al API responden
   (DevTools → Network).
3. Probar `/api/v1/health` directamente en el navegador.
4. Probar una mutación: crear un gasto, refrescar, verificar que persiste.
5. Comprobar que `/cualquiera` lleva al 404 del frontend (Vercel debe hacer
   el fallback a `index.html` para rutas SPA).

## Limitación importante

El backend usa **store en memoria**. En Vercel, cada invocación de Fluid
Compute puede o no compartir instancia con la siguiente: aunque Fluid
reusa instancias, no garantiza persistencia. **En producción real** los
datos podrían perderse entre deploys o cuando la función se recicla.

Para producción se debería migrar a una base de datos como **Neon Postgres**
o **Upstash Redis** (ambas disponibles en el Vercel Marketplace con
auto-provisión de variables de entorno).

## Rollback

Vercel mantiene un historial de despliegues. Si una versión rompe algo:

```bash
vercel rollback   # vuelve al deploy anterior
```

O bien desde el dashboard, en "Deployments", marcar uno anterior como
"Promote to Production".
