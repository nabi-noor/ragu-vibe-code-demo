# Task 7.3: Enhance Accessibility

## Task Metadata
- **Task ID**: 7.3
- **Phase**: 7 - Polish & UX Enhancements
- **Estimated Time**: 4-5 hours
- **Priority**: High
- **Complexity**: Medium-High
- **Dependencies**: Task 7.2 (Loading States)
- **Assigned To**: Frontend Developer
- **Status**: Not Started

## Overview

Implement comprehensive accessibility enhancements to achieve WCAG 2.1 AA compliance for the Bella Cucina web app. This includes proper ARIA labels, keyboard navigation, focus management, screen reader optimization, color contrast compliance, and accessible form validation. Accessibility is not optional - it's a legal requirement and fundamental to inclusive design.

## Importance

### User Experience Benefits
1. **Inclusive Access**: Makes the app usable for people with disabilities
2. **Better for Everyone**: Accessibility improvements benefit all users
3. **Keyboard Power Users**: Efficient navigation for keyboard-only users
4. **Better Mobile Experience**: Touch targets and gestures work better
5. **Voice Control**: Compatible with voice navigation tools

### Business Impact
- **Legal Compliance**: Meets ADA and WCAG 2.1 AA requirements
- **Larger Audience**: 15% of the world's population has some form of disability
- **SEO Benefits**: Better semantic HTML improves search rankings
- **Brand Reputation**: Shows commitment to inclusivity
- **Reduced Risk**: Avoids accessibility lawsuits

### Technical Benefits
- Better semantic HTML structure
- Improved code maintainability
- Better testing capability
- Clearer component interfaces
- Enhanced documentation

## Prerequisites

### Completed Requirements
- Task 7.2 (Loading States) must be complete
- All UI components implemented
- All user flows functional

### Technical Knowledge Required
- WCAG 2.1 AA guidelines
- ARIA attributes and roles
- Keyboard event handling
- Focus management
- Screen reader testing
- Semantic HTML

### Tools to Install
```bash
# Development tools
npm install -D @axe-core/react
npm install -D eslint-plugin-jsx-a11y

# Testing tools (optional)
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
```

## Technical Specifications

### WCAG 2.1 Level AA Requirements

#### 1. Perceivable
- **Text Alternatives**: All images have alt text
- **Captions**: Video/audio has captions (if applicable)
- **Adaptable**: Content can be presented in different ways
- **Distinguishable**: Minimum 4.5:1 color contrast for text

#### 2. Operable
- **Keyboard Accessible**: All functionality available via keyboard
- **Enough Time**: Users have adequate time to interact
- **Seizures**: No flashing content
- **Navigable**: Clear navigation and focus indicators

#### 3. Understandable
- **Readable**: Clear, simple language
- **Predictable**: Consistent navigation and behavior
- **Input Assistance**: Clear error messages and labels

#### 4. Robust
- **Compatible**: Works with assistive technologies
- **Valid HTML**: Proper semantic markup
- **ARIA**: Correct ARIA roles and attributes

### Key Accessibility Features to Implement

1. **Keyboard Navigation**
   - Tab order is logical
   - Focus indicators are visible
   - Skip navigation links
   - Keyboard shortcuts documented

2. **Screen Reader Support**
   - ARIA labels and descriptions
   - Live regions for dynamic content
   - Proper heading hierarchy
   - Landmark regions

3. **Visual Accessibility**
   - Minimum 4.5:1 color contrast
   - Focus indicators visible
   - No color-only information
   - Sufficient touch target size (44x44px minimum)

4. **Forms**
   - Labels associated with inputs
   - Error messages linked to fields
   - Required fields indicated
   - Autocomplete attributes

## Implementation Guide

### Step 1: Configure Accessibility Linting (30 minutes)

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
  },
}

// Install and configure axe in development
// app/layout.tsx
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}
```

### Step 2: Add Skip Navigation Link (20 minutes)

```typescript
// components/skip-nav.tsx
import Link from 'next/link'

export function SkipNav() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      Skip to main content
    </Link>
  )
}

// app/layout.tsx
import { SkipNav } from '@/components/skip-nav'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SkipNav />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

