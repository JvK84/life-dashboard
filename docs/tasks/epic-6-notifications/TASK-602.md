# TASK-602: Notificaciones del Navegador (Web Notifications API)

- **Épica:** Épica 6 - Sync & Notifications
- **Estado:** 🔴 Pendiente
- **Prioridad:** Media
- **Archivos principales a crear/modificar:**
  - `src/services/notifications/browserNotifications.ts`
  - `src/services/notifications/__tests__/browserNotifications.test.ts`
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Implementar una capa de servicio abastracta que solicite permisos para la Web Notifications API nativa del navegador y permita enviar notificaciones del sistema cuando haya eventos críticos (ej. recordatorios de Google Calendar próximos o correos urgentes).

---

## 📋 Requisitos Técnicos
1. **Servicio (`browserNotifications.ts`):**
   - Método `requestNotificationPermission()` con manejo de estados (`granted`, `denied`, `default`).
   - Método `sendBrowserNotification(title, options)` que compruebe permisos y si la pestaña está en segundo plano.
2. **Resiliencia:**
   - Comprobación de existencia de `window.Notification` para entornos SSR/Next.js y navegadores no compatibles.

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- **Casos de prueba indispensables (AAA):**
  1. Solicita permiso correctamente y resuelve el estado.
  2. Emite la notificación si el permiso es `granted`.
  3. No dispara la notificación ni arroja excepciones si el permiso es `denied` o la API no está disponible en `window`.

---

## ✅ Checklist de Verificación (Definition of Done)
- [ ] Abstracción de Notificaciones Web nativas lista.
- [ ] Cobertura de tests al 100%.
- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] Marcado como `🟢 Completado` en este archivo y en `docs/tasks/README.md`.