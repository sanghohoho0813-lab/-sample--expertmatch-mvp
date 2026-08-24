import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      colors: {
        navy: {
          50: "#F3F6FA",
          100: "#E4EAF3",
          200: "#C6D2E5",
          300: "#98AECB",
          400: "#6280A9",
          500: "#3E5C87",
          600: "#2A446A",
          700: "#1D3253",
          800: "#132441",
          900: "#0B1A33",
          950: "#060F20",
        },
        teal: {
          50: "#ECFDFA",
          100: "#CFFAF2",
          200: "#A0F2E7",
          300: "#67E4D8",
          400: "#31CDC2",
          500: "#12B3A8",
          600: "#059089",
          700: "#07736E",
          800: "#0A5B58",
          900: "#0C4B49",
        },
        sky: {
          50: "#EFF7FF",
          100: "#DBEDFE",
          200: "#BFE0FD",
          300: "#93CDFB",
          400: "#60B2F7",
          500: "#3A94F1",
          600: "#2477E6",
        },
        amber: {
          400: "#FBBF3C",
          500: "#F5A524",
          600: "#D98511",
        },
        danger: {
          50: "#FEF2F2",
          100: "#FEE3E2",
          500: "#E5534B",
          600: "#CE3F37",
        },
        canvas: "#F6F8FB",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,26,51,0.04), 0 4px 16px -6px rgba(11,26,51,0.10)",
        "card-hover":
          "0 2px 4px rgba(11,26,51,0.05), 0 18px 40px -18px rgba(11,26,51,0.28)",
        pop: "0 10px 40px -12px rgba(11,26,51,0.30)",
        bar: "0 -8px 32px -12px rgba(11,26,51,0.22)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        shell: "1280px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "draw-check": {
          from: { strokeDashoffset: "48" },
          to: { strokeDashoffset: "0" },
        },
        "ring-pulse": {
          "0%": { transform: "scale(0.8)", opacity: "0.55" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 220ms ease-out both",
        "fade-up": "fade-up 320ms cubic-bezier(0.22,1,0.36,1) both",
        "slide-up": "slide-up 260ms cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 200ms cubic-bezier(0.22,1,0.36,1) both",
        "pop-in": "pop-in 420ms cubic-bezier(0.22,1,0.36,1) both",
        "draw-check": "draw-check 480ms 260ms ease-out both",
        "ring-pulse": "ring-pulse 1400ms ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
