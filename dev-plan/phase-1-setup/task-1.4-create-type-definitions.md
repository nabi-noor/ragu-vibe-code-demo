# Task 1.4: Create Type Definitions

**Task ID:** 1.4
**Task Name:** Create Type Definitions
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 1.5 hours
**Complexity:** Medium
**Prerequisites:** Task 1.1 (Initialize Next.js), Task 1.2 (Install Dependencies)

## Overview

This task establishes the complete TypeScript type system for the Bella Cucina application. We'll define comprehensive interfaces and types for all core entities including menu items, orders, customers, categories, and order statuses. These type definitions will serve as the single source of truth for data structures throughout the application, ensuring type safety and providing excellent IDE support.

## Importance

Strong type definitions are critical because:

1. **Type Safety** - Prevents runtime errors by catching type mismatches at compile-time
2. **IDE Support** - Enables auto-completion, IntelliSense, and inline documentation
3. **Documentation** - Types serve as self-documenting code that's always up-to-date
4. **Refactoring** - Makes large-scale changes safer and easier
5. **Team Collaboration** - Provides clear contracts between different parts of the codebase
6. **API Consistency** - Ensures consistent data structures across client and server

## Prerequisites

### Required Completion
- ✅ Task 1.1: Next.js 15 project initialized with TypeScript strict mode
- ✅ `tsconfig.json` configured with strict: true
- ✅ `lib/` directory exists

### Verification
```bash
# Verify TypeScript configuration
npx tsc --version

# Check strict mode is enabled
grep -A 2 '"strict"' tsconfig.json

# Verify lib directory
ls -la lib/
```

## Technical Specifications

### Core Type Definitions

#### 1. MenuItem Interface
Represents a single item on the restaurant menu.

**Properties:**
- `id`: Unique identifier (string UUID)
- `name`: Item name (string)
- `description`: Item description (string)
- `price`: Price in dollars (number)
- `category`: Category type (MenuCategory enum)
- `image`: Image URL (string, optional)
- `available`: Availability status (boolean)
- `preparationTime`: Time in minutes (number)
- `allergens`: List of allergens (string array, optional)
- `spicyLevel`: 0-5 scale (number, optional)
- `tags`: Custom tags (string array, optional)
- `createdAt`: Creation timestamp (Date)
- `updatedAt`: Last update timestamp (Date)

#### 2. Order Interface
Represents a customer order with multiple items.

**Properties:**
- `id`: Unique identifier (string UUID)
- `orderNumber`: Human-readable order number (string)
- `items`: Array of ordered items (OrderItem[])
- `status`: Current order status (OrderStatus enum)
- `customerName`: Customer name (string)
- `customerPhone`: Contact phone (string, optional)
- `tableNumber`: Table number (number, optional)
- `notes`: Special instructions (string, optional)
- `subtotal`: Sum of items (number)
- `tax`: Tax amount (number)
- `tip`: Tip amount (number, optional)
- `total`: Final total (number)
- `createdAt`: Order creation time (Date)
- `updatedAt`: Last update time (Date)
- `completedAt`: Completion time (Date, optional)

#### 3. OrderItem Interface
Represents a single item within an order.

**Properties:**
- `id`: Unique identifier (string UUID)
- `menuItemId`: Reference to menu item (string)
- `name`: Item name (cached from menu)
- `price`: Item price (cached from menu)
- `quantity`: Number of items (number)
- `specialRequests`: Custom requests (string, optional)
- `subtotal`: quantity × price (number)

#### 4. MenuCategory Enum
Categorizes menu items.

**Values:**
- `APPETIZER`: "Appetizer"
- `MAIN`: "Main Course"
- `DESSERT`: "Dessert"
- `DRINK`: "Drink"

#### 5. OrderStatus Enum
Tracks order lifecycle.

**Values:**
- `PENDING`: "pending" - Order received, not started
- `PREPARING`: "preparing" - Currently being prepared
- `READY`: "ready" - Ready for pickup/delivery
- `DELIVERED`: "delivered" - Completed and delivered

### Type System Architecture

```
types.ts
├── Enums
│   ├── MenuCategory
│   └── OrderStatus
├── Core Interfaces
│   ├── MenuItem
│   ├── Order
│   └── OrderItem
├── Helper Types
│   ├── MenuItemInput (for creating items)
│   ├── OrderInput (for creating orders)
│   └── OrderItemInput
└── Utility Types
    ├── StatusConfig (for UI rendering)
    └── CategoryConfig (for UI rendering)
```

