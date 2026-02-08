# Task 3.1: Create Cart Context

## Task Metadata

| Property | Value |
|----------|-------|
| **Task ID** | 3.1 |
| **Task Name** | Create Cart Context |
| **Phase** | Phase 3: Cart Management & Context |
| **Estimated Time** | 2-3 hours |
| **Priority** | High |
| **Complexity** | Medium-High |
| **Prerequisites** | Task 1.4 (Type Definitions), Task 1.7 (Layout Structure) |
| **Blocked By** | None |
| **Blocks** | Task 3.2, Phase 4, Phase 5 |

## Overview

This task implements the core cart management system using React Context API. The CartProvider component will serve as the single source of truth for shopping cart state throughout the Bella Cucina application, providing a clean, type-safe API for cart operations with automatic localStorage persistence.

### Importance

The cart context is fundamental to the e-commerce functionality of the restaurant app. It provides:

1. **Centralized State Management**: Single cart state accessible from any component without prop drilling
2. **Data Persistence**: Cart survives page refreshes and browser sessions
3. **Type Safety**: Full TypeScript support prevents runtime errors
4. **Scalability**: Foundation for future features (order history, saved carts, analytics)
5. **User Experience**: Seamless cart management without page reloads

Without this implementation, each component would need its own cart state, leading to inconsistencies, data loss, and poor user experience.

## Prerequisites

### Required Completions

1. **Task 1.4: Create Type Definitions** ✓
   - `MenuItem` interface must exist
   - `CartItem` interface must exist
   - Type exports properly configured

2. **Task 1.7: Setup Root Layout Structure** ✓
   - Root layout file exists at `app/layout.tsx`
   - Layout accepts children properly
   - Ready for provider wrapping

### Required Knowledge

- React Context API and hooks
- TypeScript generics and interfaces
- localStorage API and JSON serialization
- Next.js App Router and hydration concepts
- Immutable state update patterns

### Environment Setup

- Next.js 14+ with App Router
- TypeScript 5+
- React 18+
- Modern browser with localStorage support

## Technical Specifications

### Cart State Structure

```typescript
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean; // Track if localStorage loaded
}

interface CartItem {
  id: string;           // Unique cart entry ID
  menuItemId: string;   // Reference to MenuItem
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;     // Quantity in cart
  addedAt: number;      // Timestamp
}
```

### CartContext Interface

```typescript
interface CartContextType {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;

  // Operations
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;

  // Queries
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemQuantity: (menuItemId: string) => number;
  isItemInCart: (menuItemId: string) => boolean;
}
```

### Cart Operations Specifications

#### 1. Add Item (`addItem`)
- **Input**: MenuItem object, optional quantity (default: 1)
- **Behavior**:
  - If item already exists (match by menuItemId), increase quantity
  - If new item, add to cart with specified quantity
  - Generate unique cart item ID (use crypto.randomUUID() or timestamp)
  - Set addedAt timestamp
  - Validate quantity > 0
  - Save to localStorage
- **Edge Cases**:
  - Quantity <= 0: throw error or default to 1
  - Missing item properties: validate required fields
  - Maximum quantity limits: optional enforcement

#### 2. Remove Item (`removeItem`)
- **Input**: Cart item ID
- **Behavior**:
  - Remove item completely from cart
  - Update totals
  - Save to localStorage
- **Edge Cases**:
  - Non-existent ID: silent failure or warning
  - Empty cart: handle gracefully

#### 3. Update Quantity (`updateQuantity`)
- **Input**: Cart item ID, new quantity
- **Behavior**:
  - Set exact quantity for item
  - If quantity === 0, remove item
  - If quantity < 0, throw error
  - Update totals
  - Save to localStorage
- **Edge Cases**:
  - Negative quantity: error
  - Zero quantity: remove item
  - Very large quantities: optional max limit

#### 4. Increment Item (`incrementItem`)
- **Input**: Cart item ID
- **Behavior**:
  - Increase quantity by 1
  - Update totals
  - Save to localStorage
- **Edge Cases**:
  - Non-existent item: error or silent failure
  - Maximum quantity reached: optional cap

#### 5. Decrement Item (`decrementItem`)
- **Input**: Cart item ID
- **Behavior**:
  - Decrease quantity by 1
  - If quantity reaches 0, remove item
  - Update totals
  - Save to localStorage
