# Task 1.7: Setup Root Layout

**Task ID:** 1.7
**Task Name:** Setup Root Layout
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 1 hour
**Complexity:** Low-Medium
**Prerequisites:** Task 1.2 (Install Dependencies), Task 1.3 (Configure Tailwind)

## Overview

This task involves configuring the Next.js root layout component, which serves as the foundational wrapper for the entire Bella Cucina application. The root layout defines the HTML structure, loads global styles, integrates custom fonts, adds metadata for SEO, and sets up the toast notification provider. This is the last task in Phase 1 and brings together all the configuration work done in previous tasks.

## Importance

A properly configured root layout is crucial because:

1. **SEO Foundation** - Metadata improves search engine visibility
2. **Performance** - Font optimization reduces layout shifts and load times
3. **User Experience** - Toast notifications provide essential feedback
4. **Consistency** - Global styles apply throughout the application
5. **Accessibility** - Proper HTML structure and language attributes
6. **Branding** - Favicon and app title establish brand identity

## Prerequisites

### Required Completion
- ✅ Task 1.2: Sonner (toast library) installed
- ✅ Task 1.3: Tailwind CSS configured with custom theme
- ✅ `app/globals.css` configured
- ✅ Google Fonts (Inter, Playfair Display) identified

### Verification
```bash
# Check required files exist
ls -la /Users/noorragu/Documents/vibe-code-demo/app/layout.tsx
ls -la /Users/noorragu/Documents/vibe-code-demo/app/globals.css

# Verify sonner is installed
npm list sonner
```

## Technical Specifications

### Root Layout Components

1. **HTML Structure**
   - `<html>` with language attribute
   - Font variable classes
   - Suppressible hydration warnings

2. **Head Section (Metadata)**
   - Title and description
   - Keywords for SEO
   - Viewport configuration
   - Theme color
   - Open Graph tags (optional)
   - Favicon references

3. **Body Section**
   - Font application
   - Toast notification provider
   - Global class names
   - Children rendering

4. **Font Configuration**
   - Inter (sans-serif) - primary body font
   - Playfair Display (serif) - decorative font
   - Font display: swap (performance)
   - Font subsetting: latin

5. **Metadata Configuration**
   - Application name
   - Description
   - Keywords
   - Author information
   - Viewport settings
   - Theme color

## Files to Create/Modify

### 1. `/Users/noorragu/Documents/vibe-code-demo/app/layout.tsx`

Root layout component with all configurations.

### 2. `/Users/noorragu/Documents/vibe-code-demo/app/favicon.ico`

Application favicon (to be added).

### 3. `/Users/noorragu/Documents/vibe-code-demo/public/` (Optional)

Additional icon files for various platforms.

## Step-by-Step Implementation Guide

### Step 1: Review Current Layout

Check the existing layout file:

```bash
cat /Users/noorragu/Documents/vibe-code-demo/app/layout.tsx
```

### Step 2: Update Root Layout

Replace the contents of `app/layout.tsx` with the complete configuration:

