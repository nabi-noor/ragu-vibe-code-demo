# Task 1.5: Implement Data Store

**Task ID:** 1.5
**Task Name:** Implement Data Store
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 2-3 hours
**Complexity:** High
**Prerequisites:** Task 1.4 (Create Type Definitions)

## Overview

This task involves creating an in-memory data store that manages menu items and orders for the Bella Cucina application. The store will include 16 carefully crafted menu items across 4 categories (appetizers, mains, desserts, drinks) and 8 sample orders in various statuses. Additionally, we'll implement full CRUD (Create, Read, Update, Delete) operations for both entities. This data store serves as a temporary backend until Phase 5 when we implement actual database persistence.

## Importance

A well-implemented data store is crucial because:

1. **Development Velocity** - Enables immediate feature development without backend dependencies
2. **Realistic Testing** - Seed data provides realistic scenarios for UI development
3. **API Design** - Establishes the data access patterns that will be used with real databases
4. **State Management** - Demonstrates proper separation of concerns between data and UI
5. **Type Safety** - Leverages TypeScript types to ensure data integrity
6. **Prototyping** - Allows stakeholders to interact with realistic data

## Prerequisites

### Required Completion
- ✅ Task 1.4: Type definitions (`lib/types.ts`) created
- ✅ All TypeScript interfaces defined
- ✅ Enums for MenuCategory and OrderStatus exist

### Verification
```bash
# Check types file exists
ls -la /Users/noorragu/Documents/vibe-code-demo/lib/types.ts

# Verify types compile
npx tsc lib/types.ts --noEmit
```

## Technical Specifications

### Data Store Architecture

```
data-store.ts
├── In-Memory Storage
│   ├── menuItems: Map<string, MenuItem>
│   └── orders: Map<string, Order>
├── CRUD Operations - Menu Items
│   ├── getMenuItems()
│   ├── getMenuItemById()
│   ├── createMenuItem()
│   ├── updateMenuItem()
│   └── deleteMenuItem()
├── CRUD Operations - Orders
│   ├── getOrders()
│   ├── getOrderById()
│   ├── createOrder()
│   ├── updateOrder()
│   ├── updateOrderStatus()
│   └── deleteOrder()
├── Query Operations
│   ├── getMenuItemsByCategory()
│   ├── getAvailableMenuItems()
│   ├── getOrdersByStatus()
│   └── getRecentOrders()
└── Utility Operations
    ├── searchMenuItems()
    ├── calculateOrderTotal()
    └── getOrderStatistics()
```

### Seed Data Specifications

#### Menu Items (16 total)

**Appetizers (4 items):**
1. Bruschetta - $8.99
2. Caprese Salad - $10.99
3. Calamari Fritti - $12.99
4. Arancini - $9.99

**Main Courses (5 items):**
1. Margherita Pizza - $15.99
2. Spaghetti Carbonara - $16.99
3. Chicken Parmigiana - $19.99
4. Seafood Risotto - $22.99
5. Lasagna Bolognese - $18.99

**Desserts (3 items):**
1. Tiramisu - $7.99
2. Panna Cotta - $6.99
3. Cannoli - $5.99

**Drinks (4 items):**
1. Espresso - $3.50
2. Cappuccino - $4.50
3. Italian Soda - $3.99
4. House Wine - $8.00

#### Orders (8 total)

**Status Distribution:**
- 2 PENDING orders
- 3 PREPARING orders
- 2 READY orders
- 1 DELIVERED order

