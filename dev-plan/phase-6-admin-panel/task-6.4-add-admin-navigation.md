# Task 6.4: Add Admin Navigation

## Task Metadata

- **Task ID**: 6.4
- **Task Name**: Add Admin Navigation
- **Phase**: 6 - Admin Panel
- **Estimated Time**: 2-3 hours
- **Complexity**: Low-Medium
- **Priority**: High
- **Dependencies**: Task 6.1, 6.2, 6.3 (Admin pages)
- **Assignee**: Frontend Developer

## Overview

Create a dedicated admin navigation system that provides consistent navigation across all admin pages. The navigation includes a persistent sidebar with links to all admin sections, active route highlighting, admin user information display, logout functionality, and a mobile-responsive drawer menu. The layout wraps all admin pages and provides a cohesive administrative interface with quick access to key metrics and sections.

## Importance

Admin navigation is critical because it:
- Provides consistent user experience across admin pages
- Enables quick navigation between admin sections
- Displays current location and context
- Shows admin user identity and role
- Provides quick logout access for security
- Improves workflow efficiency
- Reduces cognitive load with familiar patterns
- Supports both desktop and mobile workflows
- Creates professional admin interface

## Prerequisites

### Completed Components
- Admin dashboard page (Task 6.1)
- Menu management page (Task 6.2)
- Order management page (Task 6.3)
- AdminAuth wrapper component
- Authentication system with logout functionality

### Required Setup
- Next.js app router layout system
- Tailwind CSS for styling
- React hooks for state management
- Next.js Link component for navigation
- usePathname hook for active route detection

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0"
  }
}
```

## Technical Specifications

### Navigation Structure

```typescript
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: <DashboardIcon />,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: <OrdersIcon />,
    badge: activeOrderCount,
  },
  {
    name: 'Menu',
    href: '/admin/menu',
    icon: <MenuIcon />,
  },
];
```

### Layout Hierarchy

```
app/admin/layout.tsx (Admin Layout with Navigation)
├── AdminNav (Sidebar Navigation)
│   ├── Logo/Branding
│   ├── Navigation Links
│   ├── Active State Indicator
│   └── User Profile Section
├── AdminHeader (Top Bar)
│   ├── Mobile Menu Toggle
│   ├── Breadcrumbs
│   ├── Quick Actions
│   └── Logout Button
└── {children} (Page Content)
```

### Responsive Behavior

- **Desktop (≥768px)**: Persistent sidebar, content area adjusts
- **Tablet (768px-1024px)**: Collapsible sidebar with icon-only mode
- **Mobile (<768px)**: Drawer menu from left, top bar with hamburger

## Files to Create

### 1. `/app/admin/layout.tsx`
Main admin layout that wraps all admin pages with navigation.

### 2. `/app/admin/components/AdminNav.tsx`
Sidebar navigation component with links and user info.

### 3. `/app/admin/components/AdminHeader.tsx`
Top header bar with mobile menu toggle and quick actions.

### 4. `/app/admin/components/MobileNav.tsx`
Mobile-specific drawer navigation component.

## Step-by-Step Implementation Guide

### Step 1: Create AdminNav Component

**File**: `/app/admin/components/AdminNav.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function AdminNav() {
  const pathname = usePathname();
  const [activeOrders, setActiveOrders] = useState(0);

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setActiveOrders(data.activeOrders || 0);
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
    }
  };

  const navigationItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      badge: activeOrders,
    },
    {
      name: 'Menu',
      href: '/admin/menu',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Logo/Branding */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">BC</span>
          </div>
          <span className="text-white font-semibold text-lg">Bella Cucina</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    active
                      ? 'bg-amber-700 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site Link */}
      <div className="px-4 py-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Site</span>
        </Link>
      </div>
    </div>
  );
}
```

### Step 2: Create AdminHeader Component

**File**: `/app/admin/components/AdminHeader.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

