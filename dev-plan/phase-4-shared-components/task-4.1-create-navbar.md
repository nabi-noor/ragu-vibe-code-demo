# Task 4.1: Create Navbar Component

## Task Metadata

- **Task ID**: 4.1
- **Phase**: 4 - Shared Components
- **Complexity**: Medium
- **Estimated Time**: 2-3 hours
- **Priority**: High
- **Dependencies**: Phase 1 (Setup), Phase 3 (Cart Context)
- **Component Type**: Client Component (uses hooks and interactivity)

## Overview

The Navbar component is a critical piece of the application that provides primary navigation across all pages. It serves as the main wayfinding tool for users and displays important real-time information like the cart item count. This component must be responsive, accessible, and performant.

### Importance

- **Navigation Hub**: Primary method for users to move between pages
- **Brand Presence**: Displays restaurant name/logo prominently
- **Cart Awareness**: Shows real-time cart status encouraging conversions
- **Mobile Experience**: Responsive hamburger menu for mobile devices
- **Consistency**: Present on every page providing familiar navigation

### User Experience Goals

1. **Instant Feedback**: Cart count updates immediately when items are added
2. **Clear Wayfinding**: Active page is visually distinguished
3. **Mobile-Friendly**: Easy-to-use hamburger menu on small screens
4. **Accessibility**: Full keyboard navigation and screen reader support
5. **Performance**: Smooth animations and no layout shifts

## Prerequisites

### Required Completions

- ✅ Phase 1 completed (Next.js 15, TypeScript, Tailwind CSS setup)
- ✅ Phase 3 completed (CartContext and cart functionality)
- ✅ `app/context/CartContext.tsx` exists and exports useCart hook
- ✅ lucide-react package installed

### Required Knowledge

- React hooks (useState, useEffect, useContext)
- Next.js Link component and usePathname hook
- Tailwind CSS responsive utilities
- TypeScript interfaces
- ARIA attributes for accessibility

### Verify Prerequisites

```bash
# Check if CartContext exists
ls -la app/context/CartContext.tsx

# Check if lucide-react is installed
grep "lucide-react" package.json

# Run development server
npm run dev
```

## Technical Specifications

### Component Architecture

```
Navbar (Client Component)
├── Desktop Navigation
│   ├── Brand/Logo
│   ├── Navigation Links
│   └── Cart Button with Badge
└── Mobile Navigation
    ├── Brand/Logo
    ├── Hamburger Toggle Button
    └── Mobile Menu (conditional)
        ├── Navigation Links
        └── Cart Button with Badge
```

### State Management

```typescript
// Local state
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

// Context state
const { items } = useCart() // From CartContext

// Derived state
const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

// Router state
const pathname = usePathname() // From next/navigation
```

### Responsive Behavior

- **Mobile (< 768px)**: Hamburger menu, vertical menu stack
- **Tablet/Desktop (>= 768px)**: Horizontal menu bar, no hamburger

### Styling Theme

- **Background**: White with subtle shadow
- **Active Link**: Amber-600 color and underline
- **Hover States**: Amber-600 color transition
- **Cart Badge**: Orange-500 background with white text
- **Mobile Menu**: Full-width overlay with smooth slide animation

## Component Interface

### Props

The Navbar component doesn't accept props as it's a self-contained layout component.

```typescript
// No props interface needed
export default function Navbar() {
  // Component implementation
}
```

### Internal Interfaces

```typescript
interface NavLink {
  href: string;
  label: string;
  ariaLabel?: string;
}

// Navigation structure
const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/orders', label: 'Orders' },
  { href: '/admin', label: 'Admin', ariaLabel: 'Admin Dashboard' },
]
```

## Files to Create/Modify

### Create New File

```
app/components/Navbar.tsx
```

### Modify Existing Files

```
app/layout.tsx (integrate Navbar into layout)
```

## Step-by-Step Implementation

### Step 1: Create Component File

Create `app/components/Navbar.tsx`:

```bash
touch app/components/Navbar.tsx
```

