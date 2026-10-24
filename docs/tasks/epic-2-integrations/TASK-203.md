# [TASK-203] Integración visual de Gmail y cabecera del dashboard

- **Estado:** 🟢 Completado
- **Epic:** Epic 2 — Integraciones Personales
- **Prioridad:** Media

## 🎯 Objetivo

Mostrar los mensajes no leídos de Gmail en el dashboard con una presentación compacta, legible y accesible, manteniendo alineada la información principal de la cabecera.

## 📝 Alcance

1. Consumir desde el dashboard la ruta interna de mensajes normalizados de Gmail.
2. Mostrar estados de carga, error, autorización pendiente y bandeja vacía.
3. Presentar los correos en tarjetas diferenciadas con remitente, iniciales, asunto, fecha, vista previa e indicador de no leído.
4. Limitar la altura visible del inbox a aproximadamente tres correos y permitir consultar el resto mediante scroll interno.
5. Alinear en una única cabecera la marca, el saludo, la fecha, el tiempo, la hora y los controles del dashboard en escritorio, con composición responsive en móvil.
6. Documentar la activación de Gmail API y el scope `gmail.readonly`.

## ✅ Criterios de aceptación

- [x] El dashboard solicita los mensajes a `/api/integrations/google/gmail/messages`.
- [x] La UI diferencia carga, errores de autorización, errores de API, lista vacía y mensajes disponibles.
- [x] El inbox mantiene una altura estable y ofrece scroll interno cuando hay más de tres mensajes visibles.
- [x] Cada mensaje distingue visualmente remitente, asunto, fecha, vista previa y estado no leído.
- [x] La cabecera mantiene la alineación solicitada en escritorio y se adapta a pantallas pequeñas.
- [x] Los tests cubren mensajes reales simulados, estados de error, lista vacía y accesibilidad.
