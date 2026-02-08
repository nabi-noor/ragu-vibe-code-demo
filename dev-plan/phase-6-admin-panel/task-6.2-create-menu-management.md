# Task 6.2: Create Menu Management

## Task Metadata

- **Task ID**: 6.2
- **Task Name**: Create Menu Management
- **Phase**: 6 - Admin Panel
- **Estimated Time**: 5-6 hours
- **Complexity**: High
- **Priority**: High
- **Dependencies**: Task 6.1 (Admin Dashboard), Phase 4 (API Routes)
- **Assignee**: Full-stack Developer

## Overview

Build a comprehensive menu management interface that allows admin users to perform full CRUD (Create, Read, Update, Delete) operations on menu items. The interface includes a data table displaying all menu items with filtering and search capabilities, modal forms for adding and editing items, image upload functionality, and confirmation dialogs for deletions. This system provides restaurant staff with complete control over the menu displayed to customers.

## Importance

Menu management is critical because it:
- Enables dynamic menu updates without developer intervention
- Allows quick responses to ingredient availability changes
- Supports seasonal menu adjustments
- Provides control over pricing and item descriptions
- Enables restaurant staff to manage daily specials
- Reduces dependency on technical staff for menu updates
- Improves operational efficiency and menu accuracy
- Supports business agility and competitive responsiveness

## Prerequisites

### Completed Components
- Admin authentication system (Task 6.1)
- AdminAuth wrapper component
- Database menu_items table with proper schema
- API routes for menu CRUD operations
- Image upload handling (local or cloud storage)
- Form validation library (Zod or Yup)

### Required Database Schema

```sql
CREATE TABLE menu_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_category ON menu_items(category);
CREATE INDEX idx_menu_available ON menu_items(available);
```

### Dependencies

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

## Technical Specifications

### Menu Item Data Model

```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages' | 'specials';
  imageUrl: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}
```

### Form Validation Schema

```typescript
import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(9999.99, 'Price must be less than $10,000'),
  category: z.enum(['appetizers', 'mains', 'desserts', 'beverages', 'specials']),
  imageUrl: z.string().url('Must be a valid URL'),
  available: z.boolean(),
});
```

### API Endpoints

```typescript
// GET /api/menu - List all menu items with optional filtering
// POST /api/menu - Create new menu item
// PUT /api/menu/[id] - Update existing menu item
// DELETE /api/menu/[id] - Delete menu item
// PATCH /api/menu/[id]/toggle - Toggle availability
```

## Files to Create

### 1. `/app/admin/menu/page.tsx`
Main menu management page with data table and controls.

### 2. `/app/admin/components/MenuTable.tsx`
Data table component displaying all menu items with actions.

### 3. `/app/admin/components/MenuForm.tsx`
Modal form for creating and editing menu items.

### 4. `/app/admin/components/ConfirmDialog.tsx`
Reusable confirmation dialog for destructive actions.

### 5. `/app/admin/components/ImageUpload.tsx`
Image upload component with preview functionality.

### 6. `/app/api/menu/route.ts`
API handlers for GET (list) and POST (create) operations.

### 7. `/app/api/menu/[id]/route.ts`
API handlers for GET (single), PUT (update), and DELETE operations.

## Step-by-Step Implementation Guide

### Step 1: Create ConfirmDialog Component

**File**: `/app/admin/components/ConfirmDialog.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCancel}
        ></div>

        {/* Dialog */}
        <div
          ref={dialogRef}
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}
              >
                <svg
                  className={`h-6 w-6 ${styles.icon}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${styles.button}`}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Create ImageUpload Component

**File**: `/app/admin/components/ImageUpload.tsx`

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  error,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* File Upload */}
      <div className="flex items-center space-x-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload Image
              </>
            )}
          </div>
        </label>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Or enter image URL
        </label>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

### Step 3: Create MenuForm Component

**File**: `/app/admin/components/MenuForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import ImageUpload from './ImageUpload';

const menuItemSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  price: z.number().min(0.01).max(9999.99),
  category: z.enum(['appetizers', 'mains', 'desserts', 'beverages', 'specials']),
  imageUrl: z.string().url(),
  available: z.boolean(),
});

type MenuFormData = z.infer<typeof menuItemSchema>;

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => Promise<void>;
  initialData?: MenuFormData & { id?: string };
  mode: 'create' | 'edit';
}

export default function MenuForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: MenuFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      category: 'mains',
      imageUrl: '',
      available: true,
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  const handleFormSubmit = async (data: MenuFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={!isSubmitting ? onClose : undefined}
        ></div>

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-2xl">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === 'create' ? 'Add New Menu Item' : 'Edit Menu Item'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white px-6 py-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g., Margherita Pizza"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Describe the dish, ingredients, and preparation..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="appetizers">Appetizers</option>
                    <option value="mains">Mains</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                    <option value="specials">Specials</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setValue('imageUrl', url)}
                error={errors.imageUrl?.message}
              />

              {/* Available Toggle */}
              <div className="flex items-center">
                <input
                  {...register('available')}
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Available for orders
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  mode === 'create' ? 'Add Item' : 'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create MenuTable Component

**File**: `/app/admin/components/MenuTable.tsx`

