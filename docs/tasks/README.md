# Roadmap macro e índice de tareas

Este documento es la fuente única de verdad para el roadmap funcional y las tareas atómicas de `life-dashboard`. Cada tarea contiene objetivo, alcance, criterios de aceptación, dependencias y estado.

## Hito 1 — Desbloqueo y Calidad Base

Estado: **en progreso**. La base Next.js, los quality gates, la cobertura, la estructura de widgets y la persistencia local están implementadas. Queda cerrar acciones visuales pendientes y extraer primitives UI reutilizables.

- [TASK-101: Configuración de entorno y PR de Google Calendar](./epic-1-launch/TASK-101.md) — pendiente de completar la entrega de la rama y la PR.
- [x] [TASK-102: Normalización de acciones visuales pendientes en Dashboard](./epic-1-launch/TASK-102.md) — completada.

## Hito 2 — Integraciones Personales / Gmail

Estado: **parcialmente completado**. Google Calendar está integrado con OAuth, normalización, rangos de agenda, renovación de tokens y validación de performance. Gmail está planificado y requiere completar la normalización y el endpoint de lectura.

- [TASK-201: Normalizador de correos de Gmail a tipos internos](./epic-2-integrations/TASK-201.md) — pendiente.
- [TASK-202: Endpoint de lectura de mensajes de Gmail](./epic-2-integrations/TASK-202.md) — pendiente.

## Hito 3 — Sistema de Tareas Avanzado

Estado: **pendiente**. La aplicación dispone actualmente de tareas locales básicas; faltan el modelo extendido, la persistencia avanzada, los filtros y las prioridades.

- [TASK-301: Modelo Zod y parser seguro de tareas](./epic-3-tasks/TASK-301.md) — pendiente.
- [TASK-302: Hook de persistencia local y operaciones de tareas](./epic-3-tasks/TASK-302.md) — pendiente.
- [TASK-303: Widget de tareas con prioridades y filtros de accesibilidad](./epic-3-tasks/TASK-303.md) — pendiente.

## Hito 5 — Experiencia y Entorno Doméstico

Estado: **pendiente**. El dashboard tiene tema claro/oscuro y controles accesibles; quedan las mejoras de contexto doméstico y los atajos globales.

- [TASK-501: Widget de Clima con Open-Meteo API](./epic-5-features/TASK-501.md) — pendiente.
- [TASK-502: Motor de atajos de teclado globales](./epic-5-features/TASK-502.md) — pendiente.

## Estado transversal de calidad

- Cobertura exigida en CI para `app/` y `components/`: 100% de líneas, funciones y statements; 95% de branches.
- Tests unitarios y de integración con patrón AAA: Arrange, Act, Assert.
- `lint`, TypeScript, cobertura, build y Lighthouse CI forman parte del flujo de Pull Request.
- Los componentes interactivos deben mantener foco visible, nombres accesibles, teclado funcional y atributos ARIA adecuados.
- Las integraciones externas deben pasar por servicios tipados y normalizar sus respuestas antes de llegar a los widgets.

## Protocolo breve para agentes de IA

1. Leer la tarea atómica correspondiente antes de modificar código.
2. Consultar este roadmap y la documentación de arquitectura y contratos cuando el cambio afecte a estructura o datos.
3. Trabajar en una rama temática aislada y limitar el alcance a la tarea.
4. Implementar tests AAA para los caminos nuevos, incluidos estados de error, vacío e interacción.
5. Ejecutar `npm run test:coverage`, `npm run lint` y `npm run build` antes de finalizar.
6. Actualizar el estado de la tarea y este índice cuando cambie el alcance o el progreso.
7. No marcar una tarea como completada si alguna quality gate obligatoria sigue fallando.
