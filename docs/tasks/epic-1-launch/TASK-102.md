# [TASK-102] Normalización de acciones visuales pendientes en Dashboard

- **Estado:** 🔴 Pendiente
- **Epic:** Epic 1 — Desbloqueo
- **Prioridad:** Alta

---

## 🎯 Objetivo
Otorgar funcionalidad real o gestionar correctamente el estado inaccesible/inactivo de los controles del Dashboard que actualmente solo tienen representación visual (búsqueda, ver calendario, abrir Gmail, añadir atajo).

---

## 📁 Archivos Involucrados
- `components/dashboard.tsx`
- `components/widgets/*`
- `components/dashboard.test.tsx`

---

## 📝 Instrucciones

1. Revisar los elementos interactivos sin comportamiento.
2. Para los controles sin backend activo (ej. abrir Gmail), implementar un estado `disabled` o un aviso de "próximamente" accesible para lectores de pantalla.
3. Para el control de búsqueda, añadir filtrado local inmediato sobre las tareas visualizadas.
4. Asegurar etiquetas ARIA (`aria-label`, `aria-disabled`) en todos los botones y campos.
5. Añadir tests unitarios comprobando la reacción a la interacción de cada botón.

---

## ✅ Criterio de Aceptación
- [ ] 0 controles interactivos sin handler o sin estado accesible.
- [ ] Cobertura de tests preservada al 100%.
- [ ] `npm run test:coverage` sin errores.