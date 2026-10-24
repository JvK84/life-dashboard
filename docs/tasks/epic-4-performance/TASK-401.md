# TASK-401: Sincronización en Background con Polling Adaptativo

- **Épica:** Épica 4 - Rendimiento y Sincronización
- **Estado:** ✅ Completada
- **Prioridad:** Media / Alta
- **Archivos principales a crear/modificar:**
  - `src/hooks/useSmartPolling.ts`
  - `src/hooks/__tests__/useSmartPolling.test.ts`
  - `src/components/widgets/CalendarWidget.tsx` (o widgets que consuman la API)
  - `docs/tasks/README.md`

---

## 🎯 Objetivo
Implementar un Custom Hook reusable (`useSmartPolling`) que gestione las peticiones periódicas a las APIs del dashboard (Calendar, Gmail, Clima) de forma eficiente. El hook debe pausar las peticiones cuando la pestaña del navegador pierda el foco (`document.visibilityState === 'hidden'`), reactivarlas al recuperar el foco y aplicar un algoritmo de **Backoff Exponencial** cuando las peticiones devuelvan errores de tasa de límite (HTTP 429) o fallos de red.

---

## 📋 Requisitos Técnicos

### 1. Comportamiento del Custom Hook (`useSmartPolling`)
- **Parámetros de entrada:**
  - `fetcher`: Función asíncrona que realiza la petición HTTP.
  - `intervalMs`: Intervalo base en milisegundos (ej. 30,000 ms para Calendar, 60,000 ms para Gmail).
  - `enabled`: Booleano opcional para activar/desactivar el polling (default: `true`).
  - `maxBackoffMs`: Límite máximo para el intervalo extendido en caso de error (default: `300,000 ms` / 5 minutos).
- **Retorno:**
  - `{ data, error, isLoading, isRefetching, refetch }`

### 2. Gestión de Visibilidad (Page Visibility API)
- Escuchar el evento `visibilitychange` de `window.document`.
- Si `document.hidden` es `true`, detener el temporizador activo.
- Al volver a estar visible (`document.hidden === false`), ejecutar inmediatamente un `refetch()` y reiniciar el temporizador con el intervalo base.

### 3. Backoff Exponencial y Manejo de Errores
- Si la petición falla con un estado HTTP 429 (Rate Limit) o un error de red:
  - Duplicar el intervalo actual: $interval = \min(interval \times 2, maxBackoffMs)$.
- Tras la primera petición exitosa posterior a un error:
  - Restaurar el intervalo al valor base original (`intervalMs`).

---

## 🧪 Estrategia de Testing (Vitest + RTL)
- Pruebas unitarias obligatorias en `src/hooks/__tests__/useSmartPolling.test.ts` utilizando `@testing-library/react`.
- Aplicar estrictamente el patrón **AAA (Arrange-Act-Assert)** en cada test.
- Utilizar `vi.useFakeTimers()` para simular el paso del tiempo sin demoras en la ejecución del CI.
- **Casos de prueba indispensables:**
  1. Ejecuta la petición inicial y repite las llamadas cada `intervalMs`.
  2. Pausa el polling cuando `document.hidden` cambia a `true` y no ejecuta llamadas adicionales.
  3. Ejecuta `refetch` inmediato y reanuda el ciclo al volver `document.hidden` a `false`.
  4. Duplica el intervalo de tiempo tras un error HTTP 429 hasta alcanzar `maxBackoffMs`.
  5. Restablece el intervalo original tras recuperarse de un fallo y completar una petición exitosa.

---

## ✅ Checklist de Verificación (Definition of Done)
- [x] Archivo `src/hooks/useSmartPolling.ts` implementado con TypeScript estricto.
- [x] Polling inicial y periódico configurable con opción `enabled`.
- [x] Pausa al ocultar la pestaña y refetch inmediato al recuperar visibilidad.
- [x] Backoff exponencial para errores de red y HTTP 429, limitado por `maxBackoffMs`.
- [x] Restauración del intervalo base tras una petición exitosa.
- [x] Pruebas AAA con timers falsos para polling, visibilidad, backoff y recuperación.
- [x] Quality gates: cobertura, lint, TypeScript y build.
