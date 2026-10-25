import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  it("runs the global shortcuts", () => {
    // Arrange
    const handlers = { onNewTask: vi.fn(), onToggleTheme: vi.fn(), onShowHelp: vi.fn() };
    renderHook(() => useKeyboardShortcuts(handlers));

    // Act
    fireEvent.keyDown(window, { key: "n" });
    fireEvent.keyDown(window, { key: "d" });
    fireEvent.keyDown(window, { key: "?" });
    fireEvent.keyDown(window, { key: "x" });

    // Assert
    expect(handlers.onNewTask).toHaveBeenCalledOnce();
    expect(handlers.onToggleTheme).toHaveBeenCalledOnce();
    expect(handlers.onShowHelp).toHaveBeenCalledOnce();
  });

  it("ignores shortcuts from editable controls", () => {
    // Arrange
    const onNewTask = vi.fn();
    const input = document.createElement("input");
    document.body.append(input);
    renderHook(() => useKeyboardShortcuts({ onNewTask }));

    // Act
    fireEvent.keyDown(input, { key: "n" });

    // Assert
    expect(onNewTask).not.toHaveBeenCalled();
  });

  it("ignores shortcuts from nested editable content and modified key events", () => {
    // Arrange
    const onNewTask = vi.fn();
    const editor = document.createElement("div");
    editor.setAttribute("contenteditable", "true");
    document.body.append(editor);
    renderHook(() => useKeyboardShortcuts({ onNewTask }));

    // Act
    fireEvent.keyDown(editor, { key: "n" });
    fireEvent.keyDown(window, { key: "n", ctrlKey: true });

    // Assert
    expect(onNewTask).not.toHaveBeenCalled();
  });

  it("closes the help dialog with Escape and removes the listener on unmount", () => {
    // Arrange
    const onCloseHelp = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcuts({ onCloseHelp }));

    // Act
    fireEvent.keyDown(window, { key: "Escape" });
    unmount();
    fireEvent.keyDown(window, { key: "Escape" });

    // Assert
    expect(onCloseHelp).toHaveBeenCalledOnce();
  });
});
