import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // 화면 전체가 쓰는 단일 글자 크기 단계 (기본 크기를 1.5배 키운 디자인 기준)
    fontSize: {
      /** 로고 보조 표기 같은 아주 작은 대문자 라벨 전용 */
      "3xs": "12.5px",
      "2xs": "15px",
      xs: "16.5px",
      sm: "18px",
      base: "19.5px",
      md: "20.5px",
      lg: "21.5px",
      xl: "23px",
      "2xl": "24.5px",
      "3xl": "27px",
      "4xl": "30.5px",
      "5xl": "33px",
      "6xl": "36px",
      "7xl": "41px",
      "8xl": "46px",
      "9xl": "55px",
      display: "76px",
      mega: "94px",
    },
    extend: {
      screens: {
        xs: "360px",
      },
      colors: {
        navy: {
          50: "#F3F6FA",
          100: "#E3E9F3",
          200: "#C5D1E4",
          300: "#98ACC9",
          400: "#566F96",
          500: "#405D86",
          600: "#2C4A78",
          700: "#223C63",
          800: "#1B2F4F",
          900: "#16294B",
          950: "#0C1B36",
        },
        // 미래에이아이랩 브랜드 색 — 제작사 표기·브릿지 CTA·소개 페이지에서만 사용
        mirae: {
          ink: "#071A22",
          mist: "#C9D6DC",
          haze: "#A9BCC4",
          teal: "#00A3A3",
          lagoon: "#0E9AA7",
          deep: "#0B5F6B",
          sky: "#19C6F4",
          glow: "#00E5E5",
          blue: "#1478FF",
          navy: "#1265A8",
        },
        teal: {
          50: "#EDFAFB",
          100: "#D2F3F5",
          200: "#A6E7EB",
          300: "#6DD5DC",
          400: "#33BDC7",
          500: "#159CA8",
          600: "#0E7C86",
          700: "#0C656E",
          800: "#0C525A",
          900: "#0C444B",
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
        // 신뢰감에 온기를 더하는 프리미엄 골드 액센트
        gold: {
          50: "#FDF9F0",
          100: "#F9EFD8",
          200: "#F1DDAC",
          300: "#E5C67B",
          400: "#D6AC4E",
          500: "#BF9033",
          600: "#9C7226",
          700: "#7C5A1F",
        },
        // 화이트/그레이 일변도를 깨는 웜 뉴트럴
        cream: {
          50: "#FDFBF8",
          100: "#F8F3EC",
          200: "#F0E8DC",
          300: "#E3D6C4",
        },
        danger: {
          50: "#FEF2F2",
          100: "#FEE3E2",
          500: "#E5534B",
          600: "#CE3F37",
          700: "#B0332C",
        },
        canvas: "#F5F7FA",
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
        /* CTA 버튼 위를 6.5초에 한 번, 아주 약하게 스치는 빛 */
        sheen: {
          "0%, 72%": { transform: "translateX(-150%) skewX(-18deg)", opacity: "0" },
          "76%": { opacity: "0.55" },
          "88%": { opacity: "0.55" },
          "100%": { transform: "translateX(260%) skewX(-18deg)", opacity: "0" },
        },
        /* 배지 뒤에서 은은하게 숨 쉬는 광 */
        "badge-glow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.7" },
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
        sheen: "sheen 6.5s ease-in-out infinite",
        "badge-glow": "badge-glow 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
