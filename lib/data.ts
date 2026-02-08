// ============================================
// Bella Cucina — In-Memory Data Store + Seed Data
// ============================================
// This file is the single source of truth for all application data.
// Data resets on every server restart — by design for a demo app.

import type { MenuItem, Order, OrderStatus } from "./types";

// ---------- helpers ----------

let orderCounter = 8; // seed orders go up to ORD-008

export function generateOrderId(): string {
  orderCounter += 1;
  return `ORD-${String(orderCounter).padStart(3, "0")}`;
}

let menuCounter = 16; // seed menu items go up to 16

export function generateMenuItemId(): string {
  menuCounter += 1;
  return `menu-${menuCounter}`;
}

/** Relative timestamp: `hoursAgo` hours before now */
function hoursAgo(hours: number): number {
  return Date.now() - hours * 60 * 60 * 1000;
}

// ==========================================================
//  SEED MENU ITEMS (16 items, 4 categories)
// ==========================================================

export const menuItems: MenuItem[] = [
  // ---- Appetizers ----
  {
    id: "menu-1",
    name: "Classic Bruschetta",
    description: "Toasted bread with fresh tomatoes, basil & balsamic glaze",
    price: 8.99,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600",
    available: true,
  },
  {
    id: "menu-2",
    name: "Garlic Bread",
    description: "Oven-baked with herb butter and parmesan",
    price: 6.49,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600",
    available: true,
  },
  {
    id: "menu-3",
    name: "Soup of the Day",
    description: "Chef's daily selection served with crusty bread",
    price: 7.99,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
    available: true,
  },
  {
    id: "menu-4",
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, basil with olive oil",
    price: 10.99,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=600",
    available: true,
  },

  // ---- Mains ----
  {
    id: "menu-5",
    name: "Margherita Pizza",
    description: "San Marzano tomatoes, fresh mozzarella, basil",
    price: 14.99,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600",
    available: true,
  },
  {
    id: "menu-6",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter, seasonal vegetables",
    price: 22.99,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    available: true,
  },
  {
    id: "menu-7",
    name: "Pasta Carbonara",
    description: "Spaghetti with pancetta, egg, parmesan, black pepper",
    price: 16.99,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600",
    available: true,
  },
  {
    id: "menu-8",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast, marinara, melted mozzarella",
    price: 18.99,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600",
    available: true,
  },
  {
    id: "menu-9",
    name: "Mushroom Risotto",
    description: "Arborio rice with wild mushrooms, parmesan, truffle oil",
    price: 17.99,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600",
    available: true,
  },

  // ---- Desserts ----
  {
    id: "menu-10",
    name: "Tiramisu",
    description: "Classic Italian coffee-flavored layered dessert",
    price: 9.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600",
    available: true,
  },
  {
    id: "menu-11",
    name: "Chocolate Lava Cake",
    description: "Warm molten center with vanilla gelato",
    price: 10.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600",
    available: true,
  },
  {
    id: "menu-12",
    name: "Panna Cotta",
    description: "Vanilla bean cream with berry compote",
    price: 8.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
    available: true,
  },

  // ---- Drinks ----
  {
    id: "menu-13",
    name: "Fresh Lemonade",
    description: "House-made with mint",
    price: 4.99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600",
    available: true,
  },
  {
    id: "menu-14",
    name: "Espresso",
    description: "Double-shot Italian roast",
    price: 3.99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600",
    available: true,
  },
  {
    id: "menu-15",
    name: "House Red Wine",
    description: "Glass of Chianti Classico",
    price: 12.99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600",
    available: true,
  },
  {
    id: "menu-16",
    name: "Sparkling Water",
    description: "San Pellegrino 750ml",
    price: 3.49,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600",
    available: true,
  },
];

