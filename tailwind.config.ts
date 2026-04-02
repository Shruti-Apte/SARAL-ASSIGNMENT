import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'background-primary': 'var(--background-primary)',
        'background-secondary': 'var(--background-secondary)',
        'background-tertiary': 'var(--background-tertiary)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'action-primary': 'var(--action-primary)',
        'action-primary-hover': 'var(--action-primary-hover)',
        'action-disabled': 'var(--action-disabled)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-placeholder': 'var(--text-placeholder)',
        'text-brand': 'var(--text-brand)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        'border-primary': 'var(--border-primary)',
        'border-dropdown': 'var(--border-dropdown)',
        'border-icon-frame': 'var(--border-icon-frame)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'status-danger': 'var(--status-danger)',
      },
      boxShadow: {
        modal:
          '0 4px 2px 0 rgba(48, 48, 48, 0.04), 0 16px 32px -4px rgba(48, 48, 48, 0.10)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config
