# Arquitectura

## Objetivo

Life Dashboard es una Single Page Application personal para reunir agenda, correo, tareas, energía/clima y accesos rápidos en una vista rápida y clara.

## Stack definido

- **Framework:** Next.js con App Router.
- **UI:** React y TypeScript estricto.
- **Estilos:** Tailwind CSS.
- **Estado local:** estado de React y, cuando crezca la interacción compartida, Zustand.
- **Persistencia:** LocalStorage para preferencias y datos locales; Supabase para persistencia sincronizada y autenticación cuando se necesite acceso desde varios dispositivos.
- **Integraciones:** servicios aislados en TypeScript dentro de `src/lib/services`.
- **Calidad:** ESLint, Vitest, Testing Library y GitHub Actions para validar PRs hacia `main`.

## Estructura de directorios

```text
life-dashboard/
├── .codex/
│   └── AGENTS.md
├── .github/
│   └── workflows/
│       └── quality.yml
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── dashboard.tsx
├── docs/
│   ├── ARCHITECTURE.md
│   ├── REFERENCES.md
│   └── ROADMAP.md
├── src/
│   ├── components/
│   │   ├── ui/          # Botones, tarjetas, inputs y primitives reutilizables
│   │   └── widgets/     # Agenda, inbox, tareas, energía y atajos
│   ├── lib/
│   │   ├── services/    # Clientes y adaptadores de APIs externas
│   │   └── utils/       # Utilidades puras compartidas
│   ├── types/           # Tipos de dominio y contratos de integraciones
│   └── stores/          # Stores Zustand cuando el estado compartido lo requiera
├── .env.example
└── package.json
```

La implementación inicial mantiene el componente principal en `components/` para permitir una migración progresiva hacia la estructura `src/` sin bloquear el primer prototipo. Las nuevas piezas reutilizables deben seguir el mapa `src/components/ui` y `src/components/widgets`.

## Flujo de datos

```text
Widget visual → servicio tipado → API externa
       ↓              ↓
   estado UI      normalización de datos
       ↓
 LocalStorage / Supabase
```

Los widgets no deben llamar directamente a Google, Supabase u otros proveedores. Cada integración tendrá un servicio tipado y una capa de normalización para que la UI dependa de modelos internos estables.

## Guía visual

- Usar un Bento Grid responsive como estructura principal.
- Mantener tarjetas con jerarquía clara, bordes redondeados amplios y espacios generosos.
- Soportar tema oscuro y claro mediante tokens de color, evitando colores hardcodeados dentro de cada widget.
- Priorizar fondos neutros, contraste alto para información importante y un color de acento controlado.
- Usar glassmorphism solo como detalle puntual; la legibilidad y la velocidad visual tienen prioridad.
- Las acciones rápidas deben ser visibles, accesibles por teclado y tener estados hover/focus.
- El layout debe funcionar desde móvil hasta un monitor grande sin depender de una resolución concreta.

## Decisiones de integración

- Google Calendar y Gmail se conectarán mediante OAuth. Los tokens y secretos permanecerán en el servidor.
- La primera integración implementada es Google Calendar en `/api/integrations/google/calendar`: usa scopes de solo lectura, valida el estado OAuth, cifra la credencial en una cookie `HttpOnly` y renueva el access token cuando está próximo a caducar. La persistencia multiusuario server-side queda condicionada a incorporar identidad y Supabase.
- Open-Meteo se usará para clima sin API key cuando la ubicación y el nivel de precisión lo permitan.
- Supabase será optativo para sincronizar datos entre dispositivos; LocalStorage será el fallback para el modo local.
