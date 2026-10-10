# Referencias e integraciones

## Google Workspace APIs

### Google Calendar API

- Documentación: <https://developers.google.com/calendar/api>
- Uso previsto: leer eventos próximos, agenda diaria y duración de reuniones.
- Requiere OAuth 2.0 y consentimiento del usuario.
- El acceso debe pasar por un servicio de servidor; no exponer secretos ni refresh tokens en el navegador.

### Gmail API

- Documentación: <https://developers.google.com/gmail/api>
- Uso previsto: contar mensajes no leídos, mostrar remitente/asunto y archivar mensajes.
- Solicitar los scopes mínimos necesarios para cada funcionalidad.
- Diseñar primero el flujo de permisos y revocación antes de activar acciones de escritura.

## Supabase

- Documentación: <https://supabase.com/docs>
- Uso previsto: autenticación opcional, persistencia sincronizada y configuración personal del dashboard.
- Usar Row Level Security para que cada usuario solo pueda leer y modificar sus propios datos.
- Las claves públicas pueden vivir en el cliente; las claves de servicio deben permanecer en el servidor.

## Open-Meteo

- Documentación: <https://open-meteo.com/en/docs>
- Uso previsto: temperatura y condiciones meteorológicas del resumen diario.
- No requiere API key para el uso personal estándar.
- La ubicación debe configurarse y documentarse sin guardar datos más precisos de lo necesario.

## Plantilla `.env.example`

Copiar esta plantilla a `.env.local` y completar solo las variables necesarias. Nunca subir `.env.local` al repositorio.

```dotenv
# URL pública de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (persistencia y auth opcionales)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth (Calendar y Gmail)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# Open-Meteo / ubicación del dashboard
NEXT_PUBLIC_WEATHER_LATITUDE=
NEXT_PUBLIC_WEATHER_LONGITUDE=
NEXT_PUBLIC_WEATHER_TIMEZONE=Europe/Madrid
```

## Registro de nuevas variables

Cuando se añada una variable de entorno:

1. Añadirla a `.env.example` con un valor vacío o seguro.
2. Explicar su propósito y si es pública o solo de servidor en este documento.
3. Validarla al arrancar el servicio que la consume.
4. No imprimir su valor en logs ni incluirlo en capturas, tests o documentación pública.
