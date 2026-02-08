# Task 7.4: Add Animations

## Task Metadata
- **Task ID**: 7.4
- **Phase**: 7 - Polish & UX Enhancements
- **Estimated Time**: 2-3 hours
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Task 7.2 (Loading States), Task 7.3 (Accessibility)
- **Assigned To**: Frontend Developer
- **Status**: Not Started

## Overview

Implement smooth, purposeful animations and transitions throughout the Bella Cucina web app to enhance user experience and provide visual feedback. Animations should feel natural, improve perceived performance, and respect user preferences (prefers-reduced-motion). This task focuses on micro-interactions, page transitions, and subtle effects that make the app feel polished and responsive.

## Importance

### User Experience Benefits
1. **Visual Feedback**: Animations confirm user actions and state changes
2. **Perceived Performance**: Well-timed animations make the app feel faster
3. **Attention Direction**: Guide user focus to important changes
4. **Professional Polish**: Smooth animations elevate the overall experience
5. **Delightful Interactions**: Thoughtful micro-interactions create joy

### Business Impact
- Increases user engagement and time on site
- Improves perceived quality and professionalism
- Reduces cognitive load through visual continuity
- Differentiates from competitors
- Increases conversion rates through better UX

### Technical Benefits
- Improves state transition clarity
- Provides visual continuity between states
- Enhances component feedback
- Creates consistent motion language
- Supports progressive enhancement

## Prerequisites

### Completed Requirements
- Task 7.2 (Loading States) must be complete
- Task 7.3 (Accessibility) must be complete
- All UI components implemented

### Technical Knowledge Required
- CSS transitions and animations
- CSS transforms
- Framer Motion API (optional)
- React animation patterns
- Performance considerations
- Accessibility (prefers-reduced-motion)

### Library Options

**Option 1: CSS Transitions + Tailwind** (Recommended)
- Lightweight, no dependencies
- Excellent performance
- Built into Tailwind
- Simple animations

**Option 2: Framer Motion**
```bash
npm install framer-motion
```
- More powerful animations
- React-first API
- Advanced features (gestures, drag, etc.)
- Larger bundle size (~60kb)

## Technical Specifications

### Animation Principles

1. **Duration**
   - Fast: 150-200ms (button hover, small UI changes)
   - Medium: 200-300ms (dropdown menus, tooltips)
   - Slow: 300-500ms (page transitions, modals)
   - Never exceed 500ms

2. **Easing**
   - `ease-out`: Elements entering the screen
   - `ease-in`: Elements leaving the screen
   - `ease-in-out`: Elements moving on screen
   - Avoid `linear` except for continuous animations

3. **Properties to Animate**
   - Safe (60fps): `transform`, `opacity`
   - Avoid: `width`, `height`, `left`, `top` (causes reflow)

4. **Respect User Preferences**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

### Animation Types to Implement

1. **Page Transitions** - Fade in on route change
2. **Modal Animations** - Scale + fade entrance/exit
3. **Cart Animations** - Slide in from side, item additions
4. **Button Interactions** - Hover, active, loading states
5. **Dropdown Menus** - Slide down with fade
6. **Toast Notifications** - Slide in from bottom/top
7. **Card Hover Effects** - Subtle lift and shadow
8. **Loading Animations** - Skeleton shimmer, spinners
9. **Image Loading** - Fade in when loaded
10. **Form Feedback** - Shake on error, checkmark on success

## Implementation Guide

### Step 1: Configure Tailwind Animation (20 minutes)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',

        // Slide animations
        'slide-in-from-right': 'slideInFromRight 300ms ease-out',
        'slide-in-from-left': 'slideInFromLeft 300ms ease-out',
        'slide-in-from-top': 'slideInFromTop 200ms ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 200ms ease-out',

        // Scale animations
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 150ms ease-in',

        // Shake animation for errors
        'shake': 'shake 400ms ease-in-out',

        // Shimmer for loading
        'shimmer': 'shimmer 2s infinite',

        // Bounce for cart additions
        'bounce-in': 'bounceIn 500ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
}
```

Add prefers-reduced-motion support:

```css
/* app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Step 2: Add Page Transition Animations (20 minutes)

```typescript
// components/page-transition.tsx
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Or with CSS only (simpler)
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  )
}
```

### Step 3: Implement Card Hover Animations (15 minutes)

```typescript
// components/menu/menu-item.tsx
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function MenuItem({ item }: { item: MenuItem }) {
  return (
    <article className="group border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Optional: Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 transition-colors duration-200 group-hover:text-primary">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${item.price}</span>
          <Button className="transition-transform duration-200 active:scale-95">
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  )
}
```

### Step 4: Add Modal Entrance/Exit Animations (25 minutes)

```typescript
// components/ui/dialog.tsx (with animations)
'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFocusTrap } from '@/hooks/use-focus-trap'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useFocusTrap(open)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with fade */}
      <div
        className="fixed inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog with scale + fade */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative z-50 bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 animate-scale-in"
      >
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 transition-colors hover:bg-destructive/10"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 id="dialog-title" className="text-2xl font-bold mb-4">
          {title}
        </h2>

        <div>{children}</div>
      </div>
    </div>
  )
}

