/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Warm Orange (matches logo)
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFF7ED',
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        // Secondary - Deep Teal
        secondary: {
          DEFAULT: '#0D9488',
          hover: '#0F766E',
          light: '#CCFBF1',
          50: '#F0FDFA',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        // Accent - Purple for highlights
        accent: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#EDE9FE',
        },
        // Feedback Colors
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        // Backgrounds - Warm gradient feel
        background: '#FDF8F3',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#FFF7ED',
        },
        // Text
        text: {
          primary: '#1C1917',
          secondary: '#57534E',
          muted: '#A8A29E',
        },
        // Special
        streak: '#F97316',
        star: '#FBBF24',
        // Badge colors
        badge: {
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          gold: '#FFD700',
          platinum: '#E5E4E2',
          diamond: '#B9F2FF',
        },
      },
      fontFamily: {
        display: ['"Sassoon Primary"', '"Comic Sans MS"', 'cursive'],
        body: ['Verdana', 'Helvetica', 'Arial', 'sans-serif'],
        math: ['"SF Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Age-specific sizing will be handled via CSS variables
        'display-preK': '28px',
        'display-grade1-2': '26px',
        'display-grade3-5': '24px',
        'math-preK': '32px',
        'math-grade1-2': '28px',
        'math-grade3-5': '24px',
      },
      spacing: {
        'touch-gap': '12px',
        'button-gap': '16px',
      },
      minHeight: {
        'touch': '48px',
        'button': '60px',
      },
      minWidth: {
        'touch': '48px',
        'button': '60px',
      },
    },
  },
  plugins: [],
}
