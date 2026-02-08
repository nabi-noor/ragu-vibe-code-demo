# Task 7.5: Optimize Performance

## Task Metadata
- **Task ID**: 7.5
- **Phase**: 7 - Polish & UX Enhancements
- **Estimated Time**: 3-4 hours
- **Priority**: High
- **Complexity**: Medium-High
- **Dependencies**: All previous Phase 7 tasks
- **Assigned To**: Frontend Developer
- **Status**: Not Started

## Overview

Optimize the Bella Cucina web app to achieve a Lighthouse performance score greater than 90 across all metrics. This includes image optimization, code splitting, lazy loading, React performance optimizations, database query optimization, bundle size reduction, and implementing effective caching strategies. Performance directly impacts user satisfaction, SEO rankings, and conversion rates.

## Importance

### User Experience Benefits
1. **Faster Load Times**: Users see content quickly
2. **Smooth Interactions**: No lag or jank during use
3. **Better Mobile Experience**: Works well on slow connections
4. **Lower Data Usage**: Smaller payloads save user data
5. **Reduced Frustration**: Fast apps retain users

### Business Impact
- **Higher Conversion Rates**: 100ms faster = 1% more conversions
- **Better SEO Rankings**: Core Web Vitals are ranking factors
- **Reduced Bounce Rate**: 53% of mobile users leave if load >3s
- **Lower Infrastructure Costs**: Optimized assets reduce bandwidth
- **Competitive Advantage**: Fast sites stand out

### Technical Benefits
- Better resource utilization
- Improved scalability
- Reduced server costs
- Better code organization
- Enhanced maintainability

## Prerequisites

### Completed Requirements
- All previous Phase 7 tasks complete
- All features implemented
- Application functional end-to-end

### Technical Knowledge Required
- Next.js Image optimization
- React performance patterns (useMemo, useCallback, React.memo)
- Code splitting and lazy loading
- Bundle analysis
- Core Web Vitals metrics
- Browser caching strategies

### Tools to Install
```bash
# Bundle analyzer
npm install -D @next/bundle-analyzer

# Performance monitoring
npm install @vercel/analytics @vercel/speed-insights

# Image optimization (if using external images)
npm install sharp
```

## Technical Specifications

### Performance Targets

#### Core Web Vitals
- **Largest Contentful Paint (LCP)**: <2.5s (Good)
- **First Input Delay (FID)**: <100ms (Good)
- **Cumulative Layout Shift (CLS)**: <0.1 (Good)
- **First Contentful Paint (FCP)**: <1.8s (Good)
- **Time to Interactive (TTI)**: <3.8s (Good)
- **Total Blocking Time (TBT)**: <200ms (Good)

#### Lighthouse Scores (All >90)
- **Performance**: >90
- **Accessibility**: 100 (from Task 7.3)
- **Best Practices**: >90
- **SEO**: 100 (from Task 7.6)

#### Bundle Size Targets
- **First Load JS**: <170kb (gzipped)
- **Total Bundle**: <500kb (gzipped)
- **Individual Route JS**: <85kb (gzipped)

#### Network Performance
- **Server Response Time (TTFB)**: <600ms
- **Page Load on 3G**: <3s
- **Total Requests**: <50 per page

### Optimization Categories

1. **Image Optimization**
   - Use Next.js Image component
   - Proper sizing and formats
   - Lazy loading
   - CDN delivery

2. **Code Optimization**
   - Code splitting
   - Tree shaking
   - Minification
   - Dead code elimination

3. **React Optimization**
   - React.memo for expensive components
   - useMemo for expensive calculations
   - useCallback for event handlers
   - Proper key usage

4. **Data Fetching**
   - Server Components (default)
   - Streaming with Suspense
   - Request deduplication
   - Proper caching strategies

5. **Asset Optimization**
   - Font optimization
   - CSS optimization
   - Script loading strategies
   - Resource hints

## Implementation Guide

### Step 1: Configure Bundle Analyzer (15 minutes)

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-url.supabase.co',
      },
    ],
  },
  // Enable compression
  compress: true,
  // Optimize production build
  swcMinify: true,
  // Optimize imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
}

module.exports = withBundleAnalyzer(nextConfig)

// Add to package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Step 2: Optimize All Images (30 minutes)

```typescript
// Before: Regular img tag
<img src="/pizza.jpg" alt="Pizza" />

// After: Next.js Image component
import Image from 'next/image'

<Image
  src="/pizza.jpg"
  alt="Delicious Margherita Pizza"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false} // Set to true for above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Or use placeholder prop
/>

// For dynamic images from Supabase
<Image
  src={item.image_url}
  alt={item.name}
  width={400}
  height={300}
  loader={({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`
  }}
