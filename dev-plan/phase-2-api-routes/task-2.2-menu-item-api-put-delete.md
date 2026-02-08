# Task 2.2: Menu Item API - PUT and DELETE Endpoints

## Task Metadata

- **Task ID**: 2.2
- **Phase**: 2 (Core API Routes)
- **Complexity**: Medium
- **Estimated Time**: 2 hours
- **Prerequisites**: Tasks 1.4, 1.5, 1.6, 2.1
- **Endpoints**:
  - `PUT /api/menu/[id]`
  - `DELETE /api/menu/[id]`

## Overview

This task implements the remaining CRUD operations for individual menu items: updating existing menu items and deleting menu items. These endpoints complete the menu management API, enabling full administrative control over the restaurant's menu.

The PUT endpoint allows updating any field of a menu item while maintaining data integrity through validation. The DELETE endpoint provides safe removal of menu items from the system. Both endpoints work with dynamic route parameters to target specific menu items by ID.

## Importance

This task is critical because:

1. **Complete CRUD**: Completes the full Create, Read, Update, Delete cycle for menu items
2. **Menu Management**: Enables administrators to modify prices, descriptions, availability, and other attributes
3. **Dynamic Routes**: Introduces Next.js dynamic route handling patterns
4. **Data Integrity**: Ensures menu items can be safely updated and removed
5. **Partial Updates**: Demonstrates PUT semantics for full resource replacement
6. **Error Handling**: Adds 404 handling for non-existent resources

## Prerequisites

Before starting this task, ensure the following are complete:

### Required Files from Previous Tasks

1. **`/types/menu.ts`** (Task 1.4)
   - `MenuItem` interface
   - `MenuCategory` type

2. **`/lib/data/menuStore.ts`** (Task 1.5)
   - `getMenuItemById()` function
   - `updateMenuItem()` function
   - `deleteMenuItem()` function

3. **`/app/api/menu/route.ts`** (Task 2.1)
   - GET and POST endpoints implemented
   - Validation patterns established

### Verification Steps

```bash
# Verify menu store has required functions
grep -E "(getMenuItemById|updateMenuItem|deleteMenuItem)" /Users/noorragu/Documents/vibe-code-demo/lib/data/menuStore.ts

# Verify previous API route exists
ls -la /Users/noorragu/Documents/vibe-code-demo/app/api/menu/route.ts

# Test the server runs
npm run dev
```

## Technical Specifications

### API Contract: PUT /api/menu/[id]

**Endpoint**: `PUT /api/menu/[id]`

**Purpose**: Update an existing menu item (full replacement)

**Path Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | string | Yes | Unique menu item identifier | `/api/menu/5` |

**Request Headers**:
```
Content-Type: application/json
```

**Request Body Schema**:
```typescript
{
  name: string;              // Required, min 2 chars, max 100 chars
  description: string;       // Required, min 10 chars, max 500 chars
  price: number;            // Required, positive number, max 2 decimals
  category: MenuCategory;   // Required, valid enum value
  image: string;            // Required, valid URL or path
  available: boolean;       // Required for PUT (full replacement)
  preparationTime?: number; // Optional, positive integer
  spicyLevel?: number;      // Optional, 0-3
  isVegetarian: boolean;    // Required for PUT
  allergens: string[];      // Required for PUT (can be empty array)
}
```

**Request Example**:
```http
PUT /api/menu/5 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Margherita Pizza (Updated)",
  "description": "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil",
  "price": 13.99,
  "category": "entrees",
  "image": "/images/margherita-pizza-updated.jpg",
  "available": true,
  "preparationTime": 18,
  "spicyLevel": 0,
  "isVegetarian": true,
  "allergens": ["gluten", "dairy"]
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "5",
    "name": "Margherita Pizza (Updated)",
    "description": "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil",
    "price": 13.99,
    "category": "entrees",
    "image": "/images/margherita-pizza-updated.jpg",
    "available": true,
    "preparationTime": 18,
    "spicyLevel": 0,
    "isVegetarian": true,
    "allergens": ["gluten", "dairy"]
  }
}
```

**Not Found Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "message": "Menu item with ID '999' not found",
    "code": "MENU_ITEM_NOT_FOUND"
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
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

### API Contract: DELETE /api/menu/[id]

**Endpoint**: `DELETE /api/menu/[id]`

**Purpose**: Delete a menu item

**Path Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | string | Yes | Unique menu item identifier | `/api/menu/5` |

