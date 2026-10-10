import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the dashboard as the home page", () => {
    // Arrange
    render(<Home />);

    // Act
    const greeting = screen.getByText(/Buenos días, Jalonso/i);

    // Assert
    expect(greeting).toBeInTheDocument();
  });
});
