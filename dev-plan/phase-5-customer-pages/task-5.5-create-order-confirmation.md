# Task 5.5: Create Order Confirmation Page

## Task Metadata

- **Task ID**: 5.5
- **Task Name**: Create Order Confirmation Page
- **Phase**: 5 - Customer-Facing Pages
- **Prerequisites**: Phase 3 (Orders API), Task 5.4 (Checkout Page)
- **Estimated Time**: 2-3 hours
- **Priority**: High
- **Difficulty**: Medium
- **Last Updated**: 2026-02-09

## Overview

The order confirmation page is the final touchpoint in the customer ordering journey. This task involves creating a comprehensive order status page that displays order details, provides real-time status updates through polling, shows estimated delivery/pickup time, and gives customers confidence that their order was received. The page must handle different order statuses and provide a clear timeline of the order progress.

### Importance

- **Order Confirmation**: Reassures customer that order was placed
- **Real-Time Updates**: Keeps customer informed of order progress
- **Order Details**: Provides reference for the order
- **Customer Support**: Gives customers order ID for inquiries
- **User Experience**: Completes the ordering journey positively

### User Stories

1. As a customer, I want to see my order confirmation, so I know my order was placed successfully
2. As a customer, I want to see order details, so I can verify what I ordered
3. As a customer, I want real-time status updates, so I know when my food will arrive
4. As a customer, I want to see estimated time, so I can plan accordingly
5. As a customer, I want to save my order ID, so I can reference it later
6. As a customer, I want to return to menu, so I can place another order

## Prerequisites

### Completed Tasks

- ✅ Task 3.2: Orders API endpoint (`GET /api/orders/[id]`)
- ✅ Task 5.4: Checkout page (creates order)

### Required Knowledge

- Next.js 15 App Router (dynamic routes)
- React Server Components for initial data
- Client Components for polling
- useEffect for real-time updates
- setInterval for polling
- Error handling for invalid order IDs

### Environment Setup

```bash
# Start development server
npm run dev

# Create test order through checkout flow
```

## Technical Specifications

### Page Route

- **Path**: `/orders/[id]`
- **File**: `app/orders/[id]/page.tsx`
- **Type**: Hybrid (Server Component wrapper + Client Component for polling)
- **Layout**: Uses root layout with Header and Footer

### Page Sections

1. **Success Header**: Confirmation message with checkmark
2. **Order ID**: Large, prominent order number
3. **Order Status**: Current status with visual indicator
4. **Status Timeline**: Visual progress tracker
5. **Order Details**: Items, quantities, prices
6. **Order Summary**: Subtotal, tax, delivery, total
7. **Customer Info**: Name, phone, address
8. **Estimated Time**: Delivery/pickup ETA
9. **Action Buttons**: Return to menu, Print receipt

### Data Requirements

#### Order Status Types

```typescript
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryInstructions?: string;
  paymentMethod: string;
  specialRequests?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  estimatedTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
}
```

#### Status Configuration

```typescript
const ORDER_STATUSES = {
  pending: {
    label: 'Order Received',
    color: 'blue',
    icon: '📝',
    description: 'Your order has been received and is being processed',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'indigo',
    icon: '✅',
    description: 'Your order has been confirmed by the restaurant',
  },
  preparing: {
    label: 'Preparing',
    color: 'yellow',
    icon: '👨‍🍳',
    description: 'Your order is being prepared',
  },
  ready: {
    label: 'Ready',
    color: 'green',
    icon: '🎉',
    description: orderType === 'delivery' ? 'Your order is out for delivery' : 'Your order is ready for pickup',
  },
  completed: {
    label: 'Completed',
    color: 'green',
    icon: '✨',
    description: 'Your order has been completed',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
    icon: '❌',
    description: 'Your order has been cancelled',
  },
};
```

### Real-Time Polling Configuration

```typescript
const POLLING_INTERVAL = 5000; // Poll every 5 seconds
const STOP_POLLING_STATUSES = ['completed', 'cancelled']; // Stop polling for these statuses
```

### SEO Metadata

```typescript
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Order ${params.id} - Bella Cucina`,
    description: 'View your order status and details',
  };
}
```

## Implementation Guide

### Step 1: Create the Server Component Wrapper

```tsx
// app/orders/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderConfirmationClient from './OrderConfirmationClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Order Confirmation - Bella Cucina`,
    description: 'View your order status and details',
  };
}

async function getOrder(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/orders/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const initialOrder = await getOrder(params.id);

  if (!initialOrder) {
    notFound();
  }

  return <OrderConfirmationClient initialOrder={initialOrder} orderId={params.id} />;
}
```

### Step 2: Create the Client Component with Polling

```tsx
// app/orders/[id]/OrderConfirmationClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const POLLING_INTERVAL = 5000;
const STOP_POLLING_STATUSES = ['completed', 'cancelled'];

