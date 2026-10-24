# Roadmap macro e índice de tareas

Este documento es la fuente única de verdad para el roadmap funcional y las tareas atómicas de `life-dashboard`. Cada tarea contiene objetivo, alcance, criterios de aceptación, dependencias y estado.

## Hito 1 — Desbloqueo y Calidad Base

Estado: **completado**. La base Next.js, los quality gates, la cobertura, la estructura de widgets, la persistencia local y las acciones visuales pendientes están implementadas.

- [x] [TASK-101: Configuración de entorno y PR de Google Calendar](./COMPLETED/epic-1-launch/TASK-101.md) — completada.
- [x] [TASK-102: Normalización de acciones visuales pendientes en Dashboard](./COMPLETED/epic-1-launch/TASK-102.md) — completada.

## Hito 2 — Integraciones Personales / Gmail

Estado: **completado**. Google Calendar está integrado con OAuth, normalización, rangos de agenda, renovación de tokens y validación de performance. Gmail dispone de normalización y endpoint de lectura.

- [x] [TASK-201: Normalizador de correos de Gmail a tipos internos](./COMPLETED/epic-2-integrations/TASK-201.md) — completada.
- [x] [TASK-202: Endpoint de lectura de mensajes de Gmail](./COMPLETED/epic-2-integrations/TASK-202.md) — completada.
- [x] [TASK-203: Integración visual de Gmail y cabecera del dashboard](./COMPLETED/epic-2-integrations/TASK-203.md) — completada.

## Hito 3 — Sistema de Tareas Avanzado

Estado: **completado**. El modelo extendido, la persistencia avanzada, los filtros y las prioridades están implementados.

- [x] [TASK-301: Modelo Zod y parser seguro de tareas](./COMPLETED/epic-3-tasks/TASK-301.md) — completada.
- [x] [TASK-302: Hook de persistencia local y operaciones de tareas](./COMPLETED/epic-3-tasks/TASK-302.md) — completada.
- [x] [TASK-303: Widget de tareas con prioridades y filtros de accesibilidad](./COMPLETED/epic-3-tasks/TASK-303.md) — completada.

## Hito 4 — Rendimiento y Sincronización

Estado: **completado**.

- [x] [TASK-401: Sincronización en background con polling adaptativo](./COMPLETED/epic-4-performance/TASK-401.md) — completada.

## Hito 5 — Experiencia y Entorno Doméstico

Estado: **pendiente**. El dashboard tiene tema claro/oscuro y controles accesibles; quedan las mejoras de contexto doméstico y los atajos globales.

- [TASK-501: Widget de Clima con Open-Meteo API](./epic-5-features/TASK-501.md) — completada.
- [TASK-502: Motor de atajos de teclado globales](./epic-5-features/TASK-502.md) — pendiente.

## Épica 6: Real-time Sync & Notifications
- [ ] `TASK-601`: Sistema Centralizado de Notificaciones Toast `🔴 Pendiente`
- [ ] `TASK-602`: Notificaciones del Navegador (Web Notifications API) `🔴 Pendiente`
- [ ] `TASK-603`: Hook e Indicador de Estado de Conexión (Online/Offline) `🔴 Pendiente`

## Épica 7: Resilience & Global Error Handling
- [ ] `TASK-701`: React Error Boundary Global con Fallback UI `🔴 Pendiente`
- [ ] `TASK-702`: Contexto y Banner Superior de Errores Globales `🔴 Pendiente`
- [ ] `TASK-703`: Middleware e Interceptor de Excepciones Asíncronas `🔴 Pendiente`

## Estado transversal de calidad

- Cobertura exigida en CI para `app/` y `components/`: 100% de líneas, funciones y statements; 95% de branches.
- Tests unitarios y de integración con patrón AAA: Arrange, Act, Assert.
- `lint`, TypeScript, cobertura, build y Lighthouse CI forman parte del flujo de Pull Request.
- Los componentes interactivos deben mantener foco visible, nombres accesibles, teclado funcional y atributos ARIA adecuados.
- Las integraciones externas deben pasar por servicios tipados y normalizar sus respuestas antes de llegar a los widgets.

## Protocolo breve para agentes de IA

1. Leer la tarea atómica correspondiente antes de modificar código.
2. Consultar este roadmap y la documentación de arquitectura y contratos cuando el cambio afecte a estructura o datos.
3. Actualizar `main` con `git switch main` y `git pull --ff-only origin main`.
4. Crear la rama temática nueva a partir del `main` actualizado y limitar el alcance a la tarea.
5. Implementar tests AAA para los caminos nuevos, incluidos estados de error, vacío e interacción.
6. Ejecutar `npm run test:coverage`, `npm run lint` y `npm run build` antes de finalizar.
7. Actualizar el estado de la tarea y este índice cuando cambie el alcance o el progreso.
8. No marcar una tarea como completada si alguna quality gate obligatoria sigue fallando.