## Files to Create/Modify

### 1. `/Users/noorragu/Documents/vibe-code-demo/lib/types.ts` (New File)

This file will contain all type definitions for the application.

## Step-by-Step Implementation Guide

### Step 1: Create Types File

Navigate to the lib directory and create the types file:

```bash
cd /Users/noorragu/Documents/vibe-code-demo
mkdir -p lib
touch lib/types.ts
```

### Step 2: Implement Complete Type Definitions

Open `lib/types.ts` and add the following complete type system:

```typescript
/**
 * Type definitions for Bella Cucina Restaurant Management System
 *
 * This file contains all TypeScript interfaces, types, and enums used
 * throughout the application. These types ensure type safety and provide
 * excellent IDE support with auto-completion.
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Menu item categories
 * Used to organize menu items into logical groups
 */
export enum MenuCategory {
  APPETIZER = 'Appetizer',
  MAIN = 'Main Course',
  DESSERT = 'Dessert',
  DRINK = 'Drink',
}

/**
 * Order lifecycle statuses
 * Tracks an order from creation to completion
 */
export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Represents a single item on the restaurant menu
 */
export interface MenuItem {
  /** Unique identifier (UUID format) */
  id: string;

  /** Display name of the menu item */
  name: string;

  /** Detailed description of the item */
  description: string;

  /** Price in USD (e.g., 15.99) */
  price: number;

  /** Category classification */
  category: MenuCategory;

  /** URL to item image (optional) */
  image?: string;

  /** Whether the item is currently available */
  available: boolean;

  /** Estimated preparation time in minutes */
  preparationTime: number;

  /** List of allergens (e.g., ["nuts", "dairy"]) */
  allergens?: string[];

  /** Spiciness level (0 = not spicy, 5 = very spicy) */
  spicyLevel?: number;

  /** Custom tags for filtering (e.g., ["vegetarian", "gluten-free"]) */
  tags?: string[];

  /** When the item was created */
  createdAt: Date;

  /** When the item was last updated */
  updatedAt: Date;
}

/**
 * Input type for creating/updating menu items
 * All fields except system-generated ones
 */
export type MenuItemInput = Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Represents a single line item in an order
 * Links a menu item with quantity and customizations
 */
export interface OrderItem {
  /** Unique identifier for this order item */
  id: string;

  /** Reference to the menu item */
  menuItemId: string;

  /** Cached name from menu item (for historical accuracy) */
  name: string;

  /** Cached price from menu item (for historical accuracy) */
  price: number;

  /** Number of items ordered */
  quantity: number;

  /** Special requests or customizations */
  specialRequests?: string;

  /** Calculated subtotal (price * quantity) */
  subtotal: number;
}

/**
 * Input type for creating order items
 */
export type OrderItemInput = Omit<OrderItem, 'id' | 'subtotal'>;

/**
 * Represents a complete customer order
 * Contains multiple order items and customer information
 */
export interface Order {
  /** Unique identifier (UUID format) */
  id: string;

  /** Human-readable order number (e.g., "#1001") */
  orderNumber: string;

  /** List of items in this order */
  items: OrderItem[];

  /** Current status of the order */
  status: OrderStatus;

  /** Name of the customer */
  customerName: string;

  /** Contact phone number (optional) */
  customerPhone?: string;

  /** Table number for dine-in orders (optional) */
  tableNumber?: number;

  /** Special instructions or notes */
  notes?: string;

  /** Sum of all item subtotals */
  subtotal: number;

  /** Tax amount (calculated) */
  tax: number;

  /** Tip amount (optional) */
  tip?: number;

  /** Final total including tax and tip */
  total: number;

  /** When the order was placed */
  createdAt: Date;

  /** When the order was last updated */
  updatedAt: Date;

  /** When the order was completed (optional) */
  completedAt?: Date;
}

/**
 * Input type for creating new orders
 */
export type OrderInput = Omit<
  Order,
  'id' | 'orderNumber' | 'subtotal' | 'total' | 'createdAt' | 'updatedAt' | 'completedAt'
>;

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Configuration for rendering order status
 * Maps status to display properties
 */
export interface StatusConfig {
  /** Display label */
  label: string;

  /** Tailwind color class (e.g., "bg-warning-500") */
  color: string;

  /** Icon name (from lucide-react) */
  icon: string;

  /** Longer description */
  description: string;
}

/**
 * Configuration for rendering menu categories
 * Maps category to display properties
 */
export interface CategoryConfig {
  /** Display label */
  label: string;

  /** Icon name (from lucide-react) */
  icon: string;

  /** Description */
  description: string;

  /** Display order priority */
  order: number;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Type guard to check if a value is a valid MenuCategory
 */
export function isMenuCategory(value: string): value is MenuCategory {
  return Object.values(MenuCategory).includes(value as MenuCategory);
}

/**
 * Type guard to check if a value is a valid OrderStatus
 */
export function isOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}

/**
 * Get all menu categories as an array
 */
export function getMenuCategories(): MenuCategory[] {
  return Object.values(MenuCategory);
}

/**
 * Get all order statuses as an array
 */
export function getOrderStatuses(): OrderStatus[] {
  return Object.values(OrderStatus);
}

// ============================================================================
// FILTER AND SORT TYPES
// ============================================================================

/**
 * Options for filtering menu items
 */
export interface MenuItemFilters {
  /** Filter by category */
  category?: MenuCategory;

  /** Filter by availability */
  available?: boolean;

  /** Filter by search term (name/description) */
  search?: string;

  /** Filter by tags */
  tags?: string[];

  /** Filter by max price */
  maxPrice?: number;

  /** Filter by min price */
  minPrice?: number;

  /** Filter by spicy level */
  maxSpicyLevel?: number;
}

/**
 * Options for sorting menu items
 */
export type MenuItemSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'category'
  | 'newest'
  | 'oldest';

/**
 * Options for filtering orders
 */
export interface OrderFilters {
  /** Filter by status */
  status?: OrderStatus;

  /** Filter by date range */
  startDate?: Date;
  endDate?: Date;

  /** Filter by customer name */
  customerName?: string;

  /** Filter by table number */
  tableNumber?: number;

  /** Filter by minimum total */
  minTotal?: number;
}

/**
 * Options for sorting orders
 */
export type OrderSortOption =
  | 'newest'
  | 'oldest'
  | 'total-asc'
  | 'total-desc'
  | 'status'
  | 'customer';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the operation was successful */
  success: boolean;

  /** Response data (if successful) */
  data?: T;

  /** Error message (if failed) */
  error?: string;

  /** Additional metadata */
  metadata?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];

  /** Total number of items */
  total: number;

  /** Current page number (1-indexed) */
  page: number;

  /** Items per page */
  pageSize: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there's a next page */
  hasNextPage: boolean;

  /** Whether there's a previous page */
  hasPreviousPage: boolean;
}

// ============================================================================
// STATISTICS AND ANALYTICS TYPES
// ============================================================================

/**
 * Dashboard statistics summary
 */
export interface DashboardStats {
  /** Total number of orders today */
  ordersToday: number;

  /** Total revenue today */
  revenueToday: number;

  /** Number of pending orders */
  pendingOrders: number;

  /** Number of preparing orders */
  preparingOrders: number;

  /** Number of ready orders */
  readyOrders: number;

  /** Average order value today */
  averageOrderValue: number;

  /** Most popular menu item */
  popularItem?: MenuItem;

  /** Total number of customers today */
  customersToday: number;
}

/**
 * Revenue data for charts
 */
export interface RevenueData {
  /** Date or time label */
  label: string;

  /** Revenue amount */
  revenue: number;

  /** Number of orders */
  orders: number;

  /** Date object for sorting */
  date: Date;
}

/**
 * Category sales data
 */
export interface CategorySales {
  /** Category name */
  category: MenuCategory;

  /** Total sales for category */
  sales: number;

  /** Number of items sold */
  itemsSold: number;

  /** Percentage of total sales */
  percentage: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form values for creating/editing menu items
 */
export interface MenuItemFormValues {
  name: string;
  description: string;
  price: string; // String for form input, converted to number
  category: MenuCategory;
  image?: string;
  available: boolean;
  preparationTime: string; // String for form input
  allergens: string; // Comma-separated string, converted to array
  spicyLevel?: string; // String for form input
  tags: string; // Comma-separated string
}

/**
 * Form values for creating/editing orders
 */
export interface OrderFormValues {
  customerName: string;
  customerPhone?: string;
  tableNumber?: string; // String for form input
  notes?: string;
  items: {
    menuItemId: string;
    quantity: string; // String for form input
    specialRequests?: string;
  }[];
  tip?: string; // String for form input
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Status configurations for UI rendering
 */
export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.PENDING]: {
    label: 'Pending',
    color: 'bg-warning-500',
    icon: 'Clock',
    description: 'Order received, waiting to be prepared',
  },
  [OrderStatus.PREPARING]: {
    label: 'Preparing',
    color: 'bg-info-500',
    icon: 'ChefHat',
    description: 'Order is currently being prepared',
  },
  [OrderStatus.READY]: {
    label: 'Ready',
    color: 'bg-success-500',
    icon: 'CheckCircle',
    description: 'Order is ready for pickup or delivery',
  },
  [OrderStatus.DELIVERED]: {
    label: 'Delivered',
    color: 'bg-primary-500',
    icon: 'Package',
    description: 'Order has been delivered to customer',
  },
};

/**
 * Category configurations for UI rendering
 */
export const CATEGORY_CONFIG: Record<MenuCategory, CategoryConfig> = {
  [MenuCategory.APPETIZER]: {
    label: 'Appetizers',
    icon: 'Salad',
    description: 'Start your meal with our delicious appetizers',
    order: 1,
  },
  [MenuCategory.MAIN]: {
    label: 'Main Courses',
    icon: 'UtensilsCrossed',
    description: 'Hearty main dishes to satisfy your hunger',
    order: 2,
  },
  [MenuCategory.DESSERT]: {
    label: 'Desserts',
    icon: 'IceCream',
    description: 'Sweet treats to end your meal',
    order: 3,
  },
  [MenuCategory.DRINK]: {
    label: 'Drinks',
    icon: 'Coffee',
    description: 'Refreshing beverages',
    order: 4,
  },
};

/**
 * Tax rate for calculations (8.5%)
 */
export const TAX_RATE = 0.085;

/**
 * Default preparation times by category (in minutes)
 */
export const DEFAULT_PREP_TIMES: Record<MenuCategory, number> = {
  [MenuCategory.APPETIZER]: 10,
  [MenuCategory.MAIN]: 20,
  [MenuCategory.DESSERT]: 8,
  [MenuCategory.DRINK]: 3,
};
```