- **Edge Cases**:
  - Quantity already 1: remove item
  - Non-existent item: error or silent failure

#### 6. Clear Cart (`clearCart`)
- **Input**: None
- **Behavior**:
  - Remove all items from cart
  - Reset totals to 0
  - Clear localStorage
- **Edge Cases**:
  - Already empty: no-op

### localStorage Persistence Strategy

#### Storage Key
```typescript
const CART_STORAGE_KEY = 'bella-cucina-cart';
```

#### Storage Format
```typescript
interface StoredCart {
  items: CartItem[];
  lastUpdated: number; // Timestamp
  version: string;     // Schema version for migrations
}
```

#### Save Operation
```typescript
const saveCart = (items: CartItem[]) => {
  try {
    const data: StoredCart = {
      items,
      lastUpdated: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Handle QuotaExceededError
    console.error('Failed to save cart:', error);
    // Optional: Clear old data, retry with smaller dataset
  }
};
```

#### Load Operation
```typescript
const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const data: StoredCart = JSON.parse(stored);

    // Validate data structure
    if (!Array.isArray(data.items)) return [];

    // Optional: Check version for migrations
    if (data.version !== '1.0') {
      // Handle migration
    }

    // Optional: Clear old carts (e.g., > 30 days)
    const daysSinceUpdate = (Date.now() - data.lastUpdated) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) {
      return [];
    }

    return data.items;
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
};
```

### Hydration Handling

**Critical**: Next.js performs server-side rendering, but localStorage only exists in the browser. Accessing localStorage during SSR causes hydration mismatches.

#### Solution Pattern

```typescript
const [isHydrated, setIsHydrated] = useState(false);
const [items, setItems] = useState<CartItem[]>([]);

useEffect(() => {
  // This only runs on client
  const loadedItems = loadCart();
  setItems(loadedItems);
  setIsHydrated(true);
}, []); // Empty dependency - run once on mount
```

#### Rendering Strategy

```typescript
// In components using cart
const { items, isHydrated } = useCart();

if (!isHydrated) {
  return <LoadingState />;
}

return <CartDisplay items={items} />;
```

### Computed Values

Use `useMemo` for expensive calculations:

```typescript
const totalItems = useMemo(() => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}, [items]);

const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}, [items]);
```

### useCart Custom Hook

```typescript
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Wrap your component tree with <CartProvider>.'
    );
  }

  return context;
};
```

## Files to Create

### 1. `app/components/CartProvider.tsx`

**Location**: `/Users/noorragu/Documents/vibe-code-demo/app/components/CartProvider.tsx`

**Purpose**: React Context provider component for cart state management

**Exports**:
- `CartProvider` (default): Provider component
- `useCart`: Custom hook for consuming context
- `CartContextType`: TypeScript interface (optional export)

**Dependencies**:
- `react` - Context API, hooks
- `@/types` or inline types - MenuItem, CartItem interfaces
- `crypto` or `uuid` - For generating unique IDs (optional)

## Step-by-Step Implementation Guide

### Step 1: Create the Component File

Create the file at `app/components/CartProvider.tsx`.

### Step 2: Import Dependencies

```typescript
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode
} from 'react';
```

**Note**: The `'use client'` directive is required because this component uses hooks and browser APIs (localStorage).

### Step 3: Define TypeScript Interfaces

```typescript
// Import or define MenuItem and CartItem types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  featured?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  available?: boolean;
}

interface CartItem extends Omit<MenuItem, 'featured' | 'spicy' | 'vegetarian' | 'available'> {
  menuItemId: string; // Original menu item ID
  quantity: number;
  addedAt: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemQuantity: (menuItemId: string) => number;
  isItemInCart: (menuItemId: string) => boolean;
}

interface StoredCart {
  items: CartItem[];
  lastUpdated: number;
  version: string;
}
```

### Step 4: Create Context

```typescript
const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bella-cucina-cart';
const CART_VERSION = '1.0';
```

### Step 5: Implement localStorage Utilities