// With Framer Motion (more control)
import { motion, AnimatePresence } from 'framer-motion'

export function DialogWithMotion({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useFocusTrap(open)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="relative z-50 bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
          >
            {/* Content */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
```

### Step 5: Implement Cart Animations (30 minutes)

```typescript
// components/cart/cart-sidebar.tsx
'use client'

import { useCart } from '@/hooks/use-cart'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartItem } from './cart-item'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-slide-in-from-right"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Your cart is empty
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CartItem item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full transition-transform active:scale-95"
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </div>
      </aside>
    </>
  )
}

// components/cart/cart-item.tsx with animations
export function CartItem({ item }: { item: CartItem }) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    // Animate out before removing
    await new Promise(resolve => setTimeout(resolve, 200))
    await removeItem(item.id)
  }

  return (
    <div
      className={`flex gap-4 p-4 border rounded-lg transition-all duration-200 ${
        isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Item content */}
    </div>
  )
}
```

### Step 6: Add Button Micro-interactions (15 minutes)

```typescript
// components/ui/button.tsx (enhanced with animations)
import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Hover and active animations
          'hover:scale-105 active:scale-95',

          // Variant styles
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          variant === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          variant === 'link' && 'underline-offset-4 hover:underline',

          // Size styles
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-md px-3',
          size === 'lg' && 'h-11 rounded-md px-8',
          size === 'icon' && 'h-10 w-10',

          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

### Step 7: Add Form Feedback Animations (20 minutes)

```typescript
// components/checkout/checkout-form.tsx with animations
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function CheckoutForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)

    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      // Trigger shake animation
      return
    }

    // Submit form
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={hasSubmitted && Object.keys(errors).length > 0 ? 'animate-shake' : ''}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className={cn(
              'transition-all duration-200',
              errors.email
                ? 'border-destructive focus-visible:ring-destructive'
                : 'focus-visible:scale-105'
            )}
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1 animate-slide-in-from-top">
              {errors.email}
            </p>
          )}
        </div>

        {/* More fields... */}

        <Button type="submit" className="w-full">
          Place Order
        </Button>
      </div>
    </form>
  )
}

// Success checkmark animation
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function SuccessCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full"
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Check className="w-8 h-8 text-white" />
      </motion.div>
    </motion.div>
  )
}
```

### Step 8: Add Loading Shimmer Effect (15 minutes)

```typescript
// components/ui/skeleton.tsx (enhanced with shimmer)
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted',
        shimmer && 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

// Add shimmer gradient to globals.css if not using Tailwind animations
.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

## Code Examples

### Example 1: Staggered List Animation

```typescript
// components/menu/menu-grid.tsx
'use client'

import { motion } from 'framer-motion'
import { MenuItem } from './menu-item'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function MenuGrid({ items }: { items: MenuItem[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((menuItem) => (
        <motion.div key={menuItem.id} variants={item}>
          <MenuItem item={menuItem} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### Example 2: Number Counter Animation

```typescript
// components/cart/cart-total.tsx
'use client'

import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

export function CartTotal({ total }: { total: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(displayValue, total, {
      duration: 0.5,
      onUpdate: (value) => setDisplayValue(value)
    })

    return controls.stop
  }, [total])

  return (
    <div className="text-2xl font-bold">
      ${displayValue.toFixed(2)}
    </div>
  )
}
```

### Example 3: Notification Badge Pulse

```typescript
// components/cart/cart-badge.tsx
'use client'

import { useEffect, useState } from 'react'