const ORDER_STATUSES = {
  pending: {
    label: 'Order Received',
    color: 'blue',
    icon: '📝',
    description: 'Your order has been received and is being processed',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'indigo',
    icon: '✅',
    description: 'Your order has been confirmed by the restaurant',
  },
  preparing: {
    label: 'Preparing',
    color: 'yellow',
    icon: '👨‍🍳',
    description: 'Your order is being prepared',
  },
  ready: {
    label: 'Ready',
    color: 'green',
    icon: '🎉',
    description: 'Your order is ready',
  },
  completed: {
    label: 'Completed',
    color: 'green',
    icon: '✨',
    description: 'Your order has been completed',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
    icon: '❌',
    description: 'Your order has been cancelled',
  },
};

interface OrderConfirmationClientProps {
  initialOrder: any;
  orderId: string;
}

export default function OrderConfirmationClient({ initialOrder, orderId }: OrderConfirmationClientProps) {
  const [order, setOrder] = useState(initialOrder);
  const [previousStatus, setPreviousStatus] = useState(initialOrder.status);

  // Poll for order updates
  useEffect(() => {
    // Don't poll if order is completed or cancelled
    if (STOP_POLLING_STATUSES.includes(order.status)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const updatedOrder = await res.json();

          // Show toast if status changed
          if (updatedOrder.status !== previousStatus) {
            toast.success(`Order status updated: ${ORDER_STATUSES[updatedOrder.status]?.label}`);
            setPreviousStatus(updatedOrder.status);
          }

          setOrder(updatedOrder);
        }
      } catch (error) {
        console.error('Error polling order status:', error);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [orderId, order.status, previousStatus]);

  const statusConfig = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <SuccessHeader />

        {/* Order ID */}
        <OrderIdSection orderNumber={order.orderNumber || order.id} />

        {/* Current Status */}
        <CurrentStatusSection status={order.status} statusConfig={statusConfig} />

        {/* Status Timeline */}
        <StatusTimeline currentStatus={order.status} orderType={order.orderType} />

        {/* Order Details */}
        <OrderDetailsSection order={order} />

        {/* Customer Info */}
        <CustomerInfoSection order={order} />

        {/* Action Buttons */}
        <ActionButtons orderId={order.id} />
      </div>
    </main>
  );
}
```

### Step 3: Create Component Sections

```tsx
// app/orders/[id]/OrderConfirmationClient.tsx (continued)

function SuccessHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        Order Confirmed!
      </h1>
      <p className="text-lg text-gray-600">
        Thank you for your order. We'll have it ready soon!
      </p>
    </div>
  );
}

function OrderIdSection({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
      <p className="text-sm text-gray-600 mb-2">Order Number</p>
      <p className="text-3xl font-bold text-gray-900 font-mono">
        #{orderNumber}
      </p>
    </div>
  );
}

