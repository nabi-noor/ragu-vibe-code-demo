# Task 2.4: Single Order API - GET and PATCH Endpoints

## Task Metadata

- **Task ID**: 2.4
- **Phase**: 2 (Core API Routes)
- **Complexity**: Medium
- **Estimated Time**: 2 hours
- **Prerequisites**: Tasks 1.4, 1.5, 1.6, 2.3
- **Endpoints**:
  - `GET /api/orders/[id]`
  - `PATCH /api/orders/[id]`

## Overview

This task completes the order management API by implementing endpoints for retrieving and updating individual orders. The GET endpoint allows fetching detailed information about a specific order, while the PATCH endpoint enables partial updates to orders, primarily for status changes as orders progress through preparation and delivery.

Unlike Task 2.2 which used PUT for full replacement, this task implements PATCH for partial updates, allowing clients to update only the order status without resending the entire order object. This is more appropriate for order management workflows where staff only need to update the order status.

## Importance

This task is critical because:

1. **Order Tracking**: Enables customers and staff to view detailed order information
2. **Status Management**: Allows updating order status as it progresses through workflow
3. **Partial Updates**: Demonstrates PATCH semantics for targeted field updates
4. **Order Workflow**: Supports kitchen and delivery staff workflow management
5. **Audit Trail**: Updates timestamps to track when orders were last modified
6. **Dynamic Routes**: Reinforces Next.js dynamic route patterns
7. **Data Integrity**: Validates status transitions and prevents invalid updates

## Prerequisites

Before starting this task, ensure the following are complete:

### Required Files from Previous Tasks

1. **`/types/order.ts`** (Task 1.4)
   - `Order` interface
   - `OrderStatus` type

2. **`/lib/data/orderStore.ts`** (Task 1.5)
   - `getOrderById()` function
   - `updateOrder()` function

3. **`/app/api/orders/route.ts`** (Task 2.3)
   - GET and POST endpoints implemented
   - Order creation patterns established

### Verification Steps

```bash
# Verify order store has required functions
grep -E "(getOrderById|updateOrder)" /Users/noorragu/Documents/vibe-code-demo/lib/data/orderStore.ts

# Verify previous API route exists
ls -la /Users/noorragu/Documents/vibe-code-demo/app/api/orders/route.ts

# Test the server
npm run dev
```

## Technical Specifications

### API Contract: GET /api/orders/[id]

**Endpoint**: `GET /api/orders/[id]`

**Purpose**: Retrieve a single order by ID

**Path Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | string | Yes | Unique order identifier | `/api/orders/ORD-001` |

**Request Example**:
```http
GET /api/orders/ORD-001 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
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
    "status": "preparing",
    "paymentMethod": "credit_card",
    "deliveryAddress": "123 Main St, Apt 4B",
    "specialInstructions": "Please ring doorbell",
    "createdAt": "2026-02-09T10:30:00.000Z",
    "updatedAt": "2026-02-09T10:45:00.000Z"
  }
}
```

**Not Found Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "message": "Order with ID 'ORD-999' not found",
    "code": "ORDER_NOT_FOUND"
  }
}
```

### API Contract: PATCH /api/orders/[id]

**Endpoint**: `PATCH /api/orders/[id]`

**Purpose**: Update order status (partial update)

**Path Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | string | Yes | Unique order identifier | `/api/orders/ORD-001` |

**Request Headers**:
```
Content-Type: application/json
```

**Request Body Schema**:
```typescript
{
  status: OrderStatus;  // Required, valid enum value
  // Note: PATCH only allows status updates in this implementation
  // Future: Could support updating deliveryAddress, specialInstructions
}
```

**Valid Status Values**:
- `pending` - Order received, awaiting preparation
- `preparing` - Order being prepared in kitchen
- `ready` - Order ready for pickup/delivery
- `completed` - Order delivered or picked up
- `cancelled` - Order cancelled

**Valid Status Transitions**:
- `pending` → `preparing`, `cancelled`
- `preparing` → `ready`, `cancelled`
- `ready` → `completed`, `cancelled`
- `completed` → (no transitions, final state)
- `cancelled` → (no transitions, final state)

**Request Example**:
```http
PATCH /api/orders/ORD-001 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "status": "ready"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
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
      }
    ],
    "subtotal": 25.98,
    "tax": 2.60,
    "total": 28.58,
    "status": "ready",
    "paymentMethod": "credit_card",
    "deliveryAddress": "123 Main St, Apt 4B",
    "specialInstructions": "Please ring doorbell",
    "createdAt": "2026-02-09T10:30:00.000Z",
    "updatedAt": "2026-02-09T11:15:00.000Z"
  }
}
```

**Not Found Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "message": "Order with ID 'ORD-999' not found",
    "code": "ORDER_NOT_FOUND"
  }
}
```