**Request Example**:
```http
DELETE /api/menu/5 HTTP/1.1
Host: localhost:3000
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Menu item deleted successfully",
  "data": {
    "id": "5",
    "name": "Margherita Pizza"
  }
}
```

**Not Found Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "message": "Menu item with ID '999' not found",
    "code": "MENU_ITEM_NOT_FOUND"
  }
}
```

**Note**: Some REST APIs return 204 No Content for DELETE, but we return 200 with a confirmation message for better client feedback.

## Files to Create

### Primary File

**File Path**: `/app/api/menu/[id]/route.ts`

**Purpose**: Route handler for individual menu item operations

**Directory Structure**:
```
app/
└── api/
    └── menu/
        ├── route.ts              # Task 2.1 (GET all, POST)
        └── [id]/
            └── route.ts          # Task 2.2 (PUT, DELETE)
```

**Exports**:
- `GET` - Retrieve single menu item by ID (bonus, not required)
- `PUT` - Update menu item by ID
- `DELETE` - Delete menu item by ID

## Step-by-Step Implementation Guide

### Step 1: Create Directory Structure

```bash
# Create the api/menu/[id] directory
mkdir -p /Users/noorragu/Documents/vibe-code-demo/app/api/menu/[id]
```

Note: The `[id]` directory name with square brackets makes this a dynamic route in Next.js.

### Step 2: Create the Route Handler File

Create `/app/api/menu/[id]/route.ts` with the following initial structure:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem
} from '@/lib/data/menuStore';
import { MenuItem, MenuCategory } from '@/types/menu';

/**
 * GET /api/menu/[id]
 * Retrieves a single menu item by ID
 *
 * Path parameters:
 * - id: Menu item identifier
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Extract ID from params
    // TODO: Fetch menu item by ID
    // TODO: Handle not found case
    // TODO: Return menu item
  } catch (error) {
    // TODO: Handle errors
  }
}

/**
 * PUT /api/menu/[id]
 * Updates an existing menu item (full replacement)
 *
 * Path parameters:
 * - id: Menu item identifier
 *
 * Request body: Complete MenuItem (without id)
 * Returns: Updated menu item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Extract ID from params
    // TODO: Verify menu item exists
    // TODO: Parse request body
    // TODO: Validate all fields
    // TODO: Update menu item
    // TODO: Return updated item
  } catch (error) {
    // TODO: Handle errors
  }
}

/**
 * DELETE /api/menu/[id]
 * Deletes a menu item
 *
 * Path parameters:
 * - id: Menu item identifier
 *
 * Returns: Confirmation message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Extract ID from params
    // TODO: Verify menu item exists
    // TODO: Delete menu item
    // TODO: Return confirmation
  } catch (error) {
    // TODO: Handle errors
  }
}
```

### Step 3: Implement GET Endpoint (Bonus)