### Step 3: Verify Type Compilation

Test that all types compile without errors:

```bash
npx tsc --noEmit
```

**Expected Output:** No output (silence means success!)

### Step 4: Create a Type Test File

Create a test file to verify all types work correctly:

```bash
cat > lib/types.test.ts << 'EOF'
/**
 * Type testing file - validates type definitions
 * This file should compile without errors
 */

import {
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  OrderItem,
  MenuItemInput,
  OrderInput,
  isMenuCategory,
  isOrderStatus,
  STATUS_CONFIG,
  CATEGORY_CONFIG,
} from './types';

// Test MenuItem creation
const testMenuItem: MenuItem = {
  id: '123',
  name: 'Margherita Pizza',
  description: 'Classic pizza with tomatoes and mozzarella',
  price: 15.99,
  category: MenuCategory.MAIN,
  available: true,
  preparationTime: 15,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Test MenuItemInput (without id, createdAt, updatedAt)
const testMenuItemInput: MenuItemInput = {
  name: 'Margherita Pizza',
  description: 'Classic pizza',
  price: 15.99,
  category: MenuCategory.MAIN,
  available: true,
  preparationTime: 15,
};

// Test OrderItem
const testOrderItem: OrderItem = {
  id: '456',
  menuItemId: '123',
  name: 'Margherita Pizza',
  price: 15.99,
  quantity: 2,
  subtotal: 31.98,
};

// Test Order
const testOrder: Order = {
  id: '789',
  orderNumber: '#1001',
  items: [testOrderItem],
  status: OrderStatus.PENDING,
  customerName: 'John Doe',
  customerPhone: '555-0100',
  tableNumber: 5,
  subtotal: 31.98,
  tax: 2.72,
  total: 34.70,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Test type guards
const testCategory: string = 'Appetizer';
if (isMenuCategory(testCategory)) {
  console.log('Valid category:', testCategory);
}

const testStatus: string = 'pending';
if (isOrderStatus(testStatus)) {
  console.log('Valid status:', testStatus);
}

// Test status config
const statusConfig = STATUS_CONFIG[OrderStatus.PENDING];
console.log('Status label:', statusConfig.label);

// Test category config
const categoryConfig = CATEGORY_CONFIG[MenuCategory.MAIN];
console.log('Category label:', categoryConfig.label);

// Test with optional fields
const testMenuItemWithOptionals: MenuItem = {
  id: '124',
  name: 'Spicy Pasta',
  description: 'Hot and spicy pasta',
  price: 18.99,
  category: MenuCategory.MAIN,
  available: true,
  preparationTime: 18,
  allergens: ['gluten'],
  spicyLevel: 4,
  tags: ['spicy', 'popular'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export {};
EOF
```

