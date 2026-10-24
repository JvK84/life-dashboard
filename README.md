# Life Dashboard

Panel personal de una sola página para centralizar agenda, correo, tareas, energía y accesos rápidos.

## Estado actual

- Dashboard responsive con Bento Grid, tema claro/oscuro y persistencia local de tareas y preferencias.
- Integración inicial con Google Calendar en modo lectura.
- OAuth de Google con renovación automática del access token.
- Tests unitarios con patrón AAA y cobertura global de 100% en líneas, statements y funciones, y 98,7% en branches.
- Quality Gate y Lighthouse CI configurados para Pull Requests hacia `main`.

## Requisitos

- Node.js 20 o superior.
- Un proyecto en Google Cloud con Google Calendar API y Gmail API habilitadas.
- Credenciales OAuth 2.0 de tipo aplicación web.

## Arranque local

```bash
npm install
npm run dev
```

Después visita <http://localhost:3000>.

Para abrirlo desde otro ordenador de la red doméstica:

```bash
npm run dev -- --hostname 0.0.0.0
```

Después visita `http://IP-DE-TU-MAC:3000` desde el otro equipo.

### Si no se muestran los estilos

Si se ejecuta `next build` mientras `next dev` sigue abierto, el servidor de desarrollo puede conservar una referencia antigua a los ficheros CSS. Detén el servidor con `Ctrl+C` y vuelve a iniciarlo:

```bash
npm run dev
```

Después fuerza la recarga del navegador (`Cmd+Shift+R` en macOS). No es necesario modificar Tailwind: `app/globals.css`, PostCSS y las rutas de contenido ya están configurados.

## Configurar Google Calendar paso a paso

### 1. Crear o seleccionar un proyecto de Google Cloud