While not strictly required for this task, implementing GET for a single item is useful:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch menu item by ID
    const menuItem = getMenuItemById(id);

    // Handle not found case
    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Menu item with ID '${id}' not found`,
            code: 'MENU_ITEM_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    // Return menu item
    return NextResponse.json(
      {
        success: true,
        data: menuItem
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while fetching menu item',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 4: Implement PUT Endpoint

```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify menu item exists
    const existingItem = getMenuItemById(id);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Menu item with ID '${id}' not found`,
            code: 'MENU_ITEM_NOT_FOUND'
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

    // Validate required fields (same as POST in Task 2.1)
    const validationErrors: Array<{ field: string; message: string }> = [];

    if (!body.name || typeof body.name !== 'string') {
      validationErrors.push({ field: 'name', message: 'Name is required and must be a string' });
    } else if (body.name.length < 2 || body.name.length > 100) {
      validationErrors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
    }

    if (!body.description || typeof body.description !== 'string') {
      validationErrors.push({ field: 'description', message: 'Description is required and must be a string' });
    } else if (body.description.length < 10 || body.description.length > 500) {
      validationErrors.push({ field: 'description', message: 'Description must be between 10 and 500 characters' });
    }

    if (body.price === undefined || body.price === null) {
      validationErrors.push({ field: 'price', message: 'Price is required' });
    } else if (typeof body.price !== 'number' || body.price <= 0) {
      validationErrors.push({ field: 'price', message: 'Price must be a positive number' });
    } else if (!/^\d+(\.\d{1,2})?$/.test(body.price.toString())) {
      validationErrors.push({ field: 'price', message: 'Price must have at most 2 decimal places' });
    }

    if (!body.category) {
      validationErrors.push({ field: 'category', message: 'Category is required' });
    } else {
      const validCategories: MenuCategory[] = ['appetizers', 'entrees', 'desserts', 'beverages'];
      if (!validCategories.includes(body.category)) {
        validationErrors.push({
          field: 'category',
          message: `Category must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    if (!body.image || typeof body.image !== 'string') {
      validationErrors.push({ field: 'image', message: 'Image is required and must be a string' });
    }

    // For PUT, require available and isVegetarian (full replacement)
    if (body.available === undefined || typeof body.available !== 'boolean') {
      validationErrors.push({ field: 'available', message: 'Available is required and must be a boolean' });
    }

    if (body.isVegetarian === undefined || typeof body.isVegetarian !== 'boolean') {
      validationErrors.push({ field: 'isVegetarian', message: 'isVegetarian is required and must be a boolean' });
    }

    // Require allergens array for PUT (can be empty)
    if (!Array.isArray(body.allergens)) {
      validationErrors.push({ field: 'allergens', message: 'Allergens is required and must be an array' });
    } else if (!body.allergens.every((item: any) => typeof item === 'string')) {
      validationErrors.push({ field: 'allergens', message: 'All allergens must be strings' });
    }

    // Validate optional fields if provided
    if (body.preparationTime !== undefined) {
      if (typeof body.preparationTime !== 'number' || body.preparationTime <= 0 || !Number.isInteger(body.preparationTime)) {
        validationErrors.push({ field: 'preparationTime', message: 'Preparation time must be a positive integer' });
      }
    }

    if (body.spicyLevel !== undefined) {
      if (typeof body.spicyLevel !== 'number' || body.spicyLevel < 0 || body.spicyLevel > 3) {
        validationErrors.push({ field: 'spicyLevel', message: 'Spicy level must be between 0 and 3' });
      }
    }

    // Return validation errors if any
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

    // Create updated menu item object
    const updatedMenuItem: MenuItem = {
      id: id,  // Keep the same ID
      name: body.name.trim(),
      description: body.description.trim(),
      price: parseFloat(body.price.toFixed(2)),
      category: body.category,
      image: body.image.trim(),
      available: body.available,
      preparationTime: body.preparationTime,
      spicyLevel: body.spicyLevel,
      isVegetarian: body.isVegetarian,
      allergens: body.allergens
    };

    // Update menu item in store
    const result = updateMenuItem(id, updatedMenuItem);

    if (!result) {
      // This shouldn't happen since we checked earlier, but handle it
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Failed to update menu item with ID '${id}'`,
            code: 'UPDATE_FAILED'
          }
        },
        { status: 500 }
      );
    }

    // Return updated menu item
    return NextResponse.json(
      {
        success: true,
        data: result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while updating menu item',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 5: Implement DELETE Endpoint

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify menu item exists and get its data before deletion
    const existingItem = getMenuItemById(id);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Menu item with ID '${id}' not found`,
            code: 'MENU_ITEM_NOT_FOUND'
          }
        },
        { status: 404 }
      );
    }

    // Delete menu item from store
    const deleted = deleteMenuItem(id);

    if (!deleted) {
      // This shouldn't happen since we checked earlier, but handle it
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Failed to delete menu item with ID '${id}'`,
            code: 'DELETE_FAILED'
          }
        },
        { status: 500 }
      );
    }

    // Return confirmation with some details about deleted item
    return NextResponse.json(
      {
        success: true,
        message: 'Menu item deleted successfully',
        data: {
          id: existingItem.id,
          name: existingItem.name
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while deleting menu item',
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

#### Test 1: GET Single Menu Item

```bash
curl -X GET http://localhost:3000/api/menu/1
```

**Expected Result**: Returns menu item with ID "1" and status 200

#### Test 2: GET Non-Existent Menu Item

```bash
curl -X GET http://localhost:3000/api/menu/999
```

**Expected Result**: Returns 404 error with MENU_ITEM_NOT_FOUND code

#### Test 3: PUT Update Menu Item

```bash
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza Deluxe",
    "description": "Premium pizza with buffalo mozzarella and fresh basil",
    "price": 15.99,
    "category": "entrees",
    "image": "/images/margherita-deluxe.jpg",
    "available": true,
    "preparationTime": 20,
    "spicyLevel": 0,
    "isVegetarian": true,
    "allergens": ["gluten", "dairy"]
  }'