**Invalid Status Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Invalid status. Must be one of: pending, preparing, ready, completed, cancelled",
    "code": "INVALID_STATUS"
  }
}
```

**Invalid Transition Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Invalid status transition from 'completed' to 'preparing'",
    "code": "INVALID_STATUS_TRANSITION"
  }
}
```

## Files to Create

### Primary File

**File Path**: `/app/api/orders/[id]/route.ts`

**Purpose**: Route handler for individual order operations

**Directory Structure**:
```
app/
└── api/
    └── orders/
        ├── route.ts              # Task 2.3 (GET all, POST)
        └── [id]/
            └── route.ts          # Task 2.4 (GET, PATCH)
```

**Exports**:
- `GET` - Retrieve single order by ID
- `PATCH` - Update order status (partial update)

### Optional Utility File Extension

**File Path**: `/lib/utils/order-helpers.ts` (extend from Task 2.3)

**Additional Function**:
```typescript
/**
 * Validates if a status transition is allowed
 * @param currentStatus - Current order status
 * @param newStatus - Desired new status
 * @returns True if transition is valid
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean;
```

## Step-by-Step Implementation Guide

### Step 1: Add Status Transition Validation to Helpers

Update `/lib/utils/order-helpers.ts` to add:

```typescript
import { OrderStatus } from '@/types/order';

/**
 * Validates if a status transition is allowed
 * @param currentStatus - Current order status
 * @param newStatus - Desired new status
 * @returns True if transition is valid
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  // Define valid transitions
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['completed', 'cancelled'],
    completed: [],  // Final state, no transitions
    cancelled: []   // Final state, no transitions
  };

  // Check if the transition is valid
  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Gets a human-readable message for invalid status transitions
 * @param currentStatus - Current order status
 * @param newStatus - Attempted new status
 * @returns Error message string
 */
export function getInvalidTransitionMessage(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): string {
  if (currentStatus === 'completed') {
    return 'Cannot update completed orders';
  }
  if (currentStatus === 'cancelled') {
    return 'Cannot update cancelled orders';
  }
  return `Invalid status transition from '${currentStatus}' to '${newStatus}'`;
}
```

### Step 2: Create Directory Structure

```bash
# Create the api/orders/[id] directory
mkdir -p /Users/noorragu/Documents/vibe-code-demo/app/api/orders/[id]
```

### Step 3: Create Initial Route Handler

Create `/app/api/orders/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/data/orderStore';
import { Order, OrderStatus } from '@/types/order';
import { isValidStatusTransition, getInvalidTransitionMessage } from '@/lib/utils/order-helpers';

/**
 * GET /api/orders/[id]
 * Retrieves a single order by ID
 *
 * Path parameters:
 * - id: Order identifier (e.g., ORD-001)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Extract ID from params
    // TODO: Fetch order by ID
    // TODO: Handle not found case
    // TODO: Return order
  } catch (error) {
    // TODO: Handle errors
  }
}

/**
 * PATCH /api/orders/[id]
 * Updates order status (partial update)
 *
 * Path parameters:
 * - id: Order identifier
 *
 * Request body: { status: OrderStatus }
 * Returns: Updated order
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Extract ID from params
    // TODO: Verify order exists
    // TODO: Parse request body
    // TODO: Validate status field
    // TODO: Validate status transition
    // TODO: Update order
    // TODO: Return updated order
  } catch (error) {
    // TODO: Handle errors
  }
}
```

