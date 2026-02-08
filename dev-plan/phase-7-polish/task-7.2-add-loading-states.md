# Task 7.2: Add Loading States

## Task Metadata
- **Task ID**: 7.2
- **Phase**: 7 - Polish & UX Enhancements
- **Estimated Time**: 3-4 hours
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Task 7.1 (Toast Notifications)
- **Assigned To**: Frontend Developer
- **Status**: Not Started

## Overview

Implement comprehensive loading states throughout the Bella Cucina web app to provide visual feedback during asynchronous operations. This includes loading skeletons, button loading states, page-level indicators, error boundaries, and fallback UI components. Proper loading states are essential for perceived performance and professional user experience.

## Importance

### User Experience Benefits
1. **Perceived Performance**: Users tolerate waiting better with clear loading feedback
2. **Reduced Anxiety**: Clear indication that something is happening prevents user uncertainty
3. **Professional Appearance**: Loading states make the app feel more polished
4. **Error Recovery**: Error boundaries prevent white screens and provide recovery options
5. **Progressive Enhancement**: Content appears gradually rather than all at once

### Business Impact
- Reduces perceived load times by 20-30%
- Decreases bounce rate during slow connections
- Increases user confidence in the application
- Reduces support tickets about "broken" pages
- Improves mobile experience on slow networks

### Technical Benefits
- Prevents race conditions and UI flashing
- Provides clear component state management
- Enables better error handling
- Supports graceful degradation
- Improves code maintainability

## Prerequisites

### Completed Requirements
- Task 7.1 (Toast Notifications) must be complete
- Phase 5 (Menu Management) must be complete
- Phase 6 (Checkout) must be complete
- All async operations identified

### Technical Knowledge Required
- React Suspense and Error Boundaries
- Next.js loading.tsx and error.tsx conventions
- Skeleton UI patterns
- React state management
- TypeScript discriminated unions

### Environment Setup
No additional packages required. Uses built-in React and Next.js features.

## Technical Specifications

### Loading State Types

#### 1. Page-Level Loading
- Uses Next.js `loading.tsx` files
- Shown during route transitions
- Full-page skeleton layouts
- Automatic with App Router

#### 2. Component-Level Loading
- Skeleton components for cards, lists, forms
- Spinner components for inline loading
- Progressive loading with Suspense boundaries

#### 3. Button Loading States
- Disabled during async operations
- Spinner icon or loading text
- Prevents double-submission

#### 4. Data Loading States
- Loading skeletons matching final content
- Empty states for no data
- Error states with retry options

#### 5. Error Boundaries
- Component-level error boundaries
- Page-level error boundaries
- Root error boundary for uncaught errors

### Loading State Patterns

```typescript
// Discriminated union for component state
type ComponentState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// Or use separate boolean flags
type LoadingState = {
  isLoading: boolean
  isError: boolean
  error?: Error
  data?: T
}
```

## Implementation Guide

### Step 1: Create Loading Skeleton Components (45 minutes)

```typescript
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

// components/menu/menu-item-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function MenuItemSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// components/menu/menu-grid-skeleton.tsx
import { MenuItemSkeleton } from './menu-item-skeleton'

export function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MenuItemSkeleton key={i} />
      ))}
    </div>
  )
}
```

### Step 2: Create Page-Level Loading Files (30 minutes)

```typescript
// app/menu/loading.tsx
import { MenuGridSkeleton } from '@/components/menu/menu-grid-skeleton'

export default function MenuLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>

      <MenuGridSkeleton />
    </div>
  )
}

// app/checkout/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Skeleton className="h-8 w-64 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Form skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Right column - Order summary skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <div className="border-t pt-4 mt-4">
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// app/orders/[id]/loading.tsx
export default function OrderDetailsLoading() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Skeleton className="h-8 w-48 mb-8" />

      <div className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}
```

### Step 3: Create Error Boundary Components (45 minutes)