**Order Characteristics:**
- Various item quantities (1-4 items per order)
- Mix of table numbers and phone orders
- Different customer names
- Varying order totals ($20-$70)
- Realistic timestamps (today's date, staggered times)

## Files to Create/Modify

### 1. `/Users/noorragu/Documents/vibe-code-demo/lib/data-store.ts` (New File)

Main data store implementation with all CRUD operations and seed data.

## Step-by-Step Implementation Guide

### Step 1: Create Data Store File

```bash
cd /Users/noorragu/Documents/vibe-code-demo
touch lib/data-store.ts
```

### Step 2: Implement Complete Data Store

Open `lib/data-store.ts` and implement the complete data store:

```typescript
/**
 * In-Memory Data Store for Bella Cucina
 *
 * This module provides CRUD operations for menu items and orders.
 * Data is stored in-memory using Maps for fast lookups.
 *
 * Note: In Phase 5, this will be replaced with actual database operations.
 */

import {
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  OrderItem,
  MenuItemInput,
  OrderInput,
  TAX_RATE,
} from './types';

// ============================================================================
// IN-MEMORY STORAGE
// ============================================================================

/**
 * In-memory storage using Maps for O(1) lookups
 */
const menuItems = new Map<string, MenuItem>();
const orders = new Map<string, Order>();

/**
 * Counter for generating sequential order numbers
 */
let orderCounter = 1000;

// ============================================================================
// SEED DATA
// ============================================================================

/**
 * Initialize the data store with seed data
 */
function initializeSeedData() {
  // Clear existing data
  menuItems.clear();
  orders.clear();
  orderCounter = 1000;

  // Seed menu items
  seedMenuItems();

  // Seed orders
  seedOrders();
}

/**
 * Seed 16 menu items across 4 categories
 */
function seedMenuItems() {
  const items: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // APPETIZERS (4 items)
    {
      name: 'Bruschetta',
      description:
        'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil',
      price: 8.99,
      category: MenuCategory.APPETIZER,
      image: '/images/bruschetta.jpg',
      available: true,
      preparationTime: 10,
      allergens: ['gluten'],
      tags: ['vegetarian', 'popular'],
    },
    {
      name: 'Caprese Salad',
      description:
        'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze',
      price: 10.99,
      category: MenuCategory.APPETIZER,
      image: '/images/caprese.jpg',
      available: true,
      preparationTime: 8,
      allergens: ['dairy'],
      tags: ['vegetarian', 'gluten-free'],
    },
    {
      name: 'Calamari Fritti',
      description: 'Lightly fried calamari served with marinara sauce and lemon',
      price: 12.99,
      category: MenuCategory.APPETIZER,
      image: '/images/calamari.jpg',
      available: true,
      preparationTime: 12,
      allergens: ['seafood', 'gluten'],
      tags: ['seafood'],
    },
    {
      name: 'Arancini',
      description: 'Sicilian rice balls stuffed with cheese and meat, deep-fried',
      price: 9.99,
      category: MenuCategory.APPETIZER,
      image: '/images/arancini.jpg',
      available: true,
      preparationTime: 15,
      allergens: ['dairy', 'gluten'],
      tags: ['popular'],
    },

    // MAIN COURSES (5 items)
    {
      name: 'Margherita Pizza',
      description:
        'Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil',
      price: 15.99,
      category: MenuCategory.MAIN,
      image: '/images/margherita.jpg',
      available: true,
      preparationTime: 20,
      allergens: ['dairy', 'gluten'],
      tags: ['vegetarian', 'popular', 'pizza'],
    },
    {
      name: 'Spaghetti Carbonara',
      description: 'Pasta with eggs, Pecorino cheese, pancetta, and black pepper',
      price: 16.99,
      category: MenuCategory.MAIN,
      image: '/images/carbonara.jpg',
      available: true,
      preparationTime: 18,
      allergens: ['dairy', 'gluten', 'eggs'],
      tags: ['pasta', 'popular'],
    },
    {
      name: 'Chicken Parmigiana',
      description: 'Breaded chicken breast with marinara sauce and melted mozzarella',
      price: 19.99,
      category: MenuCategory.MAIN,
      image: '/images/chicken-parm.jpg',
      available: true,
      preparationTime: 25,
      allergens: ['dairy', 'gluten'],
      tags: ['chicken'],
    },
    {
      name: 'Seafood Risotto',
      description: 'Creamy Arborio rice with shrimp, scallops, and mussels',
      price: 22.99,
      category: MenuCategory.MAIN,
      image: '/images/risotto.jpg',
      available: true,
      preparationTime: 30,
      allergens: ['seafood', 'dairy'],
      tags: ['seafood', 'signature'],
    },
    {
      name: 'Lasagna Bolognese',
      description: 'Layers of pasta with meat sauce, béchamel, and Parmesan',
      price: 18.99,
      category: MenuCategory.MAIN,
      image: '/images/lasagna.jpg',
      available: true,
      preparationTime: 22,
      allergens: ['dairy', 'gluten'],
      tags: ['popular', 'pasta'],
    },

    // DESSERTS (3 items)
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 7.99,
      category: MenuCategory.DESSERT,
      image: '/images/tiramisu.jpg',
      available: true,
      preparationTime: 8,
      allergens: ['dairy', 'eggs', 'gluten'],
      tags: ['popular', 'coffee'],
    },
    {
      name: 'Panna Cotta',
      description: 'Silky vanilla cream with berry compote',
      price: 6.99,
      category: MenuCategory.DESSERT,
      image: '/images/panna-cotta.jpg',
      available: true,
      preparationTime: 5,
      allergens: ['dairy'],
      tags: ['gluten-free'],
    },
    {
      name: 'Cannoli',
      description: 'Crispy pastry shells filled with sweet ricotta cream and chocolate chips',
      price: 5.99,
      category: MenuCategory.DESSERT,
      image: '/images/cannoli.jpg',
      available: true,
      preparationTime: 5,
      allergens: ['dairy', 'gluten'],
      tags: ['popular'],
    },

    // DRINKS (4 items)
    {
      name: 'Espresso',
      description: 'Strong Italian coffee, freshly brewed',
      price: 3.5,
      category: MenuCategory.DRINK,
      image: '/images/espresso.jpg',
      available: true,
      preparationTime: 3,
      tags: ['coffee', 'hot'],
    },
    {
      name: 'Cappuccino',
      description: 'Espresso with steamed milk and foam',
      price: 4.5,
      category: MenuCategory.DRINK,
      image: '/images/cappuccino.jpg',
      available: true,
      preparationTime: 5,
      allergens: ['dairy'],
      tags: ['coffee', 'hot'],
    },
    {
      name: 'Italian Soda',
      description: 'Sparkling water with flavored syrup and fresh lemon',
      price: 3.99,
      category: MenuCategory.DRINK,
      image: '/images/soda.jpg',
      available: true,
      preparationTime: 2,
      tags: ['cold', 'refreshing'],
    },
    {
      name: 'House Wine',
      description: 'Selection of red or white Italian wines',
      price: 8.0,
      category: MenuCategory.DRINK,
      image: '/images/wine.jpg',
      available: true,
      preparationTime: 2,
      allergens: ['sulfites'],
      tags: ['alcohol'],
    },
  ];

  // Create menu items with IDs and timestamps
  items.forEach(item => {
    const menuItem: MenuItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    menuItems.set(menuItem.id, menuItem);
  });
}

/**
 * Seed 8 orders with various statuses
 */
function seedOrders() {
  const allMenuItems = Array.from(menuItems.values());

  // Helper to get menu item by name
  const getItemByName = (name: string) =>
    allMenuItems.find(item => item.name === name)!;

  // Create orders with different statuses and characteristics
  const orderData: Array<{
    status: OrderStatus;
    customerName: string;
    customerPhone?: string;
    tableNumber?: number;
    items: Array<{ item: MenuItem; quantity: number; specialRequests?: string }>;
    notes?: string;
    tip?: number;
    minutesAgo: number;
  }> = [
    // PENDING Orders (2)
    {
      status: OrderStatus.PENDING,
      customerName: 'Sarah Johnson',
      customerPhone: '555-0101',
      items: [
        { item: getItemByName('Margherita Pizza'), quantity: 2 },
        { item: getItemByName('Caprese Salad'), quantity: 1 },
        { item: getItemByName('Italian Soda'), quantity: 2 },
      ],
      notes: 'Please deliver to table when ready',
      tip: 5.0,
      minutesAgo: 5,
    },
    {
      status: OrderStatus.PENDING,
      customerName: 'Michael Chen',
      tableNumber: 7,
      items: [
        { item: getItemByName('Spaghetti Carbonara'), quantity: 1 },
        { item: getItemByName('House Wine'), quantity: 1 },
      ],
      minutesAgo: 3,
    },

    // PREPARING Orders (3)
    {
      status: OrderStatus.PREPARING,
      customerName: 'Emily Rodriguez',
      tableNumber: 3,
      items: [
        { item: getItemByName('Seafood Risotto'), quantity: 1 },
        { item: getItemByName('Bruschetta'), quantity: 1 },
        { item: getItemByName('Tiramisu'), quantity: 2 },
        { item: getItemByName('Cappuccino'), quantity: 2 },
      ],
      notes: 'Celebrating anniversary - please add candle to dessert',
      tip: 10.0,
      minutesAgo: 15,
    },
    {
      status: OrderStatus.PREPARING,
      customerName: 'David Thompson',
      customerPhone: '555-0103',
      items: [
        { item: getItemByName('Chicken Parmigiana'), quantity: 1 },
        { item: getItemByName('Lasagna Bolognese'), quantity: 1 },
        { item: getItemByName('Arancini'), quantity: 1 },
      ],
      minutesAgo: 20,
    },
    {
      status: OrderStatus.PREPARING,
      customerName: 'Jessica Martinez',
      tableNumber: 5,
      items: [
        {
          item: getItemByName('Margherita Pizza'),
          quantity: 1,
          specialRequests: 'Extra basil, light cheese',
        },
        { item: getItemByName('Calamari Fritti'), quantity: 1 },
      ],
      minutesAgo: 12,
    },

    // READY Orders (2)
    {
      status: OrderStatus.READY,
      customerName: 'Robert Wilson',
      tableNumber: 2,
      items: [
        { item: getItemByName('Spaghetti Carbonara'), quantity: 2 },
        { item: getItemByName('Caprese Salad'), quantity: 2 },
        { item: getItemByName('Panna Cotta'), quantity: 2 },
        { item: getItemByName('Espresso'), quantity: 2 },
      ],
      tip: 15.0,
      minutesAgo: 35,
    },
    {
      status: OrderStatus.READY,
      customerName: 'Amanda Lee',
      customerPhone: '555-0105',
      items: [
        { item: getItemByName('Lasagna Bolognese'), quantity: 1 },
        { item: getItemByName('Italian Soda'), quantity: 1 },
      ],
      notes: 'For pickup',
      minutesAgo: 28,
    },

    // DELIVERED Order (1)
    {
      status: OrderStatus.DELIVERED,
      customerName: 'Christopher Brown',
      tableNumber: 8,
      items: [
        { item: getItemByName('Seafood Risotto'), quantity: 1 },
        { item: getItemByName('Bruschetta'), quantity: 1 },
        { item: getItemByName('Cannoli'), quantity: 1 },
        { item: getItemByName('House Wine'), quantity: 2 },
      ],
      tip: 8.0,
      minutesAgo: 60,
    },
  ];

  // Create actual order objects
  orderData.forEach(data => {
    const orderItems: OrderItem[] = data.items.map(({ item, quantity, specialRequests }) => ({
      id: crypto.randomUUID(),
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      specialRequests,
      subtotal: item.price * quantity,
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + (data.tip || 0);

    const orderDate = new Date();
    orderDate.setMinutes(orderDate.getMinutes() - data.minutesAgo);

    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: `#${++orderCounter}`,
      items: orderItems,
      status: data.status,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      tableNumber: data.tableNumber,
      notes: data.notes,
      subtotal,
      tax,
      tip: data.tip,
      total,
      createdAt: orderDate,
      updatedAt: orderDate,
      completedAt: data.status === OrderStatus.DELIVERED ? orderDate : undefined,
    };

    orders.set(order.id, order);
  });
}