```typescript
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

/**
 * Inter font - Primary sans-serif font for body text and UI
 * Used throughout the application for readability and modern aesthetics
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents FOUT (Flash of Unstyled Text)
  preload: true,
  fallback: ['system-ui', 'arial'],
});

/**
 * Playfair Display - Decorative serif font
 * Used for special headings and brand elements
 * Adds elegance and Italian restaurant character
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700', '800', '900'],
  fallback: ['Georgia', 'serif'],
});

// ============================================================================
// METADATA CONFIGURATION
// ============================================================================

/**
 * Application metadata for SEO and social sharing
 * Appears in search results, browser tabs, and social media previews
 */
export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: 'Bella Cucina | Restaurant Management',
    template: '%s | Bella Cucina', // For page-specific titles
  },
  description:
    'Professional restaurant management system for Bella Cucina. Manage orders, menu items, and track performance with our intuitive dashboard.',

  // Keywords for SEO
  keywords: [
    'restaurant management',
    'order management',
    'menu management',
    'Italian restaurant',
    'Bella Cucina',
    'restaurant dashboard',
    'food service',
    'order tracking',
  ],

  // Author information
  authors: [{ name: 'Bella Cucina Team' }],

  // App configuration
  applicationName: 'Bella Cucina',
  generator: 'Next.js',

  // Viewport (also handled by viewport export below)
  // viewport: 'width=device-width, initial-scale=1',

  // Theme color (matches primary brand color)
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF9800' },
    { media: '(prefers-color-scheme: dark)', color: '#FF9800' },
  ],

  // Color scheme
  colorScheme: 'light',

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Open Graph metadata (for social media sharing)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bellacucina.com',
    siteName: 'Bella Cucina',
    title: 'Bella Cucina | Restaurant Management',
    description:
      'Professional restaurant management system for managing orders, menu items, and tracking performance.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bella Cucina Restaurant Management',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Bella Cucina | Restaurant Management',
    description: 'Professional restaurant management system',
    images: ['/og-image.png'],
    creator: '@bellacucina',
  },

  // Robots directives (for production, may want to restrict in staging)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tokens (add when setting up search console)
  // verification: {
  //   google: 'google-site-verification-token',
  //   yandex: 'yandex-verification-token',
  // },
};

/**
 * Viewport configuration
 * Separate export for better organization
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow users to zoom
  userScalable: true, // Important for accessibility
  themeColor: '#FF9800',
};

// ============================================================================
// ROOT LAYOUT COMPONENT
// ============================================================================

/**
 * Root Layout Component
 *
 * This component wraps the entire application and provides:
 * - HTML structure with proper lang attribute
 * - Font loading and CSS variable setup
 * - Global styles (imported via globals.css)
 * - Toast notification provider
 * - Consistent layout structure
 *
 * @param children - The page content to render
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        {/* Main application content */}
        {children}

        {/* Toast notification provider */}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            classNames: {
              toast: 'rounded-lg shadow-lg',
              title: 'text-sm font-medium',
              description: 'text-sm',
              actionButton: 'bg-primary text-white',
              cancelButton: 'bg-secondary text-white',
              closeButton: 'bg-white border border-gray-200',
            },
          }}
        />
      </body>
    </html>
  );
}
```

### Step 3: Create Custom Error Pages

Create a custom not-found page:

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="btn btn-primary mt-8"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

### Step 4: Create Loading Component

Create a global loading component:

```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

### Step 5: Update Homepage

Create a simple homepage to test the layout:

```typescript
// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-warm py-20 text-white">
        <div className="container-custom text-center">
          <h1 className="font-serif text-6xl font-bold">Bella Cucina</h1>
          <p className="mt-4 text-xl">Restaurant Management System</p>
          <p className="mt-2 text-lg opacity-90">
            Manage your restaurant with elegance and efficiency
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard" className="btn btn-secondary">
              View Dashboard
            </Link>
            <Link href="/menu" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="card text-center">
              <div className="mb-4 text-4xl">📋</div>
              <h3 className="text-xl font-semibold">Order Management</h3>
              <p className="mt-2 text-muted-foreground">
                Track and manage customer orders in real-time with status updates
              </p>
            </div>
            <div className="card text-center">
              <div className="mb-4 text-4xl">🍽️</div>
              <h3 className="text-xl font-semibold">Menu Control</h3>
              <p className="mt-2 text-muted-foreground">
                Easily add, edit, and organize your menu items and categories
              </p>
            </div>
            <div className="card text-center">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="mt-2 text-muted-foreground">
                View sales statistics and performance metrics at a glance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-gray-50 py-8">
        <div className="container-custom text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Bella Cucina. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
```

### Step 6: Add Favicon

You can either create a custom favicon or use a placeholder. For now, create a simple text-based one or use an online favicon generator.

**Option 1: Use existing favicon**
The default Next.js favicon should already exist in `app/favicon.ico`.

**Option 2: Add custom favicon**
Place your custom `favicon.ico` in the `app/` directory.

### Step 7: Test Toast Notifications

Create a test page for toast notifications:

```typescript
// app/toast-test/page.tsx
'use client';

import { toast } from 'sonner';

