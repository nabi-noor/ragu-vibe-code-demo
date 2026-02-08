# Task 4.3: Create Menu Card Component

## Task Metadata

- **Task ID**: 4.3
- **Phase**: 4 - Shared Components
- **Complexity**: Medium
- **Estimated Time**: 2-3 hours
- **Priority**: High
- **Dependencies**: Phase 1 (Setup), Phase 3 (Cart Context)
- **Component Type**: Client Component (interactive with cart)

## Overview

The MenuCard component is the primary visual element for displaying menu items throughout the application. It presents food items in an attractive, card-based format with images, descriptions, pricing, and interactive controls for adding items to the cart. This component is crucial for driving customer engagement and sales conversions.

### Importance

- **Product Showcase**: Primary way customers view and learn about menu items
- **Conversion Driver**: Add-to-cart functionality directly impacts sales
- **Visual Appeal**: Professional presentation builds trust and appetite
- **Information Display**: Clearly communicates price, ingredients, dietary info
- **Quantity Control**: Allows customers to specify serving sizes before adding
- **Responsive Design**: Works beautifully on all device sizes

### User Experience Goals

1. **Visual Appetite Appeal**: High-quality images and descriptions entice ordering
2. **Clear Pricing**: No confusion about costs
3. **Easy Ordering**: One-click add to cart with optional quantity selection
4. **Dietary Transparency**: Clear badges for vegetarian, vegan, gluten-free options
5. **Instant Feedback**: Immediate visual confirmation when adding to cart
6. **Mobile Optimized**: Touch-friendly buttons and readable text

## Prerequisites

### Required Completions

- ✅ Phase 1 completed (Next.js 15, TypeScript, Tailwind CSS setup)
- ✅ Phase 3 completed (CartContext with addItem, removeItem functions)
- ✅ `app/context/CartContext.tsx` exists and exports useCart hook
- ✅ lucide-react package installed
- ✅ next/image configured for external images

### Required Knowledge

- React hooks (useState, useCallback)
- Next.js Image component optimization
- TypeScript interfaces and types
- Tailwind CSS styling
- Context API consumption
- Event handling

### Verify Prerequisites

```bash
# Check if CartContext exists
ls -la app/context/CartContext.tsx

# Check if lucide-react is installed
grep "lucide-react" package.json

# Verify Image component setup
grep "images" next.config.js

# Run development server
npm run dev
```

## Technical Specifications

### Component Architecture

```
MenuCard (Client Component)
├── Card Container
│   ├── Image Section
│   │   ├── Next.js Image (optimized)
│   │   └── Dietary Badges (overlay)
│   ├── Content Section
│   │   ├── Name/Title
│   │   ├── Description
│   │   ├── Category (optional)
│   │   └── Price Display
│   └── Action Section
│       ├── Quantity Controls (in cart)
│       │   ├── Decrease Button
│       │   ├── Quantity Display
│       │   └── Increase Button
│       └── Add to Cart Button (not in cart)
```

### State Management

```typescript
// Context state
const { items, addItem, updateQuantity, removeItem } = useCart()

// Local state
const [isAdding, setIsAdding] = useState(false) // Loading state

// Derived state
const cartItem = items.find(item => item.id === menuItem.id)
const isInCart = !!cartItem
const quantity = cartItem?.quantity || 0
```

### Responsive Behavior

- **Mobile (< 640px)**: Full-width cards, stacked layout
- **Tablet (640px - 1024px)**: 2-column grid
- **Desktop (>= 1024px)**: 3-column grid
- **Image Ratio**: 16:9 aspect ratio for consistency

### Styling Theme

- **Card Background**: White with shadow
- **Hover Effect**: Lift with increased shadow
- **Price Color**: Amber-600 (primary)
- **Buttons**: Amber-600 background with white text
- **Badges**: Color-coded by dietary type
- **Border Radius**: rounded-lg (8px)

## Component Interface

### Props Interface

```typescript
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'spicy')[]
  available?: boolean
}

interface MenuCardProps {
  item: MenuItem
  showCategory?: boolean
  compact?: boolean
}
```

**Prop Descriptions**:
- `item`: Menu item data (required)
- `showCategory`: Display category badge (optional, default: false)
- `compact`: Use compact layout for smaller cards (optional, default: false)

### Type Definitions

```typescript
type DietaryType = 'vegetarian' | 'vegan' | 'gluten-free' | 'spicy'

interface DietaryBadgeConfig {
  label: string
  color: string
  icon?: React.ComponentType
}
```

