# TASK-701: React Error Boundary Global con Fallback UI

- **Épica:** Épica 7 - Resilience & Error Handling
- **Estado:** 🔴 Pendiente
- **Prioridad:** Alta / Crítica
- **Archivos principales a crear/modificar:**
  - `src/components/error/ErrorBoundary.tsx`
  - `src/components/error/__tests__/ErrorBoundary.test.tsx`
  - `src/app/layout.tsx` (o Root Component)
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Implementar un componente `ErrorBoundary` de React a nivel de raíz (`RootLayout`) y a nivel de widget para capturar cualquier excepción no controlada en el renderizado, evitando el "pantallazo blanco" y manteniendo el resto de la interfaz operativa.

---

## 📋 Requisitos Técnicos
1. **Componente Class/Wrapper (`ErrorBoundary.tsx`):**
   - Capturar excepciones en la fase de renderizado usando `componentDidCatch` y `getDerivedStateFromError`.
   - Prop opcional `fallback`: Permitir pasar un componente visual personalizado por widget.
   - Estado interno `{ hasError: boolean, error: Error | null }`.
   - Incluir un botón "Reintentar" que limpie el estado del Boundary e intente re-renderizar el árbol.
2. **Uso Aislado:**
   - Envolver cada tarjeta/widget del Bento Grid individualmente para que si un widget falla (ej. Clima), los demás (Calendar, Gmail) sigan funcionando normalmente.

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- **Casos de prueba indispensables (AAA):**
  1. Renderiza los hijos normalmente cuando no hay ningún error.
  2. Muestra la UI de reserva (Fallback) cuando un componente hijo lanza una excepción.
  3. Ejecuta la función de reseteo y restaura el renderizado al hacer clic en el botón "Reintentar".
  4. Evita que un error en un widget secundario rompa la renderización de los widgets adyacentes.

---

## ✅ Checklist de Verificación (Definition of Done)
- [ ] Componente `ErrorBoundary` implementado con TypeScript estricto.
- [ ] Fallback UI limpio y accesible.
- [ ] Tests unitarios superados al 100% de cobertura.
- [ ] `npm run lint` y `npm run build` en verde.
- [ ] Estado actualizado a `🟢 Completado` en este archivo y en `docs/tasks/README.md`.
