# Task 4.5: Create Loading Skeleton Components

## Task Metadata

- **Task ID**: 4.5
- **Phase**: 4 - Shared Components
- **Complexity**: Medium
- **Estimated Time**: 1.5-2 hours
- **Priority**: Medium
- **Dependencies**: Phase 1 (Setup)
- **Component Type**: Server Component (static, no interactivity)

## Overview

Loading skeleton components provide visual feedback while content is loading, significantly improving perceived performance and user experience. Instead of showing blank pages or generic spinners, skeletons display placeholder content that matches the layout of the actual data, giving users a preview of what's coming and reducing perceived wait time.

### Importance

- **Perceived Performance**: Makes loading feel faster even if actual load time unchanged
- **Layout Stability**: Prevents content shift when data loads
- **User Confidence**: Shows the app is working, reduces abandonment
- **Professional Polish**: Modern UX pattern expected in quality apps
- **Reduced Confusion**: Users know content is loading vs missing
- **Better Metrics**: Reduces bounce rate during initial load

### User Experience Goals

1. **Familiar Structure**: Skeleton matches actual content layout
2. **Smooth Animation**: Subtle pulse/shimmer indicates activity
3. **Correct Dimensions**: No layout shift when real content appears
4. **Fast Display**: Skeletons show immediately, no delay
5. **Appropriate Duration**: Used for 500ms+ load times

### When to Use Skeletons

- **Initial Page Load**: First render before data fetches
- **Route Transitions**: Between page navigations
- **Infinite Scroll**: Loading more items
- **Search Results**: While querying
- **Form Submissions**: While processing

## Prerequisites

### Required Completions

- ✅ Phase 1 completed (Next.js 15, TypeScript, Tailwind CSS setup)
- ✅ Understanding of component dimensions from previous tasks
- ✅ Familiarity with Tailwind animation utilities

### Required Knowledge

- React component composition
- Tailwind CSS utilities
- CSS animations
- Layout dimensions and spacing
- Accessibility considerations for loading states

### Verify Prerequisites

```bash
# Verify Tailwind includes animation
grep "animate-pulse" node_modules/tailwindcss/lib/corePlugins.js

# Run development server
npm run dev
```

## Technical Specifications

### Component Architecture

```
Skeleton System
├── Base Skeleton Component (reusable primitive)
├── MenuCardSkeleton (matches MenuCard)
├── OrderCardSkeleton (matches Order card)
├── NavbarSkeleton (optional)
└── Custom skeleton variants as needed
```

### Animation Approach

```css
/* Tailwind animate-pulse */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
```

**Alternative**: Shimmer effect using gradient animation

### Styling Theme

- **Background**: Gray-200 (light gray)
- **Animation**: Pulse (fade in/out)
- **Border Radius**: Match component being represented
- **Spacing**: Exact match to actual component
- **Accessibility**: aria-label="Loading..."

## Component Interface

### Base Skeleton Props

```typescript
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}
```

### Specialized Skeleton Props

```typescript
// No props needed for specialized skeletons
// They match specific component dimensions

interface MenuCardSkeletonProps {
  count?: number // Number of skeleton cards to render
}

interface OrderCardSkeletonProps {
  count?: number
}
```

## Files to Create/Modify

### Create New Files

```
app/components/skeletons/
├── Skeleton.tsx           (base component)
├── MenuCardSkeleton.tsx   (matches MenuCard)
└── OrderCardSkeleton.tsx  (matches Order card)
```

### Directory Structure

```bash
mkdir -p app/components/skeletons
```

## Step-by-Step Implementation

### Step 1: Create Skeleton Directory

```bash
mkdir -p app/components/skeletons
```

### Step 2: Create Base Skeleton Component

Create `app/components/skeletons/Skeleton.tsx`:

```typescript
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  // Convert numeric width/height to pixels
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  // Variant-specific classes
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  // Animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  return (
    <div
      className={`
        bg-gray-200
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
      aria-label="Loading..."
      aria-busy="true"
    />
  )
}
```

**Key Features**:
- **Variant Types**: Text, circular, rectangular shapes
- **Flexible Sizing**: Accept string or number dimensions
- **Animation Options**: Pulse, wave, or none
- **Accessibility**: ARIA attributes for screen readers
- **Tailwind Classes**: Use gray-200 for neutral loading state

### Step 3: Create MenuCardSkeleton

Create `app/components/skeletons/MenuCardSkeleton.tsx`:

```typescript
import Skeleton from './Skeleton'

