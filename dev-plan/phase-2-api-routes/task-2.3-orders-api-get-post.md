# Task 2.3: Orders API - GET and POST Endpoints

## Task Metadata

- **Task ID**: 2.3
- **Phase**: 2 (Core API Routes)
- **Complexity**: High
- **Estimated Time**: 3 hours
- **Prerequisites**: Tasks 1.4, 1.5, 1.6
- **Endpoints**:
  - `GET /api/orders`
  - `POST /api/orders`

## Overview

This task implements the order management endpoints that handle customer orders. The GET endpoint retrieves orders with filtering capabilities, while the POST endpoint creates new orders with automatic tax calculation, order ID generation, and validation of menu item references.

This is the most complex task in Phase 2 because it involves:
- Multi-item order creation with nested objects
- Cross-referencing menu items to validate availability and prices
- Automatic calculation of subtotals, tax (10%), and totals
- Generation of unique order IDs in ORD-XXX format
- Comprehensive validation of order items and customer information

## Importance

This task is critical because:

1. **Core Business Logic**: Orders are the primary business transaction in a restaurant app
2. **Complex Validation**: Must validate menu item references, quantities, and pricing
3. **Tax Calculation**: Implements 10% tax calculation for all orders
4. **Order ID Generation**: Creates unique, sequential order IDs
5. **Data Consistency**: Ensures menu items exist and are available before accepting orders
6. **Customer Data**: Handles customer contact information securely
7. **Order Tracking**: Establishes foundation for order status management

## Prerequisites

Before starting this task, ensure the following are complete:

### Required Files from Phase 1

1. **`/types/order.ts`** (Task 1.4)
   - `Order` interface
   - `OrderItem` interface
   - `OrderStatus` type
   - `PaymentMethod` type

2. **`/types/menu.ts`** (Task 1.4)
   - `MenuItem` interface (for reference validation)

3. **`/lib/data/orderStore.ts`** (Task 1.5)
   - `getOrders()` function
   - `addOrder()` function
   - `getNextOrderNumber()` function

4. **`/lib/data/menuStore.ts`** (Task 1.5)
   - `getMenuItemById()` function (for validation)

5. **`/lib/data/seed.ts`** (Task 1.6)
   - Sample order data seeded

### Verification Steps

```bash
# Check that order types exist
cat /Users/noorragu/Documents/vibe-code-demo/types/order.ts

# Check that order store exists
cat /Users/noorragu/Documents/vibe-code-demo/lib/data/orderStore.ts

# Verify menu store for cross-reference
cat /Users/noorragu/Documents/vibe-code-demo/lib/data/menuStore.ts

# Test the server
npm run dev
```

## Technical Specifications

### API Contract: GET /api/orders

**Endpoint**: `GET /api/orders`

**Purpose**: Retrieve all orders with optional filtering

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| status | string | No | Filter by order status | `?status=pending` |
| customerName | string | No | Filter by customer name (partial match) | `?customerName=John` |
| sortBy | string | No | Sort field (createdAt, total) | `?sortBy=createdAt` |
| sortOrder | string | No | Sort direction (asc, desc) | `?sortOrder=desc` |

**Valid Status Values**:
- `pending` - Order received, not yet prepared
- `preparing` - Order being prepared
- `ready` - Order ready for pickup/delivery
- `completed` - Order delivered/picked up
- `cancelled` - Order cancelled

**Request Example**:
```http
GET /api/orders HTTP/1.1
Host: localhost:3000
Accept: application/json

# With filters
GET /api/orders?status=pending&sortOrder=desc HTTP/1.1
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "ORD-001",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "+1-555-0123",
      "items": [
        {
          "menuItemId": "1",
          "name": "Margherita Pizza",
          "quantity": 2,
          "price": 12.99,
          "subtotal": 25.98
        },
        {
          "menuItemId": "5",
          "name": "Caesar Salad",
          "quantity": 1,
          "price": 8.99,
          "subtotal": 8.99
        }
      ],
      "subtotal": 34.97,
      "tax": 3.50,
      "total": 38.47,
      "status": "pending",
      "paymentMethod": "credit_card",
      "deliveryAddress": "123 Main St, Apt 4B",
      "specialInstructions": "Please ring doorbell",
      "createdAt": "2026-02-09T10:30:00.000Z",
      "updatedAt": "2026-02-09T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Empty Response** (200 OK):
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Invalid status. Must be one of: pending, preparing, ready, completed, cancelled",
    "code": "INVALID_STATUS"
  }
}
```

