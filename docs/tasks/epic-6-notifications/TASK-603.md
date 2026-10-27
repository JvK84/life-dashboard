# TASK-603: Hook e Indicador de Estado de Conexión (Online/Offline)

- **Épica:** Épica 6 - Sync & Notifications
- **Estado:** 🟢 Completada
- **Prioridad:** Media
- **Archivos principales a crear/modificar:**
  - `src/hooks/useNetworkStatus.ts`
  - `src/components/ui/NetworkBadge.tsx`
  - `src/components/ui/__tests__/NetworkBadge.test.tsx`
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Crear un hook `useNetworkStatus` que escuche los eventos `online` y `offline` del navegador y un componente `NetworkBadge` sutil en el header que avise al usuario si se ha perdido la conexión a internet.

---

## 📋 Requisitos Técnicos
1. **Hook (`useNetworkStatus`):**
   - Retorna un booleano `isOnline`.
   - Escucha los eventos `window.addEventListener('online')` y `offline`.
2. **Componente (`NetworkBadge`):**
   - Muestra un banner o indicador discreto si el usuario pasa a estado offline.
   - Lanza un Toast (`TASK-601`) al recuperar la conexión ("Conexión restablecida").

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- **Casos de prueba indispensables (AAA):**
  1. Detecta la pérdida de red cuando se dispara el evento `offline` en `window`.
  2. Cambia el estado a `isOnline: true` al dispararse el evento `online`.
  3. Limpia adecuadamente los *event listeners* al desmontar el hook.

---

## ✅ Checklist de Verificación (Definition of Done)
- [x] Custom hook `useNetworkStatus` e indicador implementados.
- [x] Tests al 100% de cobertura.
- [x] `npm run lint` y `npm run build` en verde.
- [x] Marcado como `🟢 Completado` en este archivo y en `docs/tasks/README.md`.

## 🧭 Prueba manual

1. Abrir el dashboard en un navegador.
2. En DevTools, activar el modo Offline en la pestaña de red y confirmar que aparece el indicador “Sin conexión” en la cabecera.
3. Desactivar el modo Offline y confirmar que aparece el toast “Conexión restablecida”.
