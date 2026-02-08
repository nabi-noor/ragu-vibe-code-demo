# Task 5.4: Create Checkout Page

## Task Metadata

- **Task ID**: 5.4
- **Task Name**: Create Checkout Page
- **Phase**: 5 - Customer-Facing Pages
- **Prerequisites**: Phase 3 (Orders API), Task 4.5 (CartContext), Task 5.3 (Cart Page)
- **Estimated Time**: 4-5 hours
- **Priority**: High
- **Difficulty**: High
- **Last Updated**: 2026-02-09

## Overview

The checkout page is the final step before order submission. This task involves creating a comprehensive form for collecting customer information, delivery details, and payment method. The page must validate all inputs, provide clear error messages, handle submission to the orders API, and redirect to the order confirmation page upon success. This is a critical conversion point that requires excellent UX to minimize cart abandonment.

### Importance

- **Final Conversion Step**: Where customers complete their purchase
- **Data Collection**: Gathers essential order information
- **Payment Processing**: Handles payment method selection
- **Order Creation**: Submits order to backend API
- **User Experience**: Smooth process reduces abandonment

### User Stories

1. As a customer, I want to enter my contact information, so the restaurant can reach me
2. As a customer, I want to provide my delivery address, so my food arrives at the right place
3. As a customer, I want to choose delivery or pickup, so I can get my food my way
4. As a customer, I want to see order summary, so I can confirm before submitting
5. As a customer, I want to select payment method, so I can pay how I prefer
6. As a customer, I want clear error messages, so I know what to fix
7. As a customer, I want order confirmation, so I know my order was placed

## Prerequisites

### Completed Tasks

- ✅ Task 3.2: Orders API endpoint (`POST /api/orders`)
- ✅ Task 4.5: CartContext for order items
- ✅ Task 5.3: Cart page (previous step)

### Required Knowledge

- React Hook Form for form management
- Zod for validation schemas
- Client-side form validation
- API integration (POST requests)
- Error handling and user feedback
- Next.js navigation (useRouter)

### Environment Setup

```bash
# Install dependencies
npm install react-hook-form zod @hookform/resolvers

# Start development server
npm run dev
```

## Technical Specifications

### Page Route

- **Path**: `/checkout`
- **File**: `app/checkout/page.tsx`
- **Type**: Client Component ('use client')
- **Layout**: Uses root layout, possibly minimal header

### Form Sections

1. **Contact Information**: Name, email, phone
2. **Delivery Details**: Address, order type (delivery/pickup), delivery instructions
3. **Payment Method**: Cash, Card, Digital Wallet
4. **Order Summary**: Items, totals (readonly from cart)
5. **Submit Button**: Place Order with loading state

### Data Requirements

#### Order Form Schema

```typescript
import { z } from 'zod';

export const checkoutSchema = z.object({
  // Contact Information
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),

  // Delivery Details
  orderType: z.enum(['delivery', 'pickup']),
  deliveryAddress: z.string().min(5, 'Address must be at least 5 characters').optional(),
  deliveryInstructions: z.string().max(500, 'Instructions too long').optional(),

  // Payment
  paymentMethod: z.enum(['cash', 'card', 'digital_wallet']),

  // Special requests
  specialRequests: z.string().max(500).optional(),
}).refine(
  (data) => data.orderType !== 'delivery' || data.deliveryAddress,
  {
    message: 'Delivery address is required for delivery orders',
    path: ['deliveryAddress'],
  }
);

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

#### Order Submission Payload

```typescript
interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryInstructions?: string;
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  specialRequests?: string;
  items: Array<{
    dishId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}
