# Task 5.3: Create Cart Page

## Task Metadata

- **Task ID**: 5.3
- **Task Name**: Create Cart Page
- **Phase**: 5 - Customer-Facing Pages
- **Prerequisites**: Phase 4 (CartContext), Task 5.2 (Menu Page)
- **Estimated Time**: 3-4 hours
- **Priority**: High
- **Difficulty**: Medium
- **Last Updated**: 2026-02-09

## Overview

The cart page provides customers with a comprehensive view of their selected items before proceeding to checkout. This task involves creating an intuitive interface for reviewing order items, adjusting quantities, removing items, applying promo codes, and viewing the order summary with calculated totals. The page must handle edge cases like an empty cart and provide clear pathways to continue shopping or proceed to checkout.

### Importance

- **Order Review**: Critical step in the purchase funnel
- **Quantity Management**: Allows customers to adjust their order
- **Price Transparency**: Shows clear breakdown of costs
- **Conversion Optimization**: Reduces cart abandonment with good UX
- **Promo Code Support**: Enables discounts and promotions

### User Stories

1. As a customer, I want to see all items in my cart, so I can review my order
2. As a customer, I want to adjust quantities, so I can order more or less of an item
3. As a customer, I want to remove items, so I can change my mind about purchases
4. As a customer, I want to see the total price, so I know how much I'll pay
5. As a customer, I want to apply promo codes, so I can get discounts
6. As a customer, I want to proceed to checkout easily, so I can complete my order
7. As a customer, I want to continue shopping, so I can add more items

## Prerequisites

### Completed Tasks

- ✅ Task 4.5: CartContext with state management
- ✅ Task 4.6: CartItem component
- ✅ Task 5.2: Menu page (for continue shopping link)

### Required Knowledge

- React Client Components
- Context API (useCart hook)
- State management
- Form handling
- Responsive layout design

### Environment Setup

```bash
# Ensure cart context is set up
# Start development server
npm run dev
```

## Technical Specifications

### Page Route

- **Path**: `/cart`
- **File**: `app/cart/page.tsx`
- **Type**: Client Component ('use client')
- **Layout**: Uses root layout with Header and Footer

### Page Sections

1. **Page Header**: Title and item count
2. **Cart Items List**: List of all cart items with controls
3. **Order Summary**: Subtotal, tax, delivery, total
4. **Promo Code**: Input field to apply discount codes
5. **Action Buttons**: Continue shopping, Proceed to checkout
6. **Empty State**: Displayed when cart is empty

### Data Requirements

#### Cart Item Interface

```typescript
interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

#### Order Summary Calculations

```typescript
interface OrderSummary {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}
```

### Constants

```typescript
const TAX_RATE = 0.08; // 8% tax
const DELIVERY_FEE = 5.99;
const FREE_DELIVERY_THRESHOLD = 30; // Free delivery over $30
```

### SEO Metadata

```typescript
export const metadata: Metadata = {
  title: 'Shopping Cart - Bella Cucina',
  description: 'Review your order and proceed to checkout',
};
```

## Implementation Guide

### Step 1: Create the Cart Page File

```tsx
// app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { CartItemCard } from '@/components/CartItem';
import { toast } from 'react-hot-toast';

const TAX_RATE = 0.08;
const DELIVERY_FEE = 5.99;
const FREE_DELIVERY_THRESHOLD = 30;

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string; discount: number} | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculate order summary
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal + tax + deliveryFee - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);

    // Simulate API call to validate promo code
    // In production, this would call /api/promo-codes
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock promo validation
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: promoCode, discount: subtotal * 0.1 });
      toast.success('Promo code applied! 10% off');
    } else if (promoCode.toUpperCase() === 'FREESHIP') {
      setAppliedPromo({ code: promoCode, discount: deliveryFee });
      toast.success('Free delivery applied!');
    } else {
      toast.error('Invalid promo code');
    }

    setIsApplyingPromo(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo code removed');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  // Empty cart state
  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <PageHeader itemCount={items.length} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <CartItemsList
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Promo Code Section */}
              <PromoCodeSection
                promoCode={promoCode}
                appliedPromo={appliedPromo}
                isApplying={isApplyingPromo}
                onPromoCodeChange={setPromoCode}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
              />

              {/* Order Summary */}
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
                freeDeliveryThreshold={FREE_DELIVERY_THRESHOLD}
              />

              {/* Action Buttons */}
              <ActionButtons onCheckout={handleCheckout} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### Step 2: Create Page Header Component

```tsx
// app/cart/page.tsx (continued)

interface PageHeaderProps {
  itemCount: number;
}

function PageHeader({ itemCount }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Shopping Cart
      </h1>
      <p className="mt-2 text-gray-600">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
      </p>
    </div>
  );
}
```

### Step 3: Create Cart Items List Component

```tsx
// app/cart/page.tsx (continued)

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
}

function CartItemsList({ items, onUpdateQuantity, onRemoveItem }: CartItemsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.dishId} className="p-6">
            <CartItemCard
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Alternative: Create inline CartItemCard if not in components
function CartItemCard({ item, onUpdateQuantity, onRemove }: any) {
  return (
    <div className="flex gap-4">
      {/* Item Image */}
      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-gray-600 mt-1">
          ${item.price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onUpdateQuantity(item.dishId, Math.max(1, item.quantity - 1))}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="w-12 text-center font-semibold text-gray-900">
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(item.dishId, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={() => onRemove(item.dishId)}
            className="ml-auto text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Item Subtotal */}
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
```

### Step 4: Create Promo Code Section

