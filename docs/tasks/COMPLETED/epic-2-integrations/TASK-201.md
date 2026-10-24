# [TASK-201] Normalizador de correos de Gmail a tipos internos

- **Estado:** 🟢 Completado
- **Epic:** Epic 2 — Integraciones Personales
- **Prioridad:** Media

---

## 🎯 Objetivo
Transformar las respuestas crudas de la API de Gmail en un tipo de datos interno `InboxMessage` unificado y limpio para la interfaz.

---

## 📁 Archivos Involucrados
- `src/types/inbox.ts` (nuevo)
- `src/lib/integrations/gmail/normalizer.ts` (nuevo)
- `src/lib/integrations/gmail/normalizer.test.ts` (nuevo)

---

## 📝 Instrucciones

1. Crear el tipo TypeScript `InboxMessage`: `{ id: string; sender: string; subject: string; snippet: string; date: string; unread: boolean }`.
2. Implementar `normalizeGmailMessage(rawMessage: unknown): InboxMessage`.
3. Manejar fallbacks para cabeceras ausentes, asuntos vacíos y marcas de tiempo no estándar.
4. Escribir tests con patrón AAA probando estructuras completas, incompletas o corruptas.

---

## ✅ Criterio de Aceptación
- [x] 100% de cobertura en el nuevo módulo de normalización.
- [x] Tipado estricto en TypeScript sin `any` explícito.
