export type BrowserNotificationPermission = NotificationPermission;

function getNotificationConstructor(): typeof Notification | undefined {
  if (typeof window === "undefined" || typeof window.Notification === "undefined") return undefined;

  return window.Notification;
}

export async function requestNotificationPermission(): Promise<BrowserNotificationPermission> {
  const notificationConstructor = getNotificationConstructor();

  if (!notificationConstructor) return "default";

  return notificationConstructor.requestPermission();
}

export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions,
): Notification | null {
  const notificationConstructor = getNotificationConstructor();

  if (
    !notificationConstructor
    || notificationConstructor.permission !== "granted"
    || typeof document === "undefined"
    || document.visibilityState !== "hidden"
  ) {
    return null;
  }

  return new notificationConstructor(title, options);
}
