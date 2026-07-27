/** @type {import('tailwindcss').Config} */
// 柯仪宜 Life OS — 设计系统 Token
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sage Green 主色系
        sage: {
          50: '#F2F5F1',
          100: '#E3EAE2',
          200: '#C9D6C8',
          300: '#A3B8A2',
          400: '#7C9885',
          500: '#5E7E68',
          600: '#4A6453',
          700: '#3A4F42',
          800: '#2D3B33',
          900: '#1F2A23'
        },
        // 奶白 / 米白
        cream: {
          50: '#FBFAF6',
          100: '#F5F3EE',
          200: '#EDEAE2',
          300: '#E0DCD2'
        },
        // 深色模式背景层
        ink: {
          900: '#0F1311', // 主背景 近黑绿
          800: '#161B18', // 卡片层
          700: '#1E2521', // 提升层
          600: '#272F2A'  // 边框/分隔
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'PingFang SC',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      borderRadius: {
        '4xl': '32px',
        '3xl': '28px',
        '2xl': '24px'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.18)',
        glow: '0 0 24px rgba(124, 152, 133, 0.35)'
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
}