interface MenuCardSkeletonProps {
  count?: number
}

export default function MenuCardSkeleton({ count = 1 }: MenuCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Image Skeleton */}
          <Skeleton
            variant="rectangular"
            className="aspect-video w-full"
          />

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Name and Price Row */}
            <div className="flex items-start justify-between gap-2">
              <Skeleton variant="text" className="h-6 w-3/4" />
              <Skeleton variant="text" className="h-6 w-16" />
            </div>

            {/* Description Lines */}
            <div className="space-y-2">
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-5/6" />
              <Skeleton variant="text" className="h-4 w-4/6" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="p-4 pt-0">
            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  )
}
```

**Dimensions Match MenuCard**:
- `aspect-video`: 16:9 image ratio
- `h-6 w-3/4`: Name placeholder
- `h-6 w-16`: Price placeholder
- `h-4`: Description line height
- `h-12`: Button height
- All padding matches MenuCard exactly

**Count Prop**: Allows rendering multiple skeleton cards:
```typescript
<MenuCardSkeleton count={6} /> // Shows 6 loading cards
```

### Step 4: Create OrderCardSkeleton

Create `app/components/skeletons/OrderCardSkeleton.tsx`:

```typescript
import Skeleton from './Skeleton'

interface OrderCardSkeletonProps {
  count?: number
}

export default function OrderCardSkeleton({ count = 1 }: OrderCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {/* Header: Order ID and Status */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" className="h-6 w-32" />
            <Skeleton variant="rectangular" className="h-7 w-24 rounded-full" />
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                {/* Item Image */}
                <Skeleton variant="rectangular" className="w-16 h-16 rounded-md" />

                {/* Item Details */}
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-5 w-3/4" />
                  <Skeleton variant="text" className="h-4 w-1/2" />
                </div>

                {/* Item Price */}
                <Skeleton variant="text" className="h-5 w-16" />
              </div>
            ))}
          </div>

          {/* Footer: Total and Date */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Skeleton variant="text" className="h-5 w-24" />
            <Skeleton variant="text" className="h-6 w-20" />
          </div>
        </div>
      ))}
    </>
  )
}
```

**Dimensions Match Order Card**:
- Order ID: `h-6 w-32`
- Status badge: `h-7 w-24 rounded-full`
- Item image: `w-16 h-16`
- Item details: Variable widths
- Total: `h-6 w-20`

### Step 5: Add Shimmer Animation (Optional Enhancement)

Add custom shimmer animation to `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

Update Skeleton component to use shimmer:

```typescript
export function SkeletonShimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-gray-200
        ${className}
      `}
      aria-label="Loading..."
      aria-busy="true"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
        style={{
          backgroundSize: '1000px 100%',
        }}
      />
    </div>
  )
}
```

### Step 6: Create Loading Page Layouts

Create full-page skeleton layouts:

```typescript
// app/components/skeletons/MenuPageSkeleton.tsx
import MenuCardSkeleton from './MenuCardSkeleton'

export default function MenuPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title Skeleton */}
      <div className="mb-8">
        <Skeleton variant="text" className="h-10 w-48 mb-2" />
        <Skeleton variant="text" className="h-6 w-64" />
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuCardSkeleton count={6} />
      </div>
    </div>
  )
}
```

```typescript
// app/components/skeletons/OrdersPageSkeleton.tsx
import OrderCardSkeleton from './OrderCardSkeleton'

