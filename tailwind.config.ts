import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "var(--breakpoint-xs)",
        sm: "var(--breakpoint-sm)",
        md: "var(--breakpoint-md)",
        lg: "var(--breakpoint-lg)",
        xl: "var(--breakpoint-xl)",
        "2xl": "var(--breakpoint-xxl)",
      },
    },
    extend: {
      colors: {
        // Core UI Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary & Secondary
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // Accent & Muted
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        // Destructive
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Card & Popover
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Chart Colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        
        // Sidebar Colors
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        
        // Post Content Colors
        "post-content": {
          bg: "hsl(var(--post-content-bg))",
          text: "hsl(var(--post-content-text))",
          heading: "hsl(var(--post-content-heading))",
          muted: "hsl(var(--post-content-muted))",
          link: "hsl(var(--post-content-link))",
          "link-hover": "hsl(var(--post-content-link-hover))",
          "code-bg": "hsl(var(--post-content-code-bg))",
          "code-text": "hsl(var(--post-content-code-text))",
          "blockquote-bg": "hsl(var(--post-content-blockquote-bg))",
          "blockquote-border": "hsl(var(--post-content-blockquote-border))",
          "blockquote-text": "hsl(var(--post-content-blockquote-text))",
          "table-border": "hsl(var(--post-content-table-border))",
          "table-header-bg": "hsl(var(--post-content-table-header-bg))",
          highlight: "hsl(var(--post-content-highlight))",
          shadow: "hsl(var(--post-content-shadow))",
          "image-shadow": "hsl(var(--post-content-image-shadow))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        headline: ['"Reckless Bold"', "Georgia", "serif"],
        body: ['"Ivar Text Hydro Regular"', "Georgia", "serif"],
        serif: ['"Reckless Bold"', "Georgia", "serif"],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwind-animate")],
} satisfies Config;

export default config;