### Step 2: Import Dependencies

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
```

**Explanation**:
- `'use client'`: Required for hooks and interactivity
- `Link`: Next.js optimized navigation
- `usePathname`: Get current route for active link highlighting
- `Menu, X, ShoppingCart`: Icons from lucide-react
- `useState`: Manage mobile menu toggle state
- `useCart`: Access cart items for count badge

### Step 3: Define Navigation Links

```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/orders', label: 'Orders' },
  { href: '/admin', label: 'Admin' },
]
```

### Step 4: Implement Main Component Structure

```typescript
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const pathname = usePathname()

  // Calculate total items in cart
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Component JSX here */}
    </nav>
  )
}
```

**Explanation**:
- `sticky top-0 z-50`: Navbar stays at top when scrolling
- `isActiveLink`: Helper function to determine active route
- `closeMobileMenu`: Called when navigation occurs
- `totalItems`: Sum of all item quantities in cart

### Step 5: Implement Desktop Navigation

```typescript
<nav className="bg-white shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">

      {/* Brand/Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-amber-600 hover:text-amber-700 transition-colors"
      >
        Bella Cucina
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-base font-medium transition-colors relative ${
              isActiveLink(link.href)
                ? 'text-amber-600'
                : 'text-gray-700 hover:text-amber-600'
            }`}
            onClick={closeMobileMenu}
          >
            {link.label}
            {/* Active indicator underline */}
            {isActiveLink(link.href) && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-600" />
            )}
          </Link>
        ))}

        {/* Cart Button */}
        <Link
          href="/cart"
          className={`relative p-2 rounded-lg transition-colors ${
            pathname === '/cart'
              ? 'text-amber-600 bg-amber-50'
              : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
          }`}
          aria-label={`Shopping cart with ${totalItems} items`}
        >
          <ShoppingCart className="w-6 h-6" />
          {/* Cart Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

    </div>
  </div>

  {/* Mobile Navigation Menu */}
  {/* Implementation in next step */}
</nav>
```

**Key Features**:
- **Responsive Classes**: `hidden md:flex` hides desktop nav on mobile
- **Active State**: Conditional classes based on `isActiveLink()`
- **Cart Badge**: Shows count with 9+ limit for space
- **Accessibility**: aria-label for screen readers
- **Smooth Transitions**: Hover effects with transition-colors

### Step 6: Implement Mobile Navigation Menu

```typescript
{/* Mobile Navigation Menu */}
{isMobileMenuOpen && (
  <div className="md:hidden border-t border-gray-200 bg-white">
    <div className="px-4 py-4 space-y-3">
      {/* Mobile Navigation Links */}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
            isActiveLink(link.href)
              ? 'text-amber-600 bg-amber-50'
              : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
          }`}
          onClick={closeMobileMenu}
        >
          {link.label}
        </Link>
      ))}

      {/* Mobile Cart Link */}
      <Link
        href="/cart"
        className={`flex items-center justify-between px-4 py-2 rounded-lg text-base font-medium transition-colors ${
          pathname === '/cart'
            ? 'text-amber-600 bg-amber-50'
            : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
        }`}
        onClick={closeMobileMenu}
      >
        <span className="flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
        </span>
        {totalItems > 0 && (
          <span className="bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </Link>
    </div>
  </div>
)}
```

**Key Features**:
- **Conditional Rendering**: Only shows when `isMobileMenuOpen` is true
- **Auto-Close**: Calls `closeMobileMenu` on navigation
- **Vertical Stack**: `space-y-3` for vertical spacing
- **Full-Width Links**: Better touch targets for mobile
- **Cart Indicator**: Badge shows item count

### Step 7: Add Smooth Animation (Optional Enhancement)

For a more polished mobile menu, add slide-in animation:

```typescript
{/* Mobile Navigation Menu with Animation */}
<div
  className={`md:hidden border-t border-gray-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
  }`}
>
  <div className="px-4 py-4 space-y-3">
    {/* Links here */}
  </div>
</div>
```

**Explanation**:
- `transition-all duration-300`: Smooth 300ms transition
- `max-h-96` / `max-h-0`: Height animation
- `opacity-100` / `opacity-0`: Fade effect

## Complete Component Code

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/orders', label: 'Orders' },
  { href: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const pathname = usePathname()

  // Calculate total items in cart
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Brand/Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            Bella Cucina
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors relative ${
                  isActiveLink(link.href)
                    ? 'text-amber-600'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
                onClick={closeMobileMenu}
              >
                {link.label}
                {/* Active indicator underline */}
                {isActiveLink(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-600" />
                )}
              </Link>
            ))}

            {/* Cart Button */}
            <Link
              href="/cart"
              className={`relative p-2 rounded-lg transition-colors ${
                pathname === '/cart'
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
              }`}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {/* Cart Badge */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActiveLink(link.href)
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                }`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Cart Link */}
            <Link
              href="/cart"
              className={`flex items-center justify-between px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                pathname === '/cart'
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
              }`}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart
              </span>
              {totalItems > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
```

