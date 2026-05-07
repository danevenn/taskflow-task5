# Formularios e interacción

## Formularios controlados

Todos los formularios de Dream Life Calculator son **controlados**: el valor
de cada input vive en `useState` y se actualiza en cada `onChange`. Esto
permite validar antes de enviar, dar feedback inmediato y limpiar tras un
submit exitoso.

## `ExpenseForm` (alta de gasto)

Archivo: [`src/components/ExpenseForm.tsx`](../src/components/ExpenseForm.tsx)

### Estado

```tsx
const [category, setCategory] = useState('');
const [amount, setAmount] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});
```

### Validación

Se hace **antes de llamar al `onSubmit`** para mostrar mensajes inline:

```ts
const validate = (): boolean => {
  const next: Record<string, string> = {};
  if (!category.trim()) next.category = 'La categoría es obligatoria';
  if (category.trim().length > 40) next.category = 'Máximo 40 caracteres';
  const amt = Number(amount);
  if (!amount || Number.isNaN(amt)) next.amount = 'Introduce un importe válido';
  else if (amt < 0) next.amount = 'El importe no puede ser negativo';
  setErrors(next);
  return Object.keys(next).length === 0;
};
```

Las reglas (longitud máxima, importes positivos) coinciden con las del
backend. Una doble capa de seguridad: el cliente da feedback rápido, el
servidor es la frontera real.

### Mensajes de error

Cada input renderiza su error debajo:

```tsx
{errors.category && (
  <p className="mt-1 text-xs text-red-600">{errors.category}</p>
)}
```

### Mensaje de confirmación

Tras un submit exitoso el formulario se limpia (`setCategory('')`, etc.) y
el nuevo gasto aparece inmediatamente en la lista mediante mutación
optimista en el `useApi.setData`.

## `CalculatorPage` (formulario "sin botón")

La calculadora no tiene botón "Calcular": cada slider/número actualiza el
estado del contexto y un `useEffect` con `useDebouncedValue` dispara la
llamada al backend tras 250 ms sin cambios. Es una **forma de formulario
reactivo** que entrega resultados sin fricción.

Errores del API se muestran en un `ErrorView` con botón "Reintentar".

## Modal "Guardar escenario"

Cuando el usuario pulsa **Guardar escenario** se abre un `Modal` con un
único input (nombre). El submit:

1. Valida que el nombre no esté vacío (botón deshabilitado si lo está).
2. Llama a `api.createScenario`.
3. Cierra el modal y muestra un toast verde durante 2.5 segundos:
   ```tsx
   {savedToast && (
     <div className="fixed bottom-6 right-6 ... bg-emerald-600 text-white">
       {savedToast}
     </div>
   )}
   ```

## Estilo de feedback

| Tipo | Color | Posición |
|---|---|---|
| Error de validación | Rojo (`text-red-600`) | Bajo el input |
| Error de red | Rojo (`bg-red-50`, `border-red-200`) | Banner sobre la lista |
| Confirmación | Verde (`bg-emerald-600`) | Toast flotante abajo derecha |

## Accesibilidad

- Todos los inputs tienen su `<label htmlFor>` correspondiente.
- Los `aria-label` se añaden donde el botón solo tiene un símbolo (`×` del
  modal).
- El modal usa `role="dialog"` y `aria-modal="true"` y se puede cerrar con
  Escape.
- Los errores se muestran junto al campo correspondiente en lugar de en una
  alerta global.