## Files to Create/Modify

### Create New Files

```
app/components/MenuCard.tsx
app/types/menu.ts (optional - for shared types)
```

### Modify Existing Files

```
app/context/CartContext.tsx (verify interface compatibility)
```

## Step-by-Step Implementation

### Step 1: Create Component File

```bash
touch app/components/MenuCard.tsx
```

### Step 2: Import Dependencies

```typescript
'use client'

import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
```

**Explanation**:
- `'use client'`: Required for hooks and interactivity
- `Image`: Next.js optimized image component
- Icons: Plus/Minus for quantity, ShoppingCart for add button
- `useState`: Manage loading state for cart operations
- `useCart`: Access cart context for add/update/remove

### Step 3: Define Interfaces and Types

```typescript
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'spicy')[]
  available?: boolean
}

interface MenuCardProps {
  item: MenuItem
  showCategory?: boolean
  compact?: boolean
}

type DietaryType = 'vegetarian' | 'vegan' | 'gluten-free' | 'spicy'
```

### Step 4: Define Dietary Badge Configuration

```typescript
const dietaryBadges: Record<DietaryType, { label: string; color: string }> = {
  vegetarian: {
    label: 'V',
    color: 'bg-green-500',
  },
  vegan: {
    label: 'VG',
    color: 'bg-green-600',
  },
  'gluten-free': {
    label: 'GF',
    color: 'bg-blue-500',
  },
  spicy: {
    label: '🌶️',
    color: 'bg-red-500',
  },
}
```

**Badge System**:
- **Vegetarian**: Green with "V"
- **Vegan**: Darker green with "VG"
- **Gluten-Free**: Blue with "GF"
- **Spicy**: Red with chili emoji

### Step 5: Implement Main Component Structure

```typescript
export default function MenuCard({
  item,
  showCategory = false,
  compact = false
}: MenuCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  // Find if item is in cart
  const cartItem = items.find(cartItem => cartItem.id === item.id)
  const isInCart = !!cartItem
  const quantity = cartItem?.quantity || 0

  // Handle add to cart
  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      })
    } catch (error) {
      console.error('Failed to add item:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Handle quantity increase
  const handleIncrease = () => {
    if (cartItem) {
      updateQuantity(item.id, cartItem.quantity + 1)
    }
  }

  // Handle quantity decrease
  const handleDecrease = () => {
    if (cartItem) {
      if (cartItem.quantity <= 1) {
        removeItem(item.id)
      } else {
        updateQuantity(item.id, cartItem.quantity - 1)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Component JSX here */}
    </div>
  )
}
```

**Key Logic**:
- `cartItem`: Find existing cart item by ID
- `isInCart`: Boolean for conditional rendering
- `handleAddToCart`: Async with loading state
- `handleDecrease`: Remove item if quantity reaches 0
- Loading state prevents double-clicks

### Step 6: Implement Image Section

