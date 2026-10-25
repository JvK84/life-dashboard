import { useEffect } from "react";

export type KeyboardShortcutHandlers = {
  onNewTask?: () => void;
  onToggleTheme?: () => void;
  onShowHelp?: () => void;
  onCloseHelp?: () => void;
};

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.matches("input, textarea, select, [contenteditable=\"true\"]") || Boolean(target.closest("[contenteditable=\"true\"]")));
}

export function useKeyboardShortcuts({ onNewTask, onToggleTheme, onShowHelp, onCloseHelp }: KeyboardShortcutHandlers): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        onCloseHelp?.();
        return;
      }
      if (isEditableTarget(event.target)) return;

      switch (event.key.toLowerCase()) {
        case "n":
          event.preventDefault();
          onNewTask?.();
          break;
        case "d":
          event.preventDefault();
          onToggleTheme?.();
          break;
        case "?":
          event.preventDefault();
          onShowHelp?.();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCloseHelp, onNewTask, onShowHelp, onToggleTheme]);
}
