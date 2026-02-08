# Task 2.1: Menu API - GET and POST Endpoints

## Task Metadata

- **Task ID**: 2.1
- **Phase**: 2 (Core API Routes)
- **Complexity**: Medium
- **Estimated Time**: 2.5 hours
- **Prerequisites**: Tasks 1.4, 1.5, 1.6
- **Endpoints**:
  - `GET /api/menu`
  - `POST /api/menu`

## Overview

This task implements the first two endpoints for menu management: retrieving all menu items and creating new menu items. These endpoints form the foundation of the menu management system and will be used by both the admin interface (for managing menu items) and the public interface (for displaying available items).

The GET endpoint supports optional query parameters for filtering by category and availability, making it flexible for different use cases. The POST endpoint includes comprehensive validation to ensure data integrity when creating new menu items.

## Importance

This task is critical because:

1. **Data Retrieval**: Establishes the pattern for fetching menu data used throughout the app
2. **Menu Creation**: Enables administrators to add new dishes to the restaurant menu
3. **Foundation**: Sets the architectural pattern for all subsequent API routes
4. **Type Safety**: Demonstrates proper TypeScript usage in Next.js route handlers
5. **Error Handling**: Establishes error handling patterns used across the application
6. **Validation**: Implements the first validation logic for user-submitted data

## Prerequisites

Before starting this task, ensure the following are complete:

### Required Files from Phase 1

1. **`/types/menu.ts`** (Task 1.4)
   - `MenuItem` interface
   - `MenuCategory` type
   - All menu-related types

2. **`/lib/data/menuStore.ts`** (Task 1.5)
   - `getMenuItems()` function
   - `addMenuItem()` function
   - In-memory storage implementation

3. **`/lib/data/seed.ts`** (Task 1.6)
   - `initializeData()` function
   - Sample menu data seeded

### Verification Steps

Run these checks before starting:

```bash
# Check that type definitions exist
cat /Users/noorragu/Documents/vibe-code-demo/types/menu.ts

# Check that menu store exists
cat /Users/noorragu/Documents/vibe-code-demo/lib/data/menuStore.ts

# Verify the app runs without errors
npm run dev
```

## Technical Specifications

### API Contract: GET /api/menu

**Endpoint**: `GET /api/menu`

**Purpose**: Retrieve all menu items with optional filtering

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| category | string | No | Filter by menu category | `?category=appetizers` |
| available | boolean | No | Filter by availability | `?available=true` |

**Request Example**:
```http
GET /api/menu HTTP/1.1
Host: localhost:3000
Accept: application/json

# With filters
GET /api/menu?category=entrees&available=true HTTP/1.1
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato, mozzarella, and basil",
      "price": 12.99,
      "category": "entrees",
      "image": "/images/margherita-pizza.jpg",
      "available": true,
      "preparationTime": 15,
      "spicyLevel": 0,
      "isVegetarian": true,
      "allergens": ["gluten", "dairy"]
    },
    {
      "id": "2",
      "name": "Bruschetta",
      "description": "Toasted bread with tomatoes, garlic, and olive oil",
      "price": 8.99,
      "category": "appetizers",
      "image": "/images/bruschetta.jpg",
      "available": true,
      "preparationTime": 10,
      "spicyLevel": 0,
      "isVegetarian": true,
      "allergens": ["gluten"]
    }
  ],
  "count": 2
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
    "message": "Invalid category. Must be one of: appetizers, entrees, desserts, beverages",
    "code": "INVALID_CATEGORY"
  }
}
```

### API Contract: POST /api/menu

**Endpoint**: `POST /api/menu`

**Purpose**: Create a new menu item

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
  available?: boolean;      // Optional, defaults to true
  preparationTime?: number; // Optional, positive integer (minutes)
  spicyLevel?: number;      // Optional, 0-3
  isVegetarian?: boolean;   // Optional, defaults to false
  allergens?: string[];     // Optional, array of strings
}
```

**Request Example**:
```json
POST /api/menu HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Spicy Arrabbiata",
  "description": "Penne pasta with spicy tomato sauce, garlic, and red chili peppers",
  "price": 14.99,
  "category": "entrees",
  "image": "/images/arrabbiata.jpg",
  "available": true,
  "preparationTime": 20,
  "spicyLevel": 2,
  "isVegetarian": true,
  "allergens": ["gluten"]
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "10",
    "name": "Spicy Arrabbiata",
    "description": "Penne pasta with spicy tomato sauce, garlic, and red chili peppers",
    "price": 14.99,
    "category": "entrees",
    "image": "/images/arrabbiata.jpg",
    "available": true,
    "preparationTime": 20,
    "spicyLevel": 2,
    "isVegetarian": true,
    "allergens": ["gluten"]
  }
}
```

**Validation Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Validation failed: name is required, price must be a positive number",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

**Server Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "error": {
    "message": "An unexpected error occurred while creating menu item",
    "code": "INTERNAL_ERROR"
  }
}
```