## Integration with Layout

Update `app/layout.tsx` to include the Navbar:

```typescript
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
```

## Acceptance Criteria

### Functional Requirements

- ✅ Navbar displays on all pages
- ✅ Brand/logo links to home page
- ✅ All navigation links work correctly
- ✅ Active page is visually highlighted
- ✅ Cart icon shows correct item count
- ✅ Cart count updates when items are added/removed
- ✅ Mobile menu toggles open/closed
- ✅ Mobile menu closes when navigating
- ✅ Navbar is sticky at top of viewport

### Responsive Requirements

- ✅ Desktop nav shows horizontal menu (768px+)
- ✅ Mobile nav shows hamburger menu (<768px)
- ✅ Mobile menu is full-width and vertically stacked
- ✅ Touch targets are minimum 44x44px
- ✅ No horizontal scrolling on any screen size

### Accessibility Requirements

- ✅ All links have proper hover/focus states
- ✅ Cart button has descriptive aria-label
- ✅ Mobile menu button has aria-label and aria-expanded
- ✅ Keyboard navigation works (Tab, Enter)
- ✅ Screen reader announces cart item count
- ✅ Color contrast meets WCAG AA standards
- ✅ Focus indicators are visible

### Visual Requirements

- ✅ Follows design system color palette
- ✅ Consistent spacing and typography
- ✅ Smooth transitions on hover
- ✅ Cart badge is prominent and readable
- ✅ Active state is clearly distinguished
- ✅ Shadow provides subtle elevation

## Testing Strategy

### Manual Testing

1. **Desktop Navigation**
   ```
   - Open app at 1280px width
   - Click each nav link, verify navigation
   - Check active link has amber color and underline
   - Hover over links, verify color change
   - Add items to cart, verify badge appears
   - Verify badge shows correct count
   ```

2. **Mobile Navigation**
   ```
   - Resize to 375px width
   - Verify hamburger menu appears
   - Click hamburger, verify menu opens
   - Click nav link, verify menu closes
   - Verify cart count shows in mobile menu
   - Click outside menu, verify it stays open
   ```

3. **Cart Badge**
   ```
   - Start with empty cart
   - Add 1 item, verify badge shows "1"
   - Add 9 more items, verify badge shows "10" or "9+"
   - Remove items, verify count decreases
   - Remove all items, verify badge disappears
   ```

4. **Sticky Behavior**
   ```
   - Navigate to home page
   - Scroll down page
   - Verify navbar stays at top
   - Verify shadow remains visible
   ```

5. **Keyboard Navigation**
   ```
   - Tab through all nav links
   - Verify focus indicators are visible
   - Press Enter on focused link
   - Verify navigation occurs
   - Tab to cart button, press Enter
   - Verify cart page opens
   ```

### Automated Testing (Optional)

Create `__tests__/Navbar.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '@/app/components/Navbar'
import { CartProvider } from '@/app/context/CartContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Navbar', () => {
  it('renders brand name', () => {
    render(
      <CartProvider>
        <Navbar />
      </CartProvider>
    )
    expect(screen.getByText('Bella Cucina')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(
      <CartProvider>
        <Navbar />
      </CartProvider>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    render(
      <CartProvider>
        <Navbar />
      </CartProvider>
    )
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
  })
})
```

### Browser Testing

Test in the following browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### Accessibility Testing

Run Lighthouse audit:
```bash
# In Chrome DevTools
Lighthouse > Accessibility > Generate Report
Target Score: 95+
```

Test with screen reader:
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA
- Verify cart count is announced
- Verify menu button state is announced

## Common Pitfalls

### Pitfall 1: Cart Count Not Updating

**Problem**: Badge doesn't update when items are added to cart.

**Cause**: Navbar not wrapped in CartProvider or useCart not called.

**Solution**:
```typescript
// In layout.tsx, ensure Navbar is inside CartProvider
<CartProvider>
  <Navbar />
  {children}
</CartProvider>
```

### Pitfall 2: Mobile Menu Doesn't Close on Navigation

**Problem**: Mobile menu stays open after clicking a link.

**Cause**: Missing `closeMobileMenu` call in Link onClick.

**Solution**:
```typescript
<Link href="/menu" onClick={closeMobileMenu}>
  Menu
</Link>
```

### Pitfall 3: Active Link Not Highlighting

