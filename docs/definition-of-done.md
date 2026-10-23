# Definition of Done

Una tarea o Pull Request solo está lista para producción cuando cumple todos los puntos aplicables de esta lista.

## Implementación y documentación

- El alcance está definido en una micro-tarea de `docs/tasks/` y es coherente con `docs/ROADMAP.md`.
- El cambio está aislado en una rama temática y no introduce trabajo no relacionado.
- La arquitectura, los contratos o la configuración se documentan cuando el cambio los afecta.
- No se incluyen secretos, tokens ni datos personales en el repositorio, logs o fixtures.

## Tests y cobertura

- Los tests unitarios y de integración siguen estrictamente el patrón **AAA**: Arrange, Act, Assert.
- Se prueban los estados de éxito, vacío, error, interacción y accesibilidad relevantes.
- Para el código de aplicación (`app/` y `components/`) CI exige:
  - 100% de líneas.
  - 100% de funciones.
  - 100% de statements.
  - 95% de branches.
- No se reducen umbrales ni se excluye código para ocultar caminos sin probar.

## Verificación local obligatoria

Antes de solicitar revisión o declarar terminada la tarea deben pasar sin errores:

```bash
npm run test:coverage
npm run lint
npm run build
```

En cambios de TypeScript o contratos de datos se ejecuta también `npm exec -- tsc --noEmit`. Los resultados y cualquier limitación del entorno deben quedar reflejados en la Pull Request.

## Accesibilidad y rendimiento

- Los controles tienen foco visible, nombre accesible, navegación por teclado y atributos ARIA apropiados.
- Se verifican contraste, estados vacío/carga/error y comportamiento en temas claro y oscuro.
- Lighthouse CI valida rendimiento, accesibilidad y Core Web Vitals dentro del flujo de Pull Request.
- Los fallos de performance o accesibilidad no se silencian sin una justificación documentada y aprobada.

## Revisión y entrega

- El código mantiene separación entre UI, estado, servicios y utilidades puras.
- Las actualizaciones de estado dependientes del estado anterior usan la forma funcional (`setX((previous) => ...)`).
- Los commits siguen Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:` o `chore:`).
- La Pull Request describe el cambio, pruebas ejecutadas, impacto, configuración necesaria y riesgos conocidos.