Verify it compiles:
```bash
npx tsc lib/types.test.ts --noEmit
```

### Step 5: Create Type Documentation

Create a documentation file explaining the type system:

```bash
cat > lib/TYPES_README.md << 'EOF'
# Type System Documentation

## Overview

This document explains the TypeScript type system used in the Bella Cucina application.

## Core Types

### MenuItem

Represents a menu item with all its properties.

```typescript
const pizza: MenuItem = {
  id: uuid(),
  name: "Margherita Pizza",
  description: "Classic Italian pizza",
  price: 15.99,
  category: MenuCategory.MAIN,
  available: true,
  preparationTime: 15,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Order

Represents a customer order.

```typescript
const order: Order = {
  id: uuid(),
  orderNumber: "#1001",
  items: [...],
  status: OrderStatus.PENDING,
  customerName: "John Doe",
  subtotal: 31.98,
  tax: 2.72,
  total: 34.70,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Enums

### MenuCategory

- `APPETIZER`: Appetizers and starters
- `MAIN`: Main courses
- `DESSERT`: Desserts and sweets
- `DRINK`: Beverages

### OrderStatus

- `PENDING`: Order received
- `PREPARING`: Being prepared
- `READY`: Ready for pickup
- `DELIVERED`: Completed

## Input Types

Use input types when creating new entities (they omit system-generated fields):

```typescript
const newItem: MenuItemInput = {
  name: "New Pizza",
  description: "Description",
  price: 19.99,
  category: MenuCategory.MAIN,
  available: true,
  preparationTime: 15,
};
```

## Type Guards

Use type guards to safely check enum values:

```typescript
const category: string = userInput;

if (isMenuCategory(category)) {
  // TypeScript knows category is MenuCategory here
  processCategory(category);
}
```

## Constants

### STATUS_CONFIG

Maps order status to UI configuration.

### CATEGORY_CONFIG

Maps menu category to UI configuration.

### TAX_RATE

Current tax rate (0.085 = 8.5%).

## Usage Examples

See `types.test.ts` for complete usage examples.
EOF
```

### Step 6: Export Types from Index

Create an index file for easier imports:

```bash
cat > lib/index.ts << 'EOF'
/**
 * Main library exports
 */

// Export all types
export * from './types';

// Re-export commonly used types
export type {
  MenuItem,
  Order,
  OrderItem,
  MenuItemInput,
  OrderInput,
} from './types';

// Re-export enums
export { MenuCategory, OrderStatus } from './types';
EOF
```

### Step 7: Test Type Usage in a Component

Create a test component to verify types work in React:

```typescript
// app/test-types/page.tsx
import {
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  STATUS_CONFIG,
  CATEGORY_CONFIG,
} from '@/lib/types';

export default function TypeTest() {
  // Create a test menu item
  const menuItem: MenuItem = {
    id: '1',
    name: 'Test Item',
    description: 'A test item',
    price: 10.99,
    category: MenuCategory.APPETIZER,
    available: true,
    preparationTime: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create a test order
  const order: Order = {
    id: '1',
    orderNumber: '#1001',
    items: [],
    status: OrderStatus.PENDING,
    customerName: 'Test Customer',
    subtotal: 10.99,
    tax: 0.94,
    total: 11.93,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Type System Test</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Menu Item</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(menuItem, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Order</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(order, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Status Config</h2>
          <div className="flex gap-2">
            {Object.values(OrderStatus).map(status => (
              <div key={status} className="badge badge-primary">
                {STATUS_CONFIG[status].label}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Category Config</h2>
          <div className="flex gap-2">
            {Object.values(MenuCategory).map(category => (
              <div key={category} className="badge badge-secondary">
                {CATEGORY_CONFIG[category].label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Code Examples

### Example 1: Creating a Menu Item

```typescript
import { MenuItem, MenuCategory } from '@/lib/types';

function createMenuItem(): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil',
    price: 15.99,
    category: MenuCategory.MAIN,
    available: true,
    preparationTime: 15,
    allergens: ['dairy', 'gluten'],
    tags: ['popular', 'vegetarian'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
```

### Example 2: Type-Safe Order Creation

```typescript
import { Order, OrderStatus, OrderItem } from '@/lib/types';

function createOrder(items: OrderItem[]): Order {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  return {
    id: crypto.randomUUID(),
    orderNumber: `#${Date.now()}`,
    items,
    status: OrderStatus.PENDING,
    customerName: 'John Doe',
    subtotal,
    tax,
    total,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
```

### Example 3: Using Type Guards

```typescript
import { isMenuCategory, isOrderStatus } from '@/lib/types';

function validateUserInput(category: string, status: string) {
  if (!isMenuCategory(category)) {
    throw new Error('Invalid category');
  }

  if (!isOrderStatus(status)) {
    throw new Error('Invalid status');
  }

  // TypeScript now knows these are the correct types
  processCategory(category); // category is MenuCategory
  processStatus(status);     // status is OrderStatus
}
```

### Example 4: Using Configuration Objects

```typescript
import { OrderStatus, STATUS_CONFIG } from '@/lib/types';

function renderOrderStatus(status: OrderStatus) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`badge ${config.color}`}>
      {config.label}
    </div>
  );
}
```

### Example 5: Filter and Sort with Type Safety

```typescript
import { MenuItem, MenuItemFilters, MenuItemSortOption } from '@/lib/types';

function filterMenuItems(
  items: MenuItem[],
  filters: MenuItemFilters,
  sort: MenuItemSortOption
): MenuItem[] {
  let filtered = items;

  // Apply filters
  if (filters.category) {
    filtered = filtered.filter(item => item.category === filters.category);
  }

  if (filters.available !== undefined) {
    filtered = filtered.filter(item => item.available === filters.available);
  }

  // Apply sorting
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return filtered;
}
```

## Acceptance Criteria

This task is considered complete when:

1. ✅ `lib/types.ts` exists with all type definitions
2. ✅ `MenuItem` interface defined with all properties
3. ✅ `Order` interface defined with all properties
4. ✅ `OrderItem` interface defined with all properties
5. ✅ `MenuCategory` enum defined with all values
6. ✅ `OrderStatus` enum defined with all values
7. ✅ Input types (`MenuItemInput`, `OrderInput`) defined
8. ✅ Type guards (`isMenuCategory`, `isOrderStatus`) implemented
9. ✅ Configuration objects (`STATUS_CONFIG`, `CATEGORY_CONFIG`) defined
10. ✅ Filter and sort types defined
11. ✅ API response types defined
12. ✅ All types compile without errors (`npx tsc --noEmit`)
13. ✅ Test file (`types.test.ts`) compiles successfully
14. ✅ Documentation file (`TYPES_README.md`) created
15. ✅ Types can be imported and used in components

## Testing Strategy

### Manual Testing

#### Test 1: Type Compilation
```bash
npx tsc --noEmit
# Should output nothing (success)
```

#### Test 2: Import Types
```typescript
import { MenuItem, Order } from '@/lib/types';
// No errors should occur
```

#### Test 3: IDE Auto-completion
- Open any TypeScript file
- Type `const item: MenuItem = {`
- IDE should show auto-complete for all properties

#### Test 4: Type Validation
```typescript
const item: MenuItem = {
  id: '123',
  name: 'Pizza',
  // Missing required fields should show errors
};
```

### Automated Testing

Create a comprehensive type test:

**File:** `scripts/test-types.ts`

```typescript
import {
  MenuItem,
  Order,
  MenuCategory,
  OrderStatus,
  isMenuCategory,
  isOrderStatus,
  getMenuCategories,
  getOrderStatuses,
} from '../lib/types';

console.log('Testing type definitions...\n');

// Test enum values
const categories = getMenuCategories();
console.log(`✅ Menu categories (${categories.length}):`, categories);

const statuses = getOrderStatuses();
console.log(`✅ Order statuses (${statuses.length}):`, statuses);

// Test type guards
const validCategory = 'Appetizer';
console.log(`✅ isMenuCategory("${validCategory}"):`, isMenuCategory(validCategory));

const invalidCategory = 'Invalid';
console.log(`❌ isMenuCategory("${invalidCategory}"):`, isMenuCategory(invalidCategory));

const validStatus = 'pending';
console.log(`✅ isOrderStatus("${validStatus}"):`, isOrderStatus(validStatus));

const invalidStatus = 'invalid';
console.log(`❌ isOrderStatus("${invalidStatus}"):`, isOrderStatus(invalidStatus));

console.log('\n✅ All type tests passed!');
```

Run with:
```bash
npx ts-node scripts/test-types.ts
```

## Common Pitfalls and Debugging Tips

### Pitfall 1: Optional vs Required Fields

**Problem:** Forgetting to mark optional fields with `?`

**Solution:**
```typescript
// ❌ Wrong - makes field required
interface MenuItem {
  allergens: string[];
}

// ✅ Correct - makes field optional
interface MenuItem {
  allergens?: string[];
}
```

### Pitfall 2: Date Serialization

**Problem:** Dates don't serialize to JSON properly

**Solution:**
```typescript
// When sending to API, convert dates to strings
const apiData = {
  ...menuItem,
  createdAt: menuItem.createdAt.toISOString(),
};

// When receiving from API, parse back to Date
const menuItem: MenuItem = {
  ...apiData,
  createdAt: new Date(apiData.createdAt),
};
```

### Pitfall 3: Enum String Values

**Problem:** Comparing enum with wrong value

**Solution:**
```typescript
// ❌ Wrong - using enum name
if (order.status === 'PENDING') { }

// ✅ Correct - using enum value
if (order.status === OrderStatus.PENDING) { }
// OR
if (order.status === 'pending') { }
```

### Pitfall 4: Type Narrowing

**Problem:** TypeScript doesn't know optional field is defined

**Solution:**
```typescript
// ❌ Error: allergens might be undefined
menuItem.allergens.forEach(a => console.log(a));

// ✅ Check first
if (menuItem.allergens) {
  menuItem.allergens.forEach(a => console.log(a));
}

// ✅ Or use optional chaining
menuItem.allergens?.forEach(a => console.log(a));
```

### Pitfall 5: Omit Type Issues

**Problem:** `Omit` doesn't work as expected

**Solution:**
```typescript
// Make sure omitted fields are spelled correctly
type MenuItemInput = Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>;

// NOT: 'ID' or 'created_at'
```

## Performance Considerations

### Type Compilation Speed

- Keep interfaces focused and specific
- Avoid deeply nested types
- Use type aliases for complex unions

### Runtime Impact

- **Zero runtime cost** - TypeScript types are erased during compilation
- Enums are the only types that generate runtime code
- Consider using string literal unions instead of enums for zero runtime cost:

```typescript
// Enum (generates runtime code)
enum Status {
  PENDING = 'pending'
}

// String literal union (no runtime code)
type Status = 'pending' | 'preparing' | 'ready';
```

## Related Tasks

- **Previous Task:** [Task 1.3: Configure Tailwind CSS](./task-1.3-configure-tailwind.md)
- **Next Task:** [Task 1.5: Implement Data Store](./task-1.5-implement-data-store.md)
- **Dependent Tasks:**
  - Task 1.5: Data Store (uses all these types)
  - Task 1.6: Utility Functions (uses types for validation)
  - All Phase 2-4 tasks (consume these types)

## Resources and Documentation

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Best Practices
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [TypeScript Best Practices](https://typescript.tv/best-practices/)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Coverage Tool](https://github.com/plantain-00/type-coverage)

## Notes

- All types use strict TypeScript mode
- Date fields use JavaScript Date objects (not strings)
- Price values are numbers (not strings)
- Enums use PascalCase for names, various cases for values
- Optional fields marked with `?` suffix
- Input types omit system-generated fields
- Configuration objects provide UI rendering data

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