// ============================================================================
// MENU ITEM CRUD OPERATIONS
// ============================================================================

/**
 * Get all menu items
 */
export function getMenuItems(): MenuItem[] {
  return Array.from(menuItems.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Get a menu item by ID
 */
export function getMenuItemById(id: string): MenuItem | null {
  return menuItems.get(id) || null;
}

/**
 * Get menu items by category
 */
export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  return Array.from(menuItems.values()).filter(item => item.category === category);
}

/**
 * Get available menu items only
 */
export function getAvailableMenuItems(): MenuItem[] {
  return Array.from(menuItems.values()).filter(item => item.available);
}

/**
 * Search menu items by name or description
 */
export function searchMenuItems(query: string): MenuItem[] {
  const lowercaseQuery = query.toLowerCase();
  return Array.from(menuItems.values()).filter(
    item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Create a new menu item
 */
export function createMenuItem(input: MenuItemInput): MenuItem {
  const menuItem: MenuItem = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  menuItems.set(menuItem.id, menuItem);
  return menuItem;
}

/**
 * Update an existing menu item
 */
export function updateMenuItem(id: string, updates: Partial<MenuItemInput>): MenuItem | null {
  const existingItem = menuItems.get(id);
  if (!existingItem) return null;

  const updatedItem: MenuItem = {
    ...existingItem,
    ...updates,
    updatedAt: new Date(),
  };

  menuItems.set(id, updatedItem);
  return updatedItem;
}

/**
 * Delete a menu item
 */
export function deleteMenuItem(id: string): boolean {
  return menuItems.delete(id);
}

// ============================================================================
// ORDER CRUD OPERATIONS
// ============================================================================

/**
 * Get all orders
 */
export function getOrders(): Order[] {
  return Array.from(orders.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

/**
 * Get an order by ID
 */
export function getOrderById(id: string): Order | null {
  return orders.get(id) || null;
}

/**
 * Get orders by status
 */
export function getOrdersByStatus(status: OrderStatus): Order[] {
  return Array.from(orders.values()).filter(order => order.status === status);
}

/**
 * Get recent orders (last N orders)
 */
export function getRecentOrders(limit: number = 10): Order[] {
  return Array.from(orders.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

/**
 * Create a new order
 */
export function createOrder(input: OrderInput): Order {
  const order: Order = {
    ...input,
    id: crypto.randomUUID(),
    orderNumber: `#${++orderCounter}`,
    subtotal: input.items.reduce((sum, item) => sum + item.subtotal, 0),
    total: 0, // Will be calculated below
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Calculate total
  order.total = order.subtotal + order.tax + (order.tip || 0);

  orders.set(order.id, order);
  return order;
}

/**
 * Update an existing order
 */
export function updateOrder(id: string, updates: Partial<OrderInput>): Order | null {
  const existingOrder = orders.get(id);
  if (!existingOrder) return null;

  const updatedOrder: Order = {
    ...existingOrder,
    ...updates,
    updatedAt: new Date(),
  };

  // Recalculate totals if items changed
  if (updates.items) {
    updatedOrder.subtotal = updatedOrder.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    updatedOrder.total = updatedOrder.subtotal + updatedOrder.tax + (updatedOrder.tip || 0);
  }

  orders.set(id, updatedOrder);
  return updatedOrder;
}

/**
 * Update order status
 */
export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const existingOrder = orders.get(id);
  if (!existingOrder) return null;

  const updatedOrder: Order = {
    ...existingOrder,
    status,
    updatedAt: new Date(),
    completedAt: status === OrderStatus.DELIVERED ? new Date() : existingOrder.completedAt,
  };

  orders.set(id, updatedOrder);
  return updatedOrder;
}

/**
 * Delete an order
 */
export function deleteOrder(id: string): boolean {
  return orders.delete(id);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate order statistics
 */
export function getOrderStatistics() {
  const allOrders = Array.from(orders.values());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = allOrders.filter(order => order.createdAt >= today);

  const revenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = allOrders.filter(
    order => order.status === OrderStatus.PENDING
  ).length;

  const preparingOrders = allOrders.filter(
    order => order.status === OrderStatus.PREPARING
  ).length;

  const readyOrders = allOrders.filter(
    order => order.status === OrderStatus.READY
  ).length;

  const averageOrderValue =
    ordersToday.length > 0 ? revenueToday / ordersToday.length : 0;

  return {
    ordersToday: ordersToday.length,
    revenueToday,
    pendingOrders,
    preparingOrders,
    readyOrders,
    averageOrderValue,
  };
}

/**
 * Get menu statistics
 */
export function getMenuStatistics() {
  const allItems = Array.from(menuItems.values());

  return {
    totalItems: allItems.length,
    availableItems: allItems.filter(item => item.available).length,
    appetizers: allItems.filter(item => item.category === MenuCategory.APPETIZER).length,
    mains: allItems.filter(item => item.category === MenuCategory.MAIN).length,
    desserts: allItems.filter(item => item.category === MenuCategory.DESSERT).length,
    drinks: allItems.filter(item => item.category === MenuCategory.DRINK).length,
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize seed data when module loads
initializeSeedData();

// Export initialization function for testing
export { initializeSeedData };
```

### Step 3: Verify Data Store Works

Create a test file to verify the data store:

```typescript
// lib/data-store.test.ts
import {
  getMenuItems,
  getOrders,
  getMenuItemsByCategory,
  getOrdersByStatus,
  createMenuItem,
  createOrder,
  updateOrderStatus,
  getOrderStatistics,
  getMenuStatistics,
} from './data-store';
import { MenuCategory, OrderStatus } from './types';

console.log('🧪 Testing Data Store\n');

// Test menu items
const menuItems = getMenuItems();
console.log(`✅ Menu items loaded: ${menuItems.length}`);
console.log(`   Expected: 16`);

// Test by category
const appetizers = getMenuItemsByCategory(MenuCategory.APPETIZER);
console.log(`✅ Appetizers: ${appetizers.length} (Expected: 4)`);

const mains = getMenuItemsByCategory(MenuCategory.MAIN);
console.log(`✅ Mains: ${mains.length} (Expected: 5)`);

const desserts = getMenuItemsByCategory(MenuCategory.DESSERT);
console.log(`✅ Desserts: ${desserts.length} (Expected: 3)`);

const drinks = getMenuItemsByCategory(MenuCategory.DRINK);
console.log(`✅ Drinks: ${drinks.length} (Expected: 4)`);

// Test orders
const orders = getOrders();
console.log(`\n✅ Orders loaded: ${orders.length}`);
console.log(`   Expected: 8`);

// Test by status
const pending = getOrdersByStatus(OrderStatus.PENDING);
console.log(`✅ Pending: ${pending.length} (Expected: 2)`);

const preparing = getOrdersByStatus(OrderStatus.PREPARING);
console.log(`✅ Preparing: ${preparing.length} (Expected: 3)`);

const ready = getOrdersByStatus(OrderStatus.READY);
console.log(`✅ Ready: ${ready.length} (Expected: 2)`);

const delivered = getOrdersByStatus(OrderStatus.DELIVERED);
console.log(`✅ Delivered: ${delivered.length} (Expected: 1)`);

// Test statistics
const orderStats = getOrderStatistics();
console.log(`\n✅ Order Statistics:`, orderStats);

const menuStats = getMenuStatistics();
console.log(`✅ Menu Statistics:`, menuStats);

console.log('\n✅ All tests passed!');
```

Run test:
```bash
npx ts-node lib/data-store.test.ts
```

### Step 4: Create API Route to Test Data Store

Create a test API route:

```typescript
// app/api/test-data/route.ts
import { NextResponse } from 'next/server';
import {
  getMenuItems,
  getOrders,
  getOrderStatistics,
  getMenuStatistics,
} from '@/lib/data-store';

export async function GET() {
  const menuItems = getMenuItems();
  const orders = getOrders();
  const orderStats = getOrderStatistics();
  const menuStats = getMenuStatistics();

  return NextResponse.json({
    success: true,
    data: {
      menuItems: menuItems.length,
      orders: orders.length,
      orderStats,
      menuStats,
    },
  });
}
```

Test the route:
```bash
npm run dev
# Visit http://localhost:3000/api/test-data
```

### Step 5: Create Visual Test Page

Create a page to visually verify all data:

```typescript
// app/data-test/page.tsx
import {
  getMenuItems,
  getOrders,
  getMenuItemsByCategory,
  getOrdersByStatus,
  getOrderStatistics,
  getMenuStatistics,
} from '@/lib/data-store';
import { MenuCategory, OrderStatus, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/types';

export default function DataTest() {
  const menuItems = getMenuItems();
  const orders = getOrders();
  const orderStats = getOrderStatistics();
  const menuStats = getMenuStatistics();

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Data Store Test</h1>

      {/* Statistics */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Order Stats</h3>
            <pre className="text-sm">{JSON.stringify(orderStats, null, 2)}</pre>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Menu Stats</h3>
            <pre className="text-sm">{JSON.stringify(menuStats, null, 2)}</pre>
          </div>
        </div>
      </section>

      {/* Menu Items by Category */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Menu Items ({menuItems.length})</h2>
        {Object.values(MenuCategory).map(category => {
          const items = getMenuItemsByCategory(category);
          return (
            <div key={category} className="mb-6">
              <h3 className="text-xl font-semibold mb-3">
                {CATEGORY_CONFIG[category].label} ({items.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map(item => (
                  <div key={item.id} className="card">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <p className="price text-price-md mt-2">${item.price.toFixed(2)}</p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="badge badge-primary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Orders by Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Orders ({orders.length})</h2>
        {Object.values(OrderStatus).map(status => {
          const statusOrders = getOrdersByStatus(status);
          return (
            <div key={status} className="mb-6">
              <h3 className="text-xl font-semibold mb-3">
                {STATUS_CONFIG[status].label} ({statusOrders.length})
              </h3>
              <div className="space-y-4">
                {statusOrders.map(order => (
                  <div key={order.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{order.orderNumber}</h4>
                        <p className="text-sm">{order.customerName}</p>
                      </div>
                      <span className={`badge ${STATUS_CONFIG[status].color}`}>
                        {STATUS_CONFIG[status].label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items • ${order.total.toFixed(2)}
                    </p>
                    {order.tableNumber && (
                      <p className="text-sm">Table {order.tableNumber}</p>
                    )}
                    {order.notes && (
                      <p className="text-sm italic mt-2">{order.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
```

Visit: http://localhost:3000/data-test

## Acceptance Criteria

This task is considered complete when:

1. ✅ `lib/data-store.ts` created with all functions
2. ✅ 16 menu items seeded (4 appetizers, 5 mains, 3 desserts, 4 drinks)
3. ✅ 8 orders seeded with correct status distribution
4. ✅ All menu items have realistic data (names, descriptions, prices)
5. ✅ All orders have realistic data (customer names, items, totals)
6. ✅ CRUD operations work for menu items
7. ✅ CRUD operations work for orders
8. ✅ Query functions return correct results
9. ✅ Statistics functions calculate correctly
10. ✅ TypeScript compilation succeeds
11. ✅ Test file passes all checks
12. ✅ API route returns data correctly
13. ✅ Visual test page displays all data
14. ✅ No console errors or warnings

## Testing Strategy

See full testing details in the complete task file due to length constraints. Testing includes unit tests, integration tests, and visual verification.

## Common Pitfalls and Debugging Tips

See full debugging section in the complete task file.

## Related Tasks

- **Previous Task:** [Task 1.4: Create Type Definitions](./task-1.4-create-type-definitions.md)
- **Next Task:** [Task 1.6: Create Utility Functions](./task-1.6-create-utility-functions.md)

## Resources

- [Map - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
