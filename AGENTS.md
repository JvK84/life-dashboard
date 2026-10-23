# Manual de instrucciones para agentes de IA

Este documento define el protocolo de desarrollo para cualquier agente de IA que trabaje en `life-dashboard`, incluidos Codex, Claude, Cursor y agentes equivalentes.

## 1. Visión general y arquitectura

Life Dashboard es una aplicación personal construida con:

- **Next.js** con App Router.
- **React** y **TypeScript** en modo estricto.
- **Tailwind CSS** para estilos y diseño responsive.
- **Vitest** y **React Testing Library** para tests unitarios y de integración.
- **GitHub Actions** para quality gates y Lighthouse CI en Pull Requests.

La aplicación mantiene el componente principal en `components/` y organiza progresivamente las nuevas piezas en `src/`:

- `app/`: rutas, layout y estilos globales.
- `components/`: composición actual del dashboard.
- `src/components/widgets/`: widgets de agenda, inbox, tareas, energía y accesos rápidos.
- `src/components/ui/`: primitives reutilizables.
- `src/lib/services/`: integraciones externas y clientes tipados.
- `src/lib/utils/`: funciones puras compartidas.
- `src/types/`: tipos de dominio y contratos de integraciones.
- `docs/`: contexto funcional y técnico del proyecto.

La documentación de contexto está organizada así:

- [Arquitectura](docs/ARCHITECTURE.md): estructura, flujo de datos y decisiones técnicas.
- [Roadmap](docs/ROADMAP.md): hitos y estado global del producto.
- [Micro-tareas](docs/tasks/README.md): épicas, tareas atómicas, alcance y criterios de aceptación.
- [Referencias](docs/REFERENCES.md): APIs externas, variables de entorno e integraciones.

Los widgets no deben llamar directamente a Google, Supabase u otros proveedores. Las integraciones deben pasar por servicios tipados y normalizar sus respuestas antes de llegar a la UI.

## 2. Protocolo de trabajo por tareas atómicas

Antes de escribir código:

1. Identificar la tarea concreta y leer siempre su archivo `.md` correspondiente dentro de `docs/tasks/`.
2. Consultar [docs/ROADMAP.md](docs/ROADMAP.md) para conocer el estado y las dependencias.
3. Consultar [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) si el cambio afecta a estructura, datos, componentes o integraciones.
4. Identificar los archivos, módulos y pruebas afectados.
5. Confirmar el alcance de la tarea antes de introducir cambios adyacentes.

### Aislamiento obligatorio desde `main`

Antes de crear cualquier rama de trabajo, actualizar siempre `main` desde el remoto y crear la rama temática a partir de ese estado actualizado:

```bash
git switch main
git pull --ff-only origin main
git switch -c <rama-tematica>
```

No se deben crear ramas nuevas desde otra rama de trabajo, salvo que la tarea documente explícitamente una dependencia aún no fusionada y el usuario autorice esa excepción.

Cada tarea debe ejecutarse de forma aislada en una rama temática, siguiendo una convención como:

```text
feature/nombre-del-cambio
fix/nombre-del-problema
test/nombre-de-la-cobertura
docs/nombre-de-la-documentacion
```

Los cambios deben ser pequeños, revisables y fáciles de revertir. No se deben mezclar tareas no relacionadas en la misma rama o commit.

Al finalizar una tarea:

- actualizar el estado correspondiente en `docs/ROADMAP.md`;
- actualizar la documentación afectada;
- añadir o modificar las pruebas del comportamiento cambiado;
- resumir las verificaciones ejecutadas y cualquier bloqueo restante.

## 3. Reglas de calidad y testing — innegociables

### Tests

Todos los tests unitarios y de integración deben aplicar estrictamente el patrón **AAA**:

```text
Arrange — preparar datos, mocks y estado inicial.
Act     — ejecutar una única acción relevante.
Assert  — comprobar el resultado observable.
```