```typescript
'use client';

import Image from 'next/image';
import { MenuItem } from '@prisma/client';

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
  loading?: boolean;
}

export default function MenuTable({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
  loading,
}: MenuTableProps) {
  const getCategoryBadge = (category: string) => {
    const colors = {
      appetizers: 'bg-purple-100 text-purple-800',
      mains: 'bg-blue-100 text-blue-800',
      desserts: 'bg-pink-100 text-pink-800',
      beverages: 'bg-green-100 text-green-800',
      specials: 'bg-amber-100 text-amber-800',
    };
    return colors[category as keyof typeof colors] || colors.mains;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No menu items found. Click "Add Item" to create your first menu item.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 relative rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleAvailability(item)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Edit"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 5: Create Menu Management Page

**File**: `/app/admin/menu/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { MenuItem } from '@prisma/client';
import AdminAuth from '../components/AdminAuth';
import MenuTable from '../components/MenuTable';
import MenuForm from '../components/MenuForm';
import ConfirmDialog from '../components/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, searchQuery]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  const handleAddItem = () => {
    setFormMode('create');
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setFormMode('edit');
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/menu/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      });

      if (!response.ok) throw new Error('Failed to update availability');

      toast.success(`Item ${!item.available ? 'enabled' : 'disabled'}`);
      fetchMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const url = formMode === 'create' ? '/api/menu' : `/api/menu/${selectedItem?.id}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save item');

      toast.success(
        `Menu item ${formMode === 'create' ? 'created' : 'updated'} successfully`
      );
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save menu item');
      throw error;
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'mains', label: 'Mains' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'specials', label: 'Specials' },
  ];

  return (
    <AdminAuth>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your restaurant's menu items
                </p>
              </div>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Item
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredItems.length} of {items.length} items
            </div>
          </div>

          {/* Table */}
          <MenuTable
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteClick}
            onToggleAvailability={handleToggleAvailability}
            loading={loading}
          />

          {/* Form Modal */}
          <MenuForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedItem || undefined}
            mode={formMode}
          />

          {/* Delete Confirmation */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            title="Delete Menu Item"
            message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setItemToDelete(null);
            }}
            variant="danger"
          />
        </div>
      </div>
    </AdminAuth>
  );
}
```

### Step 6: Update API Routes

**File**: `/app/api/menu/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/menu - List all menu items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    const where: any = {};
    if (category) where.category = category;
    if (available !== null) where.available = available === 'true';

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST /api/menu - Create new menu item (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, imageUrl, available } = body;

    // Validate required fields
    if (!name || !description || !price || !category || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        category,
        imageUrl,
        available: available ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
```

**File**: `/app/api/menu/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/menu/[id] - Get single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT /api/menu/[id] - Update menu item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, imageUrl, available } = body;

    const item = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        category,
        imageUrl,
        available,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// PATCH /api/menu/[id] - Toggle availability (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { available } = body;

    const item = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        available,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/[id] - Delete menu item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
```

## Acceptance Criteria

### Functional Requirements

- [ ] Menu items display in data table with images
- [ ] Search filters menu items by name and description
- [ ] Category filter shows only selected category items
- [ ] "Add Item" button opens form modal
- [ ] Form validates all inputs before submission
- [ ] Image upload works correctly
- [ ] Image URL input works as alternative
- [ ] New items appear in table after creation
- [ ] Edit button opens pre-filled form
- [ ] Changes persist after editing
- [ ] Delete button shows confirmation dialog
- [ ] Items removed after deletion confirmation
- [ ] Availability toggle works immediately
- [ ] Status badge updates after toggle
- [ ] Toast notifications show for all actions
- [ ] Form closes after successful submission
- [ ] Loading states display during operations
- [ ] Error messages show for failed operations

### Non-Functional Requirements

- [ ] Page loads within 2 seconds
- [ ] Forms respond instantly to user input
- [ ] Images load with proper optimization
- [ ] Table scrolls smoothly on mobile
- [ ] Modals trap focus properly
- [ ] Keyboard navigation works throughout
- [ ] Screen readers can access all functions
- [ ] Color contrast meets accessibility standards

## Testing Strategy

### Unit Tests

Test individual components in isolation.

### Integration Tests

Test API endpoints and data flow.

### E2E Tests

Test complete user workflows from login to menu management.

## Common Pitfalls

### Image Upload Issues
**Problem**: Images fail to upload or display
**Solution**: Implement proper error handling, validate file types, check server upload configuration

### Form State Management
**Problem**: Form doesn't reset after submission
**Solution**: Call reset() in handleFormSubmit after successful save

### Race Conditions
**Problem**: Stale data after quick edits
**Solution**: Refetch data after all mutations, use optimistic UI updates

### Memory Leaks
**Problem**: Modal doesn't clean up properly
**Solution**: Remove event listeners in useEffect cleanup

## Related Tasks

- **Task 6.1**: Admin Dashboard (prerequisite)
- **Task 6.3**: Order Management (similar patterns)
- **Task 6.4**: Admin Navigation (wraps this page)

---

**Task Status**: Ready for Implementation
**Estimated Time**: 5-6 hours
**Next Task**: Task 6.3 - Create Order Management
