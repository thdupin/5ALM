/** @type {import('tailwindcss').Config} */
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // ⚽ LE COMPROMIS COMPÉTITION : Un vrai bleu de caractère, plus lumineux
        primary: {
          DEFAULT: "#1e40af", // Bleu Royal intense (Fonds de cartes, boutons majeurs, Navbar)
          foreground: "#ffffff", //
        },
        secondary: {
          DEFAULT: "#eff6ff", // Bleu très clair et fondu pour le contraste des sous-sections
          foreground: "#1e40af",
        },
        destructive: {
          DEFAULT: "#ef4444", // Rouge vif réglementaire
          foreground: "#ffffff", //
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#475569",
        },
        accent: {
          DEFAULT: "#f59e0b", // Or / Ambre de la Coupe du Monde
          foreground: "#1e40af",
        },
        popover: {
          DEFAULT: "#ffffff", //
          foreground: "#1e40af",
        },
        card: {
          DEFAULT: "#ffffff", //
          foreground: "#1e40af",
        },

        // 🟢 PALETTE DE MARQUE OXO INTEGRÉE
        oxo: {
          DEFAULT: "#B0D122", // Le vert emblématique oxo
          dark: "#000000",    // Le noir pur oxo
          light: "#ffffff",   // Le blanc pur oxo
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}