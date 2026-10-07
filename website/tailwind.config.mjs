/** @type {import('tailwindcss').Config} */
// The theme is the app's token set (src/styles/tokens.css): only the tokens'
// colours, text steps, weights, radii and shadows exist as utilities, so the
// landing page cannot drift from the app by picking a stock Tailwind colour.
// `text-sm`, `rounded-md`, `shadow-sm`, `font-medium` are the same steps as
// in hivemind-ui. Spacing is Tailwind's 4px grid, as in the app.

const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  'card-foreground': 'var(--card-foreground)',
  popover: 'var(--popover)',
  'popover-foreground': 'var(--popover-foreground)',
  primary: 'var(--primary)',
  'primary-foreground': 'var(--primary-foreground)',
  secondary: 'var(--secondary)',
  'secondary-foreground': 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  'muted-foreground': 'var(--muted-foreground)',
  accent: 'var(--accent)',
  'accent-foreground': 'var(--accent-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  overlay: 'var(--overlay)',
  sidebar: 'var(--sidebar)',
  'sidebar-foreground': 'var(--sidebar-foreground)',
  'sidebar-accent': 'var(--sidebar-accent)',
  'sidebar-border': 'var(--sidebar-border)',
  link: 'var(--link)',
  success: 'var(--success)',
  'success-foreground': 'var(--success-foreground)',
  'success-soft': 'var(--success-soft)',
  warning: 'var(--warning)',
  'warning-foreground': 'var(--warning-foreground)',
  'warning-soft': 'var(--warning-soft)',
  destructive: 'var(--destructive)',
  'destructive-foreground': 'var(--destructive-foreground)',
  'destructive-soft': 'var(--destructive-soft)',
  info: 'var(--info)',
  'info-foreground': 'var(--info-foreground)',
  'info-soft': 'var(--info-soft)',
  neutral: 'var(--neutral)',
  'neutral-foreground': 'var(--neutral-foreground)',
  'neutral-soft': 'var(--neutral-soft)',
};

const step = (name) => [`var(--text-${name})`, `var(--text-${name}--line-height)`];

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    colors,
    fontFamily: {
      sans: 'var(--font-sans)',
      display: 'var(--font-display)',
      mono: 'var(--font-mono)',
    },
    fontSize: {
      '2xs': step('2xs'),
      xs: step('xs'),
      sm: step('sm'),
      base: step('base'),
      md: step('md'),
      lg: step('lg'),
      xl: step('xl'),
      '2xl': step('2xl'),
      '3xl': step('3xl'),
      '4xl': step('4xl'),
    },
    fontWeight: {
      normal: 'var(--font-weight-normal)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
    },
    borderRadius: {
      none: '0',
      xs: 'var(--radius-xs)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      full: 'var(--radius-full)',
    },
    boxShadow: {
      none: 'none',
      xs: 'var(--shadow-xs)',
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
    },
    extend: {},
  },
  plugins: [],
};
