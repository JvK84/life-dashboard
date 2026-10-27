import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderWidget } from "./HeaderWidget";
import { ErrorProvider } from "@/src/context/ErrorContext";

const render = (ui: ReactElement) => rtlRender(<ErrorProvider>{ui}</ErrorProvider>);

describe("HeaderWidget", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.unstubAllGlobals());

  it("renders current weather returned by Open-Meteo", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ current_weather: { temperature: 21.5, weathercode: 1 } }), { status: 200 })));

    // Act
    render(<HeaderWidget />);

    // Assert
    await waitFor(() => expect(screen.getByLabelText("Clima: 21.5º · Principalmente despejado")).toBeInTheDocument());
  });

  it("uses cached weather when the network fails", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.weather", JSON.stringify({ temperature: 18, weatherCode: 3, condition: "Nublado", icon: "☁️" }));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    // Act
    render(<HeaderWidget />);

    // Assert
    await waitFor(() => expect(screen.getByLabelText("Clima: 18º · Nublado")).toBeInTheDocument());
  });

  it("shows a neutral state when there is no cached weather", async () => {
    // Arrange
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    // Act
    render(<HeaderWidget />);

    // Assert
    await waitFor(() => expect(screen.getByLabelText("Clima: Sin datos")).toBeInTheDocument());
  });

  it("ignores corrupted cached weather", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.weather", "{invalid json");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    // Act
    render(<HeaderWidget />);

    // Assert
    await waitFor(() => expect(screen.getByLabelText("Clima: Sin datos")).toBeInTheDocument());
  });
});