function CurrentStatusSection({ status, statusConfig }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{statusConfig.icon}</div>
        <div className="flex-1">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${
            colorClasses[statusConfig.color as keyof typeof colorClasses]
          }`}>
            {statusConfig.label}
          </div>
          <p className="mt-2 text-gray-600">{statusConfig.description}</p>
        </div>
      </div>
    </div>
  );
}

function StatusTimeline({ currentStatus, orderType }: any) {
  const steps = [
    { status: 'pending', label: 'Received' },
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'preparing', label: 'Preparing' },
    { status: 'ready', label: orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup' },
    { status: 'completed', label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex(step => step.status === currentStatus);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium text-center ${
                  isCompleted ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderDetailsSection({ order }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

      {/* Items */}
      <div className="divide-y divide-gray-200">
        {order.items.map((item: any) => (
          <div key={item.id} className="py-4 flex justify-between">
            <div>
              <p className="font-medium text-gray-900">{item.dishName}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery Fee</span>
          <span>
            {order.deliveryFee === 0 ? (
              <span className="text-green-600 font-semibold">FREE</span>
            ) : (
              `$${order.deliveryFee.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function CustomerInfoSection({ order }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Name</p>
          <p className="font-medium text-gray-900">{order.customerName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Phone</p>
          <p className="font-medium text-gray-900">{order.customerPhone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Email</p>
          <p className="font-medium text-gray-900">{order.customerEmail}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Order Type</p>
          <p className="font-medium text-gray-900 capitalize">{order.orderType}</p>
        </div>

        {order.orderType === 'delivery' && order.deliveryAddress && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
            <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
            {order.deliveryInstructions && (
              <p className="text-sm text-gray-600 mt-1">
                Instructions: {order.deliveryInstructions}
              </p>
            )}
          </div>
        )}

        {order.specialRequests && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Special Requests</p>
            <p className="font-medium text-gray-900">{order.specialRequests}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButtons({ orderId }: { orderId: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        href="/menu"
        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-center"
      >
        Order Again
      </Link>
      <button
        onClick={() => window.print()}
        className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
      >
        Print Receipt
      </button>
    </div>
  );
}
```

### Step 4: Create Not Found Page

```tsx
// app/orders/[id]/not-found.tsx
import Link from 'next/link';

export default function OrderNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-xl shadow-md p-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the order you're looking for. Please check the order ID and try again.
          </p>

          <Link
            href="/menu"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
```

## Acceptance Criteria

- [ ] Order confirmation page renders at `/orders/[id]`
- [ ] Page displays all order details correctly
- [ ] Status badge shows current order status
- [ ] Status timeline visualizes progress
- [ ] Real-time polling updates status every 5 seconds
- [ ] Toast notification shows when status changes
- [ ] Polling stops when order is completed or cancelled
- [ ] Customer information displays correctly
- [ ] Order summary shows correct totals
- [ ] Print button triggers browser print dialog
- [ ] Order Again button links to menu
- [ ] Invalid order ID shows not found page
- [ ] Page is fully responsive
- [ ] No memory leaks from polling

## Testing Strategy

### Manual Testing

```bash
# Test checklist:

1. Order Confirmation Display
   - [ ] Complete checkout flow
   - [ ] Redirect to /orders/[id]
   - [ ] All order details display
   - [ ] Order number is visible

2. Status Updates
   - [ ] Initial status shows correctly
   - [ ] Manually update order status in database
   - [ ] Wait 5 seconds for poll
   - [ ] Status updates automatically
   - [ ] Toast notification appears

3. Status Timeline
   - [ ] Timeline shows all steps
   - [ ] Current step is highlighted
   - [ ] Completed steps show checkmarks
   - [ ] Progress bar fills correctly

4. Polling Behavior
   - [ ] Polling starts on page load
   - [ ] Updates every 5 seconds
   - [ ] Stops when status is 'completed'
   - [ ] Stops when status is 'cancelled'
   - [ ] No console errors

5. Error Handling
   - [ ] Visit /orders/invalid-id
   - [ ] Not found page displays
   - [ ] Return to menu button works

6. Responsive Design
   - [ ] Mobile (320px+)
   - [ ] Tablet (768px+)
   - [ ] Desktop (1024px+)

7. Actions
   - [ ] Print button opens print dialog
   - [ ] Order Again navigates to menu
```

### Polling Cleanup Test

```typescript
// Verify cleanup in useEffect
useEffect(() => {
  const interval = setInterval(() => {
    // polling logic
  }, POLLING_INTERVAL);

  // This cleanup function MUST be called when component unmounts
  return () => clearInterval(interval);
}, [dependencies]);
```

## Common Pitfalls

### 1. Memory Leaks from Polling

**Problem**: setInterval continues after component unmounts
**Solution**: Always return cleanup function in useEffect

```tsx
useEffect(() => {
  const interval = setInterval(fetchOrder, 5000);
  return () => clearInterval(interval); // CRITICAL
}, []);
```

### 2. Infinite Polling

**Problem**: Polling never stops
**Solution**: Check if status is terminal before setting interval

```tsx
if (STOP_POLLING_STATUSES.includes(order.status)) {
  return; // Don't set up polling
}
```

### 3. Stale State in Polling

**Problem**: Polling uses old state values
**Solution**: Include all dependencies in useEffect dependency array

### 4. Too Frequent Polling

**Problem**: Hammering the server with requests
**Solution**: Use reasonable interval (5-10 seconds) and stop when done

### 5. Invalid Order ID Handling

**Problem**: Error page or blank screen
**Solution**: Use Next.js notFound() function for proper 404

## Performance Optimization

### Reduce Polling Frequency

```typescript
// Adjust based on order status
const getPollingInterval = (status: string) => {
  if (status === 'pending') return 10000; // Check less frequently
  if (status === 'preparing') return 5000; // Check more frequently
  return 5000;
};
```

### Conditional Polling

```typescript
// Only poll during business hours
const shouldPoll = () => {
  const hour = new Date().getHours();
  return hour >= 11 && hour <= 22; // 11am - 10pm
};
```

## Related Tasks

- **Task 3.2**: Orders API endpoint
- **Task 5.4**: Checkout page (creates order)
- **Phase 6**: Admin dashboard (updates order status)

## Future Enhancements

1. **WebSocket Integration**: Replace polling with real-time WebSocket updates
2. **Push Notifications**: Send browser notifications for status changes
3. **SMS Updates**: Send text messages for major status changes
4. **Order History**: Link to view all past orders
5. **Reorder Button**: Quickly reorder same items
6. **Driver Tracking**: Show delivery driver location on map

## Resources

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [React useEffect Cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
- [MDN setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)

---

**Task Status**: Ready for Implementation
**Last Updated**: 2026-02-09
