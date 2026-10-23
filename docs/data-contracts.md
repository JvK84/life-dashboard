# Contratos de datos

Este documento describe los contratos TypeScript que atraviesan la aplicación. Los nombres y campos deben mantenerse estables o evolucionar junto con sus consumidores, pruebas y documentación.

## Eventos normalizados de Google Calendar

El servicio de Google Calendar devuelve un modelo independiente del formato de Google:

```ts
export type GoogleCalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  htmlLink?: string;
};
```

`start` y `end` deben ser fechas ISO serializables. `allDay` distingue eventos de día completo de eventos con hora. Los calendarios de cumpleaños u otros calendarios excluidos por política no deben aparecer en este contrato.

El rango solicitado por la agenda está restringido a:

```ts
export type CalendarRange = "day" | "week" | "month";
```

La API de la aplicación expone una respuesta normalizada con la forma `{ events: GoogleCalendarEvent[] }`. La UI puede transformar estos eventos a su modelo visual `AgendaEvent`, que añade propiedades de presentación como `color`, `duration` o un texto de hora.

## Tareas

```ts
export type Task = {
  id: string;
  label: string;
  done: boolean;
  tag: string;
};
```

El identificador debe ser estable. `done` representa el estado actual y `tag` la clasificación visible de la tarea; las modificaciones deben conservar el resto de propiedades del objeto.

## Estado del dashboard

Actualmente React mantiene este estado de forma distribuida dentro de `Dashboard`. Conceptualmente incluye:

```ts
type DashboardState = {
  tasks: Task[];
  archivedTasks: Task[];
  theme: "light" | "dark";
  agendaEvents: AgendaEvent[];
  agendaRange: CalendarRange;
  isCalendarConnected: boolean;
};
```

`AgendaEvent` es un modelo de presentación. La conversión desde `GoogleCalendarEvent` debe realizarse en una utilidad pura, no dentro del servicio ni mediante lógica duplicada en cada widget.

Los tokens OAuth son exclusivamente de servidor:

```ts
export type GoogleCalendarToken = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};
```

No deben enviarse al navegador, registrarse en logs ni incluirse en fixtures públicos.

## Validación y seguridad de tipos

- TypeScript estricto es obligatorio; no se permite `any` explícito ni implícito.
- Los datos procedentes de APIs, `localStorage` o variables de entorno deben considerarse no confiables hasta validarlos.
- En fronteras de ejecución se debe comprobar la forma, tipos, fechas y campos obligatorios antes de normalizar.
- Puede utilizarse Zod para validación runtime de payloads externos. Actualmente los contratos principales están definidos con TypeScript y validación en los servicios; si se incorpora Zod, debe añadirse como dependencia, cubrirse con pruebas y documentarse el esquema asociado.
- Los errores de validación deben convertirse en estados de error comprensibles para la UI sin exponer credenciales ni payloads sensibles.
