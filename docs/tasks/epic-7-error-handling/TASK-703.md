# TASK-703: Middleware e Interceptor de Excepciones Asíncronas

- **Épica:** Épica 7 - Resilience & Error Handling
- **Estado:** 🔴 Pendiente
- **Prioridad:** Media
- **Archivos principales a crear/modificar:**
  - `src/services/apiClient.ts`
  - `src/services/__tests__/apiClient.test.ts`
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Crear un cliente o wrapper HTTP centralizado (`apiClient`) que intercepte todas las peticiones asíncronas (fetch/axios) del dashboard para capturar fallos de red (HTTP 500, timeouts, sin conexión) y registrarlos automáticamente en el `ErrorContext` (`TASK-702`) sin lanzar excepciones no controladas.

---

## 📋 Requisitos Técnicos
1. **Wrapper HTTP (`apiClient`):**
   - Método `fetchWithRetry(url, options, maxRetries = 2)`.
   - Normalizar la respuesta de error a una interfaz unificada `AppError` (`{ message, code, status }`).
   - Reintentar peticiones fallidas automáticamente si se trata de errores 5xx o timeout antes de notificar al usuario.
2. **Integración:**
   - Conectar los servicios de integración (Calendar, Gmail, Clima) a este cliente unificado.

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- **Casos de prueba indispensables (AAA):**
  1. Devuelve los datos correctamente en peticiones HTTP 200.
  2. Reintenta la petición hasta `maxRetries` ante errores 503 o timeouts.
  3. Dispara la notificación del banner de error cuando se agotan los reintentos.

---

## ✅ Checklist de Verificación (Definition of Done)
- [ ] `apiClient` con lógica de reintentos e interceptor completado.
- [ ] Cobertura al 100% en pruebas de servicios.
- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] Marcado como `🟢 Completado` en `docs/tasks/README.md`.