```typescript
// components/error-boundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We encountered an error while loading this content. Please try again.
          </p>
          <Button onClick={this.reset}>Try Again</Button>
        </div>
      )
    }

    return this.props.children
  }
}

// app/error.tsx (Root error boundary)
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <AlertCircle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        We're sorry, but something unexpected happened. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
    </div>
  )
}

// app/menu/error.tsx (Page-level error boundary)
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Menu error:', error)
  }, [error])

  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load menu</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          We couldn't load the menu items. Please check your connection and try again.
        </p>
        <Button onClick={reset}>Retry</Button>
      </div>
    </div>
  )
}
```

### Step 4: Implement Button Loading States (30 minutes)

```typescript
// components/ui/button.tsx (enhanced)
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

// Usage example
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function AddToCartButton({ item }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await addToCart(item)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} loading={isLoading}>
      Add to Cart
    </Button>
  )
}
```

### Step 5: Implement Data Loading States (45 minutes)

```typescript
// hooks/use-async-data.ts
import { useState, useEffect } from 'react'

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })

  useEffect(() => {
    let cancelled = false

    setState({ status: 'loading' })

    fetcher()
      .then((data) => {
        if (!cancelled) {
          setState({ status: 'success', data })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ status: 'error', error })
        }
      })

    return () => {
      cancelled = true
    }
  }, deps)

  return state
}

// Usage in component
import { useAsyncData } from '@/hooks/use-async-data'
import { MenuGridSkeleton } from '@/components/menu/menu-grid-skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export function MenuGrid({ category }: { category?: string }) {
  const state = useAsyncData(() => fetchMenuItems(category), [category])

  if (state.status === 'loading') {
    return <MenuGridSkeleton />
  }

  if (state.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load menu items</h3>
        <p className="text-muted-foreground mb-4">
          {state.error.message}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (state.status === 'success' && state.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">No menu items found</p>
      </div>
    )
  }

  if (state.status === 'success') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.data.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    )
  }

  return null
}
```

### Step 6: Implement Suspense Boundaries (30 minutes)

```typescript
// app/menu/page.tsx
import { Suspense } from 'react'
import { MenuGrid } from '@/components/menu/menu-grid'
import { MenuGridSkeleton } from '@/components/menu/menu-grid-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'

export default function MenuPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Our Menu</h1>

      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">Failed to load menu</p>
            <Button onClick={reset}>Try Again</Button>
          </div>
        )}
      >
        <Suspense fallback={<MenuGridSkeleton />}>
          <MenuGrid />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// components/menu/menu-grid.tsx (async component)
import { fetchMenuItems } from '@/lib/api'

export async function MenuGrid() {
  const items = await fetchMenuItems()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No menu items available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### Step 7: Create Empty State Components (30 minutes)

```typescript
// components/ui/empty-state.tsx
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}

// Usage examples
import { ShoppingCart, Package, Search } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

// Empty cart
<EmptyState
  icon={ShoppingCart}
  title="Your cart is empty"
  description="Add some delicious items from our menu to get started"
  action={{
    label: 'Browse Menu',
    onClick: () => router.push('/menu'),
  }}
/>

// No orders
<EmptyState
  icon={Package}
  title="No orders yet"
  description="You haven't placed any orders yet. Start by browsing our menu"
  action={{
    label: 'View Menu',
    onClick: () => router.push('/menu'),
  }}
/>

// No search results
<EmptyState
  icon={Search}
  title="No results found"
  description="We couldn't find any items matching your search. Try different keywords"
/>
```

## Code Examples

### Example 1: Complete Checkout Form with Loading States

```typescript
// app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const order = await createOrder(formData)
      toast.success('Order placed successfully!', `Order #${order.id}`)
      router.push(`/orders/${order.id}`)
    } catch (error) {
      toast.error('Failed to place order', 'Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </div>
  )
}
```

### Example 2: Menu Page with All Loading States

```typescript
// app/menu/page.tsx
import { Suspense } from 'react'
import { MenuGrid } from '@/components/menu/menu-grid'
import { MenuGridSkeleton } from '@/components/menu/menu-grid-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'
import { CategoryFilter } from '@/components/menu/category-filter'