/>

// Hero image (above fold) - use priority
<Image
  src="/hero.jpg"
  alt="Bella Cucina Restaurant"
  width={1920}
  height={1080}
  priority
  className="w-full h-auto"
/>

// components/ui/optimized-image.tsx - Wrapper component
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: string
}

export function OptimizedImage({ fallback = '/placeholder.png', ...props }: OptimizedImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return <Image {...props} src={fallback} onError={() => {}} />
  }

  return <Image {...props} onError={() => setError(true)} />
}
```

### Step 3: Implement Code Splitting and Lazy Loading (45 minutes)

```typescript
// app/menu/page.tsx - Use dynamic imports for heavy components
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load cart sidebar (not needed on initial load)
const CartSidebar = dynamic(() => import('@/components/cart/cart-sidebar'), {
  loading: () => <div>Loading cart...</div>,
  ssr: false, // Don't render on server if not needed
})

// Lazy load modal dialogs
const OrderDetailsModal = dynamic(() => import('@/components/orders/order-details-modal'), {
  loading: () => null,
})

// Lazy load heavy libraries
const DatePicker = dynamic(() => import('react-datepicker'), {
  loading: () => <input type="date" />,
  ssr: false,
})

export default function MenuPage() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div>
      {/* Menu content */}

      {/* Cart only loads when opened */}
      {cartOpen && <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />}
    </div>
  )
}

// lib/utils/lazy-components.ts - Centralized lazy imports
export const LazyComponents = {
  CartSidebar: dynamic(() => import('@/components/cart/cart-sidebar')),
  OrderModal: dynamic(() => import('@/components/orders/order-modal')),
  ReviewForm: dynamic(() => import('@/components/reviews/review-form')),
  ImageGallery: dynamic(() => import('@/components/ui/image-gallery')),
}
```

### Step 4: Optimize React Components (60 minutes)

```typescript
// 1. Memoize expensive components
import { memo } from 'react'

// Before
export function MenuItem({ item, onAddToCart }) {
  return (
    <div>
      {/* Complex render logic */}
    </div>
  )
}