```

### Constants

```typescript
const TAX_RATE = 0.08;
const DELIVERY_FEE = 5.99;
const FREE_DELIVERY_THRESHOLD = 30;

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
  { id: 'digital_wallet', label: 'Digital Wallet', icon: '📱' },
];
```

### SEO Metadata

```typescript
export const metadata: Metadata = {
  title: 'Checkout - Bella Cucina',
  description: 'Complete your order',
};
```

## Implementation Guide

### Step 1: Create Validation Schema

```typescript
// lib/validations/checkout.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits (no dashes)'),
  orderType: z.enum(['delivery', 'pickup'], {
    required_error: 'Please select an order type',
  }),
  deliveryAddress: z.string().optional(),
  deliveryInstructions: z.string().max(500, 'Instructions must be less than 500 characters').optional(),
  paymentMethod: z.enum(['cash', 'card', 'digital_wallet'], {
    required_error: 'Please select a payment method',
  }),
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
}).refine(
  (data) => data.orderType !== 'delivery' || (data.deliveryAddress && data.deliveryAddress.length >= 5),
  {
    message: 'Delivery address is required for delivery orders (min 5 characters)',
    path: ['deliveryAddress'],
  }
);

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

### Step 2: Create the Checkout Page

```tsx
// app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/contexts/CartContext';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout';
import { toast } from 'react-hot-toast';

const TAX_RATE = 0.08;
const DELIVERY_FEE = 5.99;
const FREE_DELIVERY_THRESHOLD = 30;

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
  { id: 'digital_wallet', label: 'Digital Wallet', icon: '📱' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: 'delivery',
      paymentMethod: 'card',
    },
  });

  const orderType = watch('orderType');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [items, router]);

  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = orderType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + deliveryFee;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare order payload
      const orderPayload = {
        ...data,
        items: items.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        tax,
        deliveryFee,
        total,
      };

      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Clear cart and redirect to confirmation
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <PageHeader />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <ContactInfoSection register={register} errors={errors} />

              {/* Order Type */}
              <OrderTypeSection register={register} orderType={orderType} />

              {/* Delivery Address (conditional) */}
              {orderType === 'delivery' && (
                <DeliveryAddressSection register={register} errors={errors} />
              )}

              {/* Payment Method */}
              <PaymentMethodSection register={register} errors={errors} />

              {/* Special Requests */}
              <SpecialRequestsSection register={register} errors={errors} />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  tax={tax}
                  deliveryFee={deliveryFee}
                  total={total}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
```

### Step 3: Create Form Section Components

```tsx
// app/checkout/page.tsx (continued)

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Checkout
      </h1>
      <p className="mt-2 text-gray-600">
        Complete your order information
      </p>
    </div>
  );
}

interface ContactInfoSectionProps {
  register: any;
  errors: any;
}

function ContactInfoSection({ register, errors }: ContactInfoSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Contact Information
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            {...register('customerName')}
            type="text"
            id="customerName"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            {...register('customerEmail')}
            type="email"
            id="customerEmail"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.customerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            {...register('customerPhone')}
            type="tel"
            id="customerPhone"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.customerPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5551234567"
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Enter 10 digits without spaces or dashes</p>
        </div>
      </div>
    </div>
  );
}

interface OrderTypeSectionProps {
  register: any;
  orderType: string;
}

function OrderTypeSection({ register, orderType }: OrderTypeSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Order Type
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <label
          className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            orderType === 'delivery'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            {...register('orderType')}
            type="radio"
            value="delivery"
            className="sr-only"
          />
          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <div className="font-semibold">Delivery</div>
          </div>
        </label>

        <label
          className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            orderType === 'pickup'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            {...register('orderType')}
            type="radio"
            value="pickup"
            className="sr-only"
          />
          <div className="text-center">
            <div className="text-3xl mb-2">🏪</div>
            <div className="font-semibold">Pickup</div>
          </div>
        </label>
      </div>
    </div>
  );
}

interface DeliveryAddressSectionProps {
  register: any;
  errors: any;
}

function DeliveryAddressSection({ register, errors }: DeliveryAddressSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Delivery Address
      </h2>

      <div className="space-y-4">
        {/* Address */}
        <div>
          <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            {...register('deliveryAddress')}
            type="text"
            id="deliveryAddress"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main St, Apt 4B"
          />
          {errors.deliveryAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
          )}
        </div>

        {/* Delivery Instructions */}
        <div>
          <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Instructions (Optional)
          </label>
          <textarea
            {...register('deliveryInstructions')}
            id="deliveryInstructions"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Ring doorbell, leave at door, etc."
          />
          {errors.deliveryInstructions && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveryInstructions.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface PaymentMethodSectionProps {
  register: any;
  errors: any;
}

function PaymentMethodSection({ register, errors }: PaymentMethodSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Payment Method
      </h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all"
          >
            <input
              {...register('paymentMethod')}
              type="radio"
              value={method.id}
              className="w-4 h-4 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-2xl">{method.icon}</span>
            <span className="ml-3 font-medium text-gray-900">{method.label}</span>
          </label>
        ))}
      </div>
      {errors.paymentMethod && (
        <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>
      )}
    </div>
  );
}

interface SpecialRequestsSectionProps {
  register: any;
  errors: any;
}

function SpecialRequestsSection({ register, errors }: SpecialRequestsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Special Requests (Optional)
      </h2>

      <textarea
        {...register('specialRequests')}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        placeholder="Any special requests or dietary requirements?"
      />
      {errors.specialRequests && (
        <p className="mt-1 text-sm text-red-600">{errors.specialRequests.message}</p>
      )}
    </div>
  );
}
```

