// ============================================
// Bella Cucina — Core Type Definitions
// ============================================

// ---------- Enums ----------

export type MenuCategory = "Appetizers" | "Mains" | "Desserts" | "Drinks";

export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type OrderType = "Pickup" | "Delivery";

// ---------- Menu ----------

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  available: boolean;
}

// ---------- Cart ----------

export interface CartItem extends MenuItem {
  quantity: number;
}

// ---------- Orders ----------

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  orderType: OrderType;
  address?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: number; // timestamp
}

// ---------- API Payloads ----------

export interface CreateOrderPayload {
  customerName: string;
  email: string;
  phone: string;
  orderType: OrderType;
  address?: string;
  items: OrderItem[];
  specialInstructions?: string;
}

export interface CreateMenuItemPayload {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  available?: boolean;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

// ---------- Constants ----------

export const TAX_RATE = 0.1; // 10%

export const MENU_CATEGORIES: MenuCategory[] = [
  "Appetizers",
  "Mains",
  "Desserts",
  "Drinks",
];

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];