export default function ToastTest() {
  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold">Toast Notifications Test</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => toast('Basic notification')}
          className="btn btn-ghost"
        >
          Basic Toast
        </button>

        <button
          onClick={() => toast.success('Order placed successfully!')}
          className="btn btn-primary"
        >
          Success Toast
        </button>

        <button
          onClick={() => toast.error('Failed to process order')}
          className="btn btn-secondary"
        >
          Error Toast
        </button>

        <button
          onClick={() => toast.warning('Please complete all fields')}
          className="btn btn-outline"
        >
          Warning Toast
        </button>

        <button
          onClick={() => toast.info('New feature available')}
          className="btn btn-ghost"
        >
          Info Toast
        </button>

        <button
          onClick={() =>
            toast('Order received', {
              description: 'Your order #1234 has been received and is being prepared.',
              action: {
                label: 'View',
                onClick: () => console.log('View clicked'),
              },
            })
          }
          className="btn btn-primary"
        >
          Toast with Action
        </button>

        <button
          onClick={() =>
            toast.promise(
              new Promise(resolve => setTimeout(resolve, 3000)),
              {
                loading: 'Processing order...',
                success: 'Order completed!',
                error: 'Order failed',
              }
            )
          }
          className="btn btn-secondary"
        >
          Promise Toast
        </button>

        <button
          onClick={() => {
            const toastId = toast.loading('Preparing order...');
            setTimeout(() => {
              toast.success('Order ready!', { id: toastId });
            }, 2000);
          }}
          className="btn btn-outline"
        >
          Loading Toast
        </button>

        <button
          onClick={() =>
            toast('Custom styled toast', {
              className: 'bg-accent text-white',
            })
          }
          className="btn btn-ghost"
        >
          Custom Style
        </button>
      </div>
    </div>
  );
}
```

### Step 8: Verify Everything Works

Start the development server and test:

```bash
npm run dev
```

Visit these URLs to test:
- http://localhost:3000 - Homepage
- http://localhost:3000/toast-test - Toast notifications
- http://localhost:3000/fake-url - 404 page

### Step 9: Test Font Loading

Check in browser DevTools:
1. Open DevTools → Network tab
2. Filter by "Font"
3. Verify Inter and Playfair Display fonts load
4. Check console for any font loading errors

### Step 10: Validate Metadata

View page source (right-click → View Page Source) and verify:
- `<title>` tag is correct
- Meta tags are present
- Font preload links exist
- Favicon link is present

## Code Examples

### Example 1: Page-Specific Metadata

```typescript
// app/menu/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu', // Will become "Menu | Bella Cucina"
  description: 'Browse our delicious Italian menu items',
};

export default function MenuPage() {
  return <div>Menu content</div>;
}
```

### Example 2: Using Toast in a Server Action

```typescript
// app/actions.ts
'use server';

export async function createOrder() {
  // Server logic here
  return { success: true, orderId: '123' };
}

// In component (client):
'use client';
import { toast } from 'sonner';
import { createOrder } from './actions';

async function handleSubmit() {
  const result = await createOrder();
  if (result.success) {
    toast.success('Order created!');
  }
}
```

### Example 3: Custom Layout for Specific Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-gray-50">
        {/* Sidebar navigation */}
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

## Acceptance Criteria

This task is considered complete when:

1. ✅ `app/layout.tsx` updated with complete configuration
2. ✅ Inter and Playfair Display fonts load correctly
3. ✅ Font CSS variables (--font-inter, --font-playfair) available
4. ✅ Metadata includes title, description, and keywords
5. ✅ Viewport configuration is correct
6. ✅ Theme color matches brand (orange #FF9800)
7. ✅ Toaster component renders and works
8. ✅ Toast notifications display correctly
9. ✅ Favicon appears in browser tab
10. ✅ Not-found page renders correctly
11. ✅ Loading component works
12. ✅ Homepage renders without errors
13. ✅ No console errors or warnings
14. ✅ Fonts display without FOUT (Flash of Unstyled Text)
15. ✅ Build completes successfully

## Testing Strategy

### Manual Testing

#### Test 1: Font Verification
```bash
# Start dev server
npm run dev