```typescript
{/* Image Section */}
<div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
  <Image
    src={item.image}
    alt={item.name}
    fill
    className="object-cover"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />

  {/* Dietary Badges */}
  {item.dietary && item.dietary.length > 0 && (
    <div className="absolute top-2 left-2 flex gap-1">
      {item.dietary.map((type) => (
        <span
          key={type}
          className={`${dietaryBadges[type].color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-md`}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
        >
          {dietaryBadges[type].label}
        </span>
      ))}
    </div>
  )}

  {/* Category Badge (optional) */}
  {showCategory && item.category && (
    <div className="absolute top-2 right-2">
      <span className="bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-full">
        {item.category}
      </span>
    </div>
  )}

  {/* Unavailable Overlay */}
  {item.available === false && (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
      <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg">
        Currently Unavailable
      </span>
    </div>
  )}
</div>
```

**Key Features**:
- **Next.js Image**: Automatic optimization, lazy loading
- `fill`: Fills parent container
- `aspect-video`: 16:9 ratio (Tailwind utility)
- **Dietary Badges**: Absolutely positioned overlay
- **Category Badge**: Top-right corner (optional)
- **Unavailable State**: Gray overlay with message
- `sizes` prop: Responsive image sizing hints

### Step 7: Implement Content Section

```typescript
{/* Content Section */}
<div className="p-4 space-y-3">
  {/* Name and Price Row */}
  <div className="flex items-start justify-between gap-2">
    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
      {item.name}
    </h3>
    <p className="text-lg font-bold text-amber-600 whitespace-nowrap">
      ${item.price.toFixed(2)}
    </p>
  </div>

  {/* Description */}
  <p className="text-sm text-gray-600 line-clamp-3">
    {item.description}
  </p>
</div>
```

**Key Features**:
- **Flex Layout**: Name and price on same row
- **line-clamp-2**: Limit name to 2 lines
- **line-clamp-3**: Limit description to 3 lines
- `whitespace-nowrap`: Price stays on one line
- `toFixed(2)`: Always show 2 decimal places

### Step 8: Implement Action Buttons

```typescript
{/* Action Section */}
<div className="p-4 pt-0">
  {isInCart ? (
    // Quantity Controls (item in cart)
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={handleDecrease}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-gray-700" />
      </button>

      <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
        {quantity}
      </span>

      <button
        onClick={handleIncrease}
        className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 text-white" />
      </button>
    </div>
  ) : (
    // Add to Cart Button (item not in cart)
    <button
      onClick={handleAddToCart}
      disabled={isAdding || item.available === false}
      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
      aria-label={`Add ${item.name} to cart`}
    >
      {isAdding ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  )}
</div>
```

**Key Features**:
- **Conditional Rendering**: Different UI for in-cart vs not-in-cart
- **Quantity Controls**: Circular buttons with icons
- **Loading State**: Spinner animation while adding
- **Disabled State**: Gray when unavailable or loading
- **Accessibility**: aria-labels for screen readers
- **Visual Feedback**: Hover effects and transitions

### Step 9: Add Compact Variant (Optional)

```typescript
export default function MenuCard({
  item,
  showCategory = false,
  compact = false
}: MenuCardProps) {
  // ... existing code ...

  // Compact layout for smaller cards
  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex">
        {/* Compact Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-l-lg"
            sizes="96px"
          />
        </div>

        {/* Compact Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
              {item.name}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-amber-600">
              ${item.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-1 rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    // ... regular card layout ...
  )
}
```

## Complete Component Code

```typescript
'use client'

import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'spicy')[]
  available?: boolean
}

interface MenuCardProps {
  item: MenuItem
  showCategory?: boolean
  compact?: boolean
}

type DietaryType = 'vegetarian' | 'vegan' | 'gluten-free' | 'spicy'

const dietaryBadges: Record<DietaryType, { label: string; color: string }> = {
  vegetarian: {
    label: 'V',
    color: 'bg-green-500',
  },
  vegan: {
    label: 'VG',
    color: 'bg-green-600',
  },
  'gluten-free': {
    label: 'GF',
    color: 'bg-blue-500',
  },
  spicy: {
    label: '🌶️',
    color: 'bg-red-500',
  },
}

export default function MenuCard({
  item,
  showCategory = false,
  compact = false
}: MenuCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  // Find if item is in cart
  const cartItem = items.find(cartItem => cartItem.id === item.id)
  const isInCart = !!cartItem
  const quantity = cartItem?.quantity || 0

  // Handle add to cart
  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      })
    } catch (error) {
      console.error('Failed to add item:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Handle quantity increase
  const handleIncrease = () => {
    if (cartItem) {
      updateQuantity(item.id, cartItem.quantity + 1)
    }
  }

  // Handle quantity decrease
  const handleDecrease = () => {
    if (cartItem) {
      if (cartItem.quantity <= 1) {
        removeItem(item.id)
      } else {
        updateQuantity(item.id, cartItem.quantity - 1)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">

      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dietary Badges */}
        {item.dietary && item.dietary.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {item.dietary.map((type) => (
              <span
                key={type}
                className={`${dietaryBadges[type].color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-md`}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                {dietaryBadges[type].label}
              </span>
            ))}
          </div>
        )}

        {/* Category Badge (optional) */}
        {showCategory && item.category && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        )}

        {/* Unavailable Overlay */}
        {item.available === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Name and Price Row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-lg font-bold text-amber-600 whitespace-nowrap">
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {item.description}
        </p>
      </div>

      {/* Action Section */}
      <div className="p-4 pt-0">
        {isInCart ? (
          // Quantity Controls (item in cart)
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleDecrease}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>

            <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          // Add to Cart Button (item not in cart)
          <button
            onClick={handleAddToCart}
            disabled={isAdding || item.available === false}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  )
}
```

## Usage Examples

### Basic Usage

```typescript
import MenuCard from './components/MenuCard'

const menuItem = {
  id: '1',
  name: 'Margherita Pizza',
  description: 'Fresh mozzarella, tomato sauce, and basil on a wood-fired crust',
  price: 14.99,
  image: '/images/margherita-pizza.jpg',
  dietary: ['vegetarian'],
  available: true,
}

export default function MenuPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <MenuCard item={menuItem} />
    </div>
  )
}
```

### With Category Badge

```typescript
<MenuCard
  item={menuItem}
  showCategory={true}
/>
```

### Grid Layout

```typescript
const menuItems = [/* array of items */]

<div className="max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {menuItems.map((item) => (
      <MenuCard key={item.id} item={item} />
    ))}
  </div>
</div>
```

## Acceptance Criteria

### Functional Requirements

- ✅ Displays menu item image, name, description, price
- ✅ Shows dietary badges when applicable
- ✅ Add to cart button adds item to cart context
- ✅ Quantity controls appear after adding to cart
- ✅ Increase button increments quantity
- ✅ Decrease button decrements quantity
- ✅ Decrease at quantity 1 removes item from cart
- ✅ Loading state shows while adding
- ✅ Unavailable items show overlay and disable button
- ✅ Price always shows 2 decimal places

### Visual Requirements

- ✅ Card has subtle shadow, increases on hover
- ✅ Image maintains 16:9 aspect ratio
- ✅ Text truncates with ellipsis when too long
- ✅ Dietary badges are color-coded correctly
- ✅ Buttons have smooth hover transitions
- ✅ Loading spinner animates smoothly
- ✅ Follows design system colors

### Responsive Requirements

- ✅ Works on mobile (375px+)
- ✅ Works on tablet (768px+)
- ✅ Works on desktop (1280px+)
- ✅ Touch targets minimum 44x44px
- ✅ Images load optimized for screen size

### Accessibility Requirements

- ✅ Images have descriptive alt text
- ✅ Buttons have aria-labels
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ Disabled state properly communicated
- ✅ Color contrast meets WCAG AA

## Testing Strategy

### Manual Testing

1. **Add to Cart Flow**
   ```
   - Click "Add to Cart" button
   - Verify loading spinner shows
   - Verify quantity controls appear
   - Verify item appears in cart context
   - Check cart badge in navbar updates
   ```

2. **Quantity Controls**
   ```
   - Click increase button
   - Verify quantity increments
   - Click decrease button
   - Verify quantity decrements
   - Decrease to 1, click decrease again
   - Verify item removes from cart
   ```

3. **Visual States**
   ```
   - Hover over card, verify shadow increases
   - Hover over buttons, verify color change
   - Check dietary badges display correctly
   - Verify unavailable overlay shows when available=false
   ```

4. **Responsive**
   ```
   - Test at 375px width (mobile)
   - Test at 768px width (tablet)
   - Test at 1280px width (desktop)
   - Verify images load properly
   - Check text doesn't overflow
   ```

5. **Edge Cases**
   ```
   - Very long name (30+ characters)
   - Very long description (200+ characters)
   - Price with many decimals (14.999)
   - Missing image
   - No dietary info
   - All dietary badges (4 badges)
   ```

### Unit Testing (Optional)

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import MenuCard from './MenuCard'
import { CartProvider } from '../context/CartContext'

const mockItem = {
  id: '1',
  name: 'Test Pizza',
  description: 'Test description',
  price: 10.99,
  image: '/test.jpg',
}

describe('MenuCard', () => {
  it('renders menu item', () => {
    render(
      <CartProvider>
        <MenuCard item={mockItem} />
      </CartProvider>
    )
    expect(screen.getByText('Test Pizza')).toBeInTheDocument()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
  })

  it('adds item to cart', () => {
    render(
      <CartProvider>
        <MenuCard item={mockItem} />
      </CartProvider>
    )
    const addButton = screen.getByText('Add to Cart')
    fireEvent.click(addButton)
    expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument()
  })
})
```

## Common Pitfalls

### Pitfall 1: Images Not Loading

**Problem**: Next.js Image shows error or doesn't load.

**Cause**: External images not configured in next.config.js.

**Solution**:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['yourdomain.com', 'placeholder.com'],
    // Or for Next.js 15+:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.yourdomain.com',
      },
    ],
  },
}
```

### Pitfall 2: Cart Not Updating

**Problem**: Adding item doesn't update cart.

**Cause**: MenuCard not wrapped in CartProvider or addItem not implemented.

**Solution**: Verify CartContext setup and provider wrapping.

### Pitfall 3: Quantity Controls Don't Appear

**Problem**: After adding, still shows "Add to Cart" button.

**Cause**: `isInCart` check not working correctly.

**Solution**: Debug cartItem lookup:
```typescript
console.log('Cart items:', items)
console.log('Looking for ID:', item.id)
console.log('Found:', cartItem)
```

### Pitfall 4: Layout Shifts During Loading

**Problem**: Page jumps when images load.

**Cause**: Missing aspect ratio or height on image container.

**Solution**: Use `aspect-video` or fixed height:
```typescript
<div className="relative aspect-video w-full">
  <Image fill ... />
</div>
```

### Pitfall 5: Buttons Not Clickable on Mobile

**Problem**: Touch doesn't register on buttons.

**Cause**: Touch targets too small.

**Solution**: Ensure minimum 44x44px:
```typescript
<button className="w-10 h-10 ..."> {/* 40px minimum */}
<button className="w-12 h-12 ..."> {/* 48px better for mobile */}
```

### Pitfall 6: Price Formatting Issues

**Problem**: Price shows "10" instead of "10.00" or shows many decimals.

**Cause**: Missing `toFixed(2)`.

**Solution**:
```typescript
${item.price.toFixed(2)} // Always 2 decimals
```

### Pitfall 7: Dietary Badges Overlap

**Problem**: Multiple badges overflow or overlap.

**Cause**: Missing flex gap or wrapping.

**Solution**:
```typescript
<div className="flex gap-1 flex-wrap">
  {/* Badges */}
</div>
```

## Enhancement Ideas

### 1. Favorites/Wishlist

```typescript
const [isFavorite, setIsFavorite] = useState(false)

<button onClick={() => setIsFavorite(!isFavorite)}>
  <Heart fill={isFavorite ? 'currentColor' : 'none'} />
</button>
```

### 2. Quick View Modal

```typescript
<button onClick={() => setShowModal(true)}>
  Quick View
</button>
{showModal && <MenuItemModal item={item} />}
```

### 3. Ratings Display

```typescript
{item.rating && (
  <div className="flex items-center">
    <Star className="w-4 h-4 text-yellow-400 fill-current" />
    <span className="text-sm ml-1">{item.rating}</span>
  </div>
)}
```

### 4. Calorie Information

```typescript
{item.calories && (
  <span className="text-xs text-gray-500">
    {item.calories} cal
  </span>
)}
```

### 5. Customization Options

```typescript
<button className="text-sm text-amber-600">
  Customize →
</button>
```

## Related Tasks

- **Task 4.1**: Navbar (cart badge updates with MenuCard additions)
- **Task 4.5**: Loading Skeletons (MenuCardSkeleton for loading states)
- **Phase 3**: Cart Context (provides cart functionality)
- **Phase 5**: Menu Page (displays MenuCards in grid)
- **Phase 5**: Cart Page (shows cart items with MenuCard data)

## Troubleshooting

### Issue: TypeScript error on addItem

**Solution**: Verify CartItem interface matches:
```typescript
// In CartContext.tsx
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}
```

### Issue: Images show broken icon

**Solution**:
1. Check image URL is valid
2. Configure next.config.js for external images
3. Use placeholder during development:
```typescript
image: item.image || '/placeholder-food.jpg'
```

### Issue: Hover effect not working

**Solution**: Verify Tailwind JIT is working:
```bash
npm run dev
# Check browser console for CSS errors
```

## Resources

- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)
- [Tailwind CSS Line Clamp](https://tailwindcss.com/docs/line-clamp)
- [Tailwind CSS Aspect Ratio](https://tailwindcss.com/docs/aspect-ratio)
- [React Context API](https://react.dev/reference/react/useContext)
- [Lucide React Icons](https://lucide.dev/)

## Completion Checklist

- [ ] Component file created
- [ ] All interfaces defined
- [ ] Dietary badge config created
- [ ] Image section implemented
- [ ] Content section implemented
- [ ] Action buttons implemented
- [ ] Cart integration working
- [ ] Loading states functional
- [ ] Quantity controls working
- [ ] Manual testing complete
- [ ] Responsive design verified
- [ ] Accessibility tested
- [ ] No TypeScript errors
- [ ] Images loading correctly
- [ ] Hover effects working

**Task Complete**: Ready for Task 4.4!
