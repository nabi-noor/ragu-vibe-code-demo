# Task 6.3: Create Order Management

## Task Metadata

- **Task ID**: 6.3
- **Task Name**: Create Order Management
- **Phase**: 6 - Admin Panel
- **Estimated Time**: 4-5 hours
- **Complexity**: Medium-High
- **Priority**: High
- **Dependencies**: Task 6.1 (Admin Dashboard), Phase 4 (API Routes), Phase 5 (Database)
- **Assignee**: Full-stack Developer

## Overview

Build a comprehensive order management system that allows admin users to view, filter, and manage all customer orders. The interface provides order status updates, detailed order information, customer data, and real-time order tracking. Admins can update order status through a workflow (pending → preparing → ready → completed), view order details including items and totals, and manage multiple orders efficiently with filtering and sorting capabilities.

## Importance

Order management is critical because it:
- Enables efficient order processing and fulfillment
- Provides real-time visibility into order status
- Improves customer service with timely updates
- Reduces order errors and miscommunication
- Streamlines kitchen and preparation workflows
- Supports data-driven operational decisions
- Enhances staff coordination and productivity
- Improves overall customer satisfaction

## Prerequisites

### Completed Components
- Admin authentication system (Task 6.1)
- AdminAuth wrapper component
- Database orders and order_items tables
- API routes for order operations
- Order status workflow definition
- Customer data integration

### Required Database Schema

```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(255),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  order_type ENUM('dine-in', 'takeout', 'delivery') NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id VARCHAR(255) PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  menu_item_id VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE order_status_history (
  id VARCHAR(255) PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_customer ON orders(customer_email);
```

### Dependencies

```json
{
  "dependencies": {
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

## Technical Specifications

### Order Data Models

```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory?: StatusChange[];
}

interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: {
    name: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface StatusChange {
  id: string;
  status: OrderStatus;
  changedBy?: string;
  notes?: string;
  createdAt: Date;
}

interface OrderFilters {
  status?: OrderStatus | 'all';
  orderType?: string | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}
```

### Status Workflow

```typescript
const STATUS_WORKFLOW = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};
```

## Files to Create

### 1. `/app/admin/orders/page.tsx`
Main order management page with filtering and order list.

### 2. `/app/admin/components/OrderTable.tsx`
Data table component for displaying orders.

### 3. `/app/admin/components/OrderDetails.tsx`
Modal component showing detailed order information.

### 4. `/app/admin/components/StatusUpdateModal.tsx`
Modal for updating order status with notes.

### 5. `/app/api/admin/orders/route.ts`
API endpoint for listing and filtering orders.

### 6. `/app/api/admin/orders/[id]/route.ts`
API endpoint for updating order status.

## Step-by-Step Implementation Guide

### Step 1: Create StatusUpdateModal Component

**File**: `/app/admin/components/StatusUpdateModal.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { OrderStatus } from '@prisma/client';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: OrderStatus, notes?: string) => Promise<void>;
  currentStatus: OrderStatus;
  orderNumber: string;
}

