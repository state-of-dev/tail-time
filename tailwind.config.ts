import type { Config } from 'tailwindcss'

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Neobrutalism core colors
        main: "var(--main)",
        "main-foreground": "var(--main-foreground)",
        "secondary-background": "var(--secondary-background)",
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Creative pet-themed colors (colorful mode)
        "pet-pink": "var(--pet-pink)",
        "pet-blue": "var(--pet-blue)",
        "pet-green": "var(--pet-green)",
        "pet-yellow": "var(--pet-yellow)",
        "pet-purple": "var(--pet-purple)",
        "pet-orange": "var(--pet-orange)",

        // Legacy colors (compatibility)
        input: "var(--border)",
        ring: "var(--border)",
        primary: {
          DEFAULT: "var(--main)",
          foreground: "var(--main-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary-background)",
          foreground: "var(--foreground)",
        },
        card: {
          DEFAULT: "var(--main)",
          foreground: "var(--main-foreground)",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#22c55e",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        // Mantener compatibilidad con colores existentes
        pet: {
          primary: "var(--pet-primary)",
          secondary: "var(--pet-secondary)",
          accent: "var(--pet-accent)",
        },
        muted: {
          DEFAULT: "var(--secondary-background)",
          foreground: "var(--foreground)",
        },
        accent: {
          DEFAULT: "var(--pet-blue)",
          foreground: "var(--main-foreground)",
        },
        popover: {
          DEFAULT: "var(--main)",
          foreground: "var(--main-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--secondary-background)",
          foreground: "var(--foreground)",
          primary: "var(--main)",
          "primary-foreground": "var(--main-foreground)",
          accent: "var(--pet-blue)",
          "accent-foreground": "var(--main-foreground)",
          border: "var(--border)",
          ring: "var(--border)",
        },
      },
      borderRadius: {
        base: "4px", // Neobrutalism standard
        lg: "8px",
        md: "6px",
        sm: "2px",
      },
      boxShadow: {
        shadow: "4px 4px 0px var(--border)",
        "shadow-sm": "2px 2px 0px var(--border)",
        "shadow-lg": "6px 6px 0px var(--border)",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-4px",
        reverseBoxShadowY: "-4px",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        base: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        base: "500",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-shadow": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(2px, 2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "bounce-shadow": "bounce-shadow 0.3s ease-in-out",
      },
    },
  },
} satisfies Config