### Step 4: Create Order Summary Component

```tsx
// app/checkout/page.tsx (continued)

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

function OrderSummary({ items, subtotal, tax, deliveryFee, total }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      {/* Items List */}
      <div className="mb-4 space-y-3">
        {items.map((item) => (
          <div key={item.dishId} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.name} × {item.quantity}
            </span>
            <span className="text-gray-900 font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>

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

        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Add Layout Metadata

```tsx
// app/checkout/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout - Bella Cucina',
  description: 'Complete your order',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## Acceptance Criteria

- [ ] Checkout page renders at `/checkout`
- [ ] Form validates all fields correctly
- [ ] Required field errors display clearly
- [ ] Order type selection works (delivery/pickup)
- [ ] Delivery address only required for delivery
- [ ] Payment method selection works
- [ ] Order summary displays correctly
- [ ] Submit button disabled during submission
- [ ] Order creates successfully via API
- [ ] Redirects to order confirmation on success
- [ ] Error toast shows if submission fails
- [ ] Redirects to cart if cart is empty
- [ ] Form is fully responsive

## Testing Strategy

### Manual Testing

```bash
# Test checklist:

1. Form Validation
   - [ ] Submit empty form shows errors
   - [ ] Invalid email shows error
   - [ ] Invalid phone shows error
   - [ ] Fix errors and submit succeeds

2. Order Type
   - [ ] Select delivery shows address field
   - [ ] Select pickup hides address field
   - [ ] Delivery without address shows error

3. Payment Method
   - [ ] All payment options selectable
   - [ ] Submit without selection shows error

4. Order Submission
   - [ ] Fill valid form
   - [ ] Click Place Order
   - [ ] Loading state appears
   - [ ] Redirects to /orders/[id]
   - [ ] Cart is cleared

5. Error Handling
   - [ ] Test with API server down
   - [ ] Error toast appears
   - [ ] Form stays filled
   - [ ] Can retry submission
```

## Common Pitfalls

### 1. Validation Not Working

**Problem**: Form submits with invalid data
**Solution**: Ensure zodResolver is configured correctly in useForm

### 2. Conditional Validation Issues

**Problem**: Delivery address always required
**Solution**: Use Zod's refine method for conditional validation

### 3. Cart State Issues

**Problem**: Cart clears before order completes
**Solution**: Only clear cart after successful API response

### 4. Navigation Issues

**Problem**: Can't access checkout with empty cart
**Solution**: Add useEffect to redirect if cart is empty

## Related Tasks

- **Task 3.2**: Orders API endpoint
- **Task 5.3**: Cart page (previous step)
- **Task 5.5**: Order confirmation (next step)

---

**Task Status**: Ready for Implementation
**Last Updated**: 2026-02-09
