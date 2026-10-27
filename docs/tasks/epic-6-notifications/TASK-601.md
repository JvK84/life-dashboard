# TASK-601: Sistema Centralizado de Notificaciones Toast

- **Épica:** Épica 6 - Sync & Notifications
- **Estado:** 🟢 Completada
- **Prioridad:** Alta
- **Archivos principales a crear/modificar:**
  - `src/context/ToastContext.tsx`
  - `src/components/ui/ToastContainer.tsx`
  - `src/components/ui/__tests__/ToastContainer.test.tsx`
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Crear un sistema global de alertas tipo *Toast* (éxito, error, advertencia, info) accesible desde cualquier componente/hook mediante un Custom Hook `useToast`, asegurando anuncios dinámicos para lectores de pantalla via `aria-live`.

---

## 📋 Requisitos Técnicos
1. **Toast Context & Hook (`useToast`):**
   - API limpia: `addToast({ type: 'success' | 'error' | 'info', message: string, duration?: number })`.
   - Auto-descarte configurable (default: 4000ms).
2. **Componente Visual (`ToastContainer`):**
   - Renderizado flotante (Bottom-Right o Top-Right).
   - Animación de entrada/salida fluida y accesible.
   - Botón manual para cerrar cada toast.
3. **Accesibilidad:**
   - Contenedor con `role="status"` o `aria-live="polite"` (para `info`/`success`) y `aria-live="assertive"` (para `error`).

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- **Casos de prueba indispensables (AAA):**
  1. Muestra un toast al llamar a `addToast` y se elimina automáticamente al pasar el tiempo especificado (`vi.useFakeTimers()`).
  2. Permite descartar un toast manualmente al hacer clic en el botón de cierre.
  3. Soporta múltiples toasts apilados correctamente.

---

## ✅ Checklist de Verificación (Definition of Done)
- [x] Contexto y Provider de Toast implementados con TypeScript estricto.
- [x] Atributos `aria-live` validados para accesibilidad.
- [x] Tests al 100% de cobertura.
- [x] `npm run lint` y `npm run build` sin errores.
- [x] Marcado como `🟢 Completado` en este archivo y en `docs/tasks/README.md`.
