# [TASK-303] Widget de Tareas con prioridades y filtros de accesibilidad

- **Estado:** 🟢 Completado
- **Epic:** Epic 3 — Sistema de Tareas
- **Prioridad:** Alta

---

## 🎯 Objetivo
Rediseñar el componente visual del widget de tareas para reflejar la prioridad, permitir el filtrado por pestañas y garantizar el cumplimiento completo de WCAG.

---

## 📁 Archivos Involucrados
- `components/widgets/TasksWidget.tsx`
- `components/widgets/TasksWidget.test.tsx`

---

## 📝 Instrucciones

1. Integrar el hook `useTasks` (`TASK-302`).
2. Añadir selector de prioridad al crear/editar tareas.
3. Crear pestañas de navegación (Todas, Pendientes, Completadas, Archivadas) con indicación visual de foco y atributos `role="tab"` / `aria-selected`.
4. Verificar contrastes de color para las etiquetas de prioridad en modo claro y oscuro.
5. Crear pruebas unitarias con React Testing Library simulando creación, edición y filtrado de tareas.

---

## ✅ Criterio de Aceptación
- [x] Tests de interacción y accesibilidad pasando en verde.
- [x] Cobertura de branches >= 95%, líneas/funciones = 100%.
