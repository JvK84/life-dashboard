import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111113",
        paper: "#f5f5f2",
        lime: "#d7f36b",
        lavender: "#dfd9ff",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 19, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