```typescript
// Save cart to localStorage
const saveToLocalStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return; // SSR safety

  try {
    const data: StoredCart = {
      items,
      lastUpdated: Date.now(),
      version: CART_VERSION,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Cart not saved.');
      // Optional: Implement cleanup strategy
    } else {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
};

// Load cart from localStorage
const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return []; // SSR safety

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const data: StoredCart = JSON.parse(stored);

    // Validate structure
    if (!data.items || !Array.isArray(data.items)) {
      console.warn('Invalid cart data structure');
      return [];
    }

    // Check version for potential migrations
    if (data.version !== CART_VERSION) {
      console.warn(`Cart version mismatch: ${data.version} vs ${CART_VERSION}`);
      // Handle migration if needed
      // For now, return empty cart
      return [];
    }

    // Optional: Clear old carts (e.g., older than 30 days)
    const daysSinceUpdate = (Date.now() - data.lastUpdated) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) {
      console.log('Cart expired, clearing...');
      return [];
    }

    return data.items;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};
```

### Step 6: Create CartProvider Component

```typescript
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const loadedItems = loadFromLocalStorage();
    setItems(loadedItems);
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToLocalStorage(items);
    }
  }, [items, isHydrated]);

  // Computed values
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  // Cart operations (implemented in next step)
  // ...

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    getCartTotal,
    getCartCount,
    getItemQuantity,
    isItemInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
```

### Step 7: Implement Cart Operations

```typescript
// Add item to cart
const addItem = useCallback((item: MenuItem, quantity: number = 1) => {
  if (quantity <= 0) {
    console.warn('Quantity must be greater than 0');
    return;
  }

  setItems((prevItems) => {
    // Check if item already exists
    const existingItemIndex = prevItems.findIndex(
      (cartItem) => cartItem.menuItemId === item.id
    );

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const updatedItems = [...prevItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
      return updatedItems;
    } else {
      // New item, add to cart
      const newCartItem: CartItem = {
        id: crypto.randomUUID(), // Unique cart item ID
        menuItemId: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        quantity,
        addedAt: Date.now(),
      };
      return [...prevItems, newCartItem];
    }
  });
}, []);

// Remove item from cart
const removeItem = useCallback((itemId: string) => {
  setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
}, []);

// Update item quantity
const updateQuantity = useCallback((itemId: string, quantity: number) => {
  if (quantity < 0) {
    console.warn('Quantity cannot be negative');
    return;
  }

  if (quantity === 0) {
    removeItem(itemId);
    return;
  }

  setItems((prevItems) => {
    return prevItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
  });
}, [removeItem]);

// Increment item quantity
const incrementItem = useCallback((itemId: string) => {
  setItems((prevItems) => {
    return prevItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
  });
}, []);

// Decrement item quantity
const decrementItem = useCallback((itemId: string) => {
  setItems((prevItems) => {
    return prevItems
      .map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity - 1;
          if (newQuantity <= 0) {
            return null; // Mark for removal
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
  });
}, []);

// Clear entire cart
const clearCart = useCallback(() => {
  setItems([]);
}, []);

// Get cart total
const getCartTotal = useCallback(() => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}, [items]);

// Get cart count
const getCartCount = useCallback(() => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}, [items]);

// Get quantity of specific menu item
const getItemQuantity = useCallback((menuItemId: string) => {
  const item = items.find((item) => item.menuItemId === menuItemId);
  return item ? item.quantity : 0;
}, [items]);

// Check if item is in cart
const isItemInCart = useCallback((menuItemId: string) => {
  return items.some((item) => item.menuItemId === menuItemId);
}, [items]);
```

### Step 8: Create useCart Hook

```typescript
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Make sure your component is wrapped with <CartProvider>. ' +
      'Check your app/layout.tsx file.'
    );
  }

  return context;
};
```

### Step 9: Export Components

```typescript
export default CartProvider;
```

### Step 10: Add JSDoc Comments

Add comprehensive documentation:

```typescript
/**
 * CartProvider - Provides cart state management throughout the application
 *
 * Features:
 * - Centralized cart state using React Context
 * - Automatic localStorage persistence
 * - Type-safe cart operations
 * - Hydration-safe for Next.js SSR
 *
 * @example
 * ```tsx
 * <CartProvider>
 *   <App />
 * </CartProvider>
 * ```
 */

/**
 * useCart - Custom hook to access cart context
 *
 * @returns CartContextType with cart state and operations
 * @throws Error if used outside CartProvider
 *
 * @example
 * ```tsx
 * const { items, addItem, totalPrice } = useCart();
 * ```
 */
```

