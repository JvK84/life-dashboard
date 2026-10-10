# Instrucciones para OpenAI Codex

Estas instrucciones aplican a todo el repositorio `life-dashboard`.

## Contexto obligatorio

Antes de comenzar cualquier tarea:

1. Consultar [`docs/ROADMAP.md`](../docs/ROADMAP.md).
2. Revisar [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) cuando la tarea afecte a estructura, componentes, datos o integraciones.
3. Identificar los archivos y módulos afectados antes de editar.

Al finalizar una funcionalidad:

- Actualizar el estado de los hitos en [`docs/ROADMAP.md`](../docs/ROADMAP.md).
- Documentar cualquier función pública, servicio nuevo o variable de entorno añadida.
- Añadir o actualizar tests cuando cambie el comportamiento de la aplicación.
- Indicar en el resumen final qué se cambió y qué verificaciones se ejecutaron.

## Normas de código

- Usar TypeScript estricto. Evitar `any`; definir tipos explícitos para datos de UI, servicios y respuestas externas.
- Usar React con Next.js App Router.
- Usar Tailwind CSS para estilos y mantener la estética definida en [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md).
- Mantener componentes modulares, pequeños y con una única responsabilidad.
- Aplicar DRY: reutilizar componentes, tipos, utilidades y servicios en lugar de duplicar lógica.
- Mantener la lógica de integración fuera de los componentes visuales, dentro de `src/lib/services`.
- Separar componentes de presentación, widgets de negocio, estado y servicios.
- Preferir nombres descriptivos y funciones simples sobre abstracciones prematuras.
- No introducir dependencias para resolver problemas que puedan resolverse con la plataforma existente.

## Protocolo de cambios

- Trabajar en cambios pequeños y revisables.
- Preservar cambios existentes del usuario.
- No modificar configuraciones globales del sistema.
- Pedir confirmación antes de instalar paquetes grandes, añadir servicios externos de pago o modificar configuraciones globales.
- Las credenciales nunca deben entrar en Git. Añadir nuevas variables a `.env.example` y documentarlas en [`docs/REFERENCES.md`](../docs/REFERENCES.md).
- No conectar APIs reales durante una iteración de mocks sin actualizar antes el roadmap y documentar el flujo de autenticación.

## Verificación

Antes de cerrar una tarea, ejecutar las comprobaciones disponibles para el cambio, normalmente:

```bash
npm run lint
npm test -- --run
npm run build
```

Si una comprobación no puede ejecutarse, indicarlo claramente junto con el motivo.
