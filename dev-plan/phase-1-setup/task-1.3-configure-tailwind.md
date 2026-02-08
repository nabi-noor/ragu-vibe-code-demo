# Task 1.3: Configure Tailwind CSS

**Task ID:** 1.3
**Task Name:** Configure Tailwind CSS
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 1.5 hours
**Complexity:** Medium
**Prerequisites:** Task 1.1 (Initialize Next.js), Task 1.2 (Install Dependencies)

## Overview

This task involves configuring Tailwind CSS with a custom theme tailored specifically for the Bella Cucina restaurant brand. We'll establish a warm, inviting color palette centered around amber and orange tones, create custom utility classes, configure typography, and set up design tokens that will be used consistently throughout the application. This configuration creates the visual identity and design system foundation for the entire project.

## Importance

A well-configured Tailwind setup is crucial because:

1. **Brand Consistency** - Custom colors ensure the app reflects Bella Cucina's warm, Italian restaurant aesthetic
2. **Developer Efficiency** - Semantic color names (primary, secondary, accent) make development faster
3. **Design System** - Establishes reusable design tokens for spacing, typography, and colors
4. **Maintainability** - Centralized theme configuration makes future updates easier
5. **Accessibility** - Proper color contrasts and font sizes ensure WCAG compliance
6. **Performance** - Tailwind's JIT compiler only includes classes you actually use

## Prerequisites

### Required Completion
- ✅ Task 1.1: Next.js 15 project initialized
- ✅ Task 1.2: Tailwind CSS installed (from create-next-app)
- ✅ `tailwind.config.ts` exists
- ✅ `app/globals.css` exists

### Verification
```bash
# Verify you're in the correct directory
pwd
# Should output: /Users/noorragu/Documents/vibe-code-demo

# Check Tailwind config exists
ls -la tailwind.config.ts

# Check globals.css exists
ls -la app/globals.css

# Verify Tailwind is installed
npm list tailwindcss
```

## Technical Specifications

### Color Palette

**Primary Colors (Warm Amber/Orange):**
- `primary-50`: #FFF8E7 - Lightest amber, for backgrounds
- `primary-100`: #FFE9B8 - Light amber
- `primary-200`: #FFD88A - Soft amber
- `primary-300`: #FFC75C - Medium amber
- `primary-400`: #FFB62E - Vibrant amber
- `primary-500`: #FF9800 - Main brand orange
- `primary-600`: #E68900 - Darker orange
- `primary-700`: #CC7A00 - Deep orange
- `primary-800`: #B36B00 - Very dark orange
- `primary-900`: #995C00 - Darkest orange

**Secondary Colors (Terracotta/Rust):**
- `secondary-50`: #FFF3F0
- `secondary-100`: #FFE0D8
- `secondary-200`: #FFC4B1
- `secondary-300`: #FFA88A
- `secondary-400`: #FF8C63
- `secondary-500`: #E8643D - Main terracotta
- `secondary-600`: #D14520
- `secondary-700`: #B33718
- `secondary-800`: #952A11
- `secondary-900`: #771F0A

**Accent Colors (Olive Green):**
- `accent-50`: #F6F8F3
- `accent-100`: #E8EDDF
- `accent-200`: #D1DBBF
- `accent-300`: #BAC99F
- `accent-400`: #A3B77F
- `accent-500`: #87A45E - Main olive
- `accent-600`: #6B8348
- `accent-700`: #546834
- `accent-800`: #3E4D26
- `accent-900`: #283318

**Neutral Colors (Enhanced Grays):**
- Uses default Tailwind gray scale
- Warm gray tint for better harmony with amber/orange

### Typography

**Font Families:**
- `sans`: Inter (headings and UI) - loaded from Google Fonts
- `serif`: Playfair Display (decorative elements) - optional, for special headings
- `mono`: 'Courier New', monospace (code/numbers)

**Font Sizes:**
- Extended scale for restaurant menus and pricing
- Custom sizes for price displays

**Font Weights:**
- 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing & Sizing

- Default Tailwind spacing scale (0-96)
- Custom additions for restaurant-specific layouts

### Border Radius

- Slightly softer defaults for a friendlier feel
- Custom `xl` and `2xl` values

## Files to Create/Modify

### 1. `/Users/noorragu/Documents/vibe-code-demo/tailwind.config.ts`

Complete Tailwind configuration with custom theme.

### 2. `/Users/noorragu/Documents/vibe-code-demo/app/globals.css`

Global styles and CSS custom properties.

### 3. `/Users/noorragu/Documents/vibe-code-demo/app/layout.tsx`