## Complete Code Example

Here's the full implementation of `CartProvider.tsx`:

```typescript
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode
} from 'react';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  featured?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  available?: boolean;
}

interface CartItem extends Omit<MenuItem, 'featured' | 'spicy' | 'vegetarian' | 'available'> {
  menuItemId: string;
  quantity: number;
  addedAt: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemQuantity: (menuItemId: string) => number;
  isItemInCart: (menuItemId: string) => boolean;
}

interface StoredCart {
  items: CartItem[];
  lastUpdated: number;
  version: string;
}

interface CartProviderProps {
  children: ReactNode;
}

// Constants
const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'bella-cucina-cart';
const CART_VERSION = '1.0';

// localStorage utilities
const saveToLocalStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const data: StoredCart = {
      items,
      lastUpdated: Date.now(),
      version: CART_VERSION,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Cart not saved.');
    } else {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const data: StoredCart = JSON.parse(stored);

    if (!data.items || !Array.isArray(data.items)) {
      console.warn('Invalid cart data structure');
      return [];
    }

    if (data.version !== CART_VERSION) {
      console.warn(`Cart version mismatch: ${data.version} vs ${CART_VERSION}`);
      return [];
    }

    const daysSinceUpdate = (Date.now() - data.lastUpdated) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 30) {
      console.log('Cart expired, clearing...');
      return [];
    }

    return data.items;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

// Provider Component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedItems = loadFromLocalStorage();
    setItems(loadedItems);
    setIsHydrated(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      saveToLocalStorage(items);
    }
  }, [items, isHydrated]);

  // Computed values
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  // Operations
  const addItem = useCallback((item: MenuItem, quantity: number = 1) => {
    if (quantity <= 0) {
      console.warn('Quantity must be greater than 0');
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.menuItemId === item.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        const newCartItem: CartItem = {
          id: crypto.randomUUID(),
          menuItemId: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl,
          quantity,
          addedAt: Date.now(),
        };
        return [...prevItems, newCartItem];
      }
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 0) {
      console.warn('Quantity cannot be negative');
      return;
    }

    if (quantity === 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, [removeItem]);

  const incrementItem = useCallback((itemId: string) => {
    setItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity - 1;
            if (newQuantity <= 0) {
              return null;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getItemQuantity = useCallback((menuItemId: string) => {
    const item = items.find((item) => item.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  }, [items]);

  const isItemInCart = useCallback((menuItemId: string) => {
    return items.some((item) => item.menuItemId === menuItemId);
  }, [items]);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    getCartTotal,
    getCartCount,
    getItemQuantity,
    isItemInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Make sure your component is wrapped with <CartProvider>.'
    );
  }

  return context;
};

export default CartProvider;
```

## Acceptance Criteria

### Functional Criteria

- [ ] CartProvider component successfully wraps children
- [ ] useCart hook returns cart context without errors
- [ ] addItem adds new items to cart correctly
- [ ] addItem increments quantity for existing items
- [ ] removeItem removes items from cart
- [ ] updateQuantity sets exact quantity for items
- [ ] incrementItem increases quantity by 1
- [ ] decrementItem decreases quantity by 1
- [ ] decrementItem removes item when quantity reaches 0
- [ ] clearCart empties the cart completely
- [ ] getCartTotal returns correct total price
- [ ] getCartCount returns correct item count
- [ ] getItemQuantity returns correct quantity for menu item
- [ ] isItemInCart correctly identifies cart membership

### Technical Criteria

- [ ] Full TypeScript type coverage with no `any` types
- [ ] All cart operations use immutable update patterns
- [ ] localStorage saves cart on every change
- [ ] localStorage loads cart on initial mount
- [ ] No hydration errors in Next.js
- [ ] isHydrated flag prevents premature rendering
- [ ] useCallback wraps all operation functions
- [ ] useMemo used for computed values (totals)
- [ ] Error handling for localStorage failures
- [ ] Error handling for invalid inputs