export default function OrdersPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Title */}
      <Skeleton variant="text" className="h-10 w-48 mb-6" />

      {/* Order Cards */}
      <div className="space-y-4">
        <OrderCardSkeleton count={3} />
      </div>
    </div>
  )
}
```

## Complete Code Examples

### Base Skeleton (Skeleton.tsx)

```typescript
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'none'
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    none: '',
  }

  return (
    <div
      className={`
        bg-gray-200
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
      aria-label="Loading..."
      aria-busy="true"
    />
  )
}
```

## Usage Examples

### In Next.js Loading File

```typescript
// app/menu/loading.tsx
import MenuCardSkeleton from '../components/skeletons/MenuCardSkeleton'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuCardSkeleton count={6} />
      </div>
    </div>
  )
}
```

### With Suspense Boundary

```typescript
import { Suspense } from 'react'
import MenuCardSkeleton from './skeletons/MenuCardSkeleton'
import MenuList from './MenuList'

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuCardSkeleton count={6} />}>
      <MenuList />
    </Suspense>
  )
}
```

### Conditional Rendering

```typescript
'use client'

import { useEffect, useState } from 'react'
import MenuCard from './MenuCard'
import MenuCardSkeleton from './skeletons/MenuCardSkeleton'

export default function Menu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenuItems().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuCardSkeleton count={6} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### Individual Skeleton Elements

```typescript
import Skeleton from './skeletons/Skeleton'

<div className="space-y-4">
  {/* Avatar */}
  <Skeleton variant="circular" width={64} height={64} />

  {/* Title */}
  <Skeleton variant="text" width="75%" height={24} />

  {/* Paragraph */}
  <div className="space-y-2">
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="80%" />
  </div>

  {/* Button */}
  <Skeleton variant="rectangular" width={120} height={40} />
</div>
```

## Acceptance Criteria

### Functional Requirements

- ✅ Base Skeleton component renders with all variants
- ✅ MenuCardSkeleton matches MenuCard dimensions exactly
- ✅ OrderCardSkeleton matches Order card dimensions exactly
- ✅ Count prop works for multiple skeletons
- ✅ Animation runs smoothly
- ✅ No layout shift when real content loads
- ✅ Works with Next.js Suspense and loading.tsx

### Visual Requirements

- ✅ Pulse animation is subtle and smooth
- ✅ Gray-200 color is neutral and unobtrusive
- ✅ Border radius matches actual components
- ✅ Spacing matches actual components
- ✅ All dimensions precisely match real content

### Accessibility Requirements

- ✅ Has aria-label="Loading..."
- ✅ Has aria-busy="true"
- ✅ Screen readers announce loading state
- ✅ Doesn't cause seizures (subtle animation)
- ✅ Respects prefers-reduced-motion

### Performance Requirements

- ✅ Renders immediately (no delay)
- ✅ Lightweight (minimal code)
- ✅ No JavaScript required for base skeletons
- ✅ CSS animation (hardware accelerated)
- ✅ No impact on actual content load time

## Testing Strategy

### Manual Testing

1. **Visual Comparison**
   ```
   - Render MenuCardSkeleton
   - Load actual MenuCard
   - Compare dimensions side-by-side
   - Verify no layout shift occurs
   - Check all spacing matches
   ```

2. **Animation**
   ```
   - Verify pulse animation runs
   - Check animation speed (2s cycle)
   - Ensure smooth transitions
   - Test with prefers-reduced-motion
   ```

3. **Responsive**
   ```
   - Test at 375px width
   - Test at 768px width
   - Test at 1280px width
   - Verify grid adapts correctly
   - Check no horizontal scroll
   ```

4. **Integration**
   ```
   - Use in Next.js loading.tsx
   - Use with Suspense boundary
   - Test conditional rendering
   - Verify smooth transition to content
   ```

5. **Accessibility**
   ```
   - Test with screen reader
   - Verify loading announcement
   - Check with keyboard navigation
   - Test reduced motion preference
   ```

### Visual Regression

Create comparison page:

```typescript
<div className="grid grid-cols-2 gap-8">
  <div>
    <h3>Skeleton</h3>
    <MenuCardSkeleton />
  </div>
  <div>
    <h3>Actual</h3>
    <MenuCard item={sampleItem} />
  </div>
</div>
```

Take screenshots and overlay to verify alignment.

### Performance Testing

```typescript
// Measure render time
console.time('skeleton-render')
render(<MenuCardSkeleton count={10} />)
console.timeEnd('skeleton-render')
// Should be < 5ms
```

## Common Pitfalls

### Pitfall 1: Layout Shift When Content Loads

**Problem**: Content "jumps" when real data replaces skeleton.

**Cause**: Skeleton dimensions don't match actual component.

**Solution**: Measure actual component and match exactly:
```typescript
// Use same classes as actual component
<div className="aspect-video"> {/* Matches MenuCard image */}
  <Skeleton />
</div>
```

### Pitfall 2: Skeleton Shows for Too Short

**Problem**: Skeleton flashes briefly, looks glitchy.

**Cause**: Data loads too fast (< 300ms).

**Solution**: Add minimum display time:
```typescript
const [showSkeleton, setShowSkeleton] = useState(true)

useEffect(() => {
  const minTime = new Promise(resolve => setTimeout(resolve, 500))
  const dataLoad = fetchData()

  Promise.all([minTime, dataLoad]).then(() => {
    setShowSkeleton(false)
  })
}, [])
```

### Pitfall 3: Animation Causing Motion Sickness

**Problem**: Users with vestibular disorders report discomfort.

**Cause**: Not respecting prefers-reduced-motion.

**Solution**: Add media query support:
```typescript
<Skeleton
  className="motion-reduce:animate-none"
  animation="pulse"
/>
```

Or in Tailwind config:
```typescript
// Auto-respects prefers-reduced-motion
className="animate-pulse" // Already respects preference in Tailwind
```

### Pitfall 4: Too Many Skeleton Variants

**Problem**: Multiple similar skeleton components, hard to maintain.

**Cause**: Creating new component for every use case.

**Solution**: Use composition with base Skeleton:
```typescript
// Instead of new component, compose:
<div className="flex items-center space-x-3">
  <Skeleton variant="circular" width={40} height={40} />
  <div className="flex-1">
    <Skeleton variant="text" className="w-3/4 mb-2" />
    <Skeleton variant="text" className="w-1/2" />
  </div>
</div>
```

### Pitfall 5: Skeleton Doesn't Match Dark Mode

**Problem**: Skeleton looks wrong in dark mode.

**Cause**: Using fixed gray-200 color.

**Solution**: Add dark mode support:
```typescript
<div className="bg-gray-200 dark:bg-gray-700">
```

### Pitfall 6: Skeletons in Wrong Grid

**Problem**: Skeletons don't align in grid layout.

**Cause**: Missing grid container around skeletons.

**Solution**: Wrap in same grid as actual content:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <MenuCardSkeleton count={6} />
</div>
```

## Enhancement Ideas

### 1. Shimmer Animation

More sophisticated gradient shimmer:

```typescript
export function SkeletonShimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

// In tailwind.config.ts
keyframes: {
  shimmer: {
    '100%': { transform: 'translateX(100%)' },
  },
},
animation: {
  shimmer: 'shimmer 2s infinite',
}
```

### 2. Content-Aware Skeletons

Generate skeleton based on actual data structure:

```typescript
export function generateSkeleton<T>(
  data: T,
  config: SkeletonConfig
): JSX.Element {
  // Auto-generate skeleton matching data structure
}
```

### 3. Percentage Loading Indicator

```typescript
export function SkeletonWithProgress({ progress }: { progress: number }) {
  return (
    <div className="relative">
      <Skeleton />
      <div
        className="absolute bottom-0 left-0 h-1 bg-amber-600 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

### 4. Skeleton Fade-Out

Smooth transition to real content:

```typescript
const [isLoading, setIsLoading] = useState(true)

<div className={`transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
  <MenuCardSkeleton />
</div>
```

### 5. Text Length Variation

More realistic text skeletons:

```typescript
const textWidths = ['w-full', 'w-11/12', 'w-5/6', 'w-3/4']
{textWidths.map((width, i) => (
  <Skeleton key={i} variant="text" className={width} />
))}
```

## Related Tasks

- **Task 4.3**: MenuCard (MenuCardSkeleton matches this)
- **Phase 5**: All pages (use loading.tsx with skeletons)
- **Phase 6**: Admin pages (admin table skeletons)
- **Phase 7**: Order tracking (order detail skeleton)

## Troubleshooting

### Issue: Skeleton doesn't animate

**Solution**: Verify Tailwind includes animations:
```bash
# Check if animate-pulse is available
npx tailwindcss -o test.css
grep "animate-pulse" test.css
```

### Issue: Count prop doesn't work

**Solution**: Ensure Array.from is used correctly:
```typescript
Array.from({ length: count }).map((_, index) => (
  <SkeletonCard key={index} />
))
```

### Issue: Skeleton wider than container

**Solution**: Add w-full to skeleton card:
```typescript
<div className="bg-white rounded-lg shadow-md w-full">
```

## Resources

- [Tailwind CSS Animation](https://tailwindcss.com/docs/animation)
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Skeleton Screen Pattern](https://www.nngroup.com/articles/skeleton-screens/)
- [Motion Preferences](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Completion Checklist

- [ ] Skeleton directory created
- [ ] Base Skeleton component created
- [ ] MenuCardSkeleton created
- [ ] OrderCardSkeleton created
- [ ] Dimensions verified against actual components
- [ ] Animation working smoothly
- [ ] Count prop functional
- [ ] Accessibility attributes added
- [ ] Manual testing complete
- [ ] No layout shift verified
- [ ] Works with Next.js loading.tsx
- [ ] Works with Suspense
- [ ] Responsive on all screen sizes
- [ ] Documentation complete

**Task Complete**: Ready for Task 4.6!
