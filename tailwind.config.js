/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base surfaces (dark-first)
        base: {
          DEFAULT: "#05070d", // very dark background
          950: "#05070d",
          900: "#0a0e17",
          800: "#111725",
          700: "#1a2234",
        },
        surface: {
          DEFAULT: "#0d121e",
          raised: "#131a29",
          overlay: "#182135",
        },
        // Accent (blue / cyan)
        accent: {
          DEFAULT: "#22d3ee",
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        brand: {
          DEFAULT: "#3b82f6",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 0 32px -8px rgba(34,211,238,0.35)",
        "glow-sm": "0 0 24px -12px rgba(34,211,238,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 30px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
        "radial-accent":
          "radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0) 70%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
