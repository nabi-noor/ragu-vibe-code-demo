"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  RefreshCw,
  Search,
  Eye,
  ArrowRightLeft,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import AdminAuth from "@/components/AdminAuth";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { OrderRowSkeletonList } from "@/components/Skeletons";
import { formatCurrency, formatDate, getRelativeTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

// ============================================
// Status Workflow — enforces valid transitions
// ============================================

const STATUS_WORKFLOW: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Preparing", "Cancelled"],
  Preparing: ["Ready", "Cancelled"],
  Ready: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

// ============================================
// Order Management Page
// ============================================

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modals
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);

  // ---- Fetch ----
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // ---- Filtered list ----
  const filtered = useMemo(() => {
    let list = orders;

    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (typeFilter !== "all") {
      list = list.filter((o) => o.orderType === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q)
      );
    }

    return list;
  }, [orders, statusFilter, typeFilter, search]);

  // ---- Status update handler ----
  async function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Order status updated to ${newStatus}`);
      setStatusOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  }

  return (
    <AdminAuth>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-900">
              Orders
            </h1>
            <p className="mt-1 text-sm text-warm-500">
              Manage and track customer orders
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchOrders();
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

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-warm-200 bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, name, email..."
                className="w-full rounded-lg border border-warm-200 py-2 pl-10 pr-3 text-sm text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
              className="rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          <p className="mt-3 text-xs text-warm-400">
            Showing {filtered.length} of {orders.length} orders
          </p>
        </div>

        {/* Order Table */}
        {loading && orders.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-6">
            <OrderRowSkeletonList count={8} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-warm-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-warm-200">
                <thead className="bg-warm-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-sm text-warm-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-warm-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-warm-900">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="text-sm font-medium text-warm-900">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-warm-500">{order.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-warm-600">
                          {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                          item
                          {order.items.reduce((s, i) => s + i.quantity, 0) !== 1
                            ? "s"
                            : ""}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-warm-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-warm-600">
                          {order.orderType}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <OrderStatusBadge
                            status={order.status}
                            size="sm"
                          />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-warm-500">
                          {getRelativeTime(order.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailOrder(order)}
                              className="rounded-lg p-1.5 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {STATUS_WORKFLOW[order.status].length > 0 && (
                              <button
                                onClick={() => setStatusOrder(order)}
                                className="rounded-lg p-1.5 text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
                                title="Update status"
                              >
                                <ArrowRightLeft className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
        />
      )}

      {/* Status Update Modal */}
      {statusOrder && (
        <StatusUpdateModal
          order={statusOrder}
          onClose={() => setStatusOrder(null)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </AdminAuth>
  );
}

// ============================================
// Order Detail Modal
// ============================================

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-warm-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-warm-900">
              Order {order.id}
            </h2>
            <p className="text-xs text-warm-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Status & Type */}
          <div className="flex items-center gap-4">
            <OrderStatusBadge status={order.status} size="lg" />
            <span className="rounded-full bg-warm-100 px-3 py-1 text-sm font-medium text-warm-700">
              {order.orderType}
            </span>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-warm-900">
              Customer Information
            </h3>
            <div className="space-y-2 rounded-lg bg-warm-50 p-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-warm-400" />
                <span className="text-warm-900">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-warm-400" />
                <span className="text-warm-900">{order.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-warm-400" />
                <span className="text-warm-900">{order.phone}</span>
              </div>
              {order.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-warm-400" />
                  <span className="text-warm-900">{order.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-warm-400" />
                <span className="text-warm-900">
                  {getRelativeTime(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-warm-900">
                Special Instructions
              </h3>
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">
                  {order.specialInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-warm-900">
              Order Items
            </h3>
            <div className="divide-y divide-warm-100 rounded-lg border border-warm-200">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-warm-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-warm-500">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-warm-700">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 rounded-lg bg-warm-50 p-4 text-sm">
            <div className="flex justify-between text-warm-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-warm-600">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-warm-200 pt-2 font-bold text-warm-900">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-warm-200 bg-warm-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-semibold text-warm-700 transition-colors hover:bg-warm-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Status Update Modal
// ============================================

function StatusUpdateModal({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}) {
  const [selected, setSelected] = useState<OrderStatus | "">("");
  const [submitting, setSubmitting] = useState(false);
  const allowed = STATUS_WORKFLOW[order.status];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await onUpdate(order.id, selected);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!submitting ? onClose : undefined}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-200 px-6 py-4">
            <h2 className="font-serif text-lg font-bold text-warm-900">
              Update Status
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg p-1.5 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-6">
            <div className="text-sm text-warm-600">
              <span className="font-semibold text-warm-900">{order.id}</span>
              {" — "}
              {order.customerName}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-warm-500">Current:</span>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>

            {allowed.length === 0 ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                This order cannot be updated further.
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-warm-700">
                  New Status
                </label>
                <select
                  value={selected}
                  onChange={(e) =>
                    setSelected(e.target.value as OrderStatus)
                  }
                  required
                  className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select status...</option>
                  {allowed.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          {allowed.length > 0 && (
            <div className="flex items-center justify-end gap-3 border-t border-warm-200 bg-warm-50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg border border-warm-200 bg-white px-4 py-2 text-sm font-semibold text-warm-700 transition-colors hover:bg-warm-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selected}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
              >
                {submitting && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                {submitting ? "Updating..." : "Update Status"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
