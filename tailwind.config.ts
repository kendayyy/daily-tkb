import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-card": "var(--paper-card)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        hoc: "var(--hoc)",
        "hoc-bg": "var(--hoc-bg)",
        lam: "var(--lam)",
        "lam-bg": "var(--lam-bg)",
        nha: "var(--nha)",
        "nha-bg": "var(--nha-bg)",
        khac: "var(--khac)",
        "khac-bg": "var(--khac-bg)",
        danger: "#C1502E",
      },
      borderRadius: {
        card: "var(--r-card)",
        cell: "var(--r-cell)",
        chip: "var(--r-chip)",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        sheet: "0 16px 48px rgba(35, 42, 38, 0.12)",
        selected: "0 0 0 2px var(--hoc), 0 0 12px rgba(59, 130, 246, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
