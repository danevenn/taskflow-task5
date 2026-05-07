# Rutas y navegación

## Configuración

Se utiliza **React Router 6**. La configuración vive en
[`src/App.tsx`](../src/App.tsx):

```tsx
<DreamLifeProvider>
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="scenarios" element={<ScenariosPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
</DreamLifeProvider>
```

### Patrones aplicados

- **Layout route**: el `Route` padre sin `path` envuelve a todos los demás y
  renderiza `<Layout />`. Layout incluye `<Outlet />` donde se monta cada
  página.
- **Index route**: `<Route index>` representa el path `/`.
- **Catch-all 404**: `<Route path="*">` renderiza `NotFoundPage` para
  cualquier URL desconocida.

## Mapa de rutas

| Ruta | Página | Propósito |
|---|---|---|
| `/` | `HomePage` | Landing con explicación del producto y CTAs. |
| `/expenses` | `ExpensesPage` | Gestión CRUD de los gastos mensuales. |
| `/calculator` | `CalculatorPage` | Calculadora interactiva con sliders. |
| `/scenarios` | `ScenariosPage` | Lista de escenarios guardados. |
| `/about` | `AboutPage` | Información del proyecto. |
| `*` | `NotFoundPage` | Página 404 con CTA para volver. |

## Navegación

Hay dos tipos de navegación:

### Declarativa con `<NavLink>` y `<Link>`

En [`Layout.tsx`](../src/components/Layout.tsx) se usan `NavLink`s para que
el enlace activo reciba un estilo distinto:

```tsx
<NavLink to="/calculator" className={navLinkClasses}>Calculadora</NavLink>
```

`NavLink` recibe una función `className` con `{ isActive }`, perfecta para
Tailwind.

### Imperativa con `useNavigate`

En [`ScenariosPage.tsx`](../src/pages/ScenariosPage.tsx) se usa para
redirigir al usuario al cargar un escenario:

```tsx
const navigate = useNavigate();
const handleLoad = (scenario: Scenario) => {
  setInputs({ /* ... */ });
  navigate('/calculator');
};
```

## Página 404

[`NotFoundPage`](../src/pages/NotFoundPage.tsx) muestra un mensaje claro y
un botón de vuelta al inicio. Al usar el catch-all `path="*"`, cualquier URL
no definida cae aquí — incluyendo errores tipográficos del usuario.

## Comportamiento en producción

En **desarrollo** Vite gestiona el fallback a `index.html` para todas las
rutas. En **producción** sobre Vercel, la configuración de un SPA con
`vercel.json` o `vercel.ts` debe redirigir cualquier ruta no estática a
`index.html` para que React Router pueda gestionarla. El backend Express
expone `/api/v1/*` y todo lo demás se sirve como SPA. Detalles en
[deployment.md](./deployment.md).