// Add to globals.css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Step 3: Implement Proper Focus Management (45 minutes)

```typescript
// hooks/use-focus-trap.ts
import { useEffect, useRef } from 'react'

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement

    // Focus first element
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      // Restore focus when trap is deactivated
      previouslyFocused?.focus()
    }
  }, [isActive])

  return containerRef
}

// Usage in modal
import { useFocusTrap } from '@/hooks/use-focus-trap'

export function Modal({ isOpen, onClose, children }) {
  const modalRef = useFocusTrap(isOpen)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
```

### Step 4: Add Comprehensive ARIA Labels (60 minutes)

```typescript
// components/menu/menu-item.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'

interface MenuItemProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number) => void
}

export function MenuItem({ item, onAddToCart }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    setIsAdding(true)
    await onAddToCart(item, quantity)
    setIsAdding(false)
  }

  return (
    <article
      className="border rounded-lg overflow-hidden"
      aria-labelledby={`item-${item.id}-name`}
    >
      <Image
        src={item.image}
        alt={`${item.name} - ${item.description}`}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 id={`item-${item.id}-name`} className="text-xl font-semibold mb-2">
          {item.name}
        </h3>

        <p className="text-muted-foreground text-sm mb-4">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold" aria-label={`Price: ${item.price} dollars`}>
            ${item.price}
          </span>

          {item.dietary && (
            <div className="flex gap-2" aria-label="Dietary information">
              {item.dietary.includes('vegetarian') && (
                <span
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                  aria-label="Vegetarian"
                >
                  V
                </span>
              )}
              {item.dietary.includes('gluten-free') && (
                <span
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  aria-label="Gluten free"
                >
                  GF
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center border rounded-md"
            role="group"
            aria-label={`Quantity selector for ${item.name}`}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity === 1 || isAdding}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </Button>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center border-x"
              aria-label={`Quantity of ${item.name}`}
              min="1"
            />

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isAdding}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <Button
            className="flex-1"
            onClick={handleAdd}
            disabled={isAdding}
            loading={isAdding}
            aria-label={`Add ${quantity} ${item.name} to cart`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  )
}
```

### Step 5: Implement Accessible Forms (60 minutes)