### Code Quality Criteria

- [ ] Component follows React best practices
- [ ] Clear and consistent naming conventions
- [ ] Comprehensive JSDoc comments
- [ ] Proper TypeScript interface definitions
- [ ] No ESLint warnings or errors
- [ ] Clean and readable code structure
- [ ] Proper separation of concerns
- [ ] Efficient re-render behavior

## Testing Strategy

### Unit Tests

Create `__tests__/CartProvider.test.tsx`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/components/CartProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  test('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const menuItem = {
      id: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 12.99,
      category: 'main',
      imageUrl: '/pizza.jpg',
    };

    act(() => {
      result.current.addItem(menuItem, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  test('increments existing item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const menuItem = {
      id: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 12.99,
      category: 'main',
      imageUrl: '/pizza.jpg',
    };

    act(() => {
      result.current.addItem(menuItem, 1);
      result.current.addItem(menuItem, 1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  test('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const menuItem = {
      id: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 12.99,
      category: 'main',
      imageUrl: '/pizza.jpg',
    };

    act(() => {
      result.current.addItem(menuItem, 1);
    });

    const cartItemId = result.current.items[0].id;

    act(() => {
      result.current.removeItem(cartItemId);
    });

    expect(result.current.items).toHaveLength(0);
  });

  test('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item1 = {
      id: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 12.99,
      category: 'main',
      imageUrl: '/pizza.jpg',
    };
    const item2 = {
      id: '2',
      name: 'Pasta',
      description: 'Fresh pasta',
      price: 10.99,
      category: 'main',
      imageUrl: '/pasta.jpg',
    };

    act(() => {
      result.current.addItem(item1, 2);
      result.current.addItem(item2, 1);
    });

    const expectedTotal = (12.99 * 2) + (10.99 * 1);
    expect(result.current.totalPrice).toBeCloseTo(expectedTotal, 2);
  });
});
```

### Integration Tests

Test localStorage persistence:

```typescript
test('persists cart to localStorage', () => {
  const { result } = renderHook(() => useCart(), { wrapper });
  const menuItem = {
    id: '1',
    name: 'Pizza',
    description: 'Delicious pizza',
    price: 12.99,
    category: 'main',
    imageUrl: '/pizza.jpg',
  };

  act(() => {
    result.current.addItem(menuItem, 1);
  });

  const stored = localStorage.getItem('bella-cucina-cart');
  expect(stored).toBeTruthy();

  const parsed = JSON.parse(stored!);
  expect(parsed.items).toHaveLength(1);
});

test('loads cart from localStorage on mount', () => {
  const cartData = {
    items: [{
      id: 'cart-1',
      menuItemId: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 12.99,
      category: 'main',
      imageUrl: '/pizza.jpg',
      quantity: 2,
      addedAt: Date.now(),
    }],
    lastUpdated: Date.now(),
    version: '1.0',
  };

  localStorage.setItem('bella-cucina-cart', JSON.stringify(cartData));

  const { result } = renderHook(() => useCart(), { wrapper });

  // Wait for hydration
  act(() => {
    jest.runAllTimers();
  });

  expect(result.current.items).toHaveLength(1);
  expect(result.current.items[0].quantity).toBe(2);
});
```

### Manual Testing Checklist

- [ ] Add item to cart and verify it appears
- [ ] Add same item twice and verify quantity increases
- [ ] Remove item and verify cart updates
- [ ] Clear cart and verify it's empty
- [ ] Refresh page and verify cart persists
- [ ] Open in new tab and verify cart is shared
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test with browser localStorage disabled
- [ ] Test with very large cart (50+ items)
- [ ] Test rapid add/remove operations

## Common Pitfalls

### 1. Hydration Mismatches

**Problem**: Accessing localStorage during SSR causes React hydration errors.

```typescript
// WRONG - causes hydration mismatch
const [items, setItems] = useState<CartItem[]>(loadFromLocalStorage());
```

**Solution**: Load in useEffect.

```typescript
// CORRECT
const [items, setItems] = useState<CartItem[]>([]);

