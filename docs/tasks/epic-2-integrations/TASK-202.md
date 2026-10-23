# [TASK-202] Endpoint de lectura de mensajes de Gmail

- **Estado:** 🔴 Pendiente
- **Epic:** Epic 2 — Integraciones Personales
- **Prioridad:** Media

---

## 🎯 Objetivo
Exponer una API route `/api/integrations/google/gmail/messages` que obtenga y normalice los mensajes no leídos del usuario.

---

## 📁 Archivos Involucrados
- `app/api/integrations/google/gmail/messages/route.ts` (nuevo)
- `app/api/integrations/google/gmail/messages/route.test.ts` (nuevo)

---

## 📝 Instrucciones

1. Reutilizar el sistema de tokens OAuth de la integración de Google Calendar.
2. Consultar el endpoint de la API de Gmail con el scope `gmail.readonly`.
3. Normalizar la lista de correos usando `normalizeGmailMessage`.
4. Retornar respuesta JSON con manejo adecuado de errores 401 (no autorizado) y 500.
5. Crear tests de integración mockeando las respuestas de la API de Google.

---

## ✅ Criterio de Aceptación
- [ ] Endpoint probado en Vitest con mocks de API de Google.
- [ ] Cobertura del 100% en las rutas creadas.