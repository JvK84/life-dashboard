import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      all: true,
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "src/lib/services/**/*.{ts,tsx}", "src/lib/utils/calendar-range.ts"],
      exclude: ["app/api/**", "**/*.test.{ts,tsx}", "**/*.d.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 95,
      },
    },
  },
});