```tsx
// app/cart/page.tsx (continued)

interface PromoCodeSectionProps {
  promoCode: string;
  appliedPromo: { code: string; discount: number } | null;
  isApplying: boolean;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
}

function PromoCodeSection({
  promoCode,
  appliedPromo,
  isApplying,
  onPromoCodeChange,
  onApplyPromo,
  onRemovePromo
}: PromoCodeSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Promo Code
      </h2>

      {appliedPromo ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-green-900">{appliedPromo.code}</p>
              <p className="text-sm text-green-700">-${appliedPromo.discount.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onRemovePromo}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isApplying}
          />
          <button
            onClick={onApplyPromo}
            disabled={isApplying}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Try: SAVE10 for 10% off or FREESHIP for free delivery
      </p>
    </div>
  );
}
```

### Step 5: Create Order Summary Component

```tsx
// app/cart/page.tsx (continued)

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  freeDeliveryThreshold: number;
}

function OrderSummary({
  subtotal,
  tax,
  deliveryFee,
  discount,
  total,
  freeDeliveryThreshold
}: OrderSummaryProps) {
  const amountUntilFreeDelivery = freeDeliveryThreshold - subtotal;
  const showFreeDeliveryNotice = deliveryFee > 0 && amountUntilFreeDelivery > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-gray-700">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between text-gray-700">
          <span>Delivery Fee</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="text-green-600 font-semibold">FREE</span>
            ) : (
              `$${deliveryFee.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Free Delivery Notice */}
        {showFreeDeliveryNotice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Add ${amountUntilFreeDelivery.toFixed(2)} more for free delivery!
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Create Action Buttons Component

```tsx
// app/cart/page.tsx (continued)

interface ActionButtonsProps {
  onCheckout: () => void;
}

function ActionButtons({ onCheckout }: ActionButtonsProps) {
  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={onCheckout}
        className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
      >
        Proceed to Checkout
      </button>

      <Link
        href="/menu"
        className="block w-full px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-center"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
```

### Step 7: Create Empty Cart State

```tsx
// app/cart/page.tsx (continued)

function EmptyCartState() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-xl shadow-md p-12">
          {/* Empty Cart Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some delicious items from our menu to get started!
          </p>

          <Link
            href="/menu"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            Browse Menu
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

### Step 8: Add Layout Metadata

```tsx
// app/cart/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart - Bella Cucina',
  description: 'Review your order and proceed to checkout',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## Complete Code Example

The complete implementation has been provided in steps above. Key features:

1. ✅ Cart items display with quantity controls
2. ✅ Real-time price calculations
3. ✅ Promo code functionality
4. ✅ Order summary with tax and delivery
5. ✅ Empty cart state
6. ✅ Responsive design
7. ✅ Toast notifications
8. ✅ Navigation buttons

## Acceptance Criteria

- [ ] Cart page renders at `/cart` route
- [ ] Empty cart state displays when no items
- [ ] All cart items display correctly
- [ ] Quantity controls update cart
- [ ] Remove button deletes items
- [ ] Promo code validation works
- [ ] Order summary calculates correctly
- [ ] Free delivery threshold notification shows
- [ ] Proceed to checkout navigates to `/checkout`
- [ ] Continue shopping returns to menu
- [ ] Toast notifications appear for actions
- [ ] Page is fully responsive
- [ ] All calculations are accurate

## Testing Strategy

### Manual Testing Checklist

```bash
# Test checklist:

1. Empty Cart
   - [ ] Visit /cart with empty cart
   - [ ] Empty state displays
   - [ ] "Browse Menu" button works

2. Cart with Items
   - [ ] Add items from menu
   - [ ] Navigate to cart
   - [ ] All items display correctly

3. Quantity Controls
   - [ ] Increase quantity updates total
   - [ ] Decrease quantity updates total
   - [ ] Minimum quantity is 1
   - [ ] Remove button deletes item

4. Promo Codes
   - [ ] Enter "SAVE10" applies 10% discount
   - [ ] Enter "FREESHIP" removes delivery fee
   - [ ] Invalid code shows error
   - [ ] Remove promo code works

5. Order Summary
   - [ ] Subtotal calculates correctly
   - [ ] Tax is 8% of (subtotal - discount)
   - [ ] Delivery fee is $5.99 or FREE
   - [ ] Total is accurate

6. Free Delivery
   - [ ] Subtotal < $30 shows delivery fee
   - [ ] Subtotal >= $30 shows FREE
   - [ ] Notice shows amount needed

7. Navigation
   - [ ] "Proceed to Checkout" goes to /checkout
   - [ ] "Continue Shopping" goes to /menu

8. Responsive Design
   - [ ] Works on mobile (320px+)
   - [ ] Works on tablet (768px+)
   - [ ] Works on desktop (1024px+)
```

## Common Pitfalls

### 1. Cart State Not Persisting

**Problem**: Cart resets on page refresh
**Solution**: Use localStorage in CartContext

### 2. Calculation Errors

**Problem**: Totals don't add up correctly
**Solution**: Use toFixed(2) for all currency displays, calculate in cents

### 3. Promo Code Issues

**Problem**: Can apply multiple promos
**Solution**: Clear previous promo before applying new one

### 4. Quantity Edge Cases

**Problem**: Can set quantity to 0 or negative
**Solution**: Use Math.max(1, quantity) to enforce minimum

## Related Tasks

- **Task 4.5**: CartContext (provides cart state)
- **Task 4.6**: CartItem component
- **Task 5.2**: Menu page (adds items to cart)
- **Task 5.4**: Checkout page (next step after cart)

---

**Task Status**: Ready for Implementation
**Last Updated**: 2026-02-09
