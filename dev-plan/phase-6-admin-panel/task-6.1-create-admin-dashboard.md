# Task 6.1: Create Admin Dashboard

## Task Metadata

- **Task ID**: 6.1
- **Task Name**: Create Admin Dashboard
- **Phase**: 6 - Admin Panel
- **Estimated Time**: 4-5 hours
- **Complexity**: Medium
- **Priority**: High
- **Dependencies**: Phase 3 (Authentication), Phase 4 (API Routes), Phase 5 (Database)
- **Assignee**: Backend/Full-stack Developer

## Overview

Create a comprehensive admin dashboard that serves as the central hub for restaurant management. The dashboard provides real-time metrics, statistics, and quick access to recent orders. It includes key performance indicators (KPIs) such as total orders, revenue, active orders, and popular menu items. The dashboard auto-refreshes every 30 seconds to ensure admins always see current data.

## Importance

The admin dashboard is critical because it:
- Provides at-a-glance insights into restaurant operations
- Enables quick decision-making with real-time data
- Identifies trends and patterns in orders and revenue
- Serves as the landing page for all admin activities
- Improves operational efficiency by centralizing information
- Helps staff monitor peak times and adjust resources accordingly

## Prerequisites

### Completed Components
- Authentication system with admin role verification
- User session management with JWT or session cookies
- Database tables: orders, order_items, menu_items, users
- API routes for fetching order and menu data

### Required Setup
- Admin user account created in database with role='admin'
- Environment variables configured (DATABASE_URL, JWT_SECRET)
- Next.js app router structure established
- Tailwind CSS configured for styling

### Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

## Technical Specifications

### Dashboard Metrics

The dashboard displays the following key metrics:

1. **Total Orders** - All-time order count
2. **Today's Orders** - Orders placed today
3. **Total Revenue** - All-time revenue sum
4. **Today's Revenue** - Revenue generated today
5. **Active Orders** - Orders with status: pending or preparing
6. **Recent Orders** - Last 10 orders with details
7. **Popular Items** - Top 5 menu items by order count

### Data Fetching Strategy

- **Initial Load**: Fetch statistics on page mount
- **Auto-Refresh**: Poll API every 30 seconds for updates
- **Manual Refresh**: Button to trigger immediate refresh
- **Loading States**: Show skeletons during data fetching
- **Error Handling**: Display error messages with retry option

### API Response Structure

```typescript
interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  activeOrders: number;
  recentOrders: RecentOrder[];
  popularItems: PopularItem[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

interface PopularItem {
  itemId: string;
  name: string;
  orderCount: number;
  revenue: number;
}
```

### Authentication Flow

```typescript
// 1. User navigates to /admin
// 2. AdminAuth component checks session
// 3. If not authenticated → redirect to /auth/login
// 4. If authenticated but not admin → redirect to / with error
// 5. If authenticated as admin → render dashboard
```

## Files to Create

### 1. `/app/admin/page.tsx`
The main dashboard page component that displays metrics and recent orders.

### 2. `/app/admin/components/AdminAuth.tsx`
Authentication wrapper component that protects admin routes.

### 3. `/app/admin/components/MetricCard.tsx`
Reusable component for displaying individual metrics with icons and trends.

### 4. `/app/admin/components/RecentOrdersTable.tsx`
Table component displaying recent orders with status badges.

### 5. `/app/api/admin/stats/route.ts`
API endpoint that calculates and returns dashboard statistics.

## Step-by-Step Implementation Guide

### Step 1: Create AdminAuth Component

First, create the authentication wrapper that will protect all admin routes.

**File**: `/app/admin/components/AdminAuth.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login?redirect=/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

### Step 2: Create MetricCard Component

**File**: `/app/admin/components/MetricCard.tsx`

```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  loading?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  loading
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`flex items-center ${
                  trend.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.positive ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
                {trend.value}%
              </span>
              <span className="ml-2 text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Create RecentOrdersTable Component

**File**: `/app/admin/components/RecentOrdersTable.tsx`

```typescript
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
  loading?: boolean;
}

