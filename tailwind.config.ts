import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        text: "var(--text-primary)",
        parchment: "var(--parchment)",
        ink: "var(--ink)",
        palm: "var(--primary)",
        gold: "var(--gold)",
        border: "var(--border)",
        ring: "var(--ring)",
        card: "var(--card)",
        muted: "var(--muted)",
        mutedForeground: "var(--muted-foreground)",
        primarySoft: "var(--primary-soft)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
