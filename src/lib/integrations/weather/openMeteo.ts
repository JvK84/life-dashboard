export type WeatherSnapshot = {
  temperature: number;
  weatherCode: number;
  condition: string;
  icon: string;
};

type OpenMeteoResponse = {
  current_weather?: {
    temperature?: number;
    weathercode?: number;
  };
};

type Fetcher = typeof fetch;

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const DEFAULT_LATITUDE = 40.4168;
const DEFAULT_LONGITUDE = -3.7038;
const DEFAULT_TIMEZONE = "Europe/Madrid";

const weatherDescriptions: Record<number, { condition: string; icon: string }> = {
  0: { condition: "Despejado", icon: "☀️" },
  1: { condition: "Principalmente despejado", icon: "🌤️" },
  2: { condition: "Parcialmente nublado", icon: "⛅" },
  3: { condition: "Nublado", icon: "☁️" },
  45: { condition: "Niebla", icon: "🌫️" },
  48: { condition: "Niebla helada", icon: "🌫️" },
  51: { condition: "Llovizna ligera", icon: "🌦️" },
  53: { condition: "Llovizna", icon: "🌦️" },
  55: { condition: "Llovizna intensa", icon: "🌧️" },
  61: { condition: "Lluvia ligera", icon: "🌦️" },
  63: { condition: "Lluvia", icon: "🌧️" },
  65: { condition: "Lluvia intensa", icon: "🌧️" },
  71: { condition: "Nieve ligera", icon: "🌨️" },
  73: { condition: "Nieve", icon: "🌨️" },
  75: { condition: "Nieve intensa", icon: "❄️" },
  80: { condition: "Chubascos ligeros", icon: "🌦️" },
  81: { condition: "Chubascos", icon: "🌧️" },
  82: { condition: "Chubascos intensos", icon: "🌧️" },
  95: { condition: "Tormenta", icon: "⛈️" },
  96: { condition: "Tormenta con granizo", icon: "⛈️" },
  99: { condition: "Tormenta intensa", icon: "⛈️" },
};

export function describeWeatherCode(weatherCode: number): { condition: string; icon: string } {
  return weatherDescriptions[weatherCode] ?? { condition: "Condiciones desconocidas", icon: "🌡️" };
}

export function getWeatherUrl(): string {
  const latitude = Number(process.env.NEXT_PUBLIC_WEATHER_LATITUDE) || DEFAULT_LATITUDE;
  const longitude = Number(process.env.NEXT_PUBLIC_WEATHER_LONGITUDE) || DEFAULT_LONGITUDE;
  const timezone = process.env.NEXT_PUBLIC_WEATHER_TIMEZONE || DEFAULT_TIMEZONE;
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), current_weather: "true", timezone });
  return `${OPEN_METEO_URL}?${params.toString()}`;
}

export async function fetchCurrentWeather(fetcher: Fetcher = fetch): Promise<WeatherSnapshot> {
  const response = await fetcher(getWeatherUrl());
  if (!response.ok) throw new Error(`Open-Meteo respondió con ${response.status}`);
  const payload = (await response.json()) as OpenMeteoResponse;
  const currentWeather = payload.current_weather;
  if (typeof currentWeather?.temperature !== "number" || typeof currentWeather.weathercode !== "number") {
    throw new Error("La respuesta de Open-Meteo no contiene el clima actual");
  }

  return {
    temperature: currentWeather.temperature,
    weatherCode: currentWeather.weathercode,
    ...describeWeatherCode(currentWeather.weathercode),
  };
}
