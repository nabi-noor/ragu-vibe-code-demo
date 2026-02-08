# Task 5.2: Create Menu Page

## Task Metadata

- **Task ID**: 5.2
- **Task Name**: Create Menu Page
- **Phase**: 5 - Customer-Facing Pages
- **Prerequisites**: Phase 3 (API Routes), Phase 4 (Shared Components), Task 5.1 (Landing Page)
- **Estimated Time**: 4-5 hours
- **Priority**: High
- **Difficulty**: Medium-High
- **Last Updated**: 2026-02-09

## Overview

The menu page is the core of the customer ordering experience. This task involves creating a comprehensive menu browsing interface that allows customers to search, filter by category, and browse all available dishes. The page must be performant, responsive, and provide an intuitive user experience that makes it easy to find and add items to the cart.

### Importance

- **Primary Conversion Point**: Where customers decide what to order
- **User Experience**: Smooth browsing and filtering is critical for customer satisfaction
- **Performance**: Fast loading and smooth interactions are essential
- **Discovery**: Helps customers explore the menu and discover new dishes
- **Cart Integration**: Seamless add-to-cart functionality drives conversions

### User Stories

1. As a customer, I want to browse all available dishes, so I can see what's available
2. As a customer, I want to filter by category (Appetizers, Mains, etc.), so I can find specific types of food
3. As a customer, I want to search for dishes by name, so I can quickly find what I'm looking for
4. As a mobile user, I want a responsive grid layout, so I can browse comfortably on my phone
5. As a customer, I want to add items to my cart from the menu page, so I don't have to navigate away
6. As a customer, I want to see loading states, so I know the page is working

## Prerequisites

### Completed Tasks

- ✅ Task 3.1: Menu API endpoints (`/api/menu`)
- ✅ Task 4.1: Create reusable components (Button, Card, Input)
- ✅ Task 4.2: MenuCard component
- ✅ Task 4.5: CartContext for state management
- ✅ Task 5.1: Landing page (for navigation pattern reference)

### Required Knowledge

- Next.js 15 App Router
- React Client Components ('use client')
- State management with useState and useEffect
- URL search params for filtering
- Debouncing search input
- Responsive grid layouts with Tailwind

### Environment Setup

```bash
# Ensure API is running
npm run dev

# Verify database has menu items
# Check http://localhost:3000/api/menu
```

## Technical Specifications

### Page Route

- **Path**: `/menu`
- **File**: `app/menu/page.tsx`
- **Type**: Client Component ('use client' directive required)
- **Layout**: Uses root layout with Header and Footer

### Page Features

1. **Search Bar**: Real-time search with debouncing
2. **Category Filters**: Tabs or buttons for Appetizers, Mains, Desserts, Drinks, All
3. **Dish Grid**: Responsive grid of MenuCard components
4. **Loading States**: Skeleton loaders while fetching
5. **Empty States**: User-friendly messages when no results
6. **Add to Cart**: Quick add functionality from each card
7. **Toast Notifications**: Feedback when items are added to cart

### Data Requirements

#### Dish Interface

```typescript
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Categories

```typescript
const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
];
```

### API Integration

**Endpoint**: `GET /api/menu`

**Query Parameters**:
- `category`: Filter by category (optional)
- `search`: Search by name or description (optional)
- `featured`: Filter featured items (optional)

**Example Requests**:
```
/api/menu                           # All items
/api/menu?category=appetizers       # Appetizers only
/api/menu?search=pasta              # Search for "pasta"
/api/menu?category=mains&search=chicken  # Combined filters
```

### State Management

```typescript
interface MenuPageState {
  dishes: Dish[];
  filteredDishes: Dish[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
```

### SEO Metadata

```typescript
export const metadata: Metadata = {
  title: 'Menu - Bella Cucina',
  description: 'Browse our full menu of authentic Italian dishes. From classic pasta to wood-fired pizza, find your favorite Italian cuisine.',
  keywords: ['Italian menu', 'pasta menu', 'pizza menu', 'Italian restaurant menu'],
};
```

## Implementation Guide

### Step 1: Create the Menu Page File

Create the main menu page with client component:

```tsx
// app/menu/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { MenuCard } from '@/components/MenuCard';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
];

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();

  // Fetch dishes on mount
  useEffect(() => {
    fetchDishes();
  }, []);

  async function fetchDishes() {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/menu');

      if (!res.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error('Error fetching dishes:', err);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  // Filter dishes based on category and search
  const filteredDishes = useMemo(() => {
    let result = dishes;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(
        dish => dish.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        dish =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [dishes, selectedCategory, searchQuery]);

  // Handle add to cart
  function handleAddToCart(dish: Dish) {
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    });
    toast.success(`${dish.name} added to cart!`);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <PageHeader />

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for dishes..."
          />
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Dishes Grid */}
        {isLoading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDishes} />
        ) : filteredDishes.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            category={selectedCategory}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <DishesGrid
            dishes={filteredDishes}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </main>
  );
}
```

### Step 2: Create Page Header Component

```tsx
// app/menu/page.tsx (continued)

function PageHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Our Menu
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover our selection of authentic Italian dishes, made fresh daily with the finest ingredients
      </p>
    </div>
  );
}
```

### Step 3: Create Search Bar Component

```tsx
// app/menu/page.tsx (continued)

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
```

### Step 4: Create Category Tabs Component

```tsx
// app/menu/page.tsx (continued)

interface Category {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="mb-8">
      {/* Desktop: Horizontal tabs */}
      <div className="hidden sm:flex justify-center gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${
                selectedCategory === category.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

### Step 5: Create Dishes Grid Component

```tsx
// app/menu/page.tsx (continued)

interface DishesGridProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
}

function DishesGrid({ dishes, onAddToCart }: DishesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <MenuCard
          key={dish.id}
          dish={dish}
          onAddToCart={() => onAddToCart(dish)}
          showAddToCart
        />
      ))}
    </div>
  );
}
```

### Step 6: Create Loading State Component

```tsx
// app/menu/page.tsx (continued)

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Step 7: Create Empty State Component

```tsx
// app/menu/page.tsx (continued)

interface EmptyStateProps {
  searchQuery: string;
  category: string;
  onClearFilters: () => void;
}

function EmptyState({ searchQuery, category, onClearFilters }: EmptyStateProps) {
  const hasFilters = searchQuery || category !== 'all';

  return (
    <div className="text-center py-16">
      <svg
        className="mx-auto h-24 w-24 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        {hasFilters ? 'No dishes found' : 'No dishes available'}
      </h3>
      <p className="mt-2 text-gray-600">
        {hasFilters
          ? 'Try adjusting your search or filters'
          : 'Please check back later for our menu'}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
```

### Step 8: Create Error State Component

```tsx
// app/menu/page.tsx (continued)

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16">
      <svg
        className="mx-auto h-24 w-24 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        Oops! Something went wrong
      </h3>
      <p className="mt-2 text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}
```

### Step 9: Add Metadata (Create Separate File for Metadata)

Since we're using 'use client', create a separate layout or use generateMetadata:

```tsx
// app/menu/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu - Bella Cucina',
  description: 'Browse our full menu of authentic Italian dishes. From classic pasta to wood-fired pizza, find your favorite Italian cuisine.',
  keywords: ['Italian menu', 'pasta menu', 'pizza menu', 'Italian restaurant menu'],
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## Complete Code Example

Here's the complete menu page implementation:

```tsx
// app/menu/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { MenuCard } from '@/components/MenuCard';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
];

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    fetchDishes();
  }, []);

  async function fetchDishes() {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/menu');

      if (!res.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await res.json();
      setDishes(data);
    } catch (err) {
      console.error('Error fetching dishes:', err);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredDishes = useMemo(() => {
    let result = dishes;

    if (selectedCategory !== 'all') {
      result = result.filter(
        dish => dish.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        dish =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [dishes, selectedCategory, searchQuery]);

  function handleAddToCart(dish: Dish) {
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    });
    toast.success(`${dish.name} added to cart!`);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader />

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for dishes..."
          />
        </div>

        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {isLoading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDishes} />
        ) : filteredDishes.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            category={selectedCategory}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <DishesGrid
            dishes={filteredDishes}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </main>
  );
}

function PageHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Our Menu
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover our selection of authentic Italian dishes, made fresh daily with the finest ingredients
      </p>
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface Category {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="mb-8">
      <div className="hidden sm:flex justify-center gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${
                selectedCategory === category.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="sm:hidden">
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface DishesGridProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
}

function DishesGrid({ dishes, onAddToCart }: DishesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <MenuCard
          key={dish.id}
          dish={dish}
          onAddToCart={() => onAddToCart(dish)}
          showAddToCart
        />
      ))}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  searchQuery: string;
  category: string;
  onClearFilters: () => void;
}

function EmptyState({ searchQuery, category, onClearFilters }: EmptyStateProps) {
  const hasFilters = searchQuery || category !== 'all';

  return (
    <div className="text-center py-16">
      <svg
        className="mx-auto h-24 w-24 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        {hasFilters ? 'No dishes found' : 'No dishes available'}
      </h3>
      <p className="mt-2 text-gray-600">
        {hasFilters
          ? 'Try adjusting your search or filters'
          : 'Please check back later for our menu'}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16">
      <svg
        className="mx-auto h-24 w-24 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        Oops! Something went wrong
      </h3>
      <p className="mt-2 text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}
```

```tsx
// app/menu/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu - Bella Cucina',
  description: 'Browse our full menu of authentic Italian dishes. From classic pasta to wood-fired pizza, find your favorite Italian cuisine.',
  keywords: ['Italian menu', 'pasta menu', 'pizza menu', 'Italian restaurant menu'],
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## Acceptance Criteria

- [ ] Menu page renders at `/menu` route
- [ ] All dishes load from API on page mount
- [ ] Search bar filters dishes by name and description in real-time
- [ ] Category tabs filter dishes correctly
- [ ] Mobile dropdown shows on small screens
- [ ] Add to cart button adds items to cart context
- [ ] Toast notification appears when item added to cart
- [ ] Loading skeleton appears while fetching data
- [ ] Error state displays when API fails with retry button
- [ ] Empty state shows when no dishes match filters
- [ ] Clear filters button resets search and category
- [ ] Page is fully responsive on all devices
- [ ] SEO metadata is properly configured
- [ ] No console errors or warnings

## Testing Strategy

### Manual Testing Checklist

```bash
# Start development server
npm run dev

# Test the following at http://localhost:3000/menu:

1. Page Load
   - [ ] Page loads without errors
   - [ ] All dishes display in grid
   - [ ] Loading state appears briefly

2. Search Functionality
   - [ ] Type in search bar
   - [ ] Results filter in real-time
   - [ ] Clear button (X) appears and works
   - [ ] Empty state shows when no results

3. Category Filtering
   - [ ] Click each category tab
   - [ ] Dishes filter correctly
   - [ ] Mobile dropdown works
   - [ ] Combine with search

4. Add to Cart
   - [ ] Click add to cart on any dish
   - [ ] Toast notification appears
   - [ ] Cart icon updates (if in header)
   - [ ] Item appears in cart context

5. Responsive Design
   - [ ] Test on mobile (320px, 375px, 428px)
   - [ ] Test on tablet (768px, 1024px)
   - [ ] Test on desktop (1280px+)
   - [ ] Category tabs become dropdown on mobile

6. Error Handling
   - [ ] Stop API server
   - [ ] Refresh page
   - [ ] Error state displays
   - [ ] Retry button works

7. Performance
   - [ ] Page loads in < 2 seconds
   - [ ] Search is responsive (no lag)
   - [ ] Smooth animations and transitions
```

### Automated Testing

```typescript
// __tests__/menu-page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MenuPage from '@/app/menu/page';
import { CartProvider } from '@/contexts/CartContext';

// Mock fetch
global.fetch = jest.fn();

const mockDishes = [
  {
    id: '1',
    name: 'Pasta Carbonara',
    description: 'Classic Italian pasta',
    price: 15.99,
    category: 'Mains',
    image: null,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: '2',
    name: 'Bruschetta',
    description: 'Toasted bread with toppings',
    price: 8.99,
    category: 'Appetizers',
    image: null,
    isAvailable: true,
    isFeatured: false,
  },
];

describe('Menu Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDishes,
    });
  });

  it('renders page header', async () => {
    render(
      <CartProvider>
        <MenuPage />
      </CartProvider>
    );
    expect(screen.getByText('Our Menu')).toBeInTheDocument();
  });

  it('fetches and displays dishes', async () => {
    render(
      <CartProvider>
        <MenuPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    });
  });

  it('filters dishes by search query', async () => {
    render(
      <CartProvider>
        <MenuPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for dishes...');
    fireEvent.change(searchInput, { target: { value: 'pasta' } });

    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    expect(screen.queryByText('Bruschetta')).not.toBeInTheDocument();
  });

  it('filters dishes by category', async () => {
    render(
      <CartProvider>
        <MenuPage />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
    });

    const appetizersButton = screen.getByText('Appetizers');
    fireEvent.click(appetizersButton);

    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument();
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
  });
});
```

## Common Pitfalls

### 1. Client Component Not Marked

**Problem**: Error about hooks in Server Component
**Solution**: Add 'use client' directive at the top of the file

### 2. Infinite Re-renders

**Problem**: Page keeps re-rendering
**Solution**: Use useMemo for filtered dishes, don't create objects in render

### 3. Cart Context Not Available

**Problem**: useCart returns undefined
**Solution**: Ensure CartProvider wraps the app in root layout

### 4. Search Performance Issues

**Problem**: Search is laggy with many items
**Solution**: Implement debouncing or use useMemo for filtering

### 5. Category Case Sensitivity

**Problem**: Filtering doesn't work for some items
**Solution**: Convert both category and filter to lowercase for comparison

## Related Tasks

- **Task 3.1**: Menu API endpoints
- **Task 4.2**: MenuCard component
- **Task 4.5**: CartContext
- **Task 5.1**: Landing page (navigation reference)
- **Task 5.3**: Cart page (where items go after adding)

## Resources

- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React useMemo Hook](https://react.dev/reference/react/useMemo)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

**Task Status**: Ready for Implementation
**Last Updated**: 2026-02-09
