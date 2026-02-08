# Phase 2: Core API Routes

## Overview

Phase 2 focuses on implementing the core REST API endpoints that power the Bella Cucina restaurant web application. This phase builds directly on the foundation established in Phase 1 by creating robust, type-safe API routes that interact with the in-memory data stores for menu items and orders.

The API routes developed in this phase will serve as the backbone for all client-server communication, enabling full CRUD (Create, Read, Update, Delete) operations for menu management and order processing. These endpoints follow RESTful conventions and Next.js 15 App Router patterns.

## Objectives

- Implement complete REST API for menu item management
- Create order processing and management endpoints
- Establish consistent error handling patterns across all routes
- Implement request validation and type safety
- Set up proper HTTP status code usage
- Create reusable response formatting utilities
- Implement order ID generation and tax calculation logic
- Ensure data consistency in in-memory stores

## Prerequisites

Before starting Phase 2, the following Phase 1 tasks must be completed:

- **Task 1.4**: TypeScript Type Definitions (`types/menu.ts`, `types/order.ts`)
- **Task 1.5**: In-Memory Data Stores (`lib/data/menuStore.ts`, `lib/data/orderStore.ts`)
- **Task 1.6**: Data Initialization (`lib/data/seed.ts`)

These components provide the foundational types and data management infrastructure required for API implementation.

## Task Breakdown

### Task 2.1: Menu API - GET and POST Endpoints
**File**: `task-2.1-menu-api-get-post.md`
- **Complexity**: Medium
- **Estimated Time**: 2.5 hours
- **Endpoints**:
  - `GET /api/menu` - Retrieve all menu items with optional filtering
  - `POST /api/menu` - Create new menu items

### Task 2.2: Menu Item API - PUT and DELETE Endpoints
**File**: `task-2.2-menu-item-api-put-delete.md`
- **Complexity**: Medium
- **Estimated Time**: 2 hours
- **Endpoints**:
  - `PUT /api/menu/[id]` - Update existing menu item
  - `DELETE /api/menu/[id]` - Delete menu item

### Task 2.3: Orders API - GET and POST Endpoints
**File**: `task-2.3-orders-api-get-post.md`
- **Complexity**: High
- **Estimated Time**: 3 hours
- **Endpoints**:
  - `GET /api/orders` - Retrieve all orders with filtering
  - `POST /api/orders` - Create new order with tax calculation

### Task 2.4: Single Order API - GET and PATCH Endpoints
**File**: `task-2.4-single-order-api-get-patch.md`
- **Complexity**: Medium
- **Estimated Time**: 2 hours
- **Endpoints**:
  - `GET /api/orders/[id]` - Retrieve single order
  - `PATCH /api/orders/[id]` - Update order status

## Deliverables

### API Route Files
1. `/app/api/menu/route.ts` - Menu collection endpoints
2. `/app/api/menu/[id]/route.ts` - Individual menu item endpoints
3. `/app/api/orders/route.ts` - Orders collection endpoints
4. `/app/api/orders/[id]/route.ts` - Individual order endpoints

### Utility Files (Created as Needed)
1. `/lib/utils/api-response.ts` - Standardized API response helpers
2. `/lib/utils/validation.ts` - Request validation utilities
3. `/lib/utils/order-helpers.ts` - Order ID generation and tax calculation

### Testing Artifacts
1. Manual testing commands (curl/Postman)
2. Test data examples
3. Expected response formats

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 20+
- **API Pattern**: REST with route handlers
- **Data Storage**: In-memory stores (from Phase 1)

## Key Technical Concepts

### Next.js 15 App Router Route Handlers

