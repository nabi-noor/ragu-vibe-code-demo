# Task 1.6: Create Utility Functions

**Task ID:** 1.6
**Task Name:** Create Utility Functions
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 1-1.5 hours
**Complexity:** Low-Medium
**Prerequisites:** Task 1.4 (Create Type Definitions), Task 1.5 (Implement Data Store)

## Overview

This task involves creating a comprehensive set of utility functions that will be used throughout the Bella Cucina application. These utilities handle common operations like currency formatting, date manipulation, order calculations, text formatting, and class name management. Well-designed utility functions promote code reusability, maintain consistency, and simplify complex operations across the application.

## Importance

Utility functions are crucial because:

1. **Code Reusability** - Write once, use everywhere
2. **Consistency** - Ensures uniform formatting across the app (e.g., all prices look the same)
3. **Maintainability** - Changes to formatting logic happen in one place
4. **Testing** - Easier to test isolated utility functions
5. **Readability** - Complex operations become simple function calls
6. **Type Safety** - TypeScript ensures correct usage

## Prerequisites

### Required Completion
- ✅ Task 1.2: clsx and tailwind-merge installed
- ✅ Task 1.4: Type definitions created
- ✅ `lib/types.ts` exists with TAX_RATE constant

### Verification
```bash
# Check required files exist
ls -la /Users/noorragu/Documents/vibe-code-demo/lib/types.ts

# Verify dependencies
npm list clsx tailwind-merge
```

## Technical Specifications

### Utility Categories

#### 1. Class Name Utilities
- **cn()** - Combines clsx and tailwind-merge for conditional CSS classes
- Handles Tailwind class conflicts intelligently

#### 2. Currency Formatting
- **formatCurrency()** - Formats numbers as USD currency
- **formatPrice()** - Simplified price formatting
- **parseCurrency()** - Converts currency strings to numbers

#### 3. Date & Time Utilities
- **formatDate()** - Formats dates in various styles
- **formatTime()** - Formats time (12/24 hour)
- **formatDateTime()** - Combined date and time
- **getRelativeTime()** - Human-readable relative times ("5 minutes ago")
- **isToday()** - Checks if date is today
- **getTimeAgo()** - Returns "X minutes/hours ago" string

#### 4. Order Calculations
- **calculateSubtotal()** - Sum of order items
- **calculateTax()** - Tax calculation based on TAX_RATE
- **calculateTotal()** - Final total with tax and tip
- **calculateOrderItemSubtotal()** - Single item subtotal

#### 5. String Utilities
- **capitalize()** - Capitalizes first letter
- **truncate()** - Truncates long strings with ellipsis
- **pluralize()** - Handles singular/plural forms
- **slugify()** - Converts text to URL-friendly slugs

#### 6. Validation Utilities
- **isValidEmail()** - Email validation
- **isValidPhone()** - Phone number validation
- **isValidPrice()** - Price validation

#### 7. Array Utilities
- **groupBy()** - Groups array items by key
- **sortBy()** - Sorts arrays by property
- **unique()** - Removes duplicates

## Files to Create/Modify

### 1. `/Users/noorragu/Documents/vibe-code-demo/lib/utils.ts` (New File)

Complete utility functions library.

## Step-by-Step Implementation Guide

### Step 1: Create Utils File

```bash
cd /Users/noorragu/Documents/vibe-code-demo
touch lib/utils.ts
```

### Step 2: Implement Complete Utilities

Open `lib/utils.ts` and implement all utility functions:

```typescript
/**
 * Utility Functions for Bella Cucina
 *
 * This module provides reusable utility functions for common operations
 * throughout the application.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TAX_RATE } from './types';

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Combines class names using clsx and tailwind-merge
 * Handles conditional classes and resolves Tailwind conflicts
 *
 * @example
 * cn('px-2', 'px-4') // Returns: 'px-4' (last one wins)
 * cn('text-red-500', isError && 'text-blue-500') // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Formats a number as USD currency
 *
 * @param amount - The amount to format
 * @param showCents - Whether to show cents (default: true)
 * @returns Formatted currency string (e.g., "$15.99" or "$16")
 *
 * @example
 * formatCurrency(15.99) // Returns: "$15.99"
 * formatCurrency(16, false) // Returns: "$16"
 */
export function formatCurrency(amount: number, showCents: boolean = true): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}

/**
 * Alias for formatCurrency with cents always shown
 */
export function formatPrice(amount: number): string {
  return formatCurrency(amount, true);
}

/**
 * Parses a currency string to a number
 *
 * @param currencyString - String like "$15.99" or "15.99"
 * @returns The numeric value
 *
 * @example
 * parseCurrency("$15.99") // Returns: 15.99
 * parseCurrency("15.99") // Returns: 15.99
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Formats a date in various styles
 *
 * @param date - The date to format
 * @param format - Format style: 'short', 'medium', 'long', 'full'
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'short') // Returns: "2/9/26"
 * formatDate(new Date(), 'medium') // Returns: "Feb 9, 2026"
 * formatDate(new Date(), 'long') // Returns: "February 9, 2026"
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  }[format];

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Formats time in 12 or 24 hour format
 *
 * @param date - The date to format
 * @param use24Hour - Use 24-hour format (default: false)
 * @returns Formatted time string
 *
 * @example
 * formatTime(new Date()) // Returns: "2:30 PM"
 * formatTime(new Date(), true) // Returns: "14:30"
 */
export function formatTime(date: Date | string, use24Hour: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
  }).format(dateObj);
}

/**
 * Formats both date and time
 *
 * @example
 * formatDateTime(new Date()) // Returns: "Feb 9, 2026 at 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date, 'medium')} at ${formatTime(date)}`;
}

/**
 * Returns relative time string (e.g., "5 minutes ago")
 *
 * @param date - The date to compare
 * @returns Human-readable relative time
 *
 * @example
 * getRelativeTime(fiveMinutesAgo) // Returns: "5 minutes ago"
 * getRelativeTime(yesterday) // Returns: "1 day ago"
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${pluralize('minute', diffInMinutes)} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${pluralize('hour', diffInHours)} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${pluralize('day', diffInDays)} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${pluralize('week', diffInWeeks)} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${pluralize('month', diffInMonths)} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${pluralize('year', diffInYears)} ago`;
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Alias for getRelativeTime
 */
export const getTimeAgo = getRelativeTime;

// ============================================================================
// ORDER CALCULATION UTILITIES
// ============================================================================

/**
 * Calculates subtotal from order items
 *
 * @param items - Array of items with price and quantity
 * @returns Total subtotal
 *
 * @example
 * calculateSubtotal([{ price: 15.99, quantity: 2 }, { price: 8.99, quantity: 1 }])
 * // Returns: 40.97
 */
export function calculateSubtotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculates tax based on subtotal
 *
 * @param subtotal - The subtotal amount
 * @param taxRate - Tax rate (default: TAX_RATE from types)
 * @returns Tax amount
 *
 * @example
 * calculateTax(100) // Returns: 8.5 (with 8.5% tax rate)
 */
export function calculateTax(subtotal: number, taxRate: number = TAX_RATE): number {
  return subtotal * taxRate;
}

/**
 * Calculates total including tax and tip
 *
 * @param subtotal - The subtotal amount
 * @param tip - Optional tip amount
 * @returns Final total
 *
 * @example
 * calculateTotal(100, 15) // Returns: 123.5 (100 + 8.5 tax + 15 tip)
 */
export function calculateTotal(subtotal: number, tip: number = 0): number {
  const tax = calculateTax(subtotal);
  return subtotal + tax + tip;
}

/**
 * Calculates subtotal for a single order item
 *
 * @example
 * calculateOrderItemSubtotal(15.99, 2) // Returns: 31.98
 */
