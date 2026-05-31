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
        // Surfaces — true dark, no gradients
        background: '#090909',
        surface:    '#111111',
        'surface-2': '#171717',
        'surface-3': '#1E1E1E',

        // Borders — structural, not decorative
        border:         'rgba(255,255,255,0.07)',
        'border-mid':   'rgba(255,255,255,0.12)',
        'border-strong':'rgba(255,255,255,0.18)',

        // Accent — single muted amber. Used sparingly.
        accent: {
          DEFAULT:  '#C8960C',  // muted amber, not neon
          dim:      '#7A5C00',
          subtle:   'rgba(200,150,12,0.12)',
          border:   'rgba(200,150,12,0.25)',
        },

        // Text — off-white hierarchy
        foreground: '#EBEBEB',
        'fg-2':     '#909090',
        'fg-3':     '#555555',
        'fg-4':     '#333333',

        // Semantic — flat, no glow
        success: '#3D9970',
        warning: '#C8960C',
        error:   '#C0392B',
        info:    '#2980B9',
      },

      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        sans:    ['var(--font-inter)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },

      letterSpacing: {
        display: '0.06em',
        label:   '0.12em',
        wide:    '0.18em',
      },

      fontSize: {
        'display-xl': ['clamp(3.5rem,9vw,7rem)',  { lineHeight: '0.95', letterSpacing: '0.06em' }],
        'display-lg': ['clamp(2.5rem,6vw,4.5rem)',{ lineHeight: '1',    letterSpacing: '0.06em' }],
        'display-md': ['clamp(1.8rem,4vw,2.8rem)',{ lineHeight: '1.05', letterSpacing: '0.06em' }],
        label:        ['0.6875rem',               { lineHeight: '1',    letterSpacing: '0.12em' }],
      },

      animation: {
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-dot':  'pulseDot 2.5s ease-in-out infinite',
        'conn-flow':  'connFlow 2s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.35' },
        },
        connFlow: {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },

      // Intentionally NO box shadows with glow
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.5)',
        'card-raised': '0 4px 12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
