# [TASK-101] Configuración de entorno y PR de Google Calendar

- **Estado:** 🔴 Pendiente
- **Epic:** Epic 1 — Desbloqueo
- **Prioridad:** Bloqueante

---

## 🎯 Objetivo
Subir la integración terminada de Google Calendar en la rama `feature/google-calendar-integration`, abrir Pull Request y verificar el cumplimiento de las quality gates de CI.

---

## 📁 Archivos Involucrados
- `.github/workflows/quality.yml`
- `.env.example`

---

## 📝 Instrucciones

1. Verificar que el entorno local tiene corregido el fallo de `xcrun` para permitir comandos `git`.
2. Crear la rama `feature/google-calendar-integration`.
3. Confirmar las variables de entorno necesarias en `.env.example`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `NEXTAUTH_SECRET`.
4. Hacer push a GitHub y abrir la PR hacia `main`.
5. Comprobar que los checks `Quality / quality` y `Quality / Performance` (Lighthouse CI) se ejecutan y quedan en verde.

---

## ✅ Criterio de Aceptación
- [ ] PR creada sin conflictos.
- [ ] Quality gates de CI en verde.