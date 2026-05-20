import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#103D2E",
          foreground: "#F8F2E7"
        },
        secondary: {
          DEFAULT: "#B29267",
          foreground: "#08271F"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      fontFamily: {
        sans: ["var(--font-times)", "Times New Roman", "Times", "serif"],
        heading: ["var(--font-times)", "Times New Roman", "Times", "serif"],
        display: ["var(--font-stardom)", "Inter", "Segoe UI", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at top, rgba(16,61,46,0.16), transparent 38%), radial-gradient(circle at bottom right, rgba(178,146,103,0.18), transparent 30%)",
        "amolex-gradient":
          "linear-gradient(135deg, rgba(16,61,46,0.98), rgba(16,61,46,0.92) 48%, rgba(178,146,103,0.9))"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(16, 61, 46, 0.14), 0 24px 70px rgba(16, 61, 46, 0.16), 0 12px 34px rgba(178, 146, 103, 0.12)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 5s ease-in-out infinite",
        marquee: "marquee 24s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
