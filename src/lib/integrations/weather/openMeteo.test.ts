import { afterEach, describe, expect, it, vi } from "vitest";
import { describeWeatherCode, fetchCurrentWeather, getWeatherUrl } from "./openMeteo";

describe("Open-Meteo integration", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("builds a request URL with the configured weather parameters", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_WEATHER_LATITUDE", "41.3874");
    vi.stubEnv("NEXT_PUBLIC_WEATHER_LONGITUDE", "2.1686");
    vi.stubEnv("NEXT_PUBLIC_WEATHER_TIMEZONE", "Europe/Madrid");

    // Act
    const url = getWeatherUrl();

    // Assert
    expect(url).toBe("https://api.open-meteo.com/v1/forecast?latitude=41.3874&longitude=2.1686&current_weather=true&timezone=Europe%2FMadrid");
  });

  it("uses safe defaults when location variables are empty", () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_WEATHER_LATITUDE", "");
    vi.stubEnv("NEXT_PUBLIC_WEATHER_LONGITUDE", "");
    vi.stubEnv("NEXT_PUBLIC_WEATHER_TIMEZONE", "");

    // Act
    const url = getWeatherUrl();

    // Assert
    expect(url).toContain("latitude=40.4168&longitude=-3.7038");
    expect(url).toContain("timezone=Europe%2FMadrid");
  });

  it("normalizes the current weather response", async () => {
    // Arrange
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ current_weather: { temperature: 20, weathercode: 63 } }), { status: 200 }));

    // Act
    const weather = await fetchCurrentWeather(fetcher);

    // Assert
    expect(weather).toEqual({ temperature: 20, weatherCode: 63, condition: "Lluvia", icon: "🌧️" });
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("uses a neutral description for an unknown weather code", () => {
    // Arrange
    const weatherCode = 999;

    // Act
    const description = describeWeatherCode(weatherCode);

    // Assert
    expect(description).toEqual({ condition: "Condiciones desconocidas", icon: "🌡️" });
  });

  it("rejects unsuccessful HTTP responses", async () => {
    // Arrange
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));

    // Act
    const request = fetchCurrentWeather(fetcher);

    // Assert
    await expect(request).rejects.toThrow("503");
  });

  it("rejects malformed weather responses", async () => {
    // Arrange
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ current_weather: {} }), { status: 200 }));

    // Act
    const request = fetchCurrentWeather(fetcher);

    // Assert
    await expect(request).rejects.toThrow("no contiene el clima actual");
  });
});
