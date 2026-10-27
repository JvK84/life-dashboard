import { afterEach, describe, expect, it, vi } from "vitest";
import {
  requestNotificationPermission,
  sendBrowserNotification,
} from "../browserNotifications";

type NotificationConstructorMock = {
  new (title: string, options?: NotificationOptions): Notification;
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
};

function createNotificationMock(permission: NotificationPermission): NotificationConstructorMock {
  const NotificationMock = vi.fn(function NotificationMock() {
    return {} as Notification;
  }) as unknown as NotificationConstructorMock;

  NotificationMock.permission = permission;
  NotificationMock.requestPermission = vi.fn().mockResolvedValue(permission);

  return NotificationMock;
}

function setVisibilityState(state: DocumentVisibilityState): void {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: state,
  });
}

describe("browser notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setVisibilityState("visible");
  });

  it.each<NotificationPermission>(["granted", "denied", "default"])(
    "requests and resolves the %s permission state",
    async (permission) => {
      // Arrange
      const notificationMock = createNotificationMock(permission);
      vi.stubGlobal("Notification", notificationMock);

      // Act
      const result = await requestNotificationPermission();

      // Assert
      expect(result).toBe(permission);
      expect(notificationMock.requestPermission).toHaveBeenCalledOnce();
    },
  );

  it("returns default when the browser does not support notifications", async () => {
    // Arrange
    vi.stubGlobal("Notification", undefined);

    // Act
    const result = await requestNotificationPermission();

    // Assert
    expect(result).toBe("default");
  });

  it("sends a notification when permission is granted and the tab is hidden", () => {
    // Arrange
    const notificationMock = createNotificationMock("granted");
    const options = { body: "Reunión en cinco minutos" };
    vi.stubGlobal("Notification", notificationMock);
    setVisibilityState("hidden");

    // Act
    const result = sendBrowserNotification("Próximo evento", options);

    // Assert
    expect(notificationMock).toHaveBeenCalledWith("Próximo evento", options);
    expect(result).toBeDefined();
  });

  it("does not send a notification when the tab is visible", () => {
    // Arrange
    const notificationMock = createNotificationMock("granted");
    vi.stubGlobal("Notification", notificationMock);
    setVisibilityState("visible");

    // Act
    const result = sendBrowserNotification("Próximo evento");

    // Assert
    expect(result).toBeNull();
    expect(notificationMock).not.toHaveBeenCalled();
  });

  it("does not send a notification when permission is denied", () => {
    // Arrange
    const notificationMock = createNotificationMock("denied");
    vi.stubGlobal("Notification", notificationMock);
    setVisibilityState("hidden");

    // Act
    const result = sendBrowserNotification("Correo urgente");

    // Assert
    expect(result).toBeNull();
    expect(notificationMock).not.toHaveBeenCalled();
  });

  it("does not send a notification when the browser does not support notifications", () => {
    // Arrange
    vi.stubGlobal("Notification", undefined);
    setVisibilityState("hidden");

    // Act
    const result = sendBrowserNotification("Correo urgente");

    // Assert
    expect(result).toBeNull();
  });
});