1. Abre [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto nuevo o selecciona uno existente.
3. En **APIs y servicios → Biblioteca**, busca y habilita **Google Calendar API** y **Gmail API**.

### 2. Configurar la pantalla de consentimiento OAuth

1. Ve a **APIs y servicios → Pantalla de consentimiento OAuth**.
2. Selecciona el tipo de usuario adecuado. Para una cuenta personal normalmente será **Externo**.
3. Completa el nombre de la aplicación y el correo de soporte.
4. Añade tu cuenta de Google como usuario de prueba si la aplicación está en modo de pruebas.
5. Añade estos scopes de solo lectura cuando Google los solicite:

   ```text
   https://www.googleapis.com/auth/calendar.events.readonly
   https://www.googleapis.com/auth/calendar.calendarlist.readonly
   https://www.googleapis.com/auth/gmail.readonly
   ```

La aplicación solo solicita permisos de lectura. No solicita permisos para crear, editar ni borrar eventos ni correos.

Si ya habías conectado Google antes de activar Gmail, vuelve a pulsar **Conectar Google** en el dashboard para renovar el consentimiento y conceder el permiso `gmail.readonly`.

### 3. Crear las credenciales OAuth

1. Ve a **APIs y servicios → Credenciales**.
2. Pulsa **Crear credenciales → ID de cliente OAuth**.
3. Selecciona **Aplicación web**.
4. Añade esta URI exacta en **URI de redireccionamiento autorizados**:

   ```text
   http://localhost:3000/api/integrations/google/calendar/callback
   ```

5. Guarda el `Client ID` y el `Client Secret`. No los publiques ni los introduzcas en código cliente.

### 4. Crear el archivo `.env.local`

Copia la plantilla y genera un secreto aleatorio para proteger el estado OAuth y cifrar la credencial temporal:

```bash
cp .env.example .env.local
openssl rand -base64 32
```

Completa `.env.local` con estos valores:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/integrations/google/calendar/callback
GOOGLE_OAUTH_STATE_SECRET=pega-aqui-el-secreto-generado
```

Las variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` y `GOOGLE_OAUTH_STATE_SECRET` son de servidor. No deben empezar por `NEXT_PUBLIC_`, no deben aparecer en el navegador y `.env.local` no debe subirse al repositorio.

### 5. Iniciar la aplicación y conectar la cuenta

```bash
npm run dev
```

1. Abre <http://localhost:3000>.
2. En el widget **Mi agenda**, pulsa **Conectar Google**. Si ya habías conectado la cuenta con la versión anterior, vuelve a autorizarla para conceder el permiso adicional de listar calendarios.
3. Inicia sesión en Google y acepta el permiso de calendario de solo lectura.
4. Google redirigirá a la callback configurada.
5. La aplicación guardará una credencial cifrada en una cookie `HttpOnly` y volverá al dashboard.

### 6. Comprobar que llegan los eventos

Con la cuenta conectada, solicita los próximos eventos desde el endpoint interno:

```bash
curl -i http://localhost:3000/api/integrations/google/calendar/events
```

La respuesta correcta tiene esta forma:

```json
{
  "events": [
    {
      "id": "google-event-id",
      "title": "Daily de producto",
      "start": "2026-10-11T10:00:00+02:00",
      "end": "2026-10-11T10:30:00+02:00",
      "allDay": false
    }
  ]
}
```

El endpoint consulta los calendarios disponibles, ordena todos los eventos por hora de inicio y devuelve como máximo 10 eventos próximos.

Cuando la cuenta tiene varios calendarios, primero consulta `calendarList` y combina los eventos de los calendarios disponibles. Los calendarios ocultos, eliminados y de cumpleaños se excluyen para evitar que la agenda quede dominada por aniversarios repetidos.

En la cabecera de **Mi agenda** puedes cambiar el periodo entre **Día** —seleccionado por defecto—, **Semana** —de lunes a lunes— y **Mes** —del primer día del mes actual al primero del siguiente—. Cada cambio vuelve a consultar los eventos del periodo elegido.

Si el periodo no contiene eventos, la agenda muestra `No hay eventos en este periodo.`. Cuando la cuenta de Google ya está conectada, desaparece la opción **Conectar Google**. El pie de la tarjeta permanece abajo y muestra el tiempo hasta el próximo evento disponible.

## Rutas de la integración

| Ruta | Función |
| --- | --- |
| `/api/integrations/google/calendar/connect` | Inicia el consentimiento OAuth |
| `/api/integrations/google/calendar/callback` | Valida el estado y canjea el código OAuth |
| `/api/integrations/google/calendar/events` | Combina eventos de los calendarios disponibles, los normaliza y renueva el token si es necesario |

El endpoint acepta `?range=day`, `?range=week` o `?range=month`. Si se omite o se envía un valor no reconocido, utiliza `day`.

## Seguridad y limitaciones actuales

- Se usan únicamente los scopes de solo lectura `calendar.events.readonly` y `calendar.calendarlist.readonly`.
- El estado OAuth se valida mediante una cookie `SameSite=Lax` y un valor aleatorio.
- La credencial se cifra con AES-256-GCM y se guarda en una cookie `HttpOnly`.
- La renovación del access token se realiza en el servidor.
- La implementación actual es una primera integración personal; la siguiente evolución debe mover los tokens a un almacén server-side asociado a una identidad y persistencia como Supabase.
- Gmail todavía no está integrado.

## Calidad, tests y performance

```bash
npm test
npm run test:coverage
npm run lint
npm exec -- tsc --noEmit
npm run build
```

Cada Pull Request hacia `main` ejecuta `.github/workflows/quality.yml`, que valida:

- lint;
- TypeScript;
- tests y cobertura;
- build de producción;
- Lighthouse CI con umbrales de performance, accesibilidad y Core Web Vitals;
- publicación del informe Lighthouse como artefacto de la PR.

## Desarrollo con ramas

Flujo recomendado:

```bash
git switch -c feature/nombre-del-cambio
git add .
git commit -m "feat: describe el cambio"
git push -u origin feature/nombre-del-cambio
```

Después abre una Pull Request hacia `main` y fusiónala solo cuando los checks obligatorios estén en verde.

## Próximas iteraciones

1. Persistencia server-side de credenciales Google asociada a una identidad.
2. Integración OAuth con Gmail.
3. Configuración funcional de atajos y acciones pendientes.
4. Activación de Speed Insights en Vercel y revisión periódica de métricas.
