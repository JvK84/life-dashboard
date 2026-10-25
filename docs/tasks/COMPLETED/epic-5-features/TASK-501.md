# [TASK-501] Widget de Clima con Open-Meteo API

- **Estado:** 🟢 Completada
- **Epic:** Epic 5 — Contexto Doméstico
- **Prioridad:** Baja

---

## 🎯 Objetivo
Sustituir los datos de clima mock por datos meteorológicos reales usando la API gratuita de Open-Meteo sin necesidad de API key.

---

## 📁 Archivos Involucrados
- `src/lib/integrations/weather/openMeteo.ts` (nuevo)
- `components/widgets/HeaderWidget.tsx`
- `components/widgets/HeaderWidget.test.tsx`

---

## 📝 Instrucciones

1. Crear cliente para Open-Meteo API utilizando las coordenadas geográficas de la ubicación configurada.
2. Retornar temperatura, código de estado del tiempo e icono equivalente.
3. Implementar un fallback graceful (mostrar datos cacheados o estado neutro) en caso de fallo de red.
4. Mockear las llamadas HTTP en los tests unitarios del HeaderWidget.

---

## ✅ Criterio de Aceptación
- [x] Fallback verificado ante errores de red.
- [x] Tests pasando en verde sin hacer peticiones HTTP reales.