### Step 4: Implement GET Endpoint

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch order by ID
    const order = getOrderById(id);

    // Handle not found case
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Order with ID '${id}' not found`,
            code: 'ORDER_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    // Return order
    return NextResponse.json(
      {
        success: true,
        data: order
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while fetching order',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 5: Implement PATCH Endpoint

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify order exists
    const existingOrder = getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Order with ID '${id}' not found`,
            code: 'ORDER_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

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

    // Validate status field is provided
    if (!body.status) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Status is required',
            code: 'MISSING_STATUS'
          }
        },
        { status: 400 }
      );
    }

    // Validate status is a valid enum value
    const validStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(body.status)) {
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

    // Check if status is actually changing
    if (body.status === existingOrder.status) {
      // Status unchanged, return current order (idempotent)
      return NextResponse.json(
        {
          success: true,
          data: existingOrder,
          message: 'Order status unchanged'
        },
        { status: 200 }
      );
    }

    // Validate status transition
    if (!isValidStatusTransition(existingOrder.status, body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: getInvalidTransitionMessage(existingOrder.status, body.status),
            code: 'INVALID_STATUS_TRANSITION'
          }
        },
        { status: 400 }
      );
    }

    // Create updated order object (partial update - only status and updatedAt)
    const updatedOrder: Order = {
      ...existingOrder,
      status: body.status,
      updatedAt: new Date().toISOString()
    };

    // Update order in store
    const result = updateOrder(id, updatedOrder);

    if (!result) {
      // This shouldn't happen since we checked earlier
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Failed to update order with ID '${id}'`,
            code: 'UPDATE_FAILED'
          }
        },
        { status: 500 }
      );
    }

    // Return updated order
    return NextResponse.json(
      {
        success: true,
        data: result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while updating order',
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

#### Test 1: GET Single Order

```bash
curl -X GET http://localhost:3000/api/orders/ORD-001
```

**Expected**: Returns order with ID "ORD-001" and status 200

#### Test 2: GET Non-Existent Order

```bash
curl -X GET http://localhost:3000/api/orders/ORD-999
```

**Expected**: Returns 404 error with ORDER_NOT_FOUND code

#### Test 3: PATCH Update Order Status (Valid Transition)

```bash
# First, check current status
curl -X GET http://localhost:3000/api/orders/ORD-001

# If status is "pending", update to "preparing"
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

**Expected**: Returns updated order with status "preparing" and updated timestamp

#### Test 4: PATCH Continue Status Progression

```bash
# Update to "ready"
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'

# Update to "completed"
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Expected**: Each update succeeds with status 200

#### Test 5: PATCH Invalid Status Transition

```bash
# Try to update completed order back to preparing
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

**Expected**: Returns 400 error with INVALID_STATUS_TRANSITION code

#### Test 6: PATCH with Invalid Status Value

```bash
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid_status"}'
```

**Expected**: Returns 400 error with INVALID_STATUS code

#### Test 7: PATCH with Missing Status Field

```bash
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected**: Returns 400 error with MISSING_STATUS code

#### Test 8: PATCH Non-Existent Order

```bash
curl -X PATCH http://localhost:3000/api/orders/ORD-999 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

**Expected**: Returns 404 error with ORDER_NOT_FOUND code

#### Test 9: PATCH Same Status (Idempotent)

```bash
# Get current status
curl -X GET http://localhost:3000/api/orders/ORD-002

# Update to same status
curl -X PATCH http://localhost:3000/api/orders/ORD-002 \
  -H "Content-Type: application/json" \
  -d '{"status": "pending"}'
```

**Expected**: Returns 200 with message "Order status unchanged"

#### Test 10: Complete Order Workflow

```bash
# Create a new order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Workflow Test",
    "customerEmail": "workflow@example.com",
    "customerPhone": "+1-555-0000",
    "items": [{"menuItemId": "1", "quantity": 1}],
    "paymentMethod": "cash"
  }'

# Note the order ID (e.g., ORD-010)

# Progress through statuses
curl -X PATCH http://localhost:3000/api/orders/ORD-010 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'

curl -X PATCH http://localhost:3000/api/orders/ORD-010 \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'

curl -X PATCH http://localhost:3000/api/orders/ORD-010 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Verify final state
curl -X GET http://localhost:3000/api/orders/ORD-010
```

**Expected**: All transitions succeed, final GET shows "completed" status

#### Test 11: Cancel Order at Different Stages

```bash
# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Cancel Test",
    "customerEmail": "cancel@example.com",
    "customerPhone": "+1-555-1111",
    "items": [{"menuItemId": "1", "quantity": 1}],
    "paymentMethod": "cash"
  }'

# Cancel from pending
curl -X PATCH http://localhost:3000/api/orders/ORD-011 \
  -H "Content-Type: application/json" \
  -d '{"status": "cancelled"}'

# Try to update cancelled order (should fail)
curl -X PATCH http://localhost:3000/api/orders/ORD-011 \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

**Expected**: Cancel succeeds, subsequent update fails with invalid transition error

### Integration Testing Scenarios

#### Scenario 1: Kitchen Workflow

```bash
# 1. Get all pending orders
curl -X GET "http://localhost:3000/api/orders?status=pending"

# 2. Start preparing first order
curl -X PATCH http://localhost:3000/api/orders/ORD-XXX \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'

# 3. Mark as ready when done
curl -X PATCH http://localhost:3000/api/orders/ORD-XXX \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'
```

#### Scenario 2: Customer Order Tracking

```bash
# Customer checks order status
curl -X GET http://localhost:3000/api/orders/ORD-XXX

# Poll for updates (in real app, would use polling or websockets)
while true; do
  curl -s http://localhost:3000/api/orders/ORD-XXX | grep -o '"status":"[^"]*"'
  sleep 5
done
```

## Acceptance Criteria

- [ ] `/app/api/orders/[id]/route.ts` file is created
- [ ] Status transition validation helper is added to `/lib/utils/order-helpers.ts`
- [ ] GET endpoint retrieves single order by ID
- [ ] GET endpoint returns 404 for non-existent orders
- [ ] PATCH endpoint updates order status successfully
- [ ] PATCH endpoint validates status field is provided
- [ ] PATCH endpoint validates status is valid enum value
- [ ] PATCH endpoint validates status transitions
- [ ] PATCH endpoint prevents updates to completed orders
- [ ] PATCH endpoint prevents updates to cancelled orders
- [ ] PATCH endpoint updates `updatedAt` timestamp
- [ ] PATCH endpoint preserves all other order fields
- [ ] PATCH endpoint is idempotent (same status returns success)
- [ ] PATCH endpoint returns 404 for non-existent orders
- [ ] Both endpoints use consistent response format
- [ ] Dynamic route parameters work correctly
- [ ] TypeScript types are properly used
- [ ] No TypeScript compilation errors
- [ ] All manual tests pass
- [ ] Error messages are clear and helpful

## Common Pitfalls

1. **Not validating status transitions**
   ```typescript
   // WRONG - Allowing any status change
   updatedOrder.status = body.status;

   // CORRECT - Validate transition
   if (!isValidStatusTransition(currentStatus, newStatus)) {
     return error response
   }
   ```

2. **Not updating timestamp**
   ```typescript
   // MUST update timestamp
   updatedOrder.updatedAt = new Date().toISOString();
   ```

3. **Using PUT instead of PATCH**
   ```typescript
   // This is PATCH - partial update
   // Only update status, keep everything else
   const updated = {
     ...existingOrder,
     status: body.status,
     updatedAt: new Date().toISOString()
   };
   ```

4. **Not checking if order exists first**
   ```typescript
   // ALWAYS check existence
   const existingOrder = getOrderById(id);
   if (!existingOrder) {
     return 404 error
   }
   ```

5. **Not handling completed/cancelled as final states**
   ```typescript
   // These states should not allow transitions
   if (currentStatus === 'completed' || currentStatus === 'cancelled') {
     return error
   }
   ```

6. **Case sensitivity with order IDs**
   ```typescript
   // Order IDs should be case-sensitive
   // ORD-001 !== ord-001
   ```

7. **Not making PATCH idempotent**
   ```typescript
   // CORRECT - Allow same status, return success
   if (body.status === existingOrder.status) {
     return NextResponse.json({ success: true, data: existingOrder });
   }
   ```

## PATCH vs PUT: Key Differences

### This Task Uses PATCH (Partial Update)

```typescript
// PATCH /api/orders/[id]
// Only send fields to update
{
  "status": "preparing"
}

// Implementation
const updated = {
  ...existingOrder,      // Keep all fields
  status: body.status,   // Only update status
  updatedAt: now         // Update timestamp
};
```

### Task 2.2 Used PUT (Full Replacement)

```typescript
// PUT /api/menu/[id]
// Must send complete object
{
  "name": "...",
  "description": "...",
  // ... all fields required
}
```

### When to Use Each

- **PATCH**: When updating specific fields (order status, availability toggle)
- **PUT**: When replacing entire resource (menu item details)

## Status Transition Diagram

```
┌─────────┐
│ pending │
└────┬────┘
     │
     ├──────────────┐
     │              │
     ▼              ▼
┌──────────┐   ┌───────────┐
│preparing │   │ cancelled │
└────┬─────┘   └───────────┘
     │              ▲
     │              │
     ├──────────────┤
     │              │
     ▼              │
┌─────┐            │
│ready│────────────┤
└──┬──┘            │
   │               │
   │               │
   ▼               │
┌───────────┐      │
│ completed │──────┘
└───────────┘
```

## Related Tasks

### Depends On
- **Task 1.4**: TypeScript Type Definitions
- **Task 1.5**: In-Memory Data Stores
- **Task 1.6**: Data Initialization
- **Task 2.3**: Orders API - GET and POST Endpoints

### Blocks
- **Future Phase**: Order Management Dashboard UI
- **Future Phase**: Real-time Order Status Updates
- **Future Phase**: Kitchen Display System

### Related
- **Task 2.2**: Menu Item API (similar dynamic route patterns)

## Future Enhancements

### Additional PATCH Capabilities

Future versions could support updating more fields:

```typescript
// Extend PATCH to support
{
  "status": "ready",
  "deliveryAddress": "Updated address",
  "specialInstructions": "Updated instructions"
}
```

### Notification System

- Send email/SMS when order status changes
- Webhook notifications for order updates
- Push notifications to mobile apps

### Advanced Status Management

- Add estimated time for each status
- Track staff member who updated status
- Add reason field for cancellations
- Support partial fulfillment (some items ready)

## Security Considerations

### Current Implementation

- No authentication (anyone can view/update any order)
- No authorization (no role-based access)
- No rate limiting
- No audit logging

### Production Requirements

- Authenticate customers (only view their orders)
- Authorize staff (only staff can update status)
- Log all status changes with user info
- Implement rate limiting
- Add order PIN/token for customer verification

## Performance Notes

- Single order lookups are O(n) with array storage
- Future: Use Map for O(1) lookups by order ID
- Consider caching frequently accessed orders
- Index by status for faster filtered queries

## Code Quality Checklist

- [ ] Code is properly formatted
- [ ] All imports are correct
- [ ] No unused variables
- [ ] Helper functions are properly used
- [ ] TypeScript shows no errors
- [ ] Dynamic route parameters handled correctly
- [ ] Error logging is comprehensive
- [ ] Variable names are descriptive
- [ ] Comments explain business logic
- [ ] Response format is consistent
- [ ] Status codes are correct
- [ ] Transition validation is complete

## Additional Resources

### HTTP Method Semantics
- **GET**: Safe, idempotent, cacheable
- **PATCH**: Not safe, idempotent, not cacheable
- [MDN: HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

### State Machine Pattern
- Order status follows state machine pattern
- Each state has defined valid next states
- Prevents invalid state transitions

### Next.js Dynamic Routes
- Use `[id]` folder for dynamic segments
- Access via `params` parameter in route handlers

---

**Task Status**: Ready to implement
**Last Updated**: 2026-02-09
**Estimated Time**: 2 hours
**Priority**: High
**Depends On**: Task 2.3 completion
