# Life Dashboard

Panel personal de una sola página para centralizar agenda, correo, tareas y accesos rápidos.

## Arranque local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Para abrirlo desde otro ordenador de la red doméstica:

```bash
npm run dev -- --hostname 0.0.0.0
```

Después visita `http://IP-DE-TU-MAC:3000` desde el otro equipo.

## Calidad y ramas

Los tests se ejecutan con `npm test`. Cada Pull Request hacia `main` ejecuta lint, tests y build mediante GitHub Actions en `.github/workflows/quality.yml`.

Flujo recomendado: crear una rama `feature/nombre-del-cambio`, abrir un PR hacia `main` y fusionarlo solo cuando pase el workflow.

## Próximas iteraciones

1. Persistencia local de tareas y preferencias.
2. Integración OAuth con Google Calendar y Gmail.
3. Configuración de atajos y modo oscuro.
