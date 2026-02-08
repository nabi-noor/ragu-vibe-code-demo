"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ClipboardList,
  DollarSign,
  Clock,
  Zap,
  RefreshCw,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

import OrderStatusBadge from "@/components/OrderStatusBadge";
import { StatCardSkeletonGrid, OrderRowSkeletonList } from "@/components/Skeletons";
import { formatCurrency, formatDate, getRelativeTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  activeOrders: number;
  totalMenuItems: number;
  availableItems: number;
  recentOrders: Order[];
  popularItems: { itemId: string; name: string; count: number; revenue: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-warm-500">
              Overview of your restaurant operations
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchStats();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Metric Cards */}
        {loading && !stats ? (
          <StatCardSkeletonGrid count={4} />
        ) : stats ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Orders"
              value={stats.totalOrders.toString()}
              icon={<ClipboardList className="h-5 w-5 text-primary-600" />}
            />
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={<DollarSign className="h-5 w-5 text-green-600" />}
            />
            <MetricCard
              title="Active Orders"
              value={stats.activeOrders.toString()}
              subtitle="Pending + Preparing"
              icon={<Zap className="h-5 w-5 text-amber-600" />}
            />
            <MetricCard
              title="Menu Items"
              value={`${stats.availableItems} / ${stats.totalMenuItems}`}
              subtitle="Available / Total"
              icon={<UtensilsCrossed className="h-5 w-5 text-blue-600" />}
            />
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-warm-200 bg-white">
              <div className="flex items-center justify-between border-b border-warm-200 px-6 py-4">
                <h2 className="font-serif text-lg font-semibold text-warm-900">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {loading && !stats ? (
                <div className="p-6">
                  <OrderRowSkeletonList count={5} />
                </div>
              ) : stats && stats.recentOrders.length > 0 ? (
                <div className="divide-y divide-warm-100">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-warm-900">
                            {order.id}
                          </span>
                          <OrderStatusBadge
                            status={order.status as OrderStatus}
                            size="sm"
                          />
                        </div>
                        <p className="mt-0.5 text-xs text-warm-500">
                          {order.customerName} &middot;{" "}
                          {getRelativeTime(order.createdAt)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-warm-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-warm-500">
                  No orders yet
                </div>
              )}
            </div>
          </div>

          {/* Popular Items */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-warm-200 bg-white">
              <div className="border-b border-warm-200 px-6 py-4">
                <h2 className="font-serif text-lg font-semibold text-warm-900">
                  Popular Items
                </h2>
              </div>

              {loading && !stats ? (
                <div className="space-y-4 p-6">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="h-10 animate-pulse rounded bg-warm-100"
                    />
                  ))}
                </div>
              ) : stats && stats.popularItems.length > 0 ? (
                <div className="divide-y divide-warm-100">
                  {stats.popularItems.map((item, i) => (
                    <div
                      key={item.itemId}
                      className="flex items-center gap-3 px-6 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-warm-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-warm-500">
                          {item.count} ordered
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-warm-700">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-warm-500">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

// ---- Metric Card ----
function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-warm-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-warm-500">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-50">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-warm-900">{value}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-warm-400">{subtitle}</p>
      )}
    </div>
  );
}
