# [TASK-301] Modelo Zod y parser seguro de tareas

- **Estado:** 🔴 Pendiente
- **Epic:** Epic 3 — Sistema de Tareas
- **Prioridad:** Alta

---

## 🎯 Objetivo
Definir la validación en tiempo de ejecución para el modelo de tareas extendido usando Zod.

---

## 📁 Archivos Involucrados
- `src/types/task.ts` (nuevo)
- `src/lib/validations/task.ts` (nuevo)
- `src/lib/validations/task.test.ts` (nuevo)

---

## 📝 Instrucciones

1. Definir el esquema `taskSchema`:
   - `id`: string
   - `title`: string (mínimo 1 carácter)
   - `completed`: boolean
   - `priority`: `'low' | 'medium' | 'high'`
   - `dueDate`: string ISO opcional
   - `tags`: array de strings
   - `archived`: boolean
2. Implementar `parseTasks(data: unknown): Task[]` con capacidad de filtrar/sanear elementos inválidos sin romper la aplicación.
3. Escribir tests probando cargas de datos válidos, corruptos y tipos incorrectos.

---

## ✅ Criterio de Aceptación
- [ ] Cobertura 100% en `src/lib/validations/task.ts`.
- [ ] Patrón AAA cumplido estrictamente en todos los casos de test.