## Files to Create

### Primary File

**File Path**: `/app/api/menu/route.ts`

**Purpose**: Route handler for menu collection endpoints

**Exports**:
- `GET` - Async function handling GET requests
- `POST` - Async function handling POST requests

## Step-by-Step Implementation Guide

### Step 1: Create Directory Structure

```bash
# Create the api/menu directory
mkdir -p /Users/noorragu/Documents/vibe-code-demo/app/api/menu
```

### Step 2: Create the Route Handler File

Create `/app/api/menu/route.ts` with the following structure:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, addMenuItem } from '@/lib/data/menuStore';
import { MenuItem, MenuCategory } from '@/types/menu';

/**
 * GET /api/menu
 * Retrieves all menu items with optional filtering
 *
 * Query parameters:
 * - category: Filter by menu category (appetizers, entrees, desserts, beverages)
 * - available: Filter by availability (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Extract query parameters
    // TODO: Validate category parameter if provided
    // TODO: Fetch menu items from store
    // TODO: Apply filters
    // TODO: Return filtered results
  } catch (error) {
    // TODO: Handle errors
  }
}

/**
 * POST /api/menu
 * Creates a new menu item
 *
 * Request body: MenuItem (without id)
 * Returns: Created menu item with generated id
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Parse request body
    // TODO: Validate required fields
    // TODO: Validate data types
    // TODO: Validate business rules
    // TODO: Add menu item to store
    // TODO: Return created item
  } catch (error) {
    // TODO: Handle errors
  }
}
```

### Step 3: Implement GET Endpoint

Replace the GET function with full implementation:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get('category');
    const availableParam = searchParams.get('available');

    // Validate category parameter if provided
    if (categoryParam) {
      const validCategories: MenuCategory[] = ['appetizers', 'entrees', 'desserts', 'beverages'];
      if (!validCategories.includes(categoryParam as MenuCategory)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
              code: 'INVALID_CATEGORY'
            }
          },
          { status: 400 }
        );
      }
    }

    // Fetch all menu items from store
    let menuItems = getMenuItems();

    // Apply category filter if provided
    if (categoryParam) {
      menuItems = menuItems.filter(item => item.category === categoryParam);
    }

    // Apply availability filter if provided
    if (availableParam !== null) {
      const isAvailable = availableParam === 'true';
      menuItems = menuItems.filter(item => item.available === isAvailable);
    }

    // Return filtered results
    return NextResponse.json(
      {
        success: true,
        data: menuItems,
        count: menuItems.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while fetching menu items',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 4: Implement POST Endpoint with Validation

Replace the POST function with full implementation:

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

    // Validate required fields
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

    if (body.available !== undefined && typeof body.available !== 'boolean') {
      validationErrors.push({ field: 'available', message: 'Available must be a boolean' });
    }

    if (body.isVegetarian !== undefined && typeof body.isVegetarian !== 'boolean') {
      validationErrors.push({ field: 'isVegetarian', message: 'isVegetarian must be a boolean' });
    }

    if (body.allergens !== undefined) {
      if (!Array.isArray(body.allergens)) {
        validationErrors.push({ field: 'allergens', message: 'Allergens must be an array' });
      } else if (!body.allergens.every((item: any) => typeof item === 'string')) {
        validationErrors.push({ field: 'allergens', message: 'All allergens must be strings' });
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

    // Create menu item object with defaults for optional fields
    const newMenuItem: Omit<MenuItem, 'id'> = {
      name: body.name.trim(),
      description: body.description.trim(),
      price: parseFloat(body.price.toFixed(2)),
      category: body.category,
      image: body.image.trim(),
      available: body.available !== undefined ? body.available : true,
      preparationTime: body.preparationTime,
      spicyLevel: body.spicyLevel,
      isVegetarian: body.isVegetarian || false,
      allergens: body.allergens || []
    };

    // Add menu item to store
    const createdMenuItem = addMenuItem(newMenuItem);

    // Return created menu item
    return NextResponse.json(
      {
        success: true,
        data: createdMenuItem
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred while creating menu item',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
```

### Step 5: Test the Implementation

Start the development server:

```bash
cd /Users/noorragu/Documents/vibe-code-demo
npm run dev
```

## Testing Strategy

### Manual Testing with curl

#### Test 1: GET All Menu Items

```bash
curl -X GET http://localhost:3000/api/menu
```

**Expected Result**: Returns all menu items with `success: true` and status 200

#### Test 2: GET Menu Items by Category

```bash
curl -X GET "http://localhost:3000/api/menu?category=entrees"
```

**Expected Result**: Returns only entree items

#### Test 3: GET Available Menu Items

```bash
curl -X GET "http://localhost:3000/api/menu?available=true"
```

**Expected Result**: Returns only available items

#### Test 4: GET with Combined Filters

```bash
curl -X GET "http://localhost:3000/api/menu?category=appetizers&available=true"
```

**Expected Result**: Returns only available appetizers

#### Test 5: GET with Invalid Category

```bash
curl -X GET "http://localhost:3000/api/menu?category=invalid"
```

**Expected Result**: Returns error with status 400 and INVALID_CATEGORY code

#### Test 6: POST Create Valid Menu Item

```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tiramisu",
    "description": "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    "price": 8.99,
    "category": "desserts",
    "image": "/images/tiramisu.jpg",
    "available": true,
    "preparationTime": 5,
    "isVegetarian": true,
    "allergens": ["eggs", "dairy", "gluten"]
  }'
```

**Expected Result**: Returns created item with generated ID and status 201

#### Test 7: POST with Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item"
  }'
```

**Expected Result**: Returns validation error with status 400

#### Test 8: POST with Invalid Price

```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "A test item with invalid price",
    "price": -5.99,
    "category": "entrees",
    "image": "/images/test.jpg"
  }'
```

**Expected Result**: Returns validation error for negative price

#### Test 9: POST with Invalid Category

```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "A test item with invalid category",
    "price": 9.99,
    "category": "invalid_category",
    "image": "/images/test.jpg"
  }'
```

**Expected Result**: Returns validation error for invalid category

#### Test 10: POST with Invalid JSON

```bash
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d 'invalid json content'
```

**Expected Result**: Returns JSON parsing error with status 400

### Manual Testing with Postman

Create a Postman collection with the following requests:

#### Collection: Bella Cucina - Menu API

**Request 1: Get All Menu Items**
- Method: GET
- URL: `http://localhost:3000/api/menu`
- Tests:
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });

  pm.test("Response has success property", function () {
      pm.expect(pm.response.json()).to.have.property('success', true);
  });

  pm.test("Response has data array", function () {
      pm.expect(pm.response.json().data).to.be.an('array');
  });
  ```

**Request 2: Get Menu Items by Category**
- Method: GET
- URL: `http://localhost:3000/api/menu?category=entrees`
- Tests:
  ```javascript
  pm.test("All items are entrees", function () {
      const data = pm.response.json().data;
      data.forEach(item => {
          pm.expect(item.category).to.equal('entrees');
      });
  });
  ```

**Request 3: Create Menu Item**
- Method: POST
- URL: `http://localhost:3000/api/menu`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "name": "Panna Cotta",
    "description": "Silky Italian cream dessert with berry compote",
    "price": 7.99,
    "category": "desserts",
    "image": "/images/panna-cotta.jpg",
    "preparationTime": 5
  }
  ```
- Tests:
  ```javascript
  pm.test("Status code is 201", function () {
      pm.response.to.have.status(201);
  });

  pm.test("Created item has id", function () {
      pm.expect(pm.response.json().data).to.have.property('id');
  });
  ```

## Acceptance Criteria

This task is complete when:

- [ ] `/app/api/menu/route.ts` file is created
- [ ] GET endpoint returns all menu items successfully
- [ ] GET endpoint filters by category correctly
- [ ] GET endpoint filters by availability correctly
- [ ] GET endpoint handles invalid category parameter with 400 error
- [ ] POST endpoint creates new menu items successfully
- [ ] POST endpoint validates all required fields
- [ ] POST endpoint validates data types correctly
- [ ] POST endpoint validates business rules (price > 0, category enum, etc.)
- [ ] POST endpoint returns 201 status for successful creation
- [ ] POST endpoint returns 400 status for validation errors
- [ ] Both endpoints return consistent response format
- [ ] Error messages are clear and helpful
- [ ] TypeScript types are properly used throughout
- [ ] No TypeScript compilation errors
- [ ] All manual tests pass successfully
- [ ] Code follows Next.js 15 best practices
- [ ] Console logs errors appropriately

## Validation Logic Examples

### Category Validation

```typescript
function isValidCategory(category: string): category is MenuCategory {
  const validCategories: MenuCategory[] = ['appetizers', 'entrees', 'desserts', 'beverages'];
  return validCategories.includes(category as MenuCategory);
}
```

### Price Validation

```typescript
function isValidPrice(price: any): boolean {
  // Must be a number
  if (typeof price !== 'number') return false;

  // Must be positive
  if (price <= 0) return false;

  // Must have at most 2 decimal places
  const decimals = (price.toString().split('.')[1] || '').length;
  return decimals <= 2;
}
```

### String Length Validation

```typescript
function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.length > max) {
    return `${fieldName} must be at most ${max} characters`;
  }
  return null;
}
```

## Common Pitfalls

1. **Forgetting to await request.json()**
   ```typescript
   // WRONG
   const body = request.json();

   // CORRECT
   const body = await request.json();
   ```

2. **Not handling JSON parse errors**
   ```typescript
   // Add try-catch around request.json()
   try {
     const body = await request.json();
   } catch (error) {
     return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
   }
   ```

3. **Using wrong HTTP status codes**
   ```typescript
   // WRONG - Using 200 for creation
   return NextResponse.json(data, { status: 200 });

   // CORRECT - Using 201 for creation
   return NextResponse.json(data, { status: 201 });
   ```

4. **Not trimming string inputs**
   ```typescript
   // CORRECT - Trim whitespace
   name: body.name.trim(),
   description: body.description.trim()
   ```

5. **Floating point precision issues with prices**
   ```typescript
   // CORRECT - Round to 2 decimal places
   price: parseFloat(body.price.toFixed(2))
   ```

6. **Not providing helpful validation messages**
   ```typescript
   // WRONG - Generic message
   error: { message: 'Invalid data' }

   // CORRECT - Specific message
   error: {
     message: 'Validation failed',
     details: [
       { field: 'price', message: 'Price must be a positive number' }
     ]
   }
   ```

7. **Forgetting to handle optional parameters**
   ```typescript
   // CORRECT - Provide defaults
   available: body.available !== undefined ? body.available : true,
   isVegetarian: body.isVegetarian || false,
   allergens: body.allergens || []
   ```

8. **Not validating array contents**
   ```typescript
   // CORRECT - Check each element
   if (body.allergens && !body.allergens.every(item => typeof item === 'string')) {
     // Return validation error
   }
   ```

## Related Tasks

### Depends On
- **Task 1.4**: TypeScript Type Definitions
- **Task 1.5**: In-Memory Data Stores
- **Task 1.6**: Data Initialization

### Blocks
- **Task 2.2**: Menu Item API - PUT and DELETE Endpoints
- **Future Phase**: Admin Menu Management UI
- **Future Phase**: Public Menu Display UI

### Related
- **Task 2.3**: Orders API - GET and POST Endpoints (similar patterns)

## Code Quality Checklist

Before marking this task as complete:

- [ ] Code is properly formatted (use Prettier)
- [ ] All imports are correct and from the right paths
- [ ] No unused variables or imports
- [ ] TypeScript shows no errors in the editor
- [ ] Console.error is used for error logging
- [ ] Variable names are descriptive and follow camelCase
- [ ] Functions have clear purposes
- [ ] Comments explain complex logic
- [ ] Response format is consistent
- [ ] Status codes match the operation result
- [ ] All edge cases are handled

## Additional Notes

### Response Format Convention

All API endpoints in this project use a consistent response format:

```typescript
// Success
{
  success: true,
  data: T,
  count?: number  // For list endpoints
}

// Error
{
  success: false,
  error: {
    message: string,
    code: string,
    details?: Array<{ field: string; message: string }>
  }
}
```

### Query Parameter Handling

Next.js provides `searchParams` through `request.nextUrl.searchParams`:

```typescript
const searchParams = request.nextUrl.searchParams;
const param = searchParams.get('paramName');  // Returns string | null
```

### TypeScript Type Guards

Use type guards for safer code:

```typescript
function isMenuItem(obj: any): obj is MenuItem {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    // ... other checks
  );
}
```

### Performance Considerations

For this phase (in-memory store):
- Array filtering is fast for small datasets
- No need for pagination yet
- No database query optimization needed

Future considerations:
- Add pagination for large datasets
- Implement caching strategies
- Optimize database queries

---

**Task Status**: Ready to implement
**Last Updated**: 2026-02-09
**Estimated Time**: 2.5 hours
**Priority**: High
