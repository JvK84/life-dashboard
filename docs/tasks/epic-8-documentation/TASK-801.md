# TASK-801: Manual de usuario por funcionalidades

- **Épica:** Épica 8 - Documentación y adopción
- **Estado:** 🟢 Completada
- **Prioridad:** Media
- **Entregables:**
  - `docs/USER_GUIDE.md`
  - `README.md`
  - `docs/tasks/README.md`

## Objetivo

Crear un manual en español que permita a una persona usuaria descubrir y utilizar todas las funcionalidades disponibles del dashboard, incluidos sus estados vacíos, errores, integraciones y limitaciones actuales.

## Alcance

- Explicar el primer acceso y la conexión de Google.
- Documentar agenda, Gmail, tareas, energía y atajos rápidos.
- Documentar búsqueda, tema, atajos de teclado, conexión y notificaciones.
- Incluir solución de problemas, privacidad y límites conocidos.
- Enlazar el manual desde los puntos de entrada de documentación del proyecto.

## Criterios de aceptación

- [x] El manual está disponible en `docs/USER_GUIDE.md`.
- [x] Cada widget y control interactivo actual tiene instrucciones de uso.
- [x] Se describen estados de carga, vacío, error y desconexión cuando aplican.
- [x] Las funciones aún no disponibles se identifican como próximamente.
- [x] Se documentan los permisos de Google y la persistencia local.
- [x] El manual está enlazado desde `README.md` y el índice de tareas.

## Prueba manual

1. Abrir `docs/USER_GUIDE.md` y comprobar que sus enlaces y secciones son legibles en español.
2. Seguir las secciones de tareas: crear, completar, editar, archivar, desarchivar, filtrar y buscar una tarea.
3. Cambiar el tema y recargar para confirmar que la instrucción coincide con el comportamiento.
4. Cambiar el periodo de agenda y revisar el flujo de conexión de Google.
5. Simular los estados sin conexión y de error para comprobar que el manual explica qué significa cada aviso.

## Verificación

El cambio solo añade documentación Markdown; no modifica código ejecutable ni requiere nuevas pruebas automatizadas.