export default function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all →
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No recent orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/orders?id=${order.id}`}
                      className="text-amber-600 hover:text-amber-900"
                    >
                      View
                    </Link>
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

### Step 4: Create Dashboard Statistics API

**File**: `/app/api/admin/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get date boundaries for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get date boundaries for yesterday (for comparison)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Fetch all statistics in parallel
    const [
      totalOrders,
      todayOrders,
      yesterdayOrdersCount,
      totalRevenue,
      todayRevenue,
      yesterdayRevenue,
      activeOrders,
      recentOrders,
      popularItems,
    ] = await Promise.all([
      // Total orders count
      prisma.order.count(),

      // Today's orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Yesterday's orders (for trend calculation)
      prisma.order.count({
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
      }),

      // Total revenue
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: 'cancelled',
          },
        },
      }),

      // Today's revenue
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
          status: {
            not: 'cancelled',
          },
        },
      }),

      // Yesterday's revenue (for trend calculation)
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
          status: {
            not: 'cancelled',
          },
        },
      }),

      // Active orders (pending or preparing)
      prisma.order.count({
        where: {
          status: {
            in: ['pending', 'preparing'],
          },
        },
      }),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        },
      }),

      // Popular items (top 5 by order count)
      prisma.orderItem.groupBy({
        by: ['menuItemId'],
        _count: {
          menuItemId: true,
        },
        _sum: {
          subtotal: true,
        },
        orderBy: {
          _count: {
            menuItemId: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Fetch menu item details for popular items
    const popularItemsWithDetails = await Promise.all(
      popularItems.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
          select: { name: true },
        });
        return {
          itemId: item.menuItemId,
          name: menuItem?.name || 'Unknown Item',
          orderCount: item._count.menuItemId,
          revenue: item._sum.subtotal || 0,
        };
      })
    );

    // Calculate trends
    const orderTrend = yesterdayOrdersCount > 0
      ? ((todayOrders - yesterdayOrdersCount) / yesterdayOrdersCount) * 100
      : 0;

    const revenueTrend = yesterdayRevenue._sum.total
      ? (((todayRevenue._sum.total || 0) - yesterdayRevenue._sum.total) / yesterdayRevenue._sum.total) * 100
      : 0;

    // Format response
    const stats = {
      totalOrders,
      todayOrders,
      orderTrend: {
        value: Math.abs(Math.round(orderTrend)),
        positive: orderTrend >= 0,
      },
      totalRevenue: totalRevenue._sum.total || 0,
      todayRevenue: todayRevenue._sum.total || 0,
      revenueTrend: {
        value: Math.abs(Math.round(revenueTrend)),
        positive: revenueTrend >= 0,
      },
      activeOrders,
      recentOrders: recentOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
      popularItems: popularItemsWithDetails,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Main Dashboard Page

**File**: `/app/admin/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import AdminAuth from './components/AdminAuth';
import MetricCard from './components/MetricCard';
import RecentOrdersTable from './components/RecentOrdersTable';

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  orderTrend: {
    value: number;
    positive: boolean;
  };
  totalRevenue: number;
  todayRevenue: number;
  revenueTrend: {
    value: number;
    positive: boolean;
  };
  activeOrders: number;
  recentOrders: any[];
  popularItems: Array<{
    itemId: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                <svg
                  className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <MetricCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              loading={loading}
            />

            <MetricCard
              title="Today's Orders"
              value={stats?.todayOrders || 0}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              trend={
                stats?.orderTrend
                  ? {
                      value: stats.orderTrend.value,
                      label: 'vs yesterday',
                      positive: stats.orderTrend.positive,
                    }
                  : undefined
              }
              loading={loading}
            />

            <MetricCard
              title="Total Revenue"
              value={`$${stats?.totalRevenue.toFixed(2) || '0.00'}`}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              loading={loading}
            />

            <MetricCard
              title="Active Orders"
              value={stats?.activeOrders || 0}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <RecentOrdersTable
                orders={stats?.recentOrders || []}
                loading={loading}
              />
            </div>

            {/* Popular Items */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Popular Items
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : stats?.popularItems && stats.popularItems.length > 0 ? (
                    <div className="space-y-4">
                      {stats.popularItems.map((item, index) => (
                        <div
                          key={item.itemId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center flex-1">
                            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-amber-600">
                                {index + 1}
                              </span>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.orderCount} orders
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ${item.revenue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No popular items data available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}
```

### Step 6: Create Auth Utility Function

**File**: `/lib/auth.ts` (if not already exists)

```typescript
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = verify(token, secret) as AuthUser;
    return decoded;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}
```

## Acceptance Criteria

### Functional Requirements

- [ ] Dashboard loads without errors for authenticated admin users
- [ ] All metrics display correct values from database
- [ ] Dashboard auto-refreshes every 30 seconds
- [ ] Manual refresh button works correctly
- [ ] Loading states show during data fetching
- [ ] Error messages display when API calls fail
- [ ] Recent orders table shows last 10 orders
- [ ] Popular items section displays top 5 items
- [ ] Trend indicators show accurate percentage changes
- [ ] Non-admin users cannot access dashboard (redirected)
- [ ] Unauthenticated users redirected to login
- [ ] "View all" link navigates to orders page
- [ ] Order status badges display correct colors
- [ ] All timestamps formatted correctly

### Non-Functional Requirements

- [ ] Page loads within 2 seconds on initial load
- [ ] Auto-refresh doesn't cause UI flicker
- [ ] Dashboard responsive on mobile devices
- [ ] Metrics cards adapt to screen size
- [ ] Table scrolls horizontally on small screens
- [ ] Accessible with keyboard navigation
- [ ] Color contrast meets WCAG standards
- [ ] Loading skeletons match final layout

## Testing Strategy

### Unit Tests

```typescript
// __tests__/admin/components/MetricCard.test.tsx
import { render, screen } from '@testing-library/react';
import MetricCard from '@/app/admin/components/MetricCard';

describe('MetricCard', () => {
  it('renders metric title and value', () => {
    render(
      <MetricCard
        title="Total Orders"
        value={150}
        icon={<div>Icon</div>}
      />
    );
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('displays positive trend correctly', () => {
    render(
      <MetricCard
        title="Revenue"
        value="$5000"
        icon={<div>Icon</div>}
        trend={{ value: 15, label: 'vs yesterday', positive: true }}
      />
    );
    expect(screen.getByText('15%')).toHaveClass('text-green-600');
  });

  it('shows loading skeleton when loading', () => {
    const { container } = render(
      <MetricCard
        title="Orders"
        value={100}
        icon={<div>Icon</div>}
        loading={true}
      />
    );
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/api/admin/stats.test.ts
import { GET } from '@/app/api/admin/stats/route';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

jest.mock('@/lib/auth');
jest.mock('@prisma/client');

describe('Admin Stats API', () => {
  it('returns statistics for admin user', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/admin/stats');
    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('totalOrders');
    expect(data).toHaveProperty('todayRevenue');
    expect(data).toHaveProperty('recentOrders');
  });

  it('returns 401 for non-admin users', async () => {
    // Mock verifyAuth to return non-admin user
    const mockRequest = new NextRequest('http://localhost:3000/api/admin/stats');
    const response = await GET(mockRequest);

    expect(response.status).toBe(401);
  });
});
```

### E2E Tests

```typescript
// e2e/admin-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@bellacucina.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
  });

  test('displays dashboard metrics', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Today\'s Orders')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Orders')).toBeVisible();
  });

  test('shows recent orders table', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Recent Orders')).toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('refreshes data on button click', async ({ page }) => {
    await page.goto('/admin');
    const refreshButton = page.locator('button:has-text("Refresh")');
    await refreshButton.click();
    await expect(page.locator('.animate-spin')).toBeVisible();
  });
});
```

## Common Pitfalls

### Authentication Issues
**Problem**: Dashboard accessible without authentication
**Solution**: Ensure AdminAuth wrapper checks authentication on every render, not just initial mount

### Stale Data
**Problem**: Metrics don't update automatically
**Solution**: Verify setInterval cleanup in useEffect return function

### Memory Leaks
**Problem**: Intervals continue after component unmounts
**Solution**: Always clear intervals in cleanup function:
```typescript
return () => clearInterval(interval);
```

### Type Errors
**Problem**: TypeScript errors with Prisma aggregations
**Solution**: Handle null values from aggregations:
```typescript
totalRevenue._sum.total || 0
```

### Performance Issues
**Problem**: Dashboard slow with large datasets
**Solution**: Add pagination to recent orders and limit query results

### Time Zone Issues
**Problem**: "Today" metrics show wrong data
**Solution**: Use server timezone consistently or convert to user's timezone

### Status Badge Colors
**Problem**: Wrong colors for order statuses
**Solution**: Use consistent color mapping and test all status values

## Related Tasks

### Prerequisites (Must be completed first)
- Phase 3: Authentication system with admin roles
- Phase 4: API routes for orders and menu
- Phase 5: Database models and migrations

### Follow-up Tasks
- **Task 6.2**: Menu Management (uses similar patterns)
- **Task 6.3**: Order Management (links from recent orders table)
- **Task 6.4**: Admin Navigation (wraps around dashboard)

### Future Enhancements
- Advanced date range filtering
- Export dashboard data to CSV/PDF
- Custom metric widgets
- Real-time updates with WebSockets
- Comparative analytics (week-over-week, month-over-month)
- Revenue breakdown by category
- Customer analytics integration

## Additional Resources

### Documentation
- [Next.js App Router Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Prisma Aggregations](https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)

### Design References
- [Tailwind UI Stats Dashboard](https://tailwindui.com/components/application-ui/data-display/stats)
- [Vercel Dashboard Design](https://vercel.com/dashboard)

### Code Examples
- [SWR Auto-Refresh](https://swr.vercel.app/docs/revalidation)
- [React Query Polling](https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching)

---

**Task Status**: Ready for Implementation
**Estimated Time**: 4-5 hours
**Next Task**: Task 6.2 - Create Menu Management
