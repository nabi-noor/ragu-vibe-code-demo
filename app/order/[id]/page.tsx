"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  CookingPot,
  PackageCheck,
  XCircle,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

// ============================================
// Status timeline configuration
// ============================================

const timelineSteps: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "Pending", label: "Order Placed", icon: Clock },
  { status: "Preparing", label: "Preparing", icon: CookingPot },
  { status: "Ready", label: "Ready", icon: PackageCheck },
  { status: "Completed", label: "Completed", icon: CheckCircle2 },
];

const statusIndex: Record<OrderStatus, number> = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  Completed: 3,
  Cancelled: -1,
};

// ============================================
// Order Confirmation Page (Client Component)
// ============================================

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch order + poll for updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Order not found");
          throw new Error("Failed to fetch order");
        }
        const data: Order = await res.json();
        setOrder(data);
        setError(null);

        // Stop polling for terminal statuses
        if (data.status === "Completed" || data.status === "Cancelled") {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    intervalId = setInterval(fetchOrder, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [id]);

  function handleCopyId() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ---- Loading ----
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-warm-200" />
          <div className="mx-auto mt-4 h-6 w-48 animate-pulse rounded bg-warm-200" />
          <div className="mx-auto mt-2 h-4 w-64 animate-pulse rounded bg-warm-200" />
        </div>
      </div>
    );
  }

  // ---- Error ----
  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-warm-900">
            {error === "Order not found" ? "Order Not Found" : "Something Went Wrong"}
          </h1>
          <p className="mt-2 text-warm-500">
            {error === "Order not found"
              ? `We couldn't find an order with ID "${id}".`
              : "There was a problem loading your order. Please try again."}
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = statusIndex[order.status];
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Success Header ---- */}
      <div className="mb-8 text-center">
        {isCancelled ? (
          <XCircle className="mx-auto h-14 w-14 text-red-400" />
        ) : (
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
        )}
        <h1 className="mt-4 font-serif text-2xl font-bold text-warm-900 sm:text-3xl">
          {isCancelled ? "Order Cancelled" : "Order Confirmed!"}
        </h1>
        <p className="mt-2 text-warm-500">
          {isCancelled
            ? "This order has been cancelled."
            : "Thank you for your order! We're preparing it now."}
        </p>

        {/* Order ID */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-warm-100 px-4 py-2">
          <span className="text-sm text-warm-500">Order ID:</span>
          <span className="font-mono text-sm font-bold text-warm-900">
            {order.id}
          </span>
          <button
            onClick={handleCopyId}
            className="rounded p-1 text-warm-400 transition-colors hover:text-warm-600"
            aria-label="Copy order ID"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ---- Status Timeline ---- */}
      {!isCancelled && (
        <div className="mb-8 rounded-xl border border-warm-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-warm-900">
              Order Status
            </h2>
            <OrderStatusBadge status={order.status} size="lg" />
          </div>

          <div className="relative flex justify-between">
            {/* Progress bar */}
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-warm-200" />
            <div
              className="absolute left-0 top-5 h-0.5 bg-primary-600 transition-all duration-500"
              style={{
                width: `${currentStep >= 0 ? (currentStep / (timelineSteps.length - 1)) * 100 : 0}%`,
              }}
            />

            {timelineSteps.map((step, i) => {
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.status} className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isCurrent
                        ? "border-primary-600 bg-primary-600 text-white"
                        : isActive
                          ? "border-primary-600 bg-primary-100 text-primary-600"
                          : "border-warm-200 bg-white text-warm-400"
                    )}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium",
                      isActive ? "text-warm-900" : "text-warm-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Cancelled notice ---- */}
      {isCancelled && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <OrderStatusBadge status="Cancelled" size="lg" />
          <p className="mt-2 text-sm text-red-700">
            This order has been cancelled and will not be processed.
          </p>
        </div>
      )}

      {/* ---- Order Details ---- */}
      <div className="mb-8 rounded-xl border border-warm-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
          Order Details
        </h2>

        {/* Items */}
        <div className="divide-y divide-warm-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
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

        {/* Totals */}
        <div className="mt-4 space-y-2 border-t border-warm-200 pt-4 text-sm">
          <div className="flex justify-between text-warm-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-warm-600">
            <span>Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-warm-200 pt-2 font-semibold text-warm-900">
            <span>Total</span>
            <span className="text-lg">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* ---- Customer Info ---- */}
      <div className="mb-8 rounded-xl border border-warm-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
          Customer Information
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-warm-500">Name</dt>
            <dd className="font-medium text-warm-900">{order.customerName}</dd>
          </div>
          <div>
            <dt className="text-warm-500">Email</dt>
            <dd className="font-medium text-warm-900">{order.email}</dd>
          </div>
          <div>
            <dt className="text-warm-500">Phone</dt>
            <dd className="font-medium text-warm-900">{order.phone}</dd>
          </div>
          <div>
            <dt className="text-warm-500">Order Type</dt>
            <dd className="font-medium text-warm-900">{order.orderType}</dd>
          </div>
          {order.address && (
            <div className="sm:col-span-2">
              <dt className="text-warm-500">Delivery Address</dt>
              <dd className="font-medium text-warm-900">{order.address}</dd>
            </div>
          )}
          {order.specialInstructions && (
            <div className="sm:col-span-2">
              <dt className="text-warm-500">Special Instructions</dt>
              <dd className="font-medium text-warm-900">
                {order.specialInstructions}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-warm-500">Placed At</dt>
            <dd className="font-medium text-warm-900">
              {formatDate(order.createdAt)}
            </dd>
          </div>
        </dl>
      </div>

      {/* ---- Actions ---- */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Order Again
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-200 px-6 py-3 text-sm font-semibold text-warm-700 transition-colors hover:bg-warm-100"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