export default function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
        <p className="text-muted-foreground">
          Discover our delicious Italian cuisine
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={<CategoryFilterSkeleton />}>
          <CategoryFilter />
        </Suspense>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<MenuGridSkeleton />}>
          <MenuGrid category={searchParams.category} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// components/menu/menu-grid.tsx
import { fetchMenuItems } from '@/lib/api'
import { MenuItem } from './menu-item'
import { EmptyState } from '@/components/ui/empty-state'
import { UtensilsCrossed } from 'lucide-react'

interface MenuGridProps {
  category?: string
}

export async function MenuGrid({ category }: MenuGridProps) {
  const items = await fetchMenuItems(category)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No items found"
        description={
          category
            ? `No items in the ${category} category`
            : 'No menu items available at this time'
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### Example 3: Order History with Loading and Empty States

```typescript
// app/orders/page.tsx
import { Suspense } from 'react'
import { OrderList } from '@/components/orders/order-list'
import { OrderListSkeleton } from '@/components/orders/order-list-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <ErrorBoundary>
        <Suspense fallback={<OrderListSkeleton />}>
          <OrderList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// components/orders/order-list.tsx
import { fetchOrders } from '@/lib/api'
import { OrderCard } from './order-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Package } from 'lucide-react'
import { redirect } from 'next/navigation'

export async function OrderList() {
  const orders = await fetchOrders()

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="You haven't placed any orders yet. Start by browsing our delicious menu"
        action={{
          label: 'Browse Menu',
          onClick: () => redirect('/menu'),
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

// components/orders/order-list-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}
```

## Acceptance Criteria

### Functional Requirements
- [ ] All pages have loading.tsx files with appropriate skeleton UIs
- [ ] All async operations show loading indicators
- [ ] All buttons disable and show loading state during operations
- [ ] Error boundaries catch and display errors gracefully
- [ ] Empty states shown when no data is available
- [ ] Users can retry failed operations
- [ ] Loading states don't cause layout shift

### Visual Requirements
- [ ] Skeleton components match final content layout
- [ ] Loading spinners are appropriately sized
- [ ] Transitions between loading and loaded states are smooth
- [ ] Loading states are consistent across the app
- [ ] Colors and styling match design system

### Accessibility Requirements
- [ ] Loading states announced to screen readers
- [ ] Error messages are clear and actionable
- [ ] Retry buttons are keyboard accessible
- [ ] Loading spinners have aria-label
- [ ] Disabled states are clearly indicated

### Performance Requirements
- [ ] Skeleton components render instantly (<50ms)
- [ ] No unnecessary re-renders during loading
- [ ] Proper cleanup of async operations
- [ ] No memory leaks from unmounted components

### User Experience Requirements
- [ ] Loading feedback appears within 100ms
- [ ] Loading states don't flash for quick operations (<300ms)
- [ ] Error messages help users recover
- [ ] Empty states guide users to next action
- [ ] Multiple operations don't block entire UI

## Testing Strategy

### Manual Testing Checklist
- [ ] Test all pages with slow network (Chrome DevTools throttling)
- [ ] Test error scenarios (network offline, API errors)
- [ ] Test empty states (no orders, no cart items, etc.)
- [ ] Test button loading states
- [ ] Test rapid clicking (double-submission prevention)
- [ ] Test keyboard navigation in error states
- [ ] Test screen reader announcements

### Automated Testing
```typescript
// Example test for loading states
describe('MenuGrid', () => {
  it('shows loading skeleton initially', () => {
    render(<MenuGrid />)
    expect(screen.getByTestId('menu-skeleton')).toBeInTheDocument()
  })

  it('shows menu items after loading', async () => {
    render(<MenuGrid />)
    await waitFor(() => {
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument()
    })
  })

  it('shows error state on failure', async () => {
    server.use(
      http.get('/api/menu', () => {
        return HttpResponse.error()
      })
    )

    render(<MenuGrid />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load menu')).toBeInTheDocument()
    })
  })

  it('shows empty state when no items', async () => {
    server.use(
      http.get('/api/menu', () => {
        return HttpResponse.json([])
      })
    )

    render(<MenuGrid />)
    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })
})
```

## Common Pitfalls

### 1. Loading States That Flash
**Problem**: Loading states appear and disappear too quickly, causing flashing

**Solution**: Add minimum display time
```typescript
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  const startTime = Date.now()

  try {
    await submitData()
  } finally {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, 300 - elapsed)
    await new Promise(resolve => setTimeout(resolve, remaining))
    setIsLoading(false)
  }
}
```

### 2. Layout Shift During Loading
**Problem**: Content jumps when loading state switches to loaded state

**Solution**: Make skeleton match final content dimensions
```typescript
// Bad - different heights
<Skeleton className="h-20" /> // Loading
<div className="h-48">Content</div> // Loaded

// Good - same heights
<Skeleton className="h-48" /> // Loading
<div className="h-48">Content</div> // Loaded
```

### 3. Not Handling Cleanup
**Problem**: State updates after component unmounts

**Solution**: Use cleanup in useEffect
```typescript
useEffect(() => {
  let cancelled = false

  fetchData().then(data => {
    if (!cancelled) {
      setData(data)
    }
  })

  return () => {
    cancelled = true
  }
}, [])
```

### 4. Generic Error Messages
**Problem**: "An error occurred" doesn't help users

**Solution**: Provide specific, actionable messages
```typescript
// Bad
toast.error('An error occurred')

// Good
if (error instanceof NetworkError) {
  toast.error('Connection lost', 'Please check your internet and try again')
} else if (error instanceof ValidationError) {
  toast.error('Invalid data', error.message)
} else {
  toast.error('Something went wrong', 'Please try again or contact support')
}
```

### 5. Not Disabling Buttons During Loading
**Problem**: Users can click multiple times, causing duplicate submissions

**Solution**: Disable buttons during loading
```typescript
<Button
  onClick={handleSubmit}
  disabled={isLoading}
  loading={isLoading}
>
  Submit
</Button>
```

## Related Tasks

### Dependencies
- **Task 7.1**: Toast notifications for error feedback

### Related Tasks
- **Task 7.3**: Accessibility enhancements for loading states
- **Task 7.4**: Animations for loading transitions
- **Task 7.5**: Performance optimization of loading states

## Resources

### Documentation
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

### Design Patterns
- [Skeleton UI Best Practices](https://www.nngroup.com/articles/skeleton-screens/)
- [Loading State Design](https://www.smashingmagazine.com/2016/12/best-practices-for-animated-progress-indicators/)

## Completion Checklist

- [ ] Skeleton components created for all major layouts
- [ ] loading.tsx files created for all dynamic pages
- [ ] error.tsx files created for all pages
- [ ] Root error boundary implemented
- [ ] Component error boundaries added where needed
- [ ] Button loading states implemented
- [ ] Empty states created and implemented
- [ ] useAsyncData hook created
- [ ] All async operations have loading states
- [ ] Error messages are clear and actionable
- [ ] Retry mechanisms implemented
- [ ] Loading states tested on slow network
- [ ] Error scenarios tested
- [ ] Screen reader testing completed
- [ ] Code review completed
- [ ] Documentation updated

## Next Steps

After completing this task:
1. Move to Task 7.3 (Accessibility Enhancements)
2. Add ARIA live regions for loading announcements
3. Test all loading states with screen readers
4. Optimize skeleton loading performance
5. Add analytics for error tracking