// ==========================================================
//  SEED ORDERS (8 orders, various statuses)
//  Timestamps are relative to now so they always look fresh.
// ==========================================================

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "555-0101",
    orderType: "Delivery",
    address: "123 Main St, Apt 4B",
    items: [
      { menuItemId: "menu-5", name: "Margherita Pizza", price: 14.99, quantity: 2 },
      { menuItemId: "menu-13", name: "Fresh Lemonade", price: 4.99, quantity: 1 },
    ],
    subtotal: 34.97,
    tax: 3.5,
    total: 38.47,
    status: "Completed",
    createdAt: hoursAgo(4.5),
  },
  {
    id: "ORD-002",
    customerName: "Mike Chen",
    email: "mike@example.com",
    phone: "555-0102",
    orderType: "Pickup",
    items: [
      { menuItemId: "menu-6", name: "Grilled Salmon", price: 22.99, quantity: 1 },
      { menuItemId: "menu-14", name: "Espresso", price: 3.99, quantity: 1 },
    ],
    subtotal: 26.98,
    tax: 2.7,
    total: 29.68,
    status: "Completed",
    createdAt: hoursAgo(3.75),
  },
  {
    id: "ORD-003",
    customerName: "Emily Davis",
    email: "emily@example.com",
    phone: "555-0103",
    orderType: "Delivery",
    address: "456 Oak Ave",
    items: [
      { menuItemId: "menu-7", name: "Pasta Carbonara", price: 16.99, quantity: 1 },
      { menuItemId: "menu-10", name: "Tiramisu", price: 9.99, quantity: 1 },
      { menuItemId: "menu-15", name: "House Red Wine", price: 12.99, quantity: 1 },
    ],
    subtotal: 39.97,
    tax: 4.0,
    total: 43.97,
    status: "Ready",
    specialInstructions: "Please ring the doorbell twice",
    createdAt: hoursAgo(3.25),
  },
  {
    id: "ORD-004",
    customerName: "James Wilson",
    email: "james@example.com",
    phone: "555-0104",
    orderType: "Pickup",
    items: [
      { menuItemId: "menu-1", name: "Classic Bruschetta", price: 8.99, quantity: 2 },
      { menuItemId: "menu-8", name: "Chicken Parmesan", price: 18.99, quantity: 1 },
    ],
    subtotal: 36.97,
    tax: 3.7,
    total: 40.67,
    status: "Preparing",
    createdAt: hoursAgo(3),
  },
  {
    id: "ORD-005",
    customerName: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "555-0105",
    orderType: "Delivery",
    address: "789 Pine Rd, Suite 2",
    items: [
      { menuItemId: "menu-9", name: "Mushroom Risotto", price: 17.99, quantity: 1 },
      { menuItemId: "menu-11", name: "Chocolate Lava Cake", price: 10.99, quantity: 1 },
      { menuItemId: "menu-16", name: "Sparkling Water", price: 3.49, quantity: 2 },
    ],
    subtotal: 35.96,
    tax: 3.6,
    total: 39.56,
    status: "Preparing",
    specialInstructions: "Nut allergy — no tree nuts please",
    createdAt: hoursAgo(2.67),
  },
  {
    id: "ORD-006",
    customerName: "Tom Martinez",
    email: "tom@example.com",
    phone: "555-0106",
    orderType: "Pickup",
    items: [
      { menuItemId: "menu-4", name: "Caprese Salad", price: 10.99, quantity: 1 },
      { menuItemId: "menu-5", name: "Margherita Pizza", price: 14.99, quantity: 1 },
    ],
    subtotal: 25.98,
    tax: 2.6,
    total: 28.58,
    status: "Pending",
    createdAt: hoursAgo(2.42),
  },
  {
    id: "ORD-007",
    customerName: "Amy Thompson",
    email: "amy@example.com",
    phone: "555-0107",
    orderType: "Delivery",
    address: "321 Elm Blvd",
    items: [
      { menuItemId: "menu-2", name: "Garlic Bread", price: 6.49, quantity: 3 },
      { menuItemId: "menu-7", name: "Pasta Carbonara", price: 16.99, quantity: 2 },
    ],
    subtotal: 53.45,
    tax: 5.35,
    total: 58.8,
    status: "Pending",
    specialInstructions: "Extra parmesan on the carbonara",
    createdAt: hoursAgo(2.3),
  },
  {
    id: "ORD-008",
    customerName: "David Lee",
    email: "david@example.com",
    phone: "555-0108",
    orderType: "Pickup",
    items: [
      { menuItemId: "menu-3", name: "Soup of the Day", price: 7.99, quantity: 1 },
      { menuItemId: "menu-6", name: "Grilled Salmon", price: 22.99, quantity: 1 },
    ],
    subtotal: 30.98,
    tax: 3.1,
    total: 34.08,
    status: "Cancelled",
    createdAt: hoursAgo(6),
  },
];

// ==========================================================
//  CRUD Helpers — mutate the in-memory arrays
// ==========================================================

// ---- Menu ----

export function getMenuItems(): MenuItem[] {
  return menuItems;
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function addMenuItem(item: MenuItem): void {
  menuItems.push(item);
}

export function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): MenuItem | undefined {
  const idx = menuItems.findIndex((item) => item.id === id);
  if (idx === -1) return undefined;
  menuItems[idx] = { ...menuItems[idx], ...updates };
  return menuItems[idx];
}

export function deleteMenuItem(id: string): boolean {
  const idx = menuItems.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  menuItems.splice(idx, 1);
  return true;
}

// ---- Orders ----

export function getOrders(): Order[] {
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function addOrder(order: Order): void {
  orders.push(order);
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus
): Order | undefined {
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  order.status = status;
  return order;
}