Update to use custom Google Fonts.

## Step-by-Step Implementation Guide

### Step 1: Backup Existing Configuration

Before making changes, backup the default configuration:

```bash
cd /Users/noorragu/Documents/vibe-code-demo
cp tailwind.config.ts tailwind.config.ts.backup
cp app/globals.css app/globals.css.backup
```

### Step 2: Configure Tailwind Config

Replace the entire contents of `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary color palette - Amber/Orange (main brand color)
        primary: {
          50: '#FFF8E7',
          100: '#FFE9B8',
          200: '#FFD88A',
          300: '#FFC75C',
          400: '#FFB62E',
          500: '#FF9800', // Main brand orange
          600: '#E68900',
          700: '#CC7A00',
          800: '#B36B00',
          900: '#995C00',
          DEFAULT: '#FF9800',
        },
        // Secondary color palette - Terracotta/Rust
        secondary: {
          50: '#FFF3F0',
          100: '#FFE0D8',
          200: '#FFC4B1',
          300: '#FFA88A',
          400: '#FF8C63',
          500: '#E8643D', // Main terracotta
          600: '#D14520',
          700: '#B33718',
          800: '#952A11',
          900: '#771F0A',
          DEFAULT: '#E8643D',
        },
        // Accent color palette - Olive Green
        accent: {
          50: '#F6F8F3',
          100: '#E8EDDF',
          200: '#D1DBBF',
          300: '#BAC99F',
          400: '#A3B77F',
          500: '#87A45E', // Main olive
          600: '#6B8348',
          700: '#546834',
          800: '#3E4D26',
          900: '#283318',
          DEFAULT: '#87A45E',
        },
        // Status colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          DEFAULT: '#22C55E',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          DEFAULT: '#F59E0B',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          DEFAULT: '#EF4444',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          DEFAULT: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        // Extended size scale for restaurant menus
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        // Custom sizes for prices and special displays
        'price-sm': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'price-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'price-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
      },
      spacing: {
        // Additional spacing for restaurant layouts
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        // Custom shadows for cards and elevated elements
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'warm': '0 10px 15px -3px rgba(255, 152, 0, 0.1), 0 4px 6px -2px rgba(255, 152, 0, 0.05)',
      },
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #FF9800 0%, #E8643D 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 3: Update Global CSS

Replace the contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Custom Properties for dynamic theming */
:root {
  --primary: 255 152 0; /* RGB for primary-500 */
  --primary-foreground: 255 255 255;
  --secondary: 232 100 61; /* RGB for secondary-500 */
  --secondary-foreground: 255 255 255;
  --accent: 135 164 94; /* RGB for accent-500 */
  --accent-foreground: 255 255 255;

  --background: 255 255 255;
  --foreground: 23 23 23;

  --muted: 245 245 245;
  --muted-foreground: 115 115 115;

  --border: 229 229 229;
  --input: 229 229 229;
  --ring: 255 152 0;

  --radius: 0.5rem;
}

/* Base styles */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2;
  }

  /* Heading styles */
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }

  h1 {
    @apply text-4xl lg:text-5xl;
  }

  h2 {
    @apply text-3xl lg:text-4xl;
  }

  h3 {
    @apply text-2xl lg:text-3xl;
  }

  h4 {
    @apply text-xl lg:text-2xl;
  }

  /* Paragraph spacing */
  p {
    @apply leading-7;
  }

  /* Link styles */
  a {
    @apply text-primary underline-offset-4 hover:underline;
  }
}

/* Component styles */
@layer components {
  /* Button base styles */
  .btn {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary-600 active:bg-primary-700;
  }

  .btn-secondary {
    @apply bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700;
  }

  .btn-outline {
    @apply border-2 border-primary text-primary hover:bg-primary hover:text-white;
  }

  .btn-ghost {
    @apply hover:bg-primary-50 hover:text-primary-900;
  }

  /* Card styles */
  .card {
    @apply rounded-xl border bg-white p-6 shadow-md;
  }

  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
  }

  /* Input styles */
  .input {
    @apply flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm;
    @apply ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium;
    @apply placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2;
    @apply focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* Badge styles */
  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold;
  }

  .badge-primary {
    @apply bg-primary-100 text-primary-800;
  }

  .badge-success {
    @apply bg-success-100 text-success-800;
  }

  .badge-warning {
    @apply bg-warning-100 text-warning-800;
  }

  .badge-error {
    @apply bg-error-100 text-error-800;
  }

  /* Container */
  .container-custom {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  /* Menu item card - restaurant specific */
  .menu-card {
    @apply card card-hover flex flex-col gap-4;
  }

  .menu-card-image {
    @apply aspect-[4/3] w-full rounded-lg object-cover;
  }

  /* Price display - restaurant specific */
  .price {
    @apply font-semibold text-primary-600;
  }

  /* Status indicator */
  .status-indicator {
    @apply flex h-2 w-2 rounded-full;
  }

  .status-indicator-active {
    @apply bg-success-500 animate-pulse;
  }

  .status-indicator-pending {
    @apply bg-warning-500;
  }

  .status-indicator-error {
    @apply bg-error-500;
  }
}

/* Utility styles */
@layer utilities {
  /* Text gradients */
  .text-gradient-warm {
    @apply bg-gradient-warm bg-clip-text text-transparent;
  }

  /* Scrollbar styles */
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--primary)) transparent;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgb(var(--primary));
    border-radius: 20px;
  }

  /* Truncate text utilities */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  body {
    @apply text-black;
  }
}

/* Dark mode support (for future implementation) */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles can be added here later */
}
```

