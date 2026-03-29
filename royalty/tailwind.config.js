/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        border: "var(--border)",
        muted: "var(--muted)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        ambient: "0 24px 80px rgba(0, 0, 0, 0.35)",
        panel: "0 12px 40px rgba(0, 0, 0, 0.28)",
      },
      backgroundImage: {
        "premium-grid":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