```

**Expected Result**: Returns updated menu item with status 200

#### Test 4: PUT Update Non-Existent Item

```bash
curl -X PUT http://localhost:3000/api/menu/999 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "This should fail",
    "price": 10.99,
    "category": "entrees",
    "image": "/images/test.jpg",
    "available": true,
    "isVegetarian": false,
    "allergens": []
  }'
```

**Expected Result**: Returns 404 error with MENU_ITEM_NOT_FOUND code

#### Test 5: PUT with Missing Required Fields

```bash
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Item",
    "price": 10.99
  }'
```

**Expected Result**: Returns 400 validation error

#### Test 6: PUT with Invalid Price

```bash
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "Item with negative price",
    "price": -5.99,
    "category": "entrees",
    "image": "/images/test.jpg",
    "available": true,
    "isVegetarian": false,
    "allergens": []
  }'
```

**Expected Result**: Returns 400 validation error for invalid price

#### Test 7: DELETE Menu Item

```bash
# First, get the list to find a valid ID
curl -X GET http://localhost:3000/api/menu

# Then delete an item (use an existing ID)
curl -X DELETE http://localhost:3000/api/menu/1
```

**Expected Result**: Returns success message with status 200

#### Test 8: DELETE Non-Existent Item

```bash
curl -X DELETE http://localhost:3000/api/menu/999
```

**Expected Result**: Returns 404 error with MENU_ITEM_NOT_FOUND code

#### Test 9: Verify Deletion

```bash
# After deleting item 1, try to GET it
curl -X GET http://localhost:3000/api/menu/1
```

**Expected Result**: Returns 404 error (item no longer exists)

#### Test 10: Update Then Delete Workflow

```bash
# Update an item
curl -X PUT http://localhost:3000/api/menu/2 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item",
    "description": "This item will be deleted",
    "price": 9.99,
    "category": "appetizers",
    "image": "/images/temp.jpg",
    "available": false,
    "isVegetarian": true,
    "allergens": []
  }'

# Then delete it
curl -X DELETE http://localhost:3000/api/menu/2

# Verify it's gone
curl -X GET http://localhost:3000/api/menu/2
```

**Expected Result**: Update succeeds (200), delete succeeds (200), GET returns 404

### Integration Testing Workflow

Test the complete CRUD cycle:

```bash
# 1. CREATE: Add a new item
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pizza",
    "description": "A pizza for testing CRUD operations",
    "price": 11.99,
    "category": "entrees",
    "image": "/images/test-pizza.jpg",
    "available": true,
    "isVegetarian": true,
    "allergens": ["gluten", "dairy"]
  }'

# Note the ID from response (e.g., "10")

# 2. READ: Get the item
curl -X GET http://localhost:3000/api/menu/10

# 3. UPDATE: Modify the item
curl -X PUT http://localhost:3000/api/menu/10 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pizza (Updated)",
    "description": "An updated pizza for testing",
    "price": 12.99,
    "category": "entrees",
    "image": "/images/test-pizza-v2.jpg",
    "available": false,
    "isVegetarian": true,
    "allergens": ["gluten", "dairy"]
  }'

# 4. READ: Verify the update
curl -X GET http://localhost:3000/api/menu/10

# 5. DELETE: Remove the item
curl -X DELETE http://localhost:3000/api/menu/10

