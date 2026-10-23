# Arquitectura

## Pila tecnológica

- Next.js con App Router y React.
- TypeScript en modo estricto.
- Tailwind CSS para estilos responsive y temas claro/oscuro.
- Vitest y React Testing Library para pruebas unitarias y de integración.
- GitHub Actions con Lighthouse CI para validar calidad y rendimiento en Pull Requests.

## Estructura

```text
app/                         # rutas, layout y estilos globales de Next.js
components/                  # composición actual del dashboard
src/components/widgets/      # widgets aislados de agenda, tareas, energía, etc.
src/lib/services/            # integraciones externas y servicios tipados
src/lib/utils/               # lógica pura y transformaciones reutilizables
src/hooks/                   # hooks compartidos; reservado para hooks extraídos
docs/                        # contexto técnico, roadmap y tareas
docs/tasks/                  # épicas y micro-tareas atómicas
```

La implementación actual utiliza `src/lib` para servicios y utilidades, y `src/components/widgets/` para los widgets. Si se introduce una carpeta `lib/` o `hooks/` en la raíz, debe justificarse y mantener una única fuente de verdad por módulo.

## Flujo de datos

`Dashboard` compone los widgets y coordina el estado de pantalla. Las integraciones externas se ejecutan a través de servicios tipados, normalmente desde rutas de servidor, y sus respuestas se normalizan antes de llegar a la UI. Los widgets reciben datos y callbacks por props; no deben llamar directamente a Google Calendar u otros proveedores.

Los datos mock y las constantes reutilizables viven fuera de los componentes, en módulos como `src/data/dashboard.ts`, para evitar recreaciones durante el render y facilitar las pruebas.

## Patrones acordados

- **Separación de widgets:** cada widget encapsula una responsabilidad visual y de interacción concreta.
- **Composición en `Dashboard`:** el componente de dashboard conecta estado, servicios y widgets sin concentrar la lógica de presentación de cada sección.
- **Estado funcional:** cuando el nuevo estado depende del anterior, usar actualizaciones funcionales como `setTasks((previous) => nextTasks)` para evitar cierres obsoletos.
- **Frontera de servicios:** validar, normalizar y tipar los datos externos antes de entregarlos a componentes.
- **Constantes fuera de componentes:** mantener mocks, valores por defecto y configuraciones estáticas en módulos independientes.
- **Accesibilidad por diseño:** los controles deben tener foco visible, nombre accesible, soporte de teclado y estados ARIA adecuados.