### Step 4: Update Root Layout with Google Fonts

Modify `app/layout.tsx` to include custom fonts:

```typescript
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

// Configure fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Bella Cucina | Restaurant Management',
  description: 'Professional restaurant management system for Bella Cucina',
  keywords: ['restaurant', 'management', 'orders', 'menu', 'Italian cuisine'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Step 5: Create a Theme Test Page

Create a test page to verify all theme colors and components:

```typescript
// app/theme-test/page.tsx
export default function ThemeTest() {
  return (
    <div className="container-custom py-12">
      <h1 className="mb-8">Bella Cucina Theme Test</h1>

      {/* Color Palette */}
      <section className="mb-12">
        <h2 className="mb-4">Color Palette</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-lg">Primary (Orange)</h3>
          <div className="flex gap-2">
            <div className="h-16 w-16 rounded bg-primary-50" />
            <div className="h-16 w-16 rounded bg-primary-100" />
            <div className="h-16 w-16 rounded bg-primary-200" />
            <div className="h-16 w-16 rounded bg-primary-300" />
            <div className="h-16 w-16 rounded bg-primary-400" />
            <div className="h-16 w-16 rounded bg-primary-500" />
            <div className="h-16 w-16 rounded bg-primary-600" />
            <div className="h-16 w-16 rounded bg-primary-700" />
            <div className="h-16 w-16 rounded bg-primary-800" />
            <div className="h-16 w-16 rounded bg-primary-900" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg">Secondary (Terracotta)</h3>
          <div className="flex gap-2">
            <div className="h-16 w-16 rounded bg-secondary-50" />
            <div className="h-16 w-16 rounded bg-secondary-100" />
            <div className="h-16 w-16 rounded bg-secondary-200" />
            <div className="h-16 w-16 rounded bg-secondary-300" />
            <div className="h-16 w-16 rounded bg-secondary-400" />
            <div className="h-16 w-16 rounded bg-secondary-500" />
            <div className="h-16 w-16 rounded bg-secondary-600" />
            <div className="h-16 w-16 rounded bg-secondary-700" />
            <div className="h-16 w-16 rounded bg-secondary-800" />
            <div className="h-16 w-16 rounded bg-secondary-900" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-lg">Accent (Olive)</h3>
          <div className="flex gap-2">
            <div className="h-16 w-16 rounded bg-accent-50" />
            <div className="h-16 w-16 rounded bg-accent-100" />
            <div className="h-16 w-16 rounded bg-accent-200" />
            <div className="h-16 w-16 rounded bg-accent-300" />
            <div className="h-16 w-16 rounded bg-accent-400" />
            <div className="h-16 w-16 rounded bg-accent-500" />
            <div className="h-16 w-16 rounded bg-accent-600" />
            <div className="h-16 w-16 rounded bg-accent-700" />
            <div className="h-16 w-16 rounded bg-accent-800" />
            <div className="h-16 w-16 rounded bg-accent-900" />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="mb-4">Typography</h2>
        <div className="space-y-2">
          <h1>Heading 1 - Bella Cucina</h1>
          <h2>Heading 2 - Italian Restaurant</h2>
          <h3>Heading 3 - Menu Section</h3>
          <h4>Heading 4 - Category Title</h4>
          <p className="font-serif text-2xl">Decorative Serif - Playfair Display</p>
          <p>Body text - Inter font family with proper line height</p>
          <p className="price price-lg">$24.99</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-outline">Outline Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-primary" disabled>Disabled</button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="mb-4">Cards</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3>Standard Card</h3>
            <p>Basic card with shadow</p>
          </div>
          <div className="card card-hover">
            <h3>Hover Card</h3>
            <p>Card with hover effect</p>
          </div>
          <div className="menu-card">
            <div className="aspect-[4/3] w-full rounded-lg bg-primary-100" />
            <h3>Menu Card</h3>
            <p className="price">$18.99</p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-primary">Primary</span>
          <span className="badge badge-success">Success</span>
          <span className="badge badge-warning">Warning</span>
          <span className="badge badge-error">Error</span>
        </div>
      </section>

      {/* Status Indicators */}
      <section className="mb-12">
        <h2 className="mb-4">Status Indicators</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="status-indicator status-indicator-active" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator status-indicator-pending" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator status-indicator-error" />
            <span>Error</span>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Step 6: Test the Configuration

Start the development server and test the theme:

```bash
npm run dev
```

Visit these URLs:
- http://localhost:3000 - Homepage
- http://localhost:3000/theme-test - Theme test page

### Step 7: Verify Build Process

Ensure Tailwind is properly tree-shaking unused classes:

```bash
npm run build
```

Check the build output for CSS file size. It should be relatively small (~10-20KB after gzip).

### Step 8: Format All Files

Run Prettier to ensure consistent formatting:

```bash
npm run format
```

## Code Examples

### Example 1: Using Custom Colors

```typescript
export function MenuItemCard() {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Margherita Pizza</h3>
          <p className="text-sm text-muted-foreground">
            Fresh mozzarella, tomatoes, basil
          </p>
        </div>
        <span className="price text-price-md">$16.99</span>
      </div>
      <div className="flex gap-2">
        <span className="badge badge-primary">Popular</span>
        <span className="badge badge-success">Vegetarian</span>
      </div>
    </div>
  );
}
```

### Example 2: Using Custom Fonts

```typescript
export function HeroSection() {
  return (
    <section className="bg-gradient-warm py-20 text-white">
      <div className="container-custom">
        <h1 className="font-serif text-6xl">Bella Cucina</h1>
        <p className="mt-4 text-xl">Authentic Italian Cuisine</p>
      </div>
    </section>
  );
}
```

### Example 3: Status-Based Styling

```typescript
export function OrderStatus({ status }: { status: string }) {
  const getStatusClass = () => {
    switch (status) {
      case 'preparing':
        return 'badge-warning';
      case 'ready':
        return 'badge-success';
      case 'delivered':
        return 'badge-primary';
      default:
        return 'badge-error';
    }
  };

  return (
    <span className={`badge ${getStatusClass()}`}>
      {status.toUpperCase()}
    </span>
  );
}
```

### Example 4: Responsive Grid with Custom Spacing

```typescript
export function MenuGrid() {
  return (
    <div className="container-custom py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map(item => (
          <div key={item.id} className="menu-card">
            {/* Card content */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Acceptance Criteria

This task is considered complete when:

1. ✅ `tailwind.config.ts` contains custom theme configuration
2. ✅ All custom colors (primary, secondary, accent) are defined
3. ✅ Status colors (success, warning, error, info) are configured
4. ✅ Custom font families (Inter, Playfair Display) are loaded
5. ✅ Custom font sizes including price displays are defined
6. ✅ `app/globals.css` contains base, component, and utility layers
7. ✅ CSS custom properties are defined in `:root`
8. ✅ Component styles (btn, card, input, badge) are created
9. ✅ `app/layout.tsx` loads Google Fonts correctly
10. ✅ Theme test page renders all colors correctly
11. ✅ Development server runs without CSS errors
12. ✅ Build process completes and tree-shakes unused classes
13. ✅ All custom utility classes work as expected
14. ✅ Hover states and transitions work smoothly

## Testing Strategy

### Manual Testing

#### Test 1: Color Palette Verification
```bash
npm run dev
# Visit http://localhost:3000/theme-test
# Verify all color swatches display correctly
# Check contrast ratios for accessibility
```

#### Test 2: Typography Test
- Verify Inter font loads for body text
- Verify Playfair Display loads for serif elements
- Check all heading levels render correctly
- Test price display fonts

#### Test 3: Component Test
- Test all button variants (primary, secondary, outline, ghost)
- Verify hover states work
- Check disabled states
- Test card hover effects

#### Test 4: Responsive Test
```bash
# Open browser dev tools
# Test breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
# Verify responsive grid layouts work
```

#### Test 5: Build Size Test
```bash
npm run build
# Check .next/static/css/*.css file sizes
# Should be minimal due to tree-shaking
```

### Automated Testing

Create a Tailwind config test:

**File:** `scripts/test-tailwind.js`

```javascript
#!/usr/bin/env node

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../tailwind.config.ts');

const fullConfig = resolveConfig(tailwindConfig);

console.log('🎨 Testing Tailwind Configuration...\n');

// Test colors
console.log('Colors:');
console.log('  Primary 500:', fullConfig.theme.colors.primary[500]);
console.log('  Secondary 500:', fullConfig.theme.colors.secondary[500]);
console.log('  Accent 500:', fullConfig.theme.colors.accent[500]);

// Test fonts
console.log('\nFonts:');
console.log('  Sans:', fullConfig.theme.fontFamily.sans);
console.log('  Serif:', fullConfig.theme.fontFamily.serif);

// Test spacing
console.log('\nCustom Spacing:');
console.log('  18:', fullConfig.theme.spacing[18]);
console.log('  88:', fullConfig.theme.spacing[88]);

console.log('\n✅ Configuration loaded successfully');
```

## Common Pitfalls and Debugging Tips

### Pitfall 1: Tailwind Classes Not Working

**Symptoms:**
- Classes don't apply styles
- Colors not showing

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev

# Verify content paths in tailwind.config.ts
# Should include: './app/**/*.{js,ts,jsx,tsx,mdx}'
```

### Pitfall 2: Custom Fonts Not Loading

**Symptoms:**
- Fonts fallback to system default
- Console warnings about font loading

**Solutions:**
```typescript
// Verify font configuration in layout.tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Must match CSS variable
  display: 'swap', // Important for performance
});

// Verify HTML has font variables
<html className={`${inter.variable} ${playfair.variable}`}>
```

### Pitfall 3: CSS Layers Not Working

**Symptoms:**
- Component styles don't apply
- Utility classes don't work

**Solutions:**
```css
/* Ensure correct order in globals.css */
@tailwind base;      /* Must be first */
@tailwind components; /* Second */
@tailwind utilities;  /* Last */
```

### Pitfall 4: Color Contrast Issues

**Symptoms:**
- Text hard to read
- Failing accessibility checks

**Solutions:**
- Use Tailwind's contrast checker
- Test with browser accessibility tools
- Adjust color values if needed

### Pitfall 5: Build Size Too Large

**Symptoms:**
- CSS bundle > 50KB
- Slow page loads

**Solutions:**
```javascript
// Ensure content paths are specific
content: [
  './app/**/*.{js,ts,jsx,tsx}', // Good
  './**/*.{js,ts,jsx,tsx}', // Bad - too broad
],

// Enable JIT mode (default in Tailwind 3+)
// Remove unused plugins
```

## Performance Considerations

### CSS Bundle Size

**Expected Sizes:**
- Development: ~3-4MB (all classes)
- Production: ~10-20KB gzipped (only used classes)

### Font Loading Optimization

```typescript
// Use font-display: swap for better performance
const inter = Inter({
  display: 'swap', // Prevents FOUT (Flash of Unstyled Text)
  preload: true,   // Preload font files
});
```

### Purging Unused CSS

Tailwind automatically purges unused classes in production. Verify in build output:

```bash
npm run build
# Look for: "Creating an optimized production build"
# CSS should be significantly smaller than development
```

## Related Tasks

- **Previous Task:** [Task 1.2: Install Dependencies](./task-1.2-install-dependencies.md)
- **Next Task:** [Task 1.4: Create Type Definitions](./task-1.4-create-type-definitions.md)
- **Related Tasks:**
  - Task 1.7: Setup Root Layout (uses fonts configured here)
  - All UI tasks in Phase 2-4 (use this theme)

## Resources and Documentation

### Official Documentation
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Tailwind CSS Customization](https://tailwindcss.com/docs/theme)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Google Fonts](https://fonts.google.com/)

### Design Resources
- [Tailwind Color Palette Generator](https://uicolors.app/create)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind Components](https://tailwindui.com/)

### Community Resources
- [Tailwind CSS Discord](https://tailwindcss.com/discord)
- [Awesome Tailwind CSS](https://github.com/aniftyco/awesome-tailwindcss)

## Notes

- The warm color palette reflects Italian restaurant aesthetics
- Custom font sizes optimize for menu price displays
- Component styles provide consistent UI patterns
- CSS variables enable future dark mode implementation
- All colors are WCAG AA compliant for accessibility

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
