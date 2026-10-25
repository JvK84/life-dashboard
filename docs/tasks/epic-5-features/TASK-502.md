# [TASK-502] Motor de atajos de teclado globales

- **Estado:** 🟢 Completada
- **Epic:** Epic 5 — Experiencia y Entorno Doméstico
- **Prioridad:** Baja

---

## 🎯 Objetivo
Añadir soporte para accesos rápidos por teclado globales (ej. `N` nueva tarea, `D` alternar tema oscuro/claro, `?` abrir ayuda de atajos).

---

## 📁 Archivos Involucrados
- `src/hooks/useKeyboardShortcuts.ts` (nuevo)
- `src/hooks/useKeyboardShortcuts.test.ts` (nuevo)
- `components/dashboard.tsx`

---

## 📝 Instrucciones

1. Crear un custom hook que escuche eventos de teclado globales (`keydown`).
2. Desactivar la ejecución de atajos si el foco actual se encuentra dentro de un `input`, `textarea` o elemento `contenteditable`.
3. Crear modal/diálogo accesible que enumere los atajos de teclado al pulsar `?`.
4. Escribir tests unitarios simulando pulsaciones de teclado con `fireEvent.keyDown`.

---

## ✅ Criterio de Aceptación
- [x] Ignora eventos dentro de campos de texto.
- [x] Tests de simulación de teclado pasando con cobertura 100%.
