/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        surface: 'hsl(var(--surface))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neon: {
          yellow: '#FFD700',
          amber: '#B8860B',
          dim: 'rgba(255, 215, 0, 0.15)',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        display: '0.08em',
        wide: '0.15em',
        widest: '0.25em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scan-line': 'scanLine 8s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'orb-float': 'orbFloat 6s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { opacity: '0.7', filter: 'blur(20px)' },
          '100%': { opacity: '1', filter: 'blur(35px)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '33%': { transform: 'translateY(-12px) scale(1.02)' },
          '66%': { transform: 'translateY(-6px) scale(0.98)' },
        },
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(255, 215, 0, 0.3)',
        neon: '0 0 20px rgba(255, 215, 0, 0.4)',
        'neon-lg': '0 0 40px rgba(255, 215, 0, 0.3), 0 0 80px rgba(255, 215, 0, 0.1)',
        'neon-inner': 'inset 0 0 20px rgba(255, 215, 0, 0.05)',
      },
      backgroundImage: {
        'cyber-grid':
          "linear-gradient(rgba(255,215,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.04) 1px, transparent 1px)",
        'radial-glow':
          'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
    },
  },
  plugins: [],
}