# 6. READ: Verify deletion
curl -X GET http://localhost:3000/api/menu/10
```

## Acceptance Criteria

This task is complete when:

- [ ] `/app/api/menu/[id]/route.ts` file is created in correct directory
- [ ] GET endpoint retrieves single menu item by ID
- [ ] GET endpoint returns 404 for non-existent items
- [ ] PUT endpoint updates menu items successfully
- [ ] PUT endpoint validates all required fields
- [ ] PUT endpoint requires full object (PUT semantics)
- [ ] PUT endpoint returns 404 for non-existent items
- [ ] PUT endpoint validates data types and business rules
- [ ] DELETE endpoint removes menu items successfully
- [ ] DELETE endpoint returns 404 for non-existent items
- [ ] DELETE endpoint returns confirmation message
- [ ] All endpoints use consistent response format
- [ ] Dynamic route parameters work correctly
- [ ] TypeScript types are properly used
- [ ] No TypeScript compilation errors
- [ ] All manual tests pass
- [ ] Error messages are clear and helpful
- [ ] Console logs errors appropriately

## Common Pitfalls

1. **Incorrect directory naming**
   ```bash
   # WRONG
   mkdir app/api/menu/id

   # CORRECT
   mkdir app/api/menu/[id]
   ```

2. **Not extracting params correctly**
   ```typescript
   // WRONG
   export async function PUT(request: NextRequest) {
     const id = request.params.id;
   }

   // CORRECT
   export async function PUT(
     request: NextRequest,
     { params }: { params: { id: string } }
   ) {
     const { id } = params;
   }
   ```

3. **Not checking if item exists before update/delete**
   ```typescript
   // ALWAYS check first
   const existingItem = getMenuItemById(id);
   if (!existingItem) {
     return NextResponse.json({ error: 'Not found' }, { status: 404 });
   }
   ```

4. **Using PATCH semantics with PUT**
   ```typescript
   // WRONG - Allowing partial updates in PUT
   const updated = { ...existingItem, ...body };

   // CORRECT - Requiring all fields for PUT
   // Validate all required fields are present in body
   ```

5. **Not preserving the ID in updates**
   ```typescript
   // CORRECT
   const updatedItem: MenuItem = {
     id: id,  // Keep original ID
     ...body
   };
   ```

6. **Wrong status codes**
   ```typescript
   // WRONG
   return NextResponse.json(data, { status: 201 });  // For UPDATE

   // CORRECT
   return NextResponse.json(data, { status: 200 });  // For UPDATE
   ```

7. **Not returning meaningful data on DELETE**
   ```typescript
   // BETTER - Return confirmation with item info
   return NextResponse.json({
     success: true,
     message: 'Deleted successfully',
     data: { id, name }
   });
   ```

8. **Race conditions with store operations**
   ```typescript
   // Be aware that in-memory store isn't thread-safe
   // Future: Consider implementing locks or transactions
   ```

## PUT vs PATCH: Implementation Notes

### This Task Uses PUT (Full Replacement)

In this task, we implement PUT, which requires the full resource:

```typescript
// PUT /api/menu/[id]
// Requires ALL fields (except id)
{
  "name": "...",
  "description": "...",
  "price": 0,
  "category": "...",
  "image": "...",
  "available": true,
  "isVegetarian": false,
  "allergens": []
}
```

### Future: PATCH for Partial Updates

A future enhancement could add PATCH for partial updates:

```typescript
// PATCH /api/menu/[id]
// Only includes fields to update
{
  "price": 15.99,
  "available": false
}
```

For now, clients must send the complete object when updating.

## Related Tasks

### Depends On
- **Task 1.4**: TypeScript Type Definitions
- **Task 1.5**: In-Memory Data Stores
- **Task 1.6**: Data Initialization
- **Task 2.1**: Menu API - GET and POST Endpoints

### Blocks
- **Future Phase**: Admin Menu Management UI
- **Future Phase**: Menu item image uploads

### Related
- **Task 2.4**: Single Order API - GET and PATCH Endpoints (similar dynamic route patterns)

## Security Considerations

### For Future Enhancement

This basic implementation doesn't include:

1. **Authentication**: Anyone can update/delete menu items
2. **Authorization**: No role-based access control
3. **Rate Limiting**: No protection against abuse
4. **Input Sanitization**: Limited XSS protection
5. **Audit Logging**: No tracking of who changed what

These should be added before production deployment.

## Performance Notes

### Current Implementation

- In-memory store operations are O(n) for lookups
- No caching layer
- No pagination needed (small dataset)

### Future Optimizations

- Replace array storage with Map for O(1) lookups
- Add Redis caching for frequently accessed items
- Implement database indexing when moving to persistent storage

## Code Quality Checklist

- [ ] Code is properly formatted
- [ ] All imports are correct
- [ ] No unused variables
- [ ] TypeScript shows no errors
- [ ] Dynamic route parameters handled correctly
- [ ] All paths use @ alias correctly
- [ ] Error logging is comprehensive
- [ ] Variable names are descriptive
- [ ] Comments explain complex logic
- [ ] Response format is consistent
- [ ] Status codes are correct

## Additional Resources

### Next.js Dynamic Routes
- [Dynamic Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Route Handlers with Dynamic Segments](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments)

### REST API Best Practices
- PUT should replace entire resource
- DELETE should be idempotent
- Use proper status codes (200, 404, 400, 500)
- Return meaningful error messages

### TypeScript Tips
- Use type guards for parameter validation
- Leverage union types for error handling
- Use interface definitions from Phase 1

---

**Task Status**: Ready to implement
**Last Updated**: 2026-02-09
**Estimated Time**: 2 hours
**Priority**: High
**Depends On**: Task 2.1 completion