# In browser DevTools:
# 1. Inspect any text element
# 2. Check computed font-family
# 3. Should show "Inter" for body text
```

#### Test 2: Toast Functionality
```bash
# Visit http://localhost:3000/toast-test
# Click each button
# Verify toasts appear in top-right
# Check different toast types display correctly
```

#### Test 3: Metadata Verification
```bash
# View page source
# Verify all meta tags present:
# - <title>
# - <meta name="description">
# - <meta name="keywords">
# - <link rel="icon">
```

#### Test 4: Error Pages
```bash
# Visit http://localhost:3000/non-existent-page
# Should show custom 404 page
```

#### Test 5: Build Test
```bash
npm run build
# Should complete without errors
# Check build output for font optimization
```

### Automated Testing

Create a test to verify layout:

```typescript
// __tests__/layout.test.tsx
import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

describe('RootLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('has correct lang attribute', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
  });
});
```

## Common Pitfalls and Debugging Tips

### Pitfall 1: Fonts Not Loading

**Symptoms:**
- Default system fonts appear
- Font flash on page load

**Solutions:**
```typescript
// Ensure fonts are configured correctly
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Important!
  preload: true,   // Important!
});

// Ensure HTML has font variables
<html className={`${inter.variable} ${playfair.variable}`}>
```

### Pitfall 2: Toast Not Appearing

**Symptoms:**
- `toast()` calls don't show anything
- No errors in console

**Solutions:**
```typescript
// Make sure Toaster is in layout.tsx
<body>
  {children}
  <Toaster /> {/* Must be included! */}
</body>

// Make sure component is 'use client'
'use client';
import { toast } from 'sonner';
```

### Pitfall 3: Metadata Not Updating

**Symptoms:**
- Page title doesn't change
- Meta tags don't appear

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev

# Hard refresh browser (Cmd+Shift+R)
```

### Pitfall 4: Hydration Errors

**Symptoms:**
- Console warning about hydration mismatch
- Content flashes/changes on load

**Solutions:**
```typescript
// Add suppressHydrationWarning to html tag
<html suppressHydrationWarning>

// Or to specific elements with dynamic content
<div suppressHydrationWarning>
  {new Date().toString()}
</div>
```

### Pitfall 5: Build Fails with Font Errors

**Symptoms:**
- Build fails with font optimization errors

**Solutions:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Performance Considerations

### Font Loading Performance

```typescript
// ✅ Good - Using font-display: swap
const inter = Inter({
  display: 'swap', // Shows fallback font while custom font loads
});

// ✅ Good - Preloading fonts
const inter = Inter({
  preload: true, // Preloads font file
});

// ✅ Good - Subsetting
const inter = Inter({
  subsets: ['latin'], // Only includes latin characters
});
```

### Metadata Best Practices

- Keep title under 60 characters
- Keep description under 160 characters
- Use relevant keywords (5-10)
- Include Open Graph for social sharing

### Toast Performance

```typescript
// Limit toast duration for better UX
<Toaster duration={4000} /> // 4 seconds (default: 4000)

// Limit simultaneous toasts
<Toaster visibleToasts={5} /> // Max 5 toasts at once
```

## Related Tasks

- **Previous Task:** [Task 1.6: Create Utility Functions](./task-1.6-create-utility-functions.md)
- **Next Phase:** Phase 2 - Dashboard & Analytics
- **Related Tasks:**
  - Task 1.3: Tailwind CSS (styles used in layout)
  - Task 1.2: Dependencies (Sonner installed)

## Resources and Documentation

### Official Documentation
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Google Fonts](https://fonts.google.com/)

### SEO Resources
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)

### Tools
- [Favicon Generator](https://realfavicongenerator.net/)
- [Meta Tags Preview](https://metatags.io/)
- [Google Font Pairing](https://fontpair.co/)

## Notes

- The root layout wraps every page in the application
- Metadata can be overridden in page-specific files
- Toaster should only be included once (in root layout)
- Font variables are available globally via CSS custom properties
- Layout components cannot be async
- Use loading.tsx for loading states
- Use error.tsx for error boundaries

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
