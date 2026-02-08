# Bella Cucina — API Documentation

Base URL: `http://localhost:3000` (development) or your deployed Vercel URL.

All endpoints return JSON. Error responses include an `error` field with a human-readable message.

---

## Table of Contents

- [Data Types](#data-types)
- [Menu Endpoints](#menu-endpoints)
  - [GET /api/menu](#get-apimenu)
  - [POST /api/menu](#post-apimenu)
  - [GET /api/menu/:id](#get-apimenuid)
  - [PUT /api/menu/:id](#put-apimenuid)
  - [DELETE /api/menu/:id](#delete-apimenuid)
- [Order Endpoints](#order-endpoints)
  - [GET /api/orders](#get-apiorders)
  - [POST /api/orders](#post-apiorders)
  - [GET /api/orders/:id](#get-apiordersid)
  - [PATCH /api/orders/:id](#patch-apiordersid)
- [Admin Endpoints](#admin-endpoints)
  - [GET /api/admin/stats](#get-apiadminstats)
- [Error Handling](#error-handling)
- [Notes](#notes)

---

## Data Types

### MenuItem

```typescript
interface MenuItem {
  id: string;           // e.g. "menu-1"
  name: string;         // e.g. "Margherita Pizza"
  description: string;  // item description
  price: number;        // e.g. 14.99
  category: MenuCategory;
  image: string;        // URL to image
  available: boolean;   // whether the item can be ordered
}

type MenuCategory = "Appetizers" | "Mains" | "Desserts" | "Drinks";
```

### Order

```typescript
interface Order {
  id: string;                    // e.g. "ORD-009"
  customerName: string;
  email: string;
  phone: string;
  orderType: OrderType;
  address?: string;              // required for Delivery orders
  items: OrderItem[];
  subtotal: number;              // sum of (price * quantity) for all items
  tax: number;                   // 10% of subtotal
  total: number;                 // subtotal + tax
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: number;             // Unix timestamp (milliseconds)
}

type OrderType = "Pickup" | "Delivery";
type OrderStatus = "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled";
```

### OrderItem

```typescript
interface OrderItem {
  menuItemId: string;  // references MenuItem.id
  name: string;
  price: number;
  quantity: number;
}
```

---

## Menu Endpoints

### GET /api/menu

Returns all menu items. Supports optional query filters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (case-insensitive). One of: `Appetizers`, `Mains`, `Desserts`, `Drinks` |
| `available` | string | Filter by availability. `"true"` or `"false"` |

**Response:** `200 OK`

```json
[
  {
    "id": "menu-1",
    "name": "Classic Bruschetta",
    "description": "Toasted bread topped with fresh tomatoes, garlic, basil, and extra virgin olive oil",
    "price": 8.99,
    "category": "Appetizers",
    "image": "https://images.unsplash.com/...",
    "available": true
  }
]
```

**Examples:**

```bash
# All items
curl http://localhost:3000/api/menu

# Only mains
curl "http://localhost:3000/api/menu?category=Mains"

# Only available items
curl "http://localhost:3000/api/menu?available=true"

# Combine filters
curl "http://localhost:3000/api/menu?category=Desserts&available=true"
```

---

### POST /api/menu

Creates a new menu item. Used by the admin panel.

**Request Body:**

```json
{
  "name": "Focaccia Bread",
  "description": "Freshly baked focaccia with rosemary and sea salt",
  "price": 7.99,
  "category": "Appetizers",
  "image": "https://images.unsplash.com/...",
  "available": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Min 2 characters |
| `description` | string | Yes | Item description |
| `price` | number | Yes | Must be positive |
| `category` | MenuCategory | Yes | One of: `Appetizers`, `Mains`, `Desserts`, `Drinks` |
| `image` | string | Yes | Image URL |
| `available` | boolean | No | Defaults to `true` |

**Response:** `201 Created`

```json
{
  "id": "menu-17",
  "name": "Focaccia Bread",
  "description": "Freshly baked focaccia with rosemary and sea salt",
  "price": 7.99,
  "category": "Appetizers",
  "image": "https://images.unsplash.com/...",
  "available": true
}
```

**Errors:**

| Status | Reason |
|--------|--------|
| `400` | Validation failed (missing/invalid fields) |

---

### GET /api/menu/:id

Returns a single menu item by ID.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | The menu item ID (e.g. `menu-1`) |

**Response:** `200 OK`

```json
{
  "id": "menu-5",
  "name": "Margherita Pizza",
  "description": "Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil",
  "price": 14.99,
  "category": "Mains",
  "image": "https://images.unsplash.com/...",
  "available": true
}
```

**Errors:**

| Status | Reason |
|--------|--------|
| `404` | Menu item not found |

---

### PUT /api/menu/:id

Updates an existing menu item. All provided fields are validated; only provided fields are updated.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | The menu item ID (e.g. `menu-1`) |

**Request Body** (all fields optional):

```json
{
  "name": "Updated Pizza Name",
  "price": 15.99,
  "available": false
}
```

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Min 2 characters |
| `description` | string | Non-empty |
| `price` | number | Must be positive |
| `category` | MenuCategory | Must be valid category |
| `image` | string | Image URL |
| `available` | boolean | Converted to boolean |

**Response:** `200 OK` — Returns the full updated menu item.

**Errors:**

| Status | Reason |
|--------|--------|
| `400` | Validation failed |
| `404` | Menu item not found |

---

### DELETE /api/menu/:id

Deletes a menu item by ID.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | The menu item ID (e.g. `menu-1`) |

**Response:** `200 OK`

```json
{
  "success": true
}
```

**Errors:**

| Status | Reason |
|--------|--------|
| `404` | Menu item not found |

---

## Order Endpoints

### GET /api/orders

Returns all orders, sorted by newest first. Supports optional status filter.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (case-insensitive). One of: `Pending`, `Preparing`, `Ready`, `Completed`, `Cancelled` |

**Response:** `200 OK`

```json
[
  {
    "id": "ORD-007",
    "customerName": "Amy Thompson",
    "email": "amy@example.com",
    "phone": "555-0107",
    "orderType": "Delivery",
    "address": "202 Birch Rd",
    "items": [
      {
        "menuItemId": "menu-9",
        "name": "Pasta Carbonara",
        "price": 16.99,
        "quantity": 1
      }
    ],
    "subtotal": 16.99,
    "tax": 1.70,
    "total": 18.69,
    "status": "Pending",
    "createdAt": 1707400000000
  }
]
```

**Examples:**

```bash
# All orders
curl http://localhost:3000/api/orders

# Only pending orders
curl "http://localhost:3000/api/orders?status=Pending"
```

---

### POST /api/orders

Places a new order. The server auto-generates the order ID, calculates subtotal/tax/total, and sets the status to `Pending`.

**Request Body:**

```json
{
  "customerName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-1234",
  "orderType": "Delivery",
  "address": "123 Main St, Apt 4",
  "items": [
    {
      "menuItemId": "menu-5",
      "name": "Margherita Pizza",
      "price": 14.99,
      "quantity": 2
    },
    {
      "menuItemId": "menu-12",
      "name": "Tiramisu",
      "price": 9.99,
      "quantity": 1
    }
  ],
  "specialInstructions": "Extra cheese on the pizza please"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerName` | string | Yes | Min 2 characters |
| `email` | string | Yes | Customer email |
| `phone` | string | Yes | Customer phone |
| `orderType` | `"Pickup"` \| `"Delivery"` | Yes | Order type |
| `address` | string | Delivery only | Required when `orderType` is `"Delivery"` |
| `items` | OrderItem[] | Yes | At least one item |
| `specialInstructions` | string | No | Optional notes |

**OrderItem fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `menuItemId` | string | Yes | References a MenuItem ID |
| `name` | string | Yes | Item display name |
| `price` | number | Yes | Must be positive |
| `quantity` | number | Yes | Must be a positive integer |

**Response:** `201 Created`

```json
{
  "id": "ORD-009",
  "customerName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-1234",
  "orderType": "Delivery",
  "address": "123 Main St, Apt 4",
  "items": [
    { "menuItemId": "menu-5", "name": "Margherita Pizza", "price": 14.99, "quantity": 2 },
    { "menuItemId": "menu-12", "name": "Tiramisu", "price": 9.99, "quantity": 1 }
  ],
  "subtotal": 39.97,
  "tax": 4.00,
  "total": 43.97,
  "status": "Pending",
  "createdAt": 1707400000000
}
```

**Calculation details:**

- `subtotal` = sum of `price * quantity` for each item
- `tax` = `subtotal * 0.10` (10% tax rate), rounded to 2 decimals
- `total` = `subtotal + tax`, rounded to 2 decimals

**Errors:**

| Status | Reason |
|--------|--------|
| `400` | Validation failed (missing/invalid fields, empty items array, invalid item fields) |

---

### GET /api/orders/:id

Returns a single order by ID. Used by the order confirmation page for status polling.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | The order ID (e.g. `ORD-001`) |

**Response:** `200 OK` — Returns the full Order object.

**Errors:**

| Status | Reason |
|--------|--------|
| `404` | Order not found |

---

### PATCH /api/orders/:id

Updates the status of an existing order. Used by the admin panel.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | The order ID (e.g. `ORD-001`) |

**Request Body:**

```json
{
  "status": "Preparing"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | OrderStatus | Yes | One of: `Pending`, `Preparing`, `Ready`, `Completed`, `Cancelled` |

**Status workflow (enforced by the admin UI):**

```
Pending  --> Preparing --> Ready --> Completed
   |            |           |
   +--- Cancelled ---+------+
```

Any active status can transition to `Cancelled`. Completed and Cancelled orders cannot be changed further.

**Response:** `200 OK` — Returns the full updated Order object.

**Errors:**

| Status | Reason |
|--------|--------|
| `400` | Invalid status value |
| `404` | Order not found |

**Example:**

```bash
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{ "status": "Completed" }'
```

---

## Admin Endpoints

### GET /api/admin/stats

Returns aggregated dashboard statistics. Used by the admin dashboard page.

**Response:** `200 OK`

```json
{
  "totalOrders": 8,
  "todayOrders": 3,
  "totalRevenue": 245.67,
  "todayRevenue": 89.50,
  "activeOrders": 4,
  "totalMenuItems": 16,
  "availableItems": 16,
  "recentOrders": [
    {
      "id": "ORD-008",
      "customerName": "David Lee",
      "status": "Cancelled",
      "total": 22.99,
      "createdAt": 1707400000000
    }
  ],
  "popularItems": [
    {
      "itemId": "menu-5",
      "name": "Margherita Pizza",
      "count": 12,
      "revenue": 179.88
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalOrders` | number | Total number of orders (all statuses) |
| `todayOrders` | number | Orders placed today |
| `totalRevenue` | number | Revenue from non-cancelled orders (all time) |
| `todayRevenue` | number | Revenue from non-cancelled orders (today) |
| `activeOrders` | number | Orders with status `Pending` or `Preparing` |
| `totalMenuItems` | number | Total menu items in the system |
| `availableItems` | number | Menu items where `available === true` |
| `recentOrders` | Order[] | Last 10 orders, newest first |
| `popularItems` | PopularItem[] | Top 5 items by quantity ordered (non-cancelled orders) |

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

Multiple validation errors are joined with semicolons:

```json
{
  "error": "name is required (min 2 characters); price must be a positive number"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request (validation error or malformed JSON) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Notes

- **In-memory data store:** All data lives in server memory and resets on every server restart. This is by design for a demo application.
- **No authentication on API routes:** The API endpoints themselves are not password-protected. The admin password gate is a client-side UI component only.
- **Tax rate:** Fixed at 10% (`TAX_RATE = 0.1`), defined in `lib/types.ts`.
- **Order IDs:** Auto-generated in the format `ORD-XXX` (e.g. `ORD-009`, `ORD-010`).
- **Menu item IDs:** Auto-generated in the format `menu-N` (e.g. `menu-17`).
- **Timestamps:** All `createdAt` values are Unix timestamps in milliseconds (`Date.now()`).
- **CORS:** Not explicitly configured. All routes are same-origin by default when deployed.
