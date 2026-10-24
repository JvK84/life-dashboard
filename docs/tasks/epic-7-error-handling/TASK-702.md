# TASK-702: Contexto y Banner Superior de Errores Globales

- **Épica:** Épica 7 - Resilience & Error Handling
- **Estado:** 🔴 Pendiente
- **Prioridad:** Alta
- **Archivos principales a crear/modificar:**
  - `src/context/ErrorContext.tsx`
  - `src/components/ui/ErrorBanner.tsx`
  - `src/components/ui/__tests__/ErrorBanner.test.tsx`
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Crear un contexto global (`ErrorContext`) y un componente visual (`ErrorBanner`) fijado en la parte superior del viewport que informe al usuario de errores de red, fallos en la carga de datos o excepciones capturadas.

---

## 📋 Requisitos Técnicos
1. **ErrorContext & Hook (`useGlobalError`):**
   - API: `showError(message: string, options?: { code?: string, persistent?: boolean })`.
   - API: `clearError()`.
2. **Componente Visual (`ErrorBanner.tsx`):**
   - Posición fija en la parte superior (`sticky` / `fixed top-0 z-50`).
   - Estilo de alerta visible (fondo rojo/naranja accesible, icono de advertencia, mensaje claro).
   - Botón de cierre manual y soporte para auto-descarte si no es persistente.
3. **Accesibilidad:**
   - Atributos `role="alert"` y `aria-live="assertive"` para asegurar la lectura inmediata por tecnologías de asistencia.

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- **Casos de prueba indispensables (AAA):**
  1. El banner permanece oculto cuando el estado de error es nulo.
  2. Muestra el mensaje de error inmediatamente arriba al llamar a `showError`.
  3. Cierra el banner y limpia el estado al presionar el botón de descarte o la tecla `Escape`.
  4. Verifica que tiene los atributos `role="alert"` y `aria-live="assertive"`.

---

## ✅ Checklist de Verificación (Definition of Done)
- [ ] Contexto y hook `useGlobalError` implementados.
- [ ] Componente `ErrorBanner` fijado en la parte superior y responsive.
- [ ] Cobertura de tests al 100%.
- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] Marcado como `🟢 Completado` en el backlog global.
