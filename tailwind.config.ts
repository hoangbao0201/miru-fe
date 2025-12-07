import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--accent-hover) / <alpha-value>)",
        "accent-active": "rgb(var(--accent-active) / <alpha-value>)",
        "accent-10": "rgb(var(--accent-10) / <alpha-value>)",
        "accent-10-hover": "rgb(var(--accent-10-hover) / <alpha-value>)",
        "accent-10-active": "rgb(var(--accent-10-active) / <alpha-value>)",
        "accent-20": "rgb(var(--accent-20) / <alpha-value>)",
        "accent-20-hover": "rgb(var(--accent-20-hover) / <alpha-value>)",
        "accent-20-active": "rgb(var(--accent-20-active) / <alpha-value>)",
        "accent-30": "rgb(var(--accent-30) / <alpha-value>)",
        "accent-30-hover": "rgb(var(--accent-30-hover) / <alpha-value>)",
        "accent-30-active": "rgb(var(--accent-30-active) / <alpha-value>)",
        "accent-40": "rgb(var(--accent-40) / <alpha-value>)",
        "accent-40-hover": "rgb(var(--accent-40-hover) / <alpha-value>)",
        "accent-40-active": "rgb(var(--accent-40-active) / <alpha-value>)",
        "accent-50": "rgb(var(--accent-50) / <alpha-value>)",
        "accent-50-hover": "rgb(var(--accent-50-hover) / <alpha-value>)",
        "accent-50-active": "rgb(var(--accent-50-active) / <alpha-value>)",
        "mid-tone": "rgb(var(--mid-tone) / <alpha-value>)",
        "midTone": "rgb(var(--midTone) / <alpha-value>)",
        "contrast-1": "rgb(var(--contrast-1) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        nav: "rgb(var(--nav) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "primary-10": "rgb(var(--primary-10) / <alpha-value>)",
        "primary-20": "rgb(var(--primary-20) / <alpha-value>)",
        "status-red": "rgb(var(--status-red) / <alpha-value>)",
        "status-green": "rgb(var(--status-green) / <alpha-value>)",
        "status-yellow": "rgb(var(--status-yellow) / <alpha-value>)",
        "status-blue": "rgb(var(--status-blue) / <alpha-value>)",
        "status-grey": "rgb(var(--status-grey) / <alpha-value>)",
        "status-purple": "rgb(var(--status-purple) / <alpha-value>)",
        "indication-blue": "rgb(var(--indication-blue) / <alpha-value>)",
        "danger-10": "rgb(var(--danger-10) / <alpha-value>)",
        "danger-20": "rgb(var(--danger-20) / <alpha-value>)",
        "scrollbar-thumb": "rgb(var(--scrollbar-thumb) / <alpha-value>)",
        "scrollbar-thumb-hover": "rgb(var(--scrollbar-thumb-hover) / <alpha-value>)",
        "button-accent": "rgb(var(--button-accent) / <alpha-value>)",
        "button-accent-alt": "rgb(var(--button-accent-alt) / <alpha-value>)",
      },
      maxWidth: {
        '8xl': '90rem',
        'screen-8xl': '1440px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderColor: {
        DEFAULT: '#cccc',
      },
      gridTemplateColumns: (() => {
        const cols: Record<string, string> = {};
        for (let i = 1; i <= 24; i++) {
          cols[`${i}`] = `repeat(${i}, minmax(0, 1fr))`;
        }
        return cols;
      })(),
      gridColumn: (() => {
        const cols: Record<string, string> = {};
        for (let i = 1; i <= 24; i++) {
          cols[`span-${i}`] = `span ${i} / span ${i}`;
        }
        return cols;
      })(),

      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
};
export default config;
