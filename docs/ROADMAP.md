# Roadmap

Estado general del proyecto y próximos hitos.

## 🟢 Completado

### Hito 0 — Estructuración del proyecto y documentación

- [x] Crear la aplicación inicial con Next.js, React, TypeScript y Tailwind CSS.
- [x] Crear el dashboard visual con Bento Grid y datos mock.
- [x] Añadir interacción inicial para tareas e inbox.
- [x] Añadir tests unitarios de los flujos principales.
- [ ] Modificar los tests unitarios siguiendo el patrón AAA (Arrange–Act–Assert) y asegurar cobertura completa.
- [x] Configurar workflow de calidad para Pull Requests hacia `main`.
- [x] Crear instrucciones para Codex y documentación de arquitectura, referencias y roadmap.

## 🟡 En progreso

### Hito 1 — Layout base con Bento Grid y componentes mock

- [x] Header con saludo, fecha, hora y clima mock.
- [x] Widget de agenda con próximos eventos mock.
- [x] Widget de inbox con estado de archivado mock.
- [x] Widget de tareas con alta y completado local.
- [x] Panel de accesos rápidos.
- [ ] Extraer primitives reutilizables a `src/components/ui`.
- [ ] Separar cada widget en `src/components/widgets`.
- [ ] Añadir persistencia de tareas y preferencias en LocalStorage.
- [ ] Añadir alternancia de tema oscuro/claro.

## 🔵 Futuro / Backlog

### Hito 2 — Integraciones personales

- [ ] Integración con Google Calendar API.
- [ ] Integración con Gmail API.
- [ ] Gestión de OAuth y renovación segura de tokens.
- [ ] Normalización de eventos y correos a tipos internos.

### Hito 3 — Sistema de tareas

- [ ] Crear, editar, completar y archivar tareas.
- [ ] Etiquetas, prioridades y fechas límite.
- [ ] Persistencia local y sincronización opcional con Supabase.

### Hito 4 — Panel de herramientas externas

- [ ] CRUD de accesos rápidos.
- [ ] Ordenación y personalización del grid.
- [ ] Soporte para scripts locales y enlaces frecuentes.

### Hito 5 — Contexto y despliegue doméstico

- [ ] Integración de clima con Open-Meteo.
- [ ] Configuración para acceso desde la red Wi-Fi doméstica.
- [ ] Revisión de seguridad, accesibilidad y rendimiento.

## Criterio de avance

Cada hito debe tener comportamiento implementado, tests adecuados, documentación actualizada y una verificación exitosa en CI antes de marcarse como completado.
