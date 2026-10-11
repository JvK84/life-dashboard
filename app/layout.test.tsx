import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata } from "./layout";

vi.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe("RootLayout", () => {
  it("sets the Spanish document language and renders its content", () => {
    // Arrange
    const content = "Contenido de prueba";

    // Act
    render(
      <RootLayout>
        <span>{content}</span>
      </RootLayout>,
    );

    // Assert
    expect(document.documentElement).toHaveAttribute("lang", "es");
    expect(screen.getByText(content)).toBeInTheDocument();
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
  });

  it("exposes the dashboard metadata", () => {
    // Arrange
    const expectedMetadata = metadata;

    // Act
    const title = expectedMetadata.title;
    const description = expectedMetadata.description;

    // Assert
    expect(title).toBe("Life Dashboard");
    expect(description).toBe("Tu día, en un solo lugar.");
  });
});