// After
export const MenuItem = memo(function MenuItem({ item, onAddToCart }) {
  return (
    <div>
      {/* Complex render logic */}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  return prevProps.item.id === nextProps.item.id
})

// 2. Use useMemo for expensive calculations
import { useMemo } from 'react'

function CartSummary({ items }) {
  // Expensive calculation
  const summary = useMemo(() => {
    return items.reduce((acc, item) => {
      return {
        subtotal: acc.subtotal + (item.price * item.quantity),
        tax: acc.tax + (item.price * item.quantity * 0.1),
        total: acc.total + (item.price * item.quantity * 1.1),
      }
    }, { subtotal: 0, tax: 0, total: 0 })
  }, [items]) // Only recalculate when items change

  return (
    <div>
      <p>Subtotal: ${summary.subtotal.toFixed(2)}</p>
      <p>Tax: ${summary.tax.toFixed(2)}</p>
      <p>Total: ${summary.total.toFixed(2)}</p>
    </div>
  )
}

// 3. Use useCallback for event handlers
import { useCallback } from 'react'

function MenuGrid({ items }) {
  const handleAddToCart = useCallback((item) => {
    // Add to cart logic
    addToCart(item)
  }, []) // No dependencies if using stable functions

  return (
    <div>
      {items.map(item => (
        <MenuItem
          key={item.id}
          item={item}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}

// 4. Optimize list rendering with proper keys
function OrderList({ orders }) {
  return (
    <ul>
      {/* Good: Use stable, unique ID */}
      {orders.map(order => (
        <li key={order.id}>
          <OrderCard order={order} />
        </li>
      ))}

      {/* Bad: Using index as key */}
      {/* {orders.map((order, index) => (
        <li key={index}>
          <OrderCard order={order} />
        </li>
      ))} */}
    </ul>
  )
}

// 5. Virtualize long lists (if needed)
import { FixedSizeList } from 'react-window'

function VirtualizedMenuList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={200}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <MenuItem item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

### Step 5: Optimize Data Fetching (45 minutes)

```typescript
// 1. Use Server Components by default
// app/menu/page.tsx (Server Component - no 'use client')
import { fetchMenuItems } from '@/lib/api'

export default async function MenuPage() {
  // Fetches on server, no client-side JavaScript needed
  const items = await fetchMenuItems()

  return (
    <div>
      {items.map(item => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  )
}

// 2. Enable caching for static data
// lib/api.ts
import { cache } from 'react'

// Deduplicate requests within a render
export const fetchMenuItems = cache(async (category?: string) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq(category ? 'category' : 'active', category || true)

  if (error) throw error
  return data
})

// 3. Use Next.js fetch with caching
export async function fetchCategories() {
  const res = await fetch('https://api.example.com/categories', {
    next: {
      revalidate: 3600, // Revalidate every hour
      tags: ['categories'], // For on-demand revalidation
    }
  })
  return res.json()
}

// 4. Streaming with loading.tsx
// app/menu/loading.tsx
export default function Loading() {
  return <MenuGridSkeleton />
}

// 5. Parallel data fetching
export default async function OrderPage({ params }: { params: { id: string } }) {
  // Start all fetches in parallel
  const orderPromise = fetchOrder(params.id)
  const itemsPromise = fetchOrderItems(params.id)
  const customerPromise = fetchCustomer(params.id)

  // Wait for all to complete
  const [order, items, customer] = await Promise.all([
    orderPromise,
    itemsPromise,
    customerPromise,
  ])

  return (
    <div>
      {/* Render with all data */}
    </div>
  )
}

// 6. Optimize Supabase queries
// lib/api.ts

// Bad: Over-fetching
export async function fetchOrders() {
  const { data } = await supabase
    .from('orders')
    .select('*') // Gets ALL columns
  return data
}

// Good: Select only needed columns
export async function fetchOrders() {
  const { data } = await supabase
    .from('orders')
    .select('id, created_at, total, status') // Only what we need
    .order('created_at', { ascending: false })
    .limit(20) // Paginate
  return data
}

// Even better: Use views or RPC for complex queries
export async function fetchOrdersWithItems() {
  const { data } = await supabase
    .rpc('get_orders_with_items') // Use database function
  return data
}
```

### Step 6: Optimize Fonts and Assets (20 minutes)

```typescript
// app/layout.tsx - Optimize font loading
import { Inter } from 'next/font/google'

// Configure font with optimal settings
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use swap for better perceived performance
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
}

// Preload critical assets
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://your-supabase-url.supabase.co" />

        {/* Preload critical images */}
        <link
          rel="preload"
          as="image"
          href="/hero.jpg"
          type="image/jpeg"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Step 7: Implement Performance Monitoring (20 minutes)

```typescript
// app/layout.tsx - Add Vercel Analytics
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

// lib/performance.ts - Custom performance monitoring
export function measurePerformance() {
  if (typeof window === 'undefined') return

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime)
      }
      if (entry.entryType === 'first-input') {
        console.log('FID:', entry.processingStart - entry.startTime)
      }
      if (entry.entryType === 'layout-shift') {
        console.log('CLS:', entry.value)
      }
    }
  })

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
}

// Track custom metrics
export function trackMetric(name: string, value: number) {
  if (window.gtag) {
    window.gtag('event', name, {
      value: Math.round(value),
      event_category: 'Web Vitals',
    })
  }
}
```

### Step 8: Optimize CSS and Scripts (20 minutes)

```typescript
// next.config.js - Optimize CSS
module.exports = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
}

// Remove unused Tailwind classes
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // PurgeCSS will remove unused classes in production
}

// Load third-party scripts optimally
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Analytics - load after interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />

        {/* Non-critical scripts - load lazily */}
        <Script
          src="https://widget.example.com/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
```

## Code Examples

### Example 1: Optimized Menu Page (Complete)

```typescript
// app/menu/page.tsx
import { Suspense } from 'react'
import { fetchMenuItems, fetchCategories } from '@/lib/api'
import { MenuGrid } from '@/components/menu/menu-grid'
import { MenuGridSkeleton } from '@/components/menu/menu-grid-skeleton'
import { CategoryFilter } from '@/components/menu/category-filter'
import { ErrorBoundary } from '@/components/error-boundary'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Menu - Bella Cucina',
    description: 'Explore our authentic Italian cuisine menu',
  }
}

interface PageProps {
  searchParams: { category?: string }
}

export default async function MenuPage({ searchParams }: PageProps) {
  // Fetch data on server
  const categories = await fetchCategories()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Our Menu</h1>

      {/* Category filter - static, no Suspense needed */}
      <CategoryFilter categories={categories} />

      {/* Menu items - wrap in Suspense for streaming */}
      <ErrorBoundary>
        <Suspense fallback={<MenuGridSkeleton />}>
          <MenuGrid category={searchParams.category} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// components/menu/menu-grid.tsx (Server Component)
import { fetchMenuItems } from '@/lib/api'
import { MenuItem } from './menu-item'

interface MenuGridProps {
  category?: string
}

export async function MenuGrid({ category }: MenuGridProps) {
  const items = await fetchMenuItems(category)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  )
}