Route handlers in Next.js 15 use the following conventions:

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET requests
  return NextResponse.json({ data: [] }, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Handle POST requests
  const body = await request.json();
  return NextResponse.json({ data: body }, { status: 201 });
}
```

### Dynamic Route Parameters

For routes with parameters (e.g., `/api/menu/[id]`):

```typescript
// app/api/resource/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // Handle request with id
}
```

### Order ID Generation

Orders use a standardized ID format: `ORD-XXX` where XXX is a zero-padded number:

```typescript
// Example: ORD-001, ORD-002, ORD-123
function generateOrderId(currentCount: number): string {
  const nextNumber = currentCount + 1;
  return `ORD-${nextNumber.toString().padStart(3, '0')}`;
}
```

### Tax Calculation

All orders include a 10% tax calculation:

```typescript
function calculateOrderTotal(subtotal: number): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}
```

## API Design Principles

### 1. Consistent Response Format

All API responses follow a consistent structure:

```typescript
// Success response
{
  "success": true,
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### 2. Proper HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST request creating a resource
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data or parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Unexpected server errors

### 3. Request Validation

All requests undergo validation before processing:

```typescript
// Validate required fields
if (!body.name || !body.price) {
  return NextResponse.json(
    { success: false, error: { message: 'Missing required fields' } },
    { status: 400 }
  );
}

// Validate data types
if (typeof body.price !== 'number' || body.price <= 0) {
  return NextResponse.json(
    { success: false, error: { message: 'Invalid price' } },
    { status: 400 }
  );
}
```

### 4. Type Safety

All requests and responses use TypeScript types:

```typescript
import { MenuItem, MenuCategory } from '@/types/menu';
import { Order, OrderStatus, OrderItem } from '@/types/order';

// Type-safe request handling
const menuItem: MenuItem = await request.json();
```

## Data Flow Architecture

```
Client Request
    |
    v
Next.js Route Handler (/app/api/*)
    |
    v
Request Validation
    |
    v
Data Store Operations (/lib/data/*Store.ts)
    |
    v
Response Formatting
    |
    v
Client Response
```

## Testing Strategy

### Manual Testing Tools

- **curl** - Command-line HTTP requests
- **Postman** - API testing platform
- **Thunder Client** - VS Code extension
- **Browser DevTools** - Network tab inspection

### Testing Approach

1. **Unit-level Testing**: Test each endpoint independently
2. **Integration Testing**: Test workflows across multiple endpoints
3. **Edge Case Testing**: Test validation, error handling, boundary conditions
4. **Data Consistency Testing**: Verify in-memory store integrity

### Sample Test Cases

For each endpoint, test:
- Happy path (valid requests)
- Missing required fields
- Invalid data types
- Invalid IDs or references
- Boundary conditions (empty arrays, max values)
- Concurrent requests (for race conditions)

## Estimated Timeline

| Task | Estimated Time | Dependencies |
|------|----------------|--------------|
| Task 2.1 | 2.5 hours | Tasks 1.4, 1.5, 1.6 |
| Task 2.2 | 2 hours | Task 2.1 |
| Task 2.3 | 3 hours | Tasks 1.4, 1.5, 1.6 |
| Task 2.4 | 2 hours | Task 2.3 |
| **Total** | **9.5 hours** | |

Add 0.5 hours buffer for testing and debugging: **Total 10 hours**

## Success Criteria

Phase 2 is considered complete when:

1. All four API route files are implemented and functional
2. All endpoints return proper HTTP status codes
3. Request validation is working correctly
4. Error handling is consistent across all routes
5. TypeScript types are properly used throughout
6. In-memory data stores are correctly mutated
7. Order ID generation works correctly
8. Tax calculation is accurate (10%)
9. All endpoints can be tested manually with curl/Postman
10. No TypeScript compilation errors
11. Code follows consistent formatting and style

## Common Pitfalls to Avoid

1. **Async/Await Issues**: Forgetting to await `request.json()`
2. **Type Mismatches**: Not properly typing request/response data
3. **Status Code Errors**: Using wrong HTTP status codes
4. **Validation Gaps**: Missing edge case validation
5. **Race Conditions**: Not considering concurrent data store access
6. **Floating Point Errors**: Not rounding currency calculations properly
7. **ID Generation**: Not handling order ID uniqueness correctly
8. **Null/Undefined**: Not checking for optional fields properly
9. **Error Messages**: Providing unclear or generic error messages
10. **Response Format**: Inconsistent response structures

## Next Steps

After completing Phase 2:

1. **Phase 3**: Frontend UI components that consume these APIs
2. **Phase 4**: Advanced features (search, filtering, pagination)
3. **Phase 5**: Error boundaries and loading states
4. **Future Enhancements**:
   - Database integration (replacing in-memory stores)
   - Authentication and authorization
   - Rate limiting
   - Caching strategies
   - API documentation (OpenAPI/Swagger)

## Resources and References

### Next.js Documentation
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [NextResponse API](https://nextjs.org/docs/app/api-reference/functions/next-response)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

### HTTP Standards
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Design Best Practices](https://restfulapi.net/)

## Notes

- This phase uses in-memory data stores; data will be lost on server restart
- No authentication is implemented in this phase
- No database persistence is included
- Focus is on core API functionality and structure
- Production apps would require additional security and validation

## File Structure

```
vibe-code-demo/
├── app/
│   └── api/
│       ├── menu/
│       │   ├── route.ts           # Task 2.1
│       │   └── [id]/
│       │       └── route.ts       # Task 2.2
│       └── orders/
│           ├── route.ts           # Task 2.3
│           └── [id]/
│               └── route.ts       # Task 2.4
├── lib/
│   ├── data/                      # From Phase 1
│   │   ├── menuStore.ts
│   │   ├── orderStore.ts
│   │   └── seed.ts
│   └── utils/                     # Created in Phase 2
│       ├── api-response.ts
│       ├── validation.ts
│       └── order-helpers.ts
└── types/                         # From Phase 1
    ├── menu.ts
    └── order.ts
```

## Getting Help

If you encounter issues during Phase 2:

1. Review the task-specific documentation in detail
2. Check that Phase 1 prerequisites are correctly implemented
3. Verify TypeScript types match between stores and API routes
4. Test endpoints individually before integration
5. Use console.log for debugging data flow
6. Check Next.js server logs for detailed error messages
7. Verify file paths and imports are correct

---

**Last Updated**: 2026-02-09
**Phase Duration**: 9-10 hours
**Prerequisites**: Phase 1 Complete (Tasks 1.4, 1.5, 1.6)
**Next Phase**: Phase 3 - Frontend UI Components
