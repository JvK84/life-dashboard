# [TASK-302] Hook de persistencia local y operaciones de tareas

- **Estado:** 🟢 Completado
- **Epic:** Epic 3 — Sistema de Tareas
- **Prioridad:** Alta

---

## 🎯 Objetivo
Extender la gestión de estado de tareas para soportar edición, cambio de prioridad, filtrado y etiquetado con persistencia segura en LocalStorage.

---

## 📁 Archivos Involucrados
- `src/hooks/useTasks.ts`
- `src/hooks/useTasks.test.ts`

---

## 📝 Instrucciones

1. Usar el parser seguro Zod (`TASK-301`) al recuperar datos de LocalStorage.
2. Añadir mutadores: `addTask`, `updateTask`, `deleteTask`, `toggleArchiveTask`.
3. Derivar listas filtradas por estado (activas, completadas, archivadas) y por etiqueta.
4. Generar identificadores mediante `crypto.randomUUID()` o generador estable inyectable para tests.
5. Probar mutaciones y recuperación segura ante datos corruptos.

---

## ✅ Criterio de Aceptación
- [x] Módulo testeadísimo con 100% de cobertura.
- [x] Cero cierres desactualizados (usar actualizaciones funcionales de estado `setTasks(prev => ...)`).