export function CartBadge({ count }: { count: number }) {
  const [shouldPulse, setShouldPulse] = useState(false)

  useEffect(() => {
    if (count > 0) {
      setShouldPulse(true)
      const timer = setTimeout(() => setShouldPulse(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [count])

  if (count === 0) return null

  return (
    <span
      className={cn(
        'absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center',
        shouldPulse && 'animate-bounce-in'
      )}
    >
      {count}
    </span>
  )
}
```

## Acceptance Criteria

### Visual Quality
- [ ] All animations are smooth (60fps)
- [ ] No jank or stuttering
- [ ] Animations feel natural and purposeful
- [ ] Timing is consistent across the app
- [ ] Easing curves are appropriate

### User Experience
- [ ] Animations provide clear feedback
- [ ] Animations don't slow down the app
- [ ] Quick actions don't feel sluggish
- [ ] Loading states are animated
- [ ] Micro-interactions feel responsive

### Accessibility
- [ ] prefers-reduced-motion respected
- [ ] Animations don't cause disorientation
- [ ] No flashing content
- [ ] Focus indicators animated smoothly
- [ ] Screen readers not affected by animations

### Performance
- [ ] Animations use transform and opacity only
- [ ] No layout thrashing
- [ ] GPU-accelerated where possible
- [ ] No memory leaks from animations
- [ ] Animations clean up properly

### Technical
- [ ] Animation classes reusable
- [ ] Consistent animation timing
- [ ] No animation conflicts
- [ ] Exit animations work properly
- [ ] Animation utility functions created

## Testing Strategy

### Visual Testing
1. Test all animations in slow motion (Chrome DevTools)
2. Verify smooth 60fps playback
3. Check animations on different screen sizes
4. Test with slow network (loading animations)
5. Verify exit animations work

### Accessibility Testing
1. Enable prefers-reduced-motion
2. Verify animations are disabled/instant
3. Test with screen reader enabled
4. Check focus indicator animations

### Performance Testing
1. Record performance timeline
2. Check for layout reflows
3. Monitor memory usage
4. Test on low-end devices
5. Verify GPU acceleration

## Common Pitfalls

### 1. Animating Width/Height
**Problem**: Causes layout reflow, janky performance

**Solution**: Use transform: scale() instead
```typescript
// Bad
<div className="transition-all hover:w-96" />

// Good
<div className="transition-transform hover:scale-110" />
```

### 2. Too Many Simultaneous Animations
**Problem**: Overwhelms users, poor performance

**Solution**: Stagger animations
```typescript
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in"
    style={{ animationDelay: `${i * 50}ms` }}
  >
    {item.name}
  </div>
))}
```

### 3. Animations Too Slow
**Problem**: App feels sluggish

**Solution**: Keep animations under 300ms
```typescript
// Bad
<div className="transition-all duration-1000" />

// Good
<div className="transition-all duration-200" />
```

### 4. Not Respecting prefers-reduced-motion
**Problem**: Accessibility violation

**Solution**: Always add media query
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Forgetting Exit Animations
**Problem**: Elements disappear abruptly

**Solution**: Use AnimatePresence or CSS
```typescript
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

## Related Tasks

### Dependencies
- **Task 7.2**: Loading states need loading animations
- **Task 7.3**: Animations must be accessible

### Related Tasks
- **Task 7.5**: Performance optimization includes animation performance

## Resources

### Documentation
- [Framer Motion Docs](https://www.framer.com/motion/)
- [CSS Transitions MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

### Inspiration
- [Stripe Animations](https://stripe.com)
- [Linear Motion Design](https://linear.app)
- [Vercel Animations](https://vercel.com)

### Tools
- [Cubic Bezier Generator](https://cubic-bezier.com/)
- [Easings.net](https://easings.net/)
- [Animista](https://animista.net/)

## Completion Checklist

- [ ] Tailwind animation config updated
- [ ] prefers-reduced-motion support added
- [ ] Page transitions implemented
- [ ] Card hover effects added
- [ ] Modal animations implemented
- [ ] Cart animations added
- [ ] Button micro-interactions enhanced
- [ ] Form feedback animations added
- [ ] Loading shimmer effect implemented
- [ ] Toast notification animations configured
- [ ] All animations tested at 60fps
- [ ] Accessibility testing completed
- [ ] Performance testing completed
- [ ] Code review completed
- [ ] Documentation updated

## Next Steps

After completing this task:
1. Move to Task 7.5 (Performance Optimization)
2. Optimize animation performance if needed
3. Gather user feedback on animation speed
4. Consider A/B testing animation styles
5. Document animation patterns for team
