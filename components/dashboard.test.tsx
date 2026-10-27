import { fireEvent, render as rtlRender, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dashboard } from "./dashboard";
import { ErrorProvider } from "@/src/context/ErrorContext";

const render = (ui: ReactElement) => rtlRender(<ErrorProvider>{ui}</ErrorProvider>);

const mockDashboardFetch = (calendarResponse: () => Response, gmailResponse: () => Response = () => new Response(JSON.stringify({ messages: [] }), { status: 200 })) =>
  vi.fn((input: RequestInfo | URL) =>
    String(input).startsWith("https://api.open-meteo.com")
      ? Promise.resolve(new Response(JSON.stringify({ current_weather: { temperature: 19, weathercode: 0 } }), { status: 200 }))
      : String(input).includes("/api/integrations/google/gmail/messages")
        ? Promise.resolve(gmailResponse())
      : Promise.resolve(calendarResponse()),
  );

describe("Dashboard", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Google Calendar no conectado")));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the daily summary and main modules", () => {
    // Arrange
    render(<Dashboard />);

    // Act
    const summary = screen.getByText(/Buenos días, Jalonso/i);

    // Assert
    expect(summary).toBeInTheDocument();
    expect(screen.getByText("Mi agenda")).toBeInTheDocument();
    expect(screen.getByText("Bandeja de entrada")).toBeInTheDocument();
    expect(screen.getByText("Atajos rápidos")).toBeInTheDocument();
  });

  it("replaces mock agenda data with events from Google Calendar", async () => {
    // Arrange
    vi.stubGlobal(
      "fetch",
      mockDashboardFetch(() => new Response(JSON.stringify({ events: [{ id: "google-1", title: "Reunión Google", start: "2026-10-11T10:00:00Z", end: "2026-10-11T11:30:00Z", allDay: false }] }), { status: 200 })),
    );

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("Reunión Google")).toBeInTheDocument());
    expect(screen.queryByText("Daily de producto")).not.toBeInTheDocument();
    expect(screen.getByText("1.5 h")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Conectar Google Calendar" })).not.toBeInTheDocument();
  });

  it("renders the unread Gmail messages returned by the API", async () => {
    // Arrange
    vi.stubGlobal("fetch", mockDashboardFetch(
      () => new Response(null, { status: 401 }),
      () => new Response(JSON.stringify({ messages: [{ id: "mail-1", sender: "Ada Lovelace", subject: "Reunión semanal", snippet: "Nos vemos mañana", date: "2026-10-24T10:00:00.000Z", unread: true }] }), { status: 200 }),
    ));

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("Reunión semanal")).toBeInTheDocument());
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir Gmail" })).toHaveAttribute("href", "https://mail.google.com");
  });

  it("shows a Gmail error and reconnect action when the API rejects the request", async () => {
    // Arrange
    vi.stubGlobal("fetch", mockDashboardFetch(
      () => new Response(null, { status: 401 }),
      () => new Response(null, { status: 500 }),
    ));

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No se pudieron cargar los mensajes de Gmail."));
    expect(screen.getByRole("link", { name: "Conectar Google" })).toHaveAttribute("href", "/api/integrations/google/calendar/connect");
  });

  it("explains when Google authorization is required for Gmail", async () => {
    // Arrange
    vi.stubGlobal("fetch", mockDashboardFetch(
      () => new Response(null, { status: 401 }),
      () => new Response(null, { status: 401 }),
    ));

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Conecta Google para consultar tu correo."));
  });

  it("shows an empty inbox when Gmail returns no message collection", async () => {
    // Arrange
    vi.stubGlobal("fetch", mockDashboardFetch(
      () => new Response(null, { status: 401 }),
      () => new Response(JSON.stringify({}), { status: 200 }),
    ));

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("Inbox limpia")).toBeInTheDocument());
  });

  it("reloads the selected agenda range", async () => {
    // Arrange
    const fetchMock = mockDashboardFetch(() => new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<Dashboard />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Semana" }));

    // Assert
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/integrations/google/calendar/events?range=week", expect.objectContaining({ signal: expect.any(AbortSignal) })));
    expect(screen.getByRole("button", { name: "Semana" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Día" })).toHaveAttribute("aria-pressed", "false");
  });

  it("shows an empty state when the connected period has no events", async () => {
    // Arrange
    vi.stubGlobal("fetch", mockDashboardFetch(() => new Response(JSON.stringify({ events: [] }), { status: 200 })));

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("No hay eventos en este periodo.", { selector: "p" })).toBeInTheDocument());
    expect(screen.getByText("No hay eventos en este periodo.", { selector: "strong" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Conectar Google Calendar" })).not.toBeInTheDocument();
  });

  it("keeps mock agenda data when Google Calendar is not connected", async () => {
    // Arrange
    vi.stubGlobal("fetch", mockDashboardFetch(() => new Response(null, { status: 401 })));

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("Daily de producto")).toBeInTheDocument());
    expect(screen.queryByText("Reunión Google")).not.toBeInTheDocument();
  });

  it("can add and complete a task", () => {
    // Arrange
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");

    // Act
    fireEvent.change(input, { target: { value: "Preparar demo" } });
    fireEvent.submit(input);

    // Assert
    expect(screen.getByText("Preparar demo")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByText("Preparar demo"));

    // Assert
    expect(screen.getByText("2 de 4 completadas.")).toBeInTheDocument();
  });

  it("keeps consecutive task additions", () => {
    // Arrange
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");

    // Act
    fireEvent.change(input, { target: { value: "Primera tarea" } });
    fireEvent.submit(input);
    fireEvent.change(input, { target: { value: "Segunda tarea" } });
    fireEvent.submit(input);

    // Assert
    expect(screen.getByText("Primera tarea")).toBeInTheDocument();
    expect(screen.getByText("Segunda tarea")).toBeInTheDocument();
    expect(screen.getByText("1 de 5 completadas.")).toBeInTheDocument();
  });

  it("restores tasks from local storage", async () => {
    // Arrange
    localStorage.setItem(
      "life-dashboard.tasks",
      JSON.stringify([{ id: "saved-1", label: "Tarea guardada", done: true, tag: "Trabajo" }]),
    );

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("Tarea guardada")).toBeInTheDocument());
    expect(screen.getByText("1 de 1 completadas.")).toBeInTheDocument();
  });

  it("falls back to initial tasks when local storage is invalid", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.tasks", "{invalid json");

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(screen.getByText("1 de 3 completadas.")).toBeInTheDocument());
  });

  it("ignores empty tasks", () => {
    // Arrange
    render(<Dashboard />);
    const input = screen.getByLabelText("Nueva tarea");

    // Act
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input);

    // Assert
    expect(screen.queryByText("   ")).not.toBeInTheDocument();
    expect(screen.getByText("1 de 3 completadas.")).toBeInTheDocument();
  });

  it("can undo a completed task", () => {
    // Arrange
    render(<Dashboard />);
    const completedTask = screen.getByText("Revisar propuesta de producto");

    // Act
    fireEvent.click(completedTask);

    // Assert
    expect(screen.getByText("0 de 3 completadas.")).toBeInTheDocument();
  });

  it("can archive the inbox", async () => {
    // Arrange
    render(<Dashboard />);

    // Act
    await waitFor(() => expect(screen.getByRole("button", { name: "Archivar correos" })).not.toBeDisabled());
    fireEvent.click(screen.getByRole("button", { name: "Archivar correos" }));

    // Assert
    expect(screen.getByText("Todo al día.")).toBeInTheDocument();
    expect(screen.getByText("Inbox limpia")).toBeInTheDocument();
    expect(screen.queryByText("3 correos esperan.")).not.toBeInTheDocument();
  });

  it("exposes accessible names, states, links, and keyboard focus", async () => {
    // Arrange
    render(<Dashboard />);
    const searchButton = screen.getByRole("button", { name: "Buscar" });
    const firstTask = screen.getByRole("button", { name: /Revisar propuesta de producto/i });

    // Act
    searchButton.focus();

    // Assert
    expect(searchButton).toHaveFocus();
    expect(searchButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Más opciones de agenda (próximamente)" })).toHaveAttribute("aria-disabled", "true");
    await waitFor(() => expect(screen.getByRole("link", { name: "Conectar Google" })).toHaveAttribute("href", "/api/integrations/google/calendar/connect"));
    expect(screen.getByRole("button", { name: "Añadir atajo (próximamente)" })).toBeDisabled();
    expect(firstTask).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Conectar Google Calendar" })).toHaveAttribute("href", "/api/integrations/google/calendar/connect");
  });

  it("filters visible tasks immediately from the search control", () => {
    // Arrange
    render(<Dashboard />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar tareas" }), { target: { value: "propuesta" } });

    // Assert
    expect(screen.getByRole("button", { name: /Revisar propuesta de producto/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Preparar presentación/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute("aria-expanded", "true");
  });

  it("announces when the search has no matching tasks", () => {
    // Arrange
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    // Act
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar tareas" }), { target: { value: "sin coincidencias" } });

    // Assert
    expect(screen.getByRole("status")).toHaveTextContent("No hay tareas que coincidan con tu búsqueda.");
  });

  it("toggles and persists the selected theme", async () => {
    // Arrange
    render(<Dashboard />);
    const toggle = screen.getByRole("button", { name: "Activar modo oscuro" });

    // Act
    fireEvent.click(toggle);

    // Assert
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("life-dashboard.theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Activar modo claro" })).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Activar modo claro" }));

    // Assert
    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
    expect(localStorage.getItem("life-dashboard.theme")).toBe("light");
  });

  it("restores a previously selected theme", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.theme", "dark");

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(screen.getByRole("button", { name: "Activar modo claro" })).toBeInTheDocument();
  });

  it("restores the light theme when it is explicitly saved", async () => {
    // Arrange
    localStorage.setItem("life-dashboard.theme", "light");

    // Act
    render(<Dashboard />);

    // Assert
    await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
    expect(screen.getByRole("button", { name: "Activar modo oscuro" })).toBeInTheDocument();
  });

  it("supports keyboard shortcuts and an accessible help dialog", async () => {
    // Arrange
    render(<Dashboard />);
    const newTaskInput = screen.getByRole("textbox", { name: "Nueva tarea" });

    // Act
    fireEvent.keyDown(window, { key: "n" });
    fireEvent.keyDown(window, { key: "?" });

    // Assert
    expect(newTaskInput).toHaveFocus();
    const dialog = screen.getByRole("dialog", { name: "Atajos de teclado" });
    expect(dialog).toBeInTheDocument();

    // Act
    fireEvent.click(dialog);

    // Act
    fireEvent.keyDown(window, { key: "Escape" });

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Atajos de teclado" })).not.toBeInTheDocument());
  });
});