useEffect(() => {
  setItems(loadFromLocalStorage());
  setIsHydrated(true);
}, []);
```

### 2. State Mutation

**Problem**: Directly mutating state arrays.

```typescript
// WRONG - mutates state
const addItem = (item: MenuItem) => {
  items.push(convertToCartItem(item)); // Mutation!
  setItems(items);
};
```

**Solution**: Use immutable patterns.

```typescript
// CORRECT
const addItem = (item: MenuItem) => {
  setItems([...items, convertToCartItem(item)]);
};
```

### 3. Missing useCallback

**Problem**: Functions recreated on every render, causing child re-renders.

```typescript
// WRONG - new function every render
const addItem = (item: MenuItem) => {
  setItems([...items, convertToCartItem(item)]);
};
```

**Solution**: Wrap in useCallback.

```typescript
// CORRECT
const addItem = useCallback((item: MenuItem) => {
  setItems(prev => [...prev, convertToCartItem(item)]);
}, []);
```

### 4. localStorage Quota Exceeded

**Problem**: Cart grows too large for localStorage.

```typescript
// WRONG - no error handling
localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
```

**Solution**: Handle QuotaExceededError.

```typescript
// CORRECT
try {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
} catch (error) {
  if (error instanceof Error && error.name === 'QuotaExceededError') {
    // Clear old data or notify user
    console.error('Cart storage full');
  }
}
```

### 5. Race Conditions

**Problem**: Multiple rapid updates causing state inconsistencies.

```typescript
// WRONG - uses stale items value
const incrementItem = (itemId: string) => {
  const updated = items.map(item =>
    item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
  );
  setItems(updated);
};
```

**Solution**: Use functional setState.

```typescript
// CORRECT
const incrementItem = (itemId: string) => {
  setItems(prevItems =>
    prevItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
};
```

### 6. Missing Error Boundary

**Problem**: Errors in cart operations crash entire app.

**Solution**: Consider wrapping CartProvider with ErrorBoundary in Task 3.2.

### 7. Forgetting 'use client' Directive

**Problem**: Server component error when using hooks.

```typescript
// WRONG - missing directive
import { createContext } from 'react';
```

**Solution**: Add 'use client' at top of file.

```typescript
// CORRECT
'use client';

import { createContext } from 'react';
```

## Performance Optimization

### 1. Memoize Computed Values

```typescript
// Expensive calculations
const totalItems = useMemo(() =>
  items.reduce((sum, item) => sum + item.quantity, 0),
  [items]
);
```

### 2. Debounce localStorage Writes

For very frequent updates:

```typescript
const debouncedSave = useMemo(
  () => debounce(saveToLocalStorage, 500),
  []
);

useEffect(() => {
  if (isHydrated) {
    debouncedSave(items);
  }
}, [items, isHydrated, debouncedSave]);
```

### 3. Lazy Load Large Carts

For carts with many items:

```typescript
const [visibleItems, setVisibleItems] = useState(10);

// Render only visible items initially
// Load more on scroll/interaction
```

## Related Tasks

### Depends On
- **Task 1.4**: Type Definitions (MenuItem, CartItem)
- **Task 1.7**: Root Layout Structure

### Blocks
- **Task 3.2**: Integrate Cart Provider
- **Task 4.x**: Menu items need addItem function
- **Task 5.x**: Cart component needs cart state
- **Task 6.x**: Checkout needs cart total

### Related
- **Phase 4**: Menu display will use isItemInCart
- **Phase 5**: Cart UI will display items array
- **Phase 6**: Checkout will read totalPrice

## Resources

### Documentation
- [React Context API](https://react.dev/reference/react/createContext)
- [React useContext Hook](https://react.dev/reference/react/useContext)
- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)

### Code Examples
- React Context patterns
- localStorage persistence
- Custom hook patterns
- TypeScript generics

## Next Steps

After completing this task:

1. **Verify Implementation**:
   - Component file created
   - No TypeScript errors
   - Exports correct

2. **Proceed to Task 3.2**:
   - Integrate CartProvider into layout
   - Test context accessibility
   - Verify localStorage persistence

3. **Prepare for Phase 4**:
   - Review menu component structure
   - Plan "Add to Cart" button integration
   - Design cart feedback UI

---

**Task Status**: Ready for Implementation
**Last Updated**: 2026-02-09
**Estimated Completion**: 2-3 hours
**Complexity**: Medium-High