// components/menu/menu-item.tsx (Optimized)
import { memo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AddToCartButton } from './add-to-cart-button'

interface MenuItemProps {
  item: MenuItem
}

export const MenuItem = memo(function MenuItem({ item }: MenuItemProps) {
  return (
    <article className="border rounded-lg overflow-hidden">
      <Image
        src={item.image}
        alt={item.name}
        width={400}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${item.price}</span>
          <AddToCartButton item={item} />
        </div>
      </div>
    </article>
  )
})
```

### Example 2: Optimized Cart Hook

```typescript
// hooks/use-cart.ts (Optimized)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMemo } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
)

// Optimized hook with memoized calculations
export function useCart() {
  const store = useCartStore()

  // Memoize expensive calculations
  const summary = useMemo(() => {
    const subtotal = store.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const tax = subtotal * 0.1
    const total = subtotal + tax

    return { subtotal, tax, total }
  }, [store.items])

  const itemCount = useMemo(() => {
    return store.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [store.items])

  return {
    ...store,
    ...summary,
    itemCount,
  }
}
```

## Acceptance Criteria

### Lighthouse Scores
- [ ] Performance score >90 on all pages
- [ ] Accessibility score 100
- [ ] Best Practices score >90
- [ ] SEO score 100
- [ ] Tested on mobile and desktop

### Core Web Vitals
- [ ] LCP <2.5s on all pages
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] FCP <1.8s
- [ ] TTI <3.8s

### Bundle Size
- [ ] First Load JS <170kb
- [ ] Individual route JS <85kb
- [ ] No duplicate dependencies
- [ ] Tree shaking working

### Images
- [ ] All images use Next.js Image
- [ ] Proper sizing and formats
- [ ] Lazy loading implemented
- [ ] Priority images identified

### Code Quality
- [ ] No unnecessary re-renders
- [ ] Expensive calculations memoized
- [ ] Heavy components lazy loaded
- [ ] Proper code splitting

## Testing Strategy

### Performance Testing
```bash
# Run Lighthouse
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit

# Analyze bundle
npm run analyze

# Test on slow connection
# Chrome DevTools > Network > Slow 3G
```

### Monitoring
1. Set up Vercel Analytics
2. Monitor Core Web Vitals
3. Track bundle size over time
4. Set up performance budgets
5. Add alerts for regressions

## Common Pitfalls

### 1. Not Using Next.js Image
**Problem**: Unoptimized images slow down page load

**Solution**: Always use Image component
```typescript
import Image from 'next/image'
<Image src="/pizza.jpg" alt="Pizza" width={400} height={300} />
```

### 2. Over-fetching Data
**Problem**: Getting more data than needed

**Solution**: Select only required columns
```typescript
// Bad
.select('*')

// Good
.select('id, name, price')
```

### 3. Not Memoizing Calculations
**Problem**: Expensive calculations run on every render

**Solution**: Use useMemo
```typescript
const total = useMemo(() => calculateTotal(items), [items])
```

### 4. Loading Everything Upfront
**Problem**: Large initial bundle

**Solution**: Code split with dynamic imports
```typescript
const HeavyComponent = dynamic(() => import('./heavy-component'))
```

### 5. Not Setting up Monitoring
**Problem**: Can't track performance over time

**Solution**: Add Analytics and SpeedInsights
```typescript
import { Analytics } from '@vercel/analytics/react'
<Analytics />
```

## Related Tasks

### Dependencies
- All previous Phase 7 tasks

### Future Enhancements
- Service worker for offline support
- HTTP/2 Server Push
- Edge caching
- Progressive Web App features

## Resources

### Documentation
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [WebPageTest](https://www.webpagetest.org/)

## Completion Checklist

- [ ] Bundle analyzer configured
- [ ] All images optimized with Next.js Image
- [ ] Code splitting implemented
- [ ] React components memoized where needed
- [ ] Data fetching optimized
- [ ] Fonts optimized
- [ ] Performance monitoring set up
- [ ] CSS optimized
- [ ] Scripts loaded optimally
- [ ] Lighthouse score >90 achieved
- [ ] Core Web Vitals passing
- [ ] Bundle size targets met
- [ ] Mobile performance tested
- [ ] Documentation updated
- [ ] Code review completed

## Next Steps

After completing this task:
1. Move to Task 7.6 (SEO Metadata)
2. Set up continuous performance monitoring
3. Establish performance budgets
4. Create performance dashboard
5. Document optimization patterns for team
