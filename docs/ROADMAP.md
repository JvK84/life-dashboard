# Roadmap

Estado general del proyecto y próximos hitos.

## 🟢 Completado

### Hito 0 — Estructuración del proyecto y documentación

- [x] Crear la aplicación inicial con Next.js, React, TypeScript y Tailwind CSS.
- [x] Crear el dashboard visual con Bento Grid y datos mock.
- [x] Añadir interacción inicial para tareas e inbox.
- [x] Añadir tests unitarios de los flujos principales.
- [x] Modificar los tests unitarios siguiendo el patrón AAA (Arrange–Act–Assert).
- [x] Medir la cobertura real y exigir el umbral acordado en CI.
- [x] Configurar workflow de calidad para Pull Requests hacia `main`.
- [x] Crear instrucciones para Codex y documentación de arquitectura, referencias y roadmap.

## 🟡 En progreso

### Análisis técnico — 10 de octubre de 2026

Estado: análisis inicial realizado sobre [components/dashboard.tsx](../components/dashboard.tsx), [components/dashboard.test.tsx](../components/dashboard.test.tsx), [package.json](../package.json), [vitest.config.ts](../vitest.config.ts) y [.github/workflows/quality.yml](../.github/workflows/quality.yml).

#### Cobertura y calidad de tests

- [x] Instalar/configurar el proveedor de cobertura de Vitest y generar un informe reproducible.
- [x] Limitar la cobertura al código de aplicación (`app/` y `components/`), excluyendo configuración de build y tooling.
- [x] Activar `all: true` para detectar archivos de aplicación sin tests.
- [x] Definir umbrales del 100% para líneas, funciones y statements, y del 95% para branches del código de aplicación.
- [x] Añadir cobertura para la página principal y el layout raíz.
- [x] Ejecutar `npm run test:coverage` en CI como condición de aprobación de la PR.
- [x] Validar TypeScript, lint, tests con cobertura y build dentro del workflow de calidad.
- [x] Ejecutar una PR real y confirmar que la quality gate queda en verde.
- [x] Evitar ejecuciones duplicadas de la quality gate en PR mediante trigger exclusivo y control de concurrencia.
- [x] Añadir tests de accesibilidad y de interacción para los controles que actualmente tenían solo representación visual.
- [x] Verificar localmente tests, cobertura, lint y build.

#### Code smells y mantenibilidad

- [x] Extraer `Dashboard` en widgets independientes: agenda, energía, inbox, tareas y atajos; `Dashboard` conserva composición y estado compartido.
- [x] Mover datos mock, tipos y constantes de presentación fuera del componente para reducir ruido y facilitar tests aislados.
- [x] Sustituir actualizaciones de estado basadas en cierres potencialmente obsoletos por actualizaciones funcionales.
- [x] Sustituir `Date.now()` como identificador de tarea por un generador de IDs estable y testeable.
- [x] Evitar valores temporales y de ubicación hardcodeados en la vista mediante una fuente de datos mock centralizada.
- [x] Revisar el uso de `useMemo`; se eliminó porque el contador es una derivación pequeña y directa del estado.
- [x] Proteger el cálculo del porcentaje ante una colección de tareas vacía.

#### Funcionalidad y accesibilidad pendiente

- [ ] Implementar o retirar las acciones visuales sin comportamiento: búsqueda, más opciones de agenda, ver calendario, abrir Gmail y añadir atajo.
- [x] Añadir estados de foco visibles y nombres accesibles consistentes a todas las acciones existentes.
- [x] Añadir una prueba de regresión para evitar que una tarea recién creada pierda cambios cuando se produzcan interacciones consecutivas.

Prioridad recomendada: primero cobertura ejecutable en CI y actualización funcional del estado; después extracción de widgets y separación de datos; finalmente integraciones y mejoras visuales.

### Hito 1 — Layout base con Bento Grid y componentes mock

- [x] Header con saludo, fecha, hora y clima mock.
- [x] Widget de agenda con próximos eventos mock.
- [x] Widget de inbox con estado de archivado mock.
- [x] Widget de tareas con alta y completado local.
- [x] Panel de accesos rápidos.
- [ ] Extraer primitives reutilizables a `src/components/ui`.
- [x] Separar cada widget en `src/components/widgets`.
- [x] Añadir persistencia de tareas en LocalStorage con recuperación segura ante datos inválidos.
- [x] Añadir alternancia de tema oscuro/claro con persistencia de la preferencia.
- [x] Corregir el contraste de la ubicación y del widget de energía en ambos temas.
- [x] Aclarar el fondo oscuro general y el fondo de la agenda para mejorar la separación visual.

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

### Hito 6 — Observabilidad de rendimiento

- [x] Instalar `@vercel/speed-insights` y añadir `SpeedInsights` al layout raíz.
- [x] Validar la integración en PR mediante test de integración, TypeScript, tests de cobertura y build en GitHub Actions.
- [x] Añadir un check `Performance` con Lighthouse CI, umbrales de rendimiento, accesibilidad y Core Web Vitals.
- [x] Publicar los informes de Lighthouse como artefacto de la PR.
- [ ] Marcar `Quality / Performance` como check obligatorio en la protección de `main`.
- [ ] Activar Speed Insights en el proyecto de Vercel.
- [ ] Desplegar la aplicación y confirmar la recepción de métricas Core Web Vitals.
- [ ] Revisar periódicamente las métricas y registrar acciones de mejora de rendimiento.

## Criterio de avance

Cada hito debe tener comportamiento implementado, tests adecuados, documentación actualizada y una verificación exitosa en CI antes de marcarse como completado.
