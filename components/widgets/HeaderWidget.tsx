"use client";

import { useEffect, useState } from "react";
import { Clock3, CloudSun } from "lucide-react";
import { fetchCurrentWeather, type WeatherSnapshot } from "@/src/lib/integrations/weather/openMeteo";

const WEATHER_CACHE_KEY = "life-dashboard.weather";
const neutralWeather: WeatherSnapshot = { temperature: 0, weatherCode: -1, condition: "Sin datos", icon: "🌡️" };

function readCachedWeather(): WeatherSnapshot | null {
  try {
    const cached = window.localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as Partial<WeatherSnapshot>;
    if (typeof parsed.temperature !== "number" || typeof parsed.condition !== "string" || typeof parsed.icon !== "string") return null;
    return { temperature: parsed.temperature, weatherCode: parsed.weatherCode ?? -1, condition: parsed.condition, icon: parsed.icon };
  } catch {
    return null;
  }
}

export function HeaderWidget() {
  const [weather, setWeather] = useState<WeatherSnapshot>(neutralWeather);

  useEffect(() => {
    const cached = readCachedWeather();
    if (cached) setWeather(cached);
    let isCurrent = true;
    fetchCurrentWeather()
      .then((currentWeather) => {
        if (!isCurrent) return;
        setWeather(currentWeather);
        window.localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(currentWeather));
      })
      .catch(() => undefined);
    return () => {
      isCurrent = false;
    };
  }, []);

  const weatherLabel = weather.weatherCode === -1 ? weather.condition : `${weather.temperature}º · ${weather.condition}`;

  return (
    <div className="flex items-center gap-3 text-sm text-black/65 dark:text-white/75">
      <span className="flex items-center gap-2" aria-label={`Clima: ${weatherLabel}`}><CloudSun size={18} aria-hidden="true" /> <span>{weather.icon} {weatherLabel}</span></span>
      <span className="h-4 w-px bg-black/15 dark:bg-white/20" aria-hidden="true" />
      <span className="flex items-center gap-2"><Clock3 size={17} aria-hidden="true" /> 09:42 AM</span>
    </div>
  );
}
