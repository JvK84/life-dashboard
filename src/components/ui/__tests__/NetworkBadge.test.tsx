import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkBadge } from "../NetworkBadge";
import { ToastProvider, useToast } from "@/src/context/ToastContext";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";

function setOnlineState(isOnline: boolean): void {
  Object.defineProperty(window.navigator, "onLine", { configurable: true, value: isOnline });
}

function ToastCount() {
  const { toasts } = useToast();
  return <span data-testid="toast-count">{toasts.length}</span>;
}

describe("useNetworkStatus", () => {
  beforeEach(() => setOnlineState(true));

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("detects when the browser goes offline", () => {
    // Arrange
    const { result } = renderHook(() => useNetworkStatus());

    // Act
    act(() => window.dispatchEvent(new Event("offline")));

    // Assert
    expect(result.current).toBe(false);
  });

  it("detects when the browser comes back online", () => {
    // Arrange
    setOnlineState(false);
    const { result } = renderHook(() => useNetworkStatus());

    // Act
    act(() => window.dispatchEvent(new Event("online")));

    // Assert
    expect(result.current).toBe(true);
  });

  it("removes network event listeners when unmounted", () => {
    // Arrange
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useNetworkStatus());

    // Act
    unmount();

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("offline", expect.any(Function));
  });
});

describe("NetworkBadge", () => {
  beforeEach(() => setOnlineState(true));

  it("shows an accessible offline indicator", () => {
    // Arrange
    render(<ToastProvider><NetworkBadge /></ToastProvider>);

    // Act
    act(() => window.dispatchEvent(new Event("offline")));

    // Assert
    expect(screen.getByRole("status", { name: "Sin conexión" })).toBeInTheDocument();
  });

  it("adds a recovery toast after reconnecting", () => {
    // Arrange
    render(<ToastProvider><NetworkBadge /><ToastCount /></ToastProvider>);
    act(() => window.dispatchEvent(new Event("offline")));

    // Act
    act(() => window.dispatchEvent(new Event("online")));

    // Assert
    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
  });
});
