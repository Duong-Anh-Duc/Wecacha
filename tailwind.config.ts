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
        "drift-image": {
          "0%": {transform: "translate3d(-3%, 0, 0) scale(1.1)"},
          "50%": {transform: "translate3d(2%, -1%, 0) scale(1.14)"},
          "100%": {transform: "translate3d(4%, 1%, 0) scale(1.12)"}
        },
        grain: {
          "0%, 100%": {transform: "translate(0, 0)"},
          "20%": {transform: "translate(-1%, 1%)"},
          "40%": {transform: "translate(1%, -1%)"},
          "60%": {transform: "translate(-1%, -0.5%)"},
          "80%": {transform: "translate(1%, 0.5%)"}
        },
        "soft-sweep": {
          "0%": {transform: "translateX(-140%) skewX(-12deg)", opacity: "0"},
          "14%": {opacity: "0"},
          "34%": {opacity: "1"},
          "62%": {opacity: "0.42"},
          "100%": {transform: "translateX(520%) skewX(-12deg)", opacity: "0"}
        },
        "small-sweep": {
          "0%": {transform: "translateX(-130%)", opacity: "0"},
          "22%": {opacity: "0"},
          "42%": {opacity: "0.52"},
          "70%": {opacity: "0"},
          "100%": {transform: "translateX(130%)", opacity: "0"}
        },
        "slide-in-right": {
          "0%": {transform: "translateX(100%)"},
          "100%": {transform: "translateX(0)"}
        },
        "slide-out-right": {
          "0%": {transform: "translateX(0)"},
          "100%": {transform: "translateX(100%)"}
        },
        marquee: {
          "0%": {transform: "translateX(0%)"},
          "100%": {transform: "translateX(-50%)"}
        },
        fire: {
          "0%, 100%": {
            boxShadow: "0 0 10px 0px rgba(255, 69, 0, 0.4), 0 0 20px 2px rgba(255, 140, 0, 0.4) inset",
            transform: "scale(1)"
          },
          "50%": {
            boxShadow: "0 0 20px 5px rgba(255, 69, 0, 0.6), 0 0 30px 5px rgba(255, 140, 0, 0.6) inset",
            transform: "scale(1.02)"
          }
        },
        flow: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" }
        },
        "card-glow": {
          "0%, 100%": {
            boxShadow: "0 24px 80px rgba(91, 45, 9, 0.24)",
            borderColor: "rgba(6, 31, 7, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transform: "translateY(0)"
          },
          "15%": {
            boxShadow: "0 0 40px rgba(181, 112, 58, 0.3)",
            borderColor: "rgba(181, 112, 58, 0.5)",
            backgroundColor: "rgba(251, 243, 231, 1)", // A soft, warm parchment glow
            transform: "translateY(-6px)"
          },
          "30%": {
            boxShadow: "0 24px 80px rgba(91, 45, 9, 0.24)",
            borderColor: "rgba(6, 31, 7, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transform: "translateY(0)"
          }
        },
        lightning: {
          "0%, 88%, 100%": { opacity: "0" },
          "89%": { opacity: "0.85" },
          "90%": { opacity: "0.1" },
          "91%": { opacity: "0.95" },
          "92%": { opacity: "0.2" },
          "93%": { opacity: "0.7" },
          "94%": { opacity: "0" }
        },
        "bolt-flicker": {
          "0%, 86%, 100%": { transform: "scale(1)", filter: "drop-shadow(0 0 0 transparent)" },
          "89%, 91%, 93%": {
            transform: "scale(1.25)",
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.95))"
          },
          "90%, 92%": { transform: "scale(1)", filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))" }
        }
      },
      animation: {
        drift: "drift 18s ease-out infinite alternate",
        "drift-image": "drift-image 24s ease-in-out infinite alternate",
        grain: "grain 6s steps(6) infinite",
        "soft-sweep": "soft-sweep 6.8s ease-in-out infinite",
        "small-sweep": "small-sweep 5.6s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-right": "slide-out-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        marquee: "marquee 25s linear infinite",
        fire: "fire 1.5s ease-in-out infinite",
        flow: "flow 4s linear infinite",
        "card-glow": "card-glow 4s ease-in-out infinite",
        lightning: "lightning 5s ease-out infinite",
        "bolt-flicker": "bolt-flicker 5s ease-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