**Problem**: Current page link doesn't show as active.

**Cause**: `usePathname` returns different format than expected.

**Solution**: Add logging to debug:
```typescript
console.log('Current pathname:', pathname)
console.log('Link href:', link.href)
console.log('Is active:', isActiveLink(link.href))
```

### Pitfall 4: Navbar Not Sticky

**Problem**: Navbar scrolls away with page content.

**Cause**: Missing `sticky top-0 z-50` classes.

**Solution**:
```typescript
<nav className="bg-white shadow-md sticky top-0 z-50">
```

### Pitfall 5: Badge Positioning Off

**Problem**: Cart badge doesn't align correctly with icon.

**Cause**: Parent element missing `relative` positioning.

**Solution**:
```typescript
<Link href="/cart" className="relative p-2">
  <ShoppingCart className="w-6 h-6" />
  <span className="absolute -top-1 -right-1 ...">
    {totalItems}
  </span>
</Link>
```

### Pitfall 6: Mobile Menu Overlaps Content

**Problem**: Mobile menu covers page content instead of pushing it down.

**Cause**: Using absolute positioning instead of normal flow.

**Solution**: Don't use absolute positioning, let menu expand naturally:
```typescript
{isMobileMenuOpen && (
  <div className="md:hidden"> {/* Normal flow, not absolute */}
    {/* Menu content */}
  </div>
)}
```

### Pitfall 7: TypeScript Errors with useCart

**Problem**: TypeScript error "Property 'items' does not exist".

**Cause**: CartContext not properly typed or exported.

**Solution**: Ensure CartContext exports proper types:
```typescript
// In CartContext.tsx
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  // ... other methods
}
```

## Enhancement Ideas

### 1. Search Bar

Add a search input to navbar:

```typescript
<div className="flex items-center space-x-4">
  <input
    type="search"
    placeholder="Search menu..."
    className="px-4 py-2 border rounded-lg"
  />
  {/* Navigation links */}
</div>
```

### 2. User Account Menu

Add user authentication dropdown:

```typescript
<button className="flex items-center space-x-2">
  <User className="w-5 h-5" />
  <span>John Doe</span>
  <ChevronDown className="w-4 h-4" />
</button>
```

### 3. Notifications Badge

Add notification indicator:

```typescript
<button className="relative">
  <Bell className="w-6 h-6" />
  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
</button>
```

### 4. Dark Mode Toggle

Add theme switcher:

```typescript
<button onClick={toggleDarkMode}>
  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
</button>
```

### 5. Progress Indicator

Show page load progress:

```typescript
{isLoading && (
  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600 animate-pulse" />
)}
```

## Related Tasks

- **Task 4.2**: Create Footer Component (layout companion)
- **Task 4.3**: Create Menu Card Component (links to /menu)
- **Task 3.x**: Cart Context (provides cart state)
- **Phase 5**: Page implementations that use this navbar
- **Phase 6**: Admin dashboard (requires navbar /admin link)

## Troubleshooting

### Issue: "Cannot find module '../context/CartContext'"

**Solution**: Verify CartContext exists:
```bash
ls app/context/CartContext.tsx
```

If missing, complete Phase 3 first.

### Issue: Icons not rendering

**Solution**: Install lucide-react:
```bash
npm install lucide-react
```

### Issue: Mobile menu button not visible

**Solution**: Check responsive classes:
```typescript
<button className="md:hidden"> {/* Shows only on mobile */}
```

### Issue: Cart count always shows 0

**Solution**: Check if CartProvider wraps the entire app in layout.tsx:
```typescript
<CartProvider>
  <Navbar />
  {children}
</CartProvider>
```

## Resources

- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [Next.js usePathname Hook](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [ARIA Navigation Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/navigationbar/)

## Completion Checklist

- [ ] Component file created at `app/components/Navbar.tsx`
- [ ] All imports added correctly
- [ ] Navigation links defined
- [ ] Desktop navigation implemented
- [ ] Mobile hamburger menu implemented
- [ ] Cart badge showing correct count
- [ ] Active link highlighting working
- [ ] Mobile menu closes on navigation
- [ ] Sticky positioning functional
- [ ] Integrated into app/layout.tsx
- [ ] Manual testing complete
- [ ] Responsive design verified
- [ ] Accessibility audit passed
- [ ] No TypeScript errors
- [ ] No console warnings

**Task Complete**: When all checklist items are ✅, proceed to Task 4.2!