### API Contract: POST /api/orders

**Endpoint**: `POST /api/orders`

**Purpose**: Create a new order with automatic tax calculation

**Request Headers**:
```
Content-Type: application/json
```

**Request Body Schema**:
```typescript
{
  customerName: string;           // Required, min 2 chars, max 100 chars
  customerEmail: string;          // Required, valid email format
  customerPhone: string;          // Required, valid phone format
  items: Array<{                  // Required, min 1 item
    menuItemId: string;           // Required, must exist in menu
    quantity: number;             // Required, positive integer
  }>;
  paymentMethod: PaymentMethod;   // Required, valid enum value
  deliveryAddress?: string;       // Optional, required for delivery
  specialInstructions?: string;   // Optional, max 500 chars
}
```

**Payment Method Values**:
- `cash`
- `credit_card`
- `debit_card`
- `online`

**Request Example**:
```json
POST /api/orders HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+1-555-0456",
  "items": [
    {
      "menuItemId": "1",
      "quantity": 2
    },
    {
      "menuItemId": "3",
      "quantity": 1
    }
  ],
  "paymentMethod": "credit_card",
  "deliveryAddress": "456 Oak Avenue, Unit 12",
  "specialInstructions": "Extra napkins please"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "ORD-005",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "customerPhone": "+1-555-0456",
    "items": [
      {
        "menuItemId": "1",
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 12.99,
        "subtotal": 25.98
      },
      {
        "menuItemId": "3",
        "name": "Tiramisu",
        "quantity": 1,
        "price": 8.99,
        "subtotal": 8.99
      }
    ],
    "subtotal": 34.97,
    "tax": 3.50,
    "total": 38.47,
    "status": "pending",
    "paymentMethod": "credit_card",
    "deliveryAddress": "456 Oak Avenue, Unit 12",
    "specialInstructions": "Extra napkins please",
    "createdAt": "2026-02-09T14:25:00.000Z",
    "updatedAt": "2026-02-09T14:25:00.000Z"
  }
}
```

**Validation Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "customerEmail",
        "message": "Invalid email format"
      },
      {
        "field": "items[0].menuItemId",
        "message": "Menu item with ID '999' not found"
      }
    ]
  }
}
```

**Menu Item Unavailable Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "One or more menu items are unavailable",
    "code": "MENU_ITEM_UNAVAILABLE",
    "details": [
      {
        "field": "items[1].menuItemId",
        "message": "Menu item 'Seasonal Special' is currently unavailable"
      }
    ]
  }
}
```

## Files to Create

### Primary File

**File Path**: `/app/api/orders/route.ts`

**Purpose**: Route handler for orders collection endpoints

**Exports**:
- `GET` - Async function handling GET requests
- `POST` - Async function handling POST requests with complex validation

### Optional Utility File

**File Path**: `/lib/utils/order-helpers.ts`

**Purpose**: Helper functions for order processing

**Functions**:
- `generateOrderId(orderNumber: number): string` - Generate ORD-XXX format ID
- `calculateOrderTotals(subtotal: number): { subtotal, tax, total }` - Calculate 10% tax
- `validateEmail(email: string): boolean` - Validate email format
- `validatePhone(phone: string): boolean` - Validate phone format

## Step-by-Step Implementation Guide

### Step 1: Create Order Helpers Utility (Optional but Recommended)

Create `/lib/utils/order-helpers.ts`:

```typescript
/**
 * Generates an order ID in the format ORD-XXX
 * @param orderNumber - The sequential order number
 * @returns Formatted order ID (e.g., "ORD-001", "ORD-123")
 */
export function generateOrderId(orderNumber: number): string {
  // Pad with zeros to ensure 3 digits (001, 002, ..., 999)
  const paddedNumber = orderNumber.toString().padStart(3, '0');
  return `ORD-${paddedNumber}`;
}

/**
 * Calculates order totals including 10% tax
 * @param subtotal - The order subtotal before tax
 * @returns Object with subtotal, tax, and total (all rounded to 2 decimals)
 */
export function calculateOrderTotals(subtotal: number): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format
 * Accepts formats like: +1-555-0123, (555) 123-4567, 555-123-4567
 * @param phone - Phone number to validate
 * @returns True if valid phone format
 */
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  // Check if it has 10-15 digits (supports international)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}
```

