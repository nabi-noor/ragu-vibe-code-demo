"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { MenuItem, CartItem } from "@/lib/types";

// ============================================
// Cart Context — Types
// ============================================

interface CartContextType {
  // state
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  // operations
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;

  // queries
  getItemQuantity: (menuItemId: string) => number;
  isInCart: (menuItemId: string) => boolean;
}

const STORAGE_KEY = "bella-cucina-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// localStorage helpers (safe for SSR)
// ============================================

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or other storage error — silently ignore
  }
}

// ============================================
// CartProvider Component
// ============================================

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialise with empty array to avoid hydration mismatch.
  // localStorage is loaded in the useEffect below.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (skip first render)
  useEffect(() => {
    if (hydrated) {
      saveCart(items);
    }
  }, [items, hydrated]);

  // ---------- operations ----------

  const addItem = useCallback((menuItem: MenuItem, quantity = 1) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...menuItem, quantity }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      // remove if quantity drops below 1
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  }, []);

  const incrementItem = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // ---------- queries ----------

  const getItemQuantity = useCallback(
    (menuItemId: string) => {
      return items.find((i) => i.id === menuItemId)?.quantity ?? 0;
    },
    [items]
  );

  const isInCart = useCallback(
    (menuItemId: string) => {
      return items.some((i) => i.id === menuItemId);
    },
    [items]
  );

  // ---------- derived values ----------

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      Math.round(
        items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
      ) / 100,
    [items]
  );

  // ---------- context value (stable reference) ----------

  const value = useMemo<CartContextType>(
    () => ({
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      incrementItem,
      decrementItem,
      clearCart,
      getItemQuantity,
      isInCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      incrementItem,
      decrementItem,
      clearCart,
      getItemQuantity,
      isInCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================
// useCart hook
// ============================================

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return context;
}
