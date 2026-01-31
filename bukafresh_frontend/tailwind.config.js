/** @type {import('tailwindcss').Config} */
export default {
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
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        // Core colors
        background: "hsl(60 20% 99%)",
        foreground: "hsl(150 10% 15%)",
        
        // Card colors
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(150 10% 15%)",
        },
        
        // Primary - Fresh Green
        primary: {
          DEFAULT: "hsl(145 63% 32%)",
          foreground: "hsl(0 0% 100%)",
        },
        
        // Secondary - Warm Sand
        secondary: {
          DEFAULT: "hsl(35 30% 95%)",
          foreground: "hsl(35 40% 25%)",
        },
        
        // Muted
        muted: {
          DEFAULT: "hsl(60 10% 96%)",
          foreground: "hsl(150 5% 45%)",
        },
        
        // Accent - Warm Terracotta
        accent: {
          DEFAULT: "hsl(25 85% 55%)",
          foreground: "hsl(0 0% 100%)",
        },
        
        // Destructive
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 100%)",
        },
        
        // Border and input
        border: "hsl(60 10% 90%)",
        input: "hsl(60 10% 90%)",
        ring: "hsl(145 63% 32%)",
        
        // Popover
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(150 10% 15%)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