const STATUS_WORKFLOW = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function StatusUpdateModal({
  isOpen,
  onClose,
  onSubmit,
  currentStatus,
  orderNumber,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStatuses = STATUS_WORKFLOW[currentStatus] || [];

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus('');
      setNotes('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    try {
      setIsSubmitting(true);
      await onSubmit(selectedStatus as OrderStatus, notes || undefined);
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={!isSubmitting ? onClose : undefined}
        ></div>

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Update Order Status
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Order: <span className="font-semibold">{orderNumber}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Status:{' '}
                  <span className="font-semibold capitalize">{STATUS_LABELS[currentStatus]}</span>
                </p>
              </div>

              {availableStatuses.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    This order cannot be updated further. It is already {currentStatus}.
                  </p>
                </div>
              ) : (
                <>
                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status *
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select new status...</option>
                      {availableStatuses.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status as OrderStatus]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Add any additional notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {availableStatuses.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedStatus}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Create OrderDetails Component

**File**: `/app/admin/components/OrderDetails.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetails({ isOpen, onClose, order }: OrderDetailsProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order {order.orderNumber}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4 space-y-6">
            {/* Status and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${
                    STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Order Type</h4>
                <span className="text-sm text-gray-900 capitalize">{order.orderType}</span>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm text-gray-900">{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 relative rounded-md overflow-hidden">
                        <Image
                          src={item.menuItem.imageUrl || '/placeholder.jpg'}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.menuItem.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Special Instructions</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">{order.specialInstructions}</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Status History</h4>
                <div className="space-y-3">
                  {order.statusHistory.map((history: any) => (
                    <div
                      key={history.id}
                      className="flex items-start space-x-3 text-sm"
                    >
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-amber-400"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 capitalize font-medium">
                          {history.status}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {format(new Date(history.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                        {history.notes && (
                          <p className="text-gray-600 text-xs mt-1">{history.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sticky bottom-0">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Create OrderTable Component

**File**: `/app/admin/components/OrderTable.tsx`

```typescript
'use client';

import { format } from 'date-fns';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  orderType: string;
  createdAt: string;
  itemCount: number;
}

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  loading?: boolean;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  loading,
}: OrderTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {order.orderType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(order)}
                        className="text-amber-600 hover:text-amber-900"
                        title="View Details"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => onUpdateStatus(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Update Status"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 4: Create Order Management Page

**File**: `/app/admin/orders/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import AdminAuth from '../components/AdminAuth';
import OrderTable from '../components/OrderTable';
import OrderDetails from '../components/OrderDetails';
import StatusUpdateModal from '../components/StatusUpdateModal';
import toast, { Toaster } from 'react-hot-toast';
import { OrderStatus } from '@prisma/client';

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus, selectedType, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((order) => order.orderType === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetails = async (order: any) => {
    try {
      const response = await fetch(`/api/orders/${order.id}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setSelectedOrder(data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleUpdateStatusClick = (order: any) => {
    setOrderToUpdate(order);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (status: OrderStatus, notes?: string) => {
    if (!orderToUpdate) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderToUpdate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
      throw error;
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'dine-in', label: 'Dine In' },
    { value: 'takeout', label: 'Takeout' },
    { value: 'delivery', label: 'Delivery' },
  ];

  return (
    <AdminAuth>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and track all customer orders
                </p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                <svg
                  className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, customers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          {/* Table */}
          <OrderTable
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatusClick}
            loading={loading}
          />

          {/* Order Details Modal */}
          <OrderDetails
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />

          {/* Status Update Modal */}
          <StatusUpdateModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setOrderToUpdate(null);
            }}
            onSubmit={handleStatusUpdate}
            currentStatus={orderToUpdate?.status}
            orderNumber={orderToUpdate?.orderNumber}
          />
        </div>
      </div>
    </AdminAuth>
  );
}
```

### Step 5: Create API Routes

**File**: `/app/api/admin/orders/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      status: order.status,
      orderType: order.orderType,
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.length,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
```

**File**: `/app/api/admin/orders/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes } = body;

    // Update order status
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Create status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: params.id,
        status,
        changedBy: user.id,
        notes,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
```

## Acceptance Criteria

- [ ] Orders display in data table with all relevant information
- [ ] Search filters orders by order number, customer name, and email
- [ ] Status filter shows only orders with selected status
- [ ] Type filter shows only orders of selected type
- [ ] Auto-refresh updates orders every 30 seconds
- [ ] View details button opens modal with complete order information
- [ ] Update status button opens modal for status changes
- [ ] Status workflow enforced (can only move to allowed statuses)
- [ ] Status updates persist and show success notification
- [ ] Status history tracks all changes
- [ ] Order details modal shows all items with images
- [ ] Special instructions display prominently
- [ ] Toast notifications appear for all actions
- [ ] Loading states display during data fetching
- [ ] Error messages show for failed operations

## Testing Strategy

Test order management workflows end-to-end.

## Common Pitfalls

### Status Workflow Violations
**Problem**: Allow invalid status transitions
**Solution**: Implement status workflow validation on both client and server

### Missing Order Details
**Problem**: Items don't load with order
**Solution**: Include proper relations in Prisma query

## Related Tasks

- **Task 6.1**: Admin Dashboard
- **Task 6.2**: Menu Management
- **Task 6.4**: Admin Navigation

---

**Task Status**: Ready for Implementation
**Estimated Time**: 4-5 hours
**Next Task**: Task 6.4 - Add Admin Navigation
