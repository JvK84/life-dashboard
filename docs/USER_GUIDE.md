# Manual de usuario de Life Dashboard

Life Dashboard reúne en una sola pantalla la agenda, el correo, las tareas y algunos indicadores de contexto. Este manual explica qué hace cada sección y cómo utilizarla.

## 1. Primer acceso

1. Inicia la aplicación y abre `http://localhost:3000`.
2. Comprueba que el dashboard carga todas sus tarjetas.
3. Si quieres consultar tu agenda o Gmail, pulsa **Conectar Google** en la tarjeta correspondiente y completa el consentimiento de Google.
4. Si una integración no está configurada, el resto del dashboard sigue disponible con sus datos locales o de demostración.

La aplicación funciona mejor con una cuenta de Google autorizada, pero las tareas y las preferencias del tema se guardan localmente en el navegador.

## 2. Cabecera y controles generales

### Buscar tareas

1. Pulsa el botón **Buscar**.
2. Escribe una palabra o parte del nombre de una tarea.
3. El listado se filtra mientras escribes. La búsqueda también revisa las etiquetas internas de la tarea.
4. Vuelve a pulsar **Buscar** para cerrar el campo.

### Cambiar el tema

Pulsa el botón con la luna o el sol para alternar entre modo claro y modo oscuro. La elección queda guardada en este navegador y se recupera al volver a abrir la aplicación.

### Atajos de teclado

Pulsa `?` fuera de un campo de edición para abrir la ayuda de atajos:

| Tecla | Acción |
| --- | --- |
| `N` | Lleva el foco al campo **Nueva tarea**. |
| `D` | Cambia entre modo claro y oscuro. |
| `?` | Abre la ayuda de atajos. |
| `Esc` | Cierra la ayuda o un diálogo abierto. |

Los atajos no se ejecutan mientras escribes en un campo, selector o área editable.

### Estado de conexión y avisos

Si el navegador pierde internet, la cabecera muestra **Sin conexión**. Al recuperar la conexión aparece el aviso **Conexión restablecida**.

Los avisos breves aparecen como notificaciones en pantalla. Los errores importantes aparecen en una banda superior y pueden cerrarse con `Esc` o con su botón de cierre.

## 3. Mi agenda

La tarjeta **Mi agenda** muestra los próximos eventos de Google Calendar, ordenados por hora.

1. Pulsa **Día**, **Semana** o **Mes** para cambiar el periodo consultado.
2. Revisa el título, la hora y la duración de cada evento.
3. El pie de la tarjeta indica el próximo evento disponible.
4. Si no hay una cuenta conectada, pulsa **Conectar Google** y autoriza el acceso de solo lectura.

Si el periodo elegido no tiene eventos, la tarjeta muestra **No hay eventos en este periodo**. La conexión utiliza los calendarios disponibles de Google y excluye calendarios ocultos, eliminados y de cumpleaños.

## 4. Tu energía

**Tu energía** es un indicador visual del estado del día. Muestra una puntuación, una barra de progreso y un mensaje contextual. Es informativo: en la versión actual no se puede editar desde el dashboard.

## 5. Bandeja de entrada

La tarjeta **Bandeja de entrada** resume los mensajes que Gmail proporciona a la aplicación.

- Mientras consulta Gmail aparece **Cargando correo**.
- Cada mensaje muestra remitente, asunto, fecha, fragmento y si está sin leer.
- Pulsa **Abrir Gmail** para continuar la gestión completa en Gmail.
- Pulsa el botón de archivo para ocultar el resumen actual y mostrar **Inbox limpia**.
- Si no hay mensajes, también aparece **Inbox limpia**.
- Si falta autorización, pulsa **Conectar Google** y concede el permiso solicitado.

El archivado de esta tarjeta es una acción visual del dashboard; la gestión definitiva del correo se realiza en Gmail.

## 6. Tareas de hoy

### Crear una tarea

1. Escribe el texto en **Añade una tarea…**.
2. Selecciona una prioridad: **Baja**, **Media** o **Alta**.
3. Pulsa el botón de envío o pulsa `N` para llevar el foco al campo antes de escribir.
4. Una tarea vacía no se crea.

### Completar y organizar tareas

- Pulsa el nombre de una tarea para marcarla como completada o pendiente.
- Usa **Editar tarea** para cambiar su título o prioridad y pulsa **Guardar**.
- Usa **Archivar tarea** para apartarla del trabajo activo.
- En una tarea archivada, el mismo control permite **Desarchivar tarea**.
- El porcentaje y el contador de la tarjeta reflejan las tareas completadas.

### Filtros

Los filtros **Todas**, **Pendientes**, **Completadas** y **Archivadas** muestran el grupo correspondiente y su contador. La búsqueda de la cabecera puede combinarse con cualquiera de ellos.

Las tareas se guardan en el almacenamiento local del navegador. Por eso no se sincronizan automáticamente entre navegadores, dispositivos o usuarios.

## 7. Atajos rápidos

La sección **Atajos rápidos** muestra enlaces preparados para herramientas habituales como Notion, GitHub, Linear y scripts personales. En la versión actual sirven como accesos visuales configurables en el código; el botón **Añadir atajo** está marcado como próximamente y no está operativo.

## 8. Estados y solución de problemas

### Google no se conecta

Comprueba que Google Calendar API y Gmail API están habilitadas, que la URI OAuth coincide con la configuración y que la cuenta está autorizada como usuario de prueba cuando el proyecto está en modo de pruebas.

### No aparecen eventos o correos

Confirma que la cuenta está conectada, que el navegador tiene conexión y que el periodo de agenda contiene datos. Para el correo, usa **Abrir Gmail** para verificar que los mensajes existen y que la autorización sigue vigente.

### Se perdió el estilo o el estado local

Recarga la página. Si el problema continúa, reinicia el servidor de desarrollo. Borrar los datos del sitio elimina las tareas y el tema guardados localmente, por lo que debe hacerse solo si se quiere empezar de cero.

### Error inesperado

Lee el mensaje de la banda superior, ciérrala y vuelve a intentar la acción. Si una tarjeta falla, el resto de widgets debe seguir visible. Si el error persiste, conserva el mensaje y la acción que lo provocó para reportarlo.

## 9. Privacidad y permisos

Google se conecta mediante OAuth y la aplicación solicita permisos de lectura para Calendar y Gmail. No puede crear, editar ni borrar eventos o correos desde el dashboard. No compartas secretos OAuth ni el archivo `.env.local`.