### Step 2: Create Directory Structure

```bash
# Create the api/orders directory
mkdir -p /Users/noorragu/Documents/vibe-code-demo/app/api/orders

# Create utils directory if it doesn't exist
mkdir -p /Users/noorragu/Documents/vibe-code-demo/lib/utils
```

### Step 3: Create Initial Route Handler

Create `/app/api/orders/route.ts` with initial structure:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOrders, addOrder, getNextOrderNumber } from '@/lib/data/orderStore';
import { getMenuItemById } from '@/lib/data/menuStore';
import { Order, OrderItem, OrderStatus, PaymentMethod } from '@/types/order';
import { generateOrderId, calculateOrderTotals, validateEmail, validatePhone } from '@/lib/utils/order-helpers';

/**
 * GET /api/orders
 * Retrieves all orders with optional filtering and sorting
 *
 * Query parameters:
 * - status: Filter by order status
 * - customerName: Filter by customer name (partial match)
 * - sortBy: Sort field (createdAt, total)
 * - sortOrder: Sort direction (asc, desc)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Extract and validate query parameters
    // TODO: Fetch orders from store
    // TODO: Apply filters
    // TODO: Apply sorting
    // TODO: Return results
  } catch (error) {
    // TODO: Handle errors
  }
}

/**
 * POST /api/orders
 * Creates a new order with automatic tax calculation
 *
 * Request body: Order creation payload
 * Returns: Created order with generated ID and calculated totals
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Parse request body
    // TODO: Validate customer information
    // TODO: Validate order items
    // TODO: Validate menu item references
    // TODO: Check menu item availability
    // TODO: Calculate order totals
    // TODO: Generate order ID
    // TODO: Create order
    // TODO: Return created order
  } catch (error) {
    // TODO: Handle errors
  }
}
```

### Step 4: Implement GET Endpoint

```typescript
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const customerNameParam = searchParams.get('customerName');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate status parameter if provided
    if (statusParam) {
      const validStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
      if (!validStatuses.includes(statusParam as OrderStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
              code: 'INVALID_STATUS'
            }
          },
          { status: 400 }
        );
      }
    }

    // Validate sortBy parameter
    const validSortFields = ['createdAt', 'total', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Invalid sortBy field. Must be one of: ${validSortFields.join(', ')}`,
            code: 'INVALID_SORT_FIELD'
          }
        },
        { status: 400 }
      );
    }

    // Validate sortOrder parameter
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid sortOrder. Must be either "asc" or "desc"',
            code: 'INVALID_SORT_ORDER'
          }
        },
        { status: 400 }
      );
    }

    // Fetch all orders
    let orders = getOrders();

    // Apply status filter if provided
    if (statusParam) {
      orders = orders.filter(order => order.status === statusParam);
    }

    // Apply customer name filter if provided (case-insensitive partial match)
    if (customerNameParam) {
      const searchTerm = customerNameParam.toLowerCase();
      orders = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    orders.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(a[sortBy]).getTime();
        bValue = new Date(b[sortBy]).getTime();
      } else if (sortBy === 'total') {
        aValue = a.total;
        bValue = b.total;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    // Return filtered and sorted results
    return NextResponse.json(
      {
        success: true,
        data: orders,
        count: orders.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while fetching orders',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 5: Implement POST Endpoint with Complex Validation

```typescript
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid JSON in request body',
            code: 'INVALID_JSON'
          }
        },
        { status: 400 }
      );
    }

    // Validation errors array
    const validationErrors: Array<{ field: string; message: string }> = [];

    // Validate customer name
    if (!body.customerName || typeof body.customerName !== 'string') {
      validationErrors.push({ field: 'customerName', message: 'Customer name is required and must be a string' });
    } else if (body.customerName.trim().length < 2 || body.customerName.trim().length > 100) {
      validationErrors.push({ field: 'customerName', message: 'Customer name must be between 2 and 100 characters' });
    }

    // Validate customer email
    if (!body.customerEmail || typeof body.customerEmail !== 'string') {
      validationErrors.push({ field: 'customerEmail', message: 'Customer email is required and must be a string' });
    } else if (!validateEmail(body.customerEmail)) {
      validationErrors.push({ field: 'customerEmail', message: 'Invalid email format' });
    }

    // Validate customer phone
    if (!body.customerPhone || typeof body.customerPhone !== 'string') {
      validationErrors.push({ field: 'customerPhone', message: 'Customer phone is required and must be a string' });
    } else if (!validatePhone(body.customerPhone)) {
      validationErrors.push({ field: 'customerPhone', message: 'Invalid phone number format' });
    }

    // Validate items array
    if (!body.items || !Array.isArray(body.items)) {
      validationErrors.push({ field: 'items', message: 'Items is required and must be an array' });
    } else if (body.items.length === 0) {
      validationErrors.push({ field: 'items', message: 'Order must contain at least one item' });
    } else {
      // Validate each item
      body.items.forEach((item: any, index: number) => {
        if (!item.menuItemId || typeof item.menuItemId !== 'string') {
          validationErrors.push({
            field: `items[${index}].menuItemId`,
            message: 'Menu item ID is required and must be a string'
          });
        }

        if (item.quantity === undefined || item.quantity === null) {
          validationErrors.push({
            field: `items[${index}].quantity`,
            message: 'Quantity is required'
          });
        } else if (typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
          validationErrors.push({
            field: `items[${index}].quantity`,
            message: 'Quantity must be a positive integer'
          });
        }
      });
    }

    // Validate payment method
    if (!body.paymentMethod) {
      validationErrors.push({ field: 'paymentMethod', message: 'Payment method is required' });
    } else {
      const validPaymentMethods: PaymentMethod[] = ['cash', 'credit_card', 'debit_card', 'online'];
      if (!validPaymentMethods.includes(body.paymentMethod)) {
        validationErrors.push({
          field: 'paymentMethod',
          message: `Payment method must be one of: ${validPaymentMethods.join(', ')}`
        });
      }
    }

    // Validate optional fields
    if (body.specialInstructions && typeof body.specialInstructions === 'string') {
      if (body.specialInstructions.length > 500) {
        validationErrors.push({
          field: 'specialInstructions',
          message: 'Special instructions must be at most 500 characters'
        });
      }
    }

    // Return validation errors if any basic validation failed
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validationErrors
          }
        },
        { status: 400 }
      );
    }

    // Validate menu items exist and are available, and build order items
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      const menuItem = getMenuItemById(item.menuItemId);

      // Check if menu item exists
      if (!menuItem) {
        validationErrors.push({
          field: `items[${i}].menuItemId`,
          message: `Menu item with ID '${item.menuItemId}' not found`
        });
        continue;
      }

      // Check if menu item is available
      if (!menuItem.available) {
        validationErrors.push({
          field: `items[${i}].menuItemId`,
          message: `Menu item '${menuItem.name}' is currently unavailable`
        });
        continue;
      }

      // Calculate item subtotal
      const itemSubtotal = menuItem.price * item.quantity;

      // Build order item
      orderItems.push({
        menuItemId: item.menuItemId,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        subtotal: parseFloat(itemSubtotal.toFixed(2))
      });

      subtotal += itemSubtotal;
    }

    // Return errors if menu item validation failed
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'One or more menu items are invalid or unavailable',
            code: 'MENU_ITEM_VALIDATION_FAILED',
            details: validationErrors
          }
        },
        { status: 400 }
      );
    }

    // Calculate totals with tax
    const { subtotal: finalSubtotal, tax, total } = calculateOrderTotals(subtotal);

    // Generate order ID
    const orderNumber = getNextOrderNumber();
    const orderId = generateOrderId(orderNumber);

    // Get current timestamp
    const now = new Date().toISOString();

    // Create order object
    const newOrder: Order = {
      id: orderId,
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim().toLowerCase(),
      customerPhone: body.customerPhone.trim(),
      items: orderItems,
      subtotal: finalSubtotal,
      tax: tax,
      total: total,
      status: 'pending',
      paymentMethod: body.paymentMethod,
      deliveryAddress: body.deliveryAddress?.trim(),
      specialInstructions: body.specialInstructions?.trim(),
      createdAt: now,
      updatedAt: now
    };

    // Add order to store
    const createdOrder = addOrder(newOrder);

    // Return created order
    return NextResponse.json(
      {
        success: true,
        data: createdOrder
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while creating order',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 6: Test the Implementation

```bash
cd /Users/noorragu/Documents/vibe-code-demo
npm run dev
```

## Testing Strategy

### Manual Testing with curl

#### Test 1: GET All Orders

```bash
curl -X GET http://localhost:3000/api/orders
```

**Expected**: Returns all orders with status 200

#### Test 2: GET Orders by Status

```bash
curl -X GET "http://localhost:3000/api/orders?status=pending"
```

**Expected**: Returns only pending orders

#### Test 3: GET Orders with Sorting

```bash
curl -X GET "http://localhost:3000/api/orders?sortBy=total&sortOrder=desc"
```

**Expected**: Returns orders sorted by total (highest first)

#### Test 4: POST Create Valid Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Alice Johnson",
    "customerEmail": "alice@example.com",
    "customerPhone": "+1-555-9876",
    "items": [
      {
        "menuItemId": "1",
        "quantity": 2
      },
      {
        "menuItemId": "2",
        "quantity": 1
      }
    ],
    "paymentMethod": "credit_card",
    "deliveryAddress": "789 Elm Street",
    "specialInstructions": "Ring doorbell twice"
  }'
```

**Expected**: Returns created order with ORD-XXX ID, calculated totals, status 201

#### Test 5: POST with Invalid Email

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Bob Smith",
    "customerEmail": "invalid-email",
    "customerPhone": "+1-555-1234",
    "items": [{"menuItemId": "1", "quantity": 1}],
    "paymentMethod": "cash"
  }'
```

**Expected**: Returns 400 validation error for invalid email

#### Test 6: POST with Non-Existent Menu Item

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Charlie Brown",
    "customerEmail": "charlie@example.com",
    "customerPhone": "+1-555-5555",
    "items": [{"menuItemId": "999", "quantity": 1}],
    "paymentMethod": "cash"
  }'
```

**Expected**: Returns 400 error indicating menu item not found

#### Test 7: POST with Zero Quantity

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Diana Prince",
    "customerEmail": "diana@example.com",
    "customerPhone": "+1-555-7777",
    "items": [{"menuItemId": "1", "quantity": 0}],
    "paymentMethod": "credit_card"
  }'
```

**Expected**: Returns 400 validation error for invalid quantity

#### Test 8: POST with Empty Items Array

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Eve Adams",
    "customerEmail": "eve@example.com",
    "customerPhone": "+1-555-8888",
    "items": [],
    "paymentMethod": "cash"
  }'
```

**Expected**: Returns 400 validation error for empty items

#### Test 9: Verify Tax Calculation

```bash
# Create order and verify 10% tax
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Frank Castle",
    "customerEmail": "frank@example.com",
    "customerPhone": "+1-555-9999",
    "items": [{"menuItemId": "1", "quantity": 1}],
    "paymentMethod": "cash"
  }'

# If menu item 1 costs $12.99:
# Expected subtotal: 12.99
# Expected tax: 1.30 (10% of 12.99)
# Expected total: 14.29
```

#### Test 10: Verify Order ID Generation

```bash
# Create multiple orders and check ID increment
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Order Test 1",
    "customerEmail": "test1@example.com",
    "customerPhone": "+1-555-0001",
    "items": [{"menuItemId": "1", "quantity": 1}],
    "paymentMethod": "cash"
  }'

# Note the order ID (e.g., ORD-005)

curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Order Test 2",
    "customerEmail": "test2@example.com",
    "customerPhone": "+1-555-0002",
    "items": [{"menuItemId": "1", "quantity": 1}],
    "paymentMethod": "cash"
  }'

# Should be ORD-006 (incremented)
```

## Acceptance Criteria

- [ ] `/app/api/orders/route.ts` file is created
- [ ] `/lib/utils/order-helpers.ts` utility file is created
- [ ] GET endpoint returns all orders successfully
- [ ] GET endpoint filters by status correctly
- [ ] GET endpoint filters by customer name (partial match)
- [ ] GET endpoint sorts by specified field and order
- [ ] GET endpoint validates status parameter
- [ ] POST endpoint creates orders successfully
- [ ] POST endpoint validates customer information
- [ ] POST endpoint validates all required fields
- [ ] POST endpoint validates items array (not empty)
- [ ] POST endpoint validates each item's quantity
- [ ] POST endpoint checks menu items exist
- [ ] POST endpoint checks menu items are available
- [ ] POST endpoint calculates subtotals correctly
- [ ] POST endpoint calculates 10% tax correctly
- [ ] POST endpoint calculates total correctly
- [ ] POST endpoint generates order IDs in ORD-XXX format
- [ ] POST endpoint increments order IDs sequentially
- [ ] POST endpoint sets status to "pending"
- [ ] POST endpoint sets timestamps (createdAt, updatedAt)
- [ ] Both endpoints return consistent response format
- [ ] Error messages are clear and helpful
- [ ] TypeScript types are properly used
- [ ] No TypeScript compilation errors
- [ ] All manual tests pass

## Common Pitfalls

1. **Not validating menu item references**
   ```typescript
   // MUST check if menu item exists
   const menuItem = getMenuItemById(item.menuItemId);
   if (!menuItem) {
     // Return error
   }
   ```

2. **Not checking menu item availability**
   ```typescript
   // MUST check availability
   if (!menuItem.available) {
     // Return error
   }
   ```

3. **Incorrect tax calculation**
   ```typescript
   // WRONG - Not rounding properly
   const tax = subtotal * 0.10;

   // CORRECT - Round to 2 decimals
   const tax = parseFloat((subtotal * 0.10).toFixed(2));
   ```

4. **Order ID padding errors**
   ```typescript
   // WRONG
   const id = `ORD-${orderNumber}`;  // Produces ORD-1, ORD-2

   // CORRECT
   const id = `ORD-${orderNumber.toString().padStart(3, '0')}`;  // Produces ORD-001, ORD-002
   ```

5. **Not trimming customer input**
   ```typescript
   // ALWAYS trim strings
   customerName: body.customerName.trim(),
   customerEmail: body.customerEmail.trim().toLowerCase()
   ```

6. **Forgetting to calculate item subtotals**
   ```typescript
   // Each item needs its own subtotal
   subtotal: parseFloat((menuItem.price * quantity).toFixed(2))
   ```

7. **Not setting timestamps**
   ```typescript
   // MUST set both
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString()
   ```

8. **Case-sensitive email storage**
   ```typescript
   // CORRECT - Normalize to lowercase
   customerEmail: body.customerEmail.trim().toLowerCase()
   ```

## Related Tasks

### Depends On
- **Task 1.4**: TypeScript Type Definitions
- **Task 1.5**: In-Memory Data Stores
- **Task 1.6**: Data Initialization

### Blocks
- **Task 2.4**: Single Order API - GET and PATCH Endpoints
- **Future Phase**: Order Management UI
- **Future Phase**: Customer Order Tracking

### Related
- **Task 2.1**: Menu API (similar validation patterns)

## Performance and Security Notes

### Current Implementation
- Sequential menu item validation (acceptable for small orders)
- No rate limiting on order creation
- No duplicate order prevention
- Email validation is basic regex

### Future Enhancements
- Add duplicate order detection (same customer, items within time window)
- Implement rate limiting per customer
- Add more sophisticated email validation
- Add phone number normalization
- Implement inventory tracking
- Add payment processing integration
- Add order confirmation emails

## Code Quality Checklist

- [ ] Code is properly formatted
- [ ] All imports are correct
- [ ] No unused variables
- [ ] Helper functions are in separate file
- [ ] TypeScript shows no errors
- [ ] Error logging is comprehensive
- [ ] Variable names are descriptive
- [ ] Comments explain complex logic
- [ ] Response format is consistent
- [ ] Status codes are correct
- [ ] All edge cases are handled

---

**Task Status**: Ready to implement
**Last Updated**: 2026-02-09
**Estimated Time**: 3 hours
**Priority**: High
**Complexity**: High