No ocultar varias acciones o aserciones complejas sin necesidad. Los tests deben validar comportamiento observable, accesibilidad y estados de error relevantes.

### Cobertura

La quality gate exige para el código de aplicación:

- **100% de líneas**.
- **100% de funciones**.
- **100% de statements**.
- **95% de branches**.

El ámbito mínimo acordado es `app/` y `components/`. La configuración actual también mide la lógica crítica de servicios y utilidades seleccionadas; no se deben reducir los umbrales para ocultar código sin probar.

### TypeScript

- Mantener TypeScript estricto.
- No introducir `any` implícito ni explícito salvo una justificación técnica excepcional y documentada.
- Definir tipos para respuestas externas, estados de UI y modelos de dominio.
- Validar y normalizar datos procedentes de APIs antes de utilizarlos en componentes.

## 4. Verificación local obligatoria

Antes de dar por finalizada cualquier tarea o proponer cambios, ejecutar y asegurar que pasan sin errores:

```bash
npm run test:coverage
npm run lint
npm run build
```

Cuando el cambio afecte a TypeScript o contratos de datos, ejecutar además:

```bash
npm exec -- tsc --noEmit
```

La validación de performance de las Pull Requests se realiza mediante Lighthouse CI en `.github/workflows/quality.yml`. Si una comprobación no puede ejecutarse por una limitación del entorno, el agente debe indicarlo claramente y no declarar la tarea completamente verificada.

## 5. Convenciones de código y accesibilidad

### Componentes y estado

- Mantener componentes pequeños, modulares y con una única responsabilidad.
- Separar presentación, estado, servicios y utilidades puras.
- Usar actualizaciones funcionales de estado cuando el nuevo estado dependa del anterior:

  ```tsx
  setItems((previousItems) => [...previousItems, newItem]);
  ```

- Evitar cierres obsoletos, efectos con dependencias incompletas y lógica de integración dentro de widgets.
- Preferir las APIs nativas y las dependencias ya instaladas antes de añadir paquetes nuevos.

### Accesibilidad

Cualquier componente visual o interactivo creado o modificado debe incluir:

- estados de foco visibles (`:focus-visible` o clases equivalentes);
- nombres accesibles mediante texto visible, `aria-label` o `aria-labelledby`;
- atributos ARIA apropiados para botones toggle, tabs, diálogos y estados seleccionados;
- navegación funcional por teclado;
- contraste suficiente en temas claro y oscuro;
- estados vacíos, de carga y de error comprensibles.

Los cambios de interacción deben tener pruebas de accesibilidad y comportamiento con React Testing Library.

### Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: añadir filtro por periodo en agenda
fix: corregir carga de eventos sin estilos
test: cubrir estado vacío de calendario
docs: actualizar instrucciones de Google Calendar
refactor: extraer normalizador de eventos
chore: actualizar configuración de calidad
```

## 6. Seguridad y configuración

- Nunca incluir credenciales, tokens o secretos en Git.
- Añadir nuevas variables a `.env.example` y documentarlas en `docs/REFERENCES.md`.
- Mantener secretos y refresh tokens fuera del navegador siempre que sea posible.
- Solicitar scopes mínimos en integraciones OAuth.
- No imprimir secretos, tokens ni datos personales en logs, capturas o tests.
- Preservar los cambios existentes del usuario y evitar comandos destructivos.

## 7. Entrega de cambios

Una entrega se considera completa únicamente cuando:

1. La tarea correspondiente está implementada dentro de su alcance.
2. Los tests siguen el patrón AAA y cubren los nuevos caminos.
3. La cobertura, lint, build y TypeScript cumplen sus umbrales.
4. La documentación y el roadmap están actualizados.
5. La rama temática y el commit siguen las convenciones del proyecto.
6. La Pull Request describe el cambio, las pruebas ejecutadas, los riesgos y cualquier configuración adicional necesaria.
