/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Electric Blue - Main Brand
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Secondary colors
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Vibrant Purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Accent colors for youth appeal
        accent: {
          orange: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Energetic Orange
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          green: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981', // Fresh Green
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6', // Coral Pink
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          },
          yellow: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047', // Sunny Yellow
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
        },
      },
      fontFamily: {
        'primary': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'accent': ['Fredoka One', 'cursive'],
        'body': ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 4rem)', { lineHeight: '1.1', fontWeight: '900', letterSpacing: '-0.025em' }],
        'hero': ['clamp(2.5rem, 7vw, 3rem)', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.025em' }],
        'title': ['clamp(2rem, 6vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'subtitle': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'heading': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.4', fontWeight: '400' }],
        'caption': ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.025em' }],
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2',
        'normal': '1.4',
        'relaxed': '1.6',
        'loose': '1.8',
      },
      letterSpacing: {
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'youth': '1rem',
        'youth-xl': '1.5rem',
        'youth-2xl': '2rem',
      },
      boxShadow: {
        'youth': '0 8px 25px rgba(59, 130, 246, 0.15)',
        'youth-hover': '0 12px 35px rgba(59, 130, 246, 0.25)',
        'youth-lg': '0 20px 40px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'progress-fill': 'progress-fill 1s ease-out forwards',
        'shimmer': 'shimmer 1.5s ease-in-out',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backgroundImage: {
        'gradient-youth': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #fbbf24, #f472b6)',
        'gradient-success': 'linear-gradient(135deg, #34d399, #059669)',
      },
    },
  },
  plugins: [],
}