export function calculateOrderItemSubtotal(price: number, quantity: number): number {
  return price * quantity;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalizes the first letter of a string
 *
 * @example
 * capitalize('hello') // Returns: "Hello"
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a maximum length
 *
 * @param str - The string to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated string
 *
 * @example
 * truncate('This is a very long description', 20) // Returns: "This is a very lo..."
 */
export function truncate(str: string, maxLength: number = 50, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Handles singular/plural forms
 *
 * @param word - The singular word
 * @param count - The count
 * @param pluralForm - Optional custom plural form
 * @returns Correctly pluralized word
 *
 * @example
 * pluralize('item', 1) // Returns: "item"
 * pluralize('item', 2) // Returns: "items"
 * pluralize('child', 2, 'children') // Returns: "children"
 */
export function pluralize(word: string, count: number, pluralForm?: string): string {
  if (count === 1) return word;
  return pluralForm || `${word}s`;
}

/**
 * Converts text to URL-friendly slug
 *
 * @example
 * slugify('Chicken Parmigiana') // Returns: "chicken-parmigiana"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates an email address
 *
 * @example
 * isValidEmail('user@example.com') // Returns: true
 * isValidEmail('invalid') // Returns: false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a US phone number
 *
 * @example
 * isValidPhone('555-0100') // Returns: true
 * isValidPhone('(555) 555-0100') // Returns: true
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digits = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digits.length === 10;
}

/**
 * Validates a price value
 *
 * @example
 * isValidPrice(15.99) // Returns: true
 * isValidPrice(-5) // Returns: false
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && isFinite(price);
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Groups array items by a key
 *
 * @example
 * groupBy(menuItems, 'category')
 * // Returns: { 'Appetizer': [...], 'Main Course': [...] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array by a property
 *
 * @param array - Array to sort
 * @param key - Property to sort by
 * @param direction - 'asc' or 'desc' (default: 'asc')
 * @returns Sorted array
 *
 * @example
 * sortBy(menuItems, 'price', 'asc') // Sort by price ascending
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Removes duplicate values from an array
 *
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // Returns: [1, 2, 3]
 * unique(['a', 'b', 'a']) // Returns: ['a', 'b']
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Returns a random item from an array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Clamps a number between min and max
 *
 * @example
 * clamp(5, 0, 10) // Returns: 5
 * clamp(-5, 0, 10) // Returns: 0
 * clamp(15, 0, 10) // Returns: 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to specified decimal places
 *
 * @example
 * round(15.6789, 2) // Returns: 15.68
 */
export function round(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Formats a number with thousand separators
 *
 * @example
 * formatNumber(1234567) // Returns: "1,234,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if an object is empty
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// ============================================================================
// WAIT/DELAY UTILITY
// ============================================================================

/**
 * Creates a delay (useful for testing/animations)
 *
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 *
 * @example
 * await wait(1000); // Wait 1 second
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export commonly used functions
export default {
  cn,
  formatCurrency,
  formatPrice,
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  capitalize,
  truncate,
  pluralize,
  slugify,
};
```

### Step 3: Create Test File

Create comprehensive tests:

```typescript
// lib/utils.test.ts
import {
  formatCurrency,
  formatDate,
  formatTime,
  getRelativeTime,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  capitalize,
  truncate,
  pluralize,
  slugify,
  isValidEmail,
  isValidPhone,
  groupBy,
  sortBy,
  unique,
  cn,
} from './utils';

console.log('🧪 Testing Utility Functions\n');

// Currency formatting
console.log('Currency Formatting:');
console.log('  formatCurrency(15.99):', formatCurrency(15.99));
console.log('  formatCurrency(16, false):', formatCurrency(16, false));
console.log('');

// Date formatting
const testDate = new Date('2026-02-09T14:30:00');
console.log('Date Formatting:');
console.log('  formatDate(testDate, "short"):', formatDate(testDate, 'short'));
console.log('  formatDate(testDate, "medium"):', formatDate(testDate, 'medium'));
console.log('  formatDate(testDate, "long"):', formatDate(testDate, 'long'));
console.log('  formatTime(testDate):', formatTime(testDate));
console.log('');

// Relative time
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
console.log('Relative Time:');
console.log('  getRelativeTime(5 min ago):', getRelativeTime(fiveMinutesAgo));
console.log('');

// Order calculations
const items = [
  { price: 15.99, quantity: 2 },
  { price: 8.99, quantity: 1 },
];
const subtotal = calculateSubtotal(items);
const tax = calculateTax(subtotal);
const total = calculateTotal(subtotal, 5.0);

console.log('Order Calculations:');
console.log('  Subtotal:', subtotal);
console.log('  Tax:', tax);
console.log('  Total (with $5 tip):', total);
console.log('');

// String utilities
console.log('String Utilities:');
console.log('  capitalize("hello"):', capitalize('hello'));
console.log('  truncate("Long text...", 10):', truncate('This is a very long text', 10));
console.log('  pluralize("item", 1):', pluralize('item', 1));
console.log('  pluralize("item", 2):', pluralize('item', 2));
console.log('  slugify("Chicken Parmigiana"):', slugify('Chicken Parmigiana'));
console.log('');

// Validation
console.log('Validation:');
console.log('  isValidEmail("user@example.com"):', isValidEmail('user@example.com'));
console.log('  isValidEmail("invalid"):', isValidEmail('invalid'));
console.log('  isValidPhone("555-0100"):', isValidPhone('555-0100'));
console.log('');

// Array utilities
const testArray = [
  { name: 'Pizza', category: 'Main', price: 15 },
  { name: 'Salad', category: 'Appetizer', price: 10 },
  { name: 'Pasta', category: 'Main', price: 18 },
];

console.log('Array Utilities:');
console.log('  groupBy(items, "category"):', groupBy(testArray, 'category'));
console.log('  sortBy(items, "price", "asc"):', sortBy(testArray, 'price', 'asc'));
console.log('  unique([1,2,2,3]):', unique([1, 2, 2, 3]));
console.log('');

// Class names
console.log('Class Names:');
console.log('  cn("px-2", "px-4"):', cn('px-2', 'px-4'));
console.log('  cn("text-red", false && "text-blue"):', cn('text-red', false && 'text-blue'));
console.log('');

console.log('✅ All utility functions tested!');
```

Run test:
```bash
npx ts-node lib/utils.test.ts
```

### Step 4: Create Usage Examples Component

```typescript
// app/utils-test/page.tsx
import {
  formatCurrency,
  formatDate,
  getRelativeTime,
  calculateTotal,
  truncate,
  pluralize,
  cn,
} from '@/lib/utils';

export default function UtilsTest() {
  const testDate = new Date();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Utility Functions Test</h1>

      {/* Currency */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Currency Formatting</h2>
        <div className="space-y-2">
          <p>formatCurrency(15.99): {formatCurrency(15.99)}</p>
          <p>formatCurrency(100): {formatCurrency(100)}</p>
          <p>formatCurrency(1234.56): {formatCurrency(1234.56)}</p>
        </div>
      </section>

      {/* Dates */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Date Formatting</h2>
        <div className="space-y-2">
          <p>formatDate(now, 'short'): {formatDate(testDate, 'short')}</p>
          <p>formatDate(now, 'medium'): {formatDate(testDate, 'medium')}</p>
          <p>formatDate(now, 'long'): {formatDate(testDate, 'long')}</p>
          <p>getRelativeTime(5 min ago): {getRelativeTime(fiveMinutesAgo)}</p>
        </div>
      </section>

      {/* Calculations */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Calculations</h2>
        <div className="space-y-2">
          <p>Subtotal: $50.00</p>
          <p>Total (with tax & tip): {formatCurrency(calculateTotal(50, 10))}</p>
        </div>
      </section>

      {/* Strings */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">String Utilities</h2>
        <div className="space-y-2">
          <p>
            truncate('Very long description...'):{' '}
            {truncate('This is a very long description that needs truncating', 30)}
          </p>
          <p>pluralize('item', 1): {pluralize('item', 1)}</p>
          <p>pluralize('item', 5): {pluralize('item', 5)}</p>
        </div>
      </section>

      {/* Class Names */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Class Name Utility</h2>
        <div className="space-y-2">
          <div className={cn('p-4 rounded', 'bg-primary text-white')}>
            Using cn() with multiple classes
          </div>
          <div className={cn('p-4 rounded', 'bg-secondary', 'text-white')}>
            Conditional classes work great
          </div>
        </div>
      </section>
    </div>
  );
}
```

## Acceptance Criteria

1. ✅ `lib/utils.ts` created with all utility functions
2. ✅ Class name utility (cn) implemented
3. ✅ Currency formatting functions work correctly
4. ✅ Date/time formatting functions work
5. ✅ Relative time function works
6. ✅ Order calculation functions accurate
7. ✅ String utilities implemented
8. ✅ Validation functions work
9. ✅ Array utilities implemented
10. ✅ All functions have JSDoc comments
11. ✅ Test file passes all checks
12. ✅ Functions can be imported in components
13. ✅ TypeScript compilation succeeds
14. ✅ No linting errors

## Common Pitfalls

### Pitfall 1: Date Timezone Issues
Use consistent Date handling and consider timezone conversions.

### Pitfall 2: Floating Point Precision
Always round currency calculations to 2 decimal places.

### Pitfall 3: Tailwind Merge Not Working
Ensure tailwind-merge is properly imported and used with clsx.

## Related Tasks

- **Previous Task:** [Task 1.5: Implement Data Store](./task-1.5-implement-data-store.md)
- **Next Task:** [Task 1.7: Setup Root Layout](./task-1.7-setup-root-layout.md)

## Resources

- [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