interface User {
  name: string;
  email: string;
  role: string;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.startsWith('/admin/orders')) return 'Order Management';
    if (pathname.startsWith('/admin/menu')) return 'Menu Management';
    return 'Admin Panel';
  };

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/'),
      isLast: index === paths.length - 1,
    }));
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="h-5 w-5 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {crumb.isLast ? (
                  <span className="font-medium text-gray-900">{crumb.name}</span>
                ) : (
                  <a
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {crumb.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Page Title (Mobile) */}
          <h1 className="md:hidden text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <svg
                className="hidden md:block h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      router.push('/');
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Site
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Step 3: Create MobileNav Component

**File**: `/app/admin/components/MobileNav.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import AdminNav from './AdminNav';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-b border-gray-800">
            <span className="text-white font-semibold text-lg">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <AdminNav />
          </div>
        </div>
      </div>
    </>
  );
}
```

### Step 4: Create Admin Layout

**File**: `/app/admin/layout.tsx`

```typescript
'use client';

import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminNav from './components/AdminNav';
import MobileNav from './components/MobileNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
          <AdminNav />
        </aside>

        {/* Mobile Navigation */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col">
          {/* Header */}
          <AdminHeader onMenuToggle={() => setIsMobileNavOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Update Admin Pages (Remove Duplicate Wrappers)

Since the layout now handles authentication and navigation, update the admin pages to remove the `AdminAuth` wrapper and use the layout instead.

**File**: `/app/admin/page.tsx` (Update)

```typescript
// Remove AdminAuth wrapper since it's handled in layout
// Before:
// <AdminAuth>
//   <div className="min-h-screen bg-gray-50">
//     ...
//   </div>
// </AdminAuth>

// After:
export default function AdminDashboard() {
  // ... existing code without AdminAuth wrapper
  return (
    <div>
      {/* Dashboard content */}
    </div>
  );
}
```

Apply the same pattern to `/app/admin/menu/page.tsx` and `/app/admin/orders/page.tsx`.

### Step 6: Add Authentication Check to Layout

Update the layout to include authentication check:

**File**: `/app/admin/layout.tsx` (Enhanced)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from './components/AdminHeader';
import AdminNav from './components/AdminNav';
import MobileNav from './components/MobileNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/auth/login?redirect=/admin');
        return;
      }

      const data = await response.json();

      if (data.user.role !== 'admin') {
        router.push('/?error=unauthorized');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login?redirect=/admin');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
          <AdminNav />
        </aside>

        {/* Mobile Navigation */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col">
          {/* Header */}
          <AdminHeader onMenuToggle={() => setIsMobileNavOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

## Acceptance Criteria

### Functional Requirements

- [ ] Admin layout wraps all admin pages
- [ ] Sidebar navigation displays on desktop
- [ ] Active route highlighted in navigation
- [ ] Navigation links work correctly
- [ ] Active orders badge displays count
- [ ] Badge updates every 30 seconds
- [ ] Mobile menu toggle works
- [ ] Mobile drawer opens from left
- [ ] Mobile drawer closes on backdrop click
- [ ] Mobile drawer closes on Escape key
- [ ] Breadcrumbs show current location
- [ ] User menu displays user info
- [ ] Logout button works correctly
- [ ] Back to Site link works
- [ ] Authentication check on layout mount
- [ ] Non-admin users redirected
- [ ] Unauthenticated users redirected to login

### Non-Functional Requirements

- [ ] Navigation transitions smooth
- [ ] Mobile menu animates properly
- [ ] Layout responsive on all screen sizes
- [ ] Sidebar scrolls if content overflows
- [ ] Active state visually clear
- [ ] Keyboard navigation works
- [ ] Focus management proper in modals
- [ ] Color contrast meets standards

## Testing Strategy

### Unit Tests

```typescript
// __tests__/admin/components/AdminNav.test.tsx
import { render, screen } from '@testing-library/react';
import AdminNav from '@/app/admin/components/AdminNav';

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}));

describe('AdminNav', () => {
  it('renders navigation items', () => {
    render(<AdminNav />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('highlights active route', () => {
    render(<AdminNav />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-amber-600');
  });
});
```

### Integration Tests

Test navigation flow between admin pages.

### E2E Tests

```typescript
// e2e/admin-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@bellacucina.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
  });

  test('navigates between admin sections', async ({ page }) => {
    await page.goto('/admin');

    // Navigate to orders
    await page.click('text=Orders');
    await expect(page).toHaveURL('/admin/orders');

    // Navigate to menu
    await page.click('text=Menu');
    await expect(page).toHaveURL('/admin/menu');

    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/admin');
  });

  test('displays active order badge', async ({ page }) => {
    await page.goto('/admin');
    const badge = page.locator('text=Orders').locator('..').locator('.badge');
    await expect(badge).toBeVisible();
  });

  test('mobile menu works', async ({ page, viewport }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');

    // Open mobile menu
    await page.click('[aria-label="Menu"]');
    await expect(page.locator('nav')).toBeVisible();

    // Close on backdrop click
    await page.click('.backdrop');
    await expect(page.locator('nav')).not.toBeVisible();
  });
});
```

## Common Pitfalls

### Layout Hydration Errors
**Problem**: Client/server mismatch in layout
**Solution**: Use 'use client' directive and handle loading states

### Active Route Detection
**Problem**: Active state not updating on navigation
**Solution**: Use usePathname hook and check in render

### Mobile Menu State
**Problem**: Menu stays open on route change
**Solution**: Close menu on route change with useEffect

### Z-Index Conflicts
**Problem**: Modals appear behind navigation
**Solution**: Set proper z-index hierarchy (nav: 40-50, modals: 50+)

### Body Scroll Lock
**Problem**: Background scrolls when mobile menu open
**Solution**: Set `overflow: hidden` on body when menu open

## Related Tasks

### Prerequisites
- **Task 6.1**: Admin Dashboard
- **Task 6.2**: Menu Management
- **Task 6.3**: Order Management

### Integration Points
- All admin pages use this layout
- Authentication system for access control
- API endpoints for badge counts

## Future Enhancements

### Potential Improvements
- Collapsible sidebar on desktop
- Dark mode toggle
- Notification center with real-time updates
- Search command palette (Cmd+K)
- Keyboard shortcuts for navigation
- Role-based menu items
- Custom themes and branding
- Multi-language support
- Admin activity tracking

## Additional Resources

### Documentation
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [React usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)

### Design References
- [Tailwind UI Application Layouts](https://tailwindui.com/components/application-ui/application-shells/sidebar)
- [Material Design Navigation](https://material.io/components/navigation-drawer)

### Accessibility
- [ARIA Navigation Landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- [Keyboard Navigation Best Practices](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

---

**Task Status**: Ready for Implementation
**Estimated Time**: 2-3 hours
**Completes**: Phase 6 - Admin Panel

## Phase 6 Completion Checklist

After completing this task, verify Phase 6 is complete:

- [ ] Task 6.1: Admin Dashboard ✓
- [ ] Task 6.2: Menu Management ✓
- [ ] Task 6.3: Order Management ✓
- [ ] Task 6.4: Admin Navigation ✓
- [ ] All admin pages accessible via navigation
- [ ] Authentication protects all routes
- [ ] Mobile responsive throughout
- [ ] All CRUD operations working
- [ ] Real-time updates functioning
- [ ] Code reviewed and tested
- [ ] Documentation complete

**Congratulations!** Phase 6 Admin Panel is complete and ready for production deployment.