```typescript
// components/checkout/checkout-form.tsx
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CheckoutForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      // Announce errors to screen readers
      const errorCount = Object.keys(errors).length
      const announcement = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please correct and resubmit.`
      announceToScreenReader(announcement)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Checkout form">
      {/* Error summary for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 mb-6"
        >
          <h2 className="font-semibold mb-2">Please correct the following errors:</h2>
          <ul className="list-disc list-inside">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="underline">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            Full Name <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <p id="name-error" className="text-destructive text-sm mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="text-destructive text-sm mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            autoComplete="tel"
          />
          {errors.phone && (
            <p id="phone-error" className="text-destructive text-sm mt-1" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="address">
            Delivery Address <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
            autoComplete="street-address"
          />
          {errors.address && (
            <p id="address-error" className="text-destructive text-sm mt-1" role="alert">
              {errors.address}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        loading={isSubmitting}
        aria-label={isSubmitting ? 'Processing order' : 'Place order'}
      >
        Place Order
      </Button>
    </form>
  )
}

// Utility for screen reader announcements
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
```

### Step 6: Add Live Regions for Dynamic Content (30 minutes)

```typescript
// components/cart/cart-count.tsx
'use client'

import { useCart } from '@/hooks/use-cart'
import { ShoppingCart } from 'lucide-react'

export function CartCount() {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" aria-hidden="true" />
      {itemCount > 0 && (
        <>
          <span
            className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
            aria-hidden="true"
          >
            {itemCount}
          </span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
          </span>
        </>
      )}
    </div>
  )
}

// components/ui/live-region.tsx
'use client'

import { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  role?: 'status' | 'alert'
  politeness?: 'polite' | 'assertive'
}

export function LiveRegion({ message, role = 'status', politeness = 'polite' }: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (regionRef.current && message) {
      // Clear and re-add message to ensure announcement
      const temp = message
      regionRef.current.textContent = ''
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = temp
        }
      }, 100)
    }
  }, [message])

  return (
    <div
      ref={regionRef}
      role={role}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    />
  )
}
```

### Step 7: Ensure Color Contrast Compliance (30 minutes)

```typescript
// Check color contrast with online tools or browser extensions
// Update colors in tailwind.config.js if needed

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Ensure all colors meet WCAG AA standards
        primary: {
          DEFAULT: '#dc2626', // 4.64:1 on white
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#16a34a', // 4.76:1 on white
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#374151', // 9.73:1 contrast
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
      },
    },
  },
}

// Add focus visible styles
// app/globals.css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Ensure sufficient touch target sizes on mobile */
@media (max-width: 768px) {
  button,
  a,
  input[type='checkbox'],
  input[type='radio'] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

## Code Examples

### Example 1: Accessible Navigation

```typescript
// components/header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="border-b" role="banner">
      <nav
        className="container mx-auto flex items-center justify-between py-4"
        aria-label="Main navigation"
      >
        <Link href="/" className="text-2xl font-bold">
          <span aria-label="Bella Cucina - Home">Bella Cucina</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6" role="menubar">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href} role="none">
                <Link
                  href={link.href}
                  className={`hover:text-primary transition-colors ${
                    isActive ? 'text-primary font-semibold' : ''
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  role="menuitem"
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="absolute top-16 left-0 right-0 bg-white border-b md:hidden"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <ul className="container mx-auto py-4 space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block py-2 px-4 rounded hover:bg-accent ${
                        isActive ? 'bg-accent font-semibold' : ''
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
```

### Example 2: Accessible Data Table

```typescript
// components/admin/orders-table.tsx
interface Order {
  id: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table" aria-label="Orders table">
        <caption className="sr-only">
          List of customer orders with details
        </caption>

        <thead>
          <tr>
            <th scope="col" className="text-left p-4 font-semibold">
              Order ID
            </th>
            <th scope="col" className="text-left p-4 font-semibold">
              Customer
            </th>
            <th scope="col" className="text-right p-4 font-semibold">
              Total
            </th>
            <th scope="col" className="text-left p-4 font-semibold">
              Status
            </th>
            <th scope="col" className="text-left p-4 font-semibold">
              Date
            </th>
            <th scope="col" className="text-center p-4 font-semibold">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-4">
                <code aria-label={`Order ID ${order.id}`}>#{order.id}</code>
              </td>
              <td className="p-4">{order.customerName}</td>
              <td className="p-4 text-right">
                <span aria-label={`Total ${order.total} dollars`}>
                  ${order.total.toFixed(2)}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                  aria-label={`Status: ${order.status}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-4">
                <time dateTime={order.createdAt}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </time>
              </td>
              <td className="p-4 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`View details for order ${order.id}`}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-center py-8 text-muted-foreground" role="status">
          No orders found
        </p>
      )}
    </div>
  )
}
```

### Example 3: Accessible Modal Dialog

```typescript
// components/ui/dialog.tsx
'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFocusTrap } from '@/hooks/use-focus-trap'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const dialogRef = useFocusTrap(open)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-description' : undefined}
        className="relative z-50 bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
      >
        {/* Close button */}
        <Button
          ref={closeButtonRef}
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Title */}
        <h2 id="dialog-title" className="text-2xl font-bold mb-2">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p id="dialog-description" className="text-muted-foreground mb-4">
            {description}
          </p>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
```

## Acceptance Criteria

### Keyboard Navigation
- [ ] All interactive elements accessible via Tab key
- [ ] Logical tab order throughout application
- [ ] Focus indicators visible on all elements
- [ ] Escape key closes modals and dropdowns
- [ ] Enter/Space activate buttons
- [ ] Arrow keys navigate within component groups
- [ ] Skip navigation link functional

### Screen Reader Support
- [ ] All images have descriptive alt text
- [ ] ARIA labels on all interactive elements
- [ ] Form errors announced to screen readers
- [ ] Dynamic content changes announced
- [ ] Proper heading hierarchy (h1, h2, h3, etc.)
- [ ] Landmark regions defined (header, nav, main, footer)
- [ ] Loading states announced

### Visual Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Focus indicators visible (not just browser default)
- [ ] Touch targets minimum 44x44px on mobile
- [ ] No information conveyed by color alone
- [ ] Text can be resized to 200% without loss of functionality

### Form Accessibility
- [ ] All inputs have associated labels
- [ ] Required fields clearly indicated
- [ ] Error messages linked to fields (aria-describedby)
- [ ] Autocomplete attributes present
- [ ] Error summary at top of form
- [ ] Validation errors clear and actionable

### Testing
- [ ] Passes axe DevTools with 0 violations
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (VoiceOver/NVDA/JAWS)
- [ ] Passes WAVE evaluation
- [ ] Lighthouse accessibility score 100

## Testing Strategy

### Automated Testing
```bash
# Run axe accessibility tests
npm run test:a11y

# Run ESLint with jsx-a11y
npm run lint

# Run Lighthouse CI
npm run lighthouse
```

### Manual Testing Checklist

#### Keyboard Navigation Test
1. [ ] Unplug mouse
2. [ ] Navigate entire site using only keyboard
3. [ ] Verify tab order is logical
4. [ ] Verify focus indicators are visible
5. [ ] Verify all actions can be completed

#### Screen Reader Test
1. [ ] Test with VoiceOver (Mac) or NVDA (Windows)
2. [ ] Navigate by headings (H key)
3. [ ] Navigate by landmarks (D key)
4. [ ] Verify all images are announced
5. [ ] Verify form errors are announced
6. [ ] Verify loading states are announced

#### Color Contrast Test
1. [ ] Use WebAIM Contrast Checker
2. [ ] Verify all text meets 4.5:1 ratio
3. [ ] Verify focus indicators meet 3:1 ratio
4. [ ] Test with color blindness simulator

#### Touch Target Test
1. [ ] Test on mobile device
2. [ ] Verify all buttons are easy to tap
3. [ ] Verify no accidental clicks

## Common Pitfalls

### 1. Missing Alt Text
**Problem**: Images without alt attributes

**Solution**: All images need alt text
```typescript
// Bad
<img src="/pizza.jpg" />

// Good
<Image src="/pizza.jpg" alt="Margherita pizza with fresh basil and mozzarella" />

// Decorative images
<Image src="/background.jpg" alt="" /> // Empty alt for decorative
```

### 2. Poor Focus Indicators
**Problem**: Default browser focus indicators are hard to see

**Solution**: Custom, visible focus styles
```css
*:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}
```

### 3. Div Buttons
**Problem**: Using divs with onClick instead of buttons

**Solution**: Use semantic button elements
```typescript
// Bad
<div onClick={handleClick}>Click me</div>

// Good
<button onClick={handleClick}>Click me</button>
```

### 4. Missing Form Labels
**Problem**: Inputs without labels

**Solution**: Always associate labels with inputs
```typescript
// Bad
<input type="text" placeholder="Name" />

// Good
<Label htmlFor="name">Name</Label>
<Input id="name" />
```

### 5. Not Managing Focus
**Problem**: Focus lost after modal closes

**Solution**: Return focus to trigger element
```typescript
const previousFocus = document.activeElement
// ... modal logic
previousFocus?.focus() // Return focus
```

## Related Tasks

### Dependencies
- **Task 7.2**: Loading states need accessibility features

### Related Tasks
- **Task 7.4**: Animations must respect prefers-reduced-motion
- **Task 7.5**: Performance improvements benefit users with slow connections
- **Task 7.7**: Mobile testing includes touch accessibility

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Learning Resources
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

## Completion Checklist

- [ ] ESLint jsx-a11y plugin configured
- [ ] axe-core integrated in development
- [ ] Skip navigation link added
- [ ] Focus trap implemented for modals
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] ARIA labels added throughout
- [ ] Live regions implemented
- [ ] Color contrast verified
- [ ] Focus styles enhanced
- [ ] Keyboard navigation tested
- [ ] Screen reader testing completed
- [ ] axe DevTools shows 0 violations
- [ ] Lighthouse accessibility score 100
- [ ] Documentation updated
- [ ] Code review completed

## Next Steps

After completing this task:
1. Move to Task 7.4 (Animations)
2. Ensure animations respect prefers-reduced-motion
3. Document accessibility features for team
4. Train team on accessibility best practices
5. Set up automated accessibility testing in CI/CD
