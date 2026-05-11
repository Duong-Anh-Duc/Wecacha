import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#061f07",
          900: "#0b3100",
          800: "#134A00",
          700: "#255f00",
          600: "#417A00"
        },
        earth: {
          900: "#3c2111",
          800: "#593016",
          700: "#7a4109",
          600: "#B56500",
          500: "#d18722"
        },
        parchment: {
          50: "#fffaf0",
          100: "#f4ead8",
          200: "#dfceb2"
        },
        ember: "#f3a734",
        white: "#FFFFFF"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "\"Playfair Display\"", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cinematic: "0 30px 90px rgba(12, 31, 9, 0.38)",
        warm: "0 24px 80px rgba(91, 45, 9, 0.24)"
      },
      backgroundImage: {
        "cinema-overlay":
          "linear-gradient(120deg, rgba(6,31,7,0.86), rgba(60,33,17,0.48) 48%, rgba(181,101,0,0.18))",
        "paper-grain":
          "radial-gradient(circle at 18% 20%, rgba(181,101,0,0.12), transparent 30%), radial-gradient(circle at 82% 18%, rgba(65,122,0,0.12), transparent 32%)"
      },
      keyframes: {
        drift: {
          "0%": {transform: "translate3d(-8%, 0, 0) scale(1)"},
          "50%": {transform: "translate3d(4%, -2%, 0) scale(1.04)"},
          "100%": {transform: "translate3d(10%, 1%, 0) scale(1.02)"}
        },
        grain: {
          "0%, 100%": {transform: "translate(0, 0)"},
          "20%": {transform: "translate(-1%, 1%)"},
          "40%": {transform: "translate(1%, -1%)"},
          "60%": {transform: "translate(-1%, -0.5%)"},
          "80%": {transform: "translate(1%, 0.5%)"}
        }
      },
      animation: {
        drift: "drift 18s ease-out infinite alternate",
        grain: "grain 6s steps(6) infinite"
      }
    }
  },
  plugins: []
};

export default config;
