"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/CartProvider";
import {
  formatCurrency,
  isValidEmail,
  isValidPhone,
} from "@/lib/utils";
import { TAX_RATE } from "@/lib/types";
import type { OrderType, OrderItem } from "@/lib/types";

// ============================================
// Checkout Page (Client Component)
// ============================================

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("Pickup");
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = totalPrice;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.customerName = "Name must be at least 2 characters";
    }
    if (!email.trim() || !isValidEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim() || !isValidPhone(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (orderType === "Delivery" && !address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const orderItems: OrderItem[] = items.map((item) => ({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          orderType,
          ...(orderType === "Delivery" ? { address: address.trim() } : {}),
          items: orderItems,
          ...(specialInstructions.trim()
            ? { specialInstructions: specialInstructions.trim() }
            : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      const order = await res.json();
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order/${order.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to place order"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Empty cart redirect ----
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-warm-300" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-warm-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-warm-500">
            Add some items to your cart before checking out.
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mb-8 font-serif text-3xl font-bold text-warm-900">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ---- Form Fields ---- */}
          <div className="space-y-8 lg:col-span-2">
            {/* Contact Info */}
            <section className="rounded-xl border border-warm-200 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="customerName"
                    className="mb-1 block text-sm font-medium text-warm-700"
                  >
                    Full Name *
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.customerName ? "border-red-400 focus:border-red-500" : "border-warm-200 focus:border-primary-500"}`}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-warm-700"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.email ? "border-red-400 focus:border-red-500" : "border-warm-200 focus:border-primary-500"}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium text-warm-700"
                  >
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555-123-4567"
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.phone ? "border-red-400 focus:border-red-500" : "border-warm-200 focus:border-primary-500"}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Order Type */}
            <section className="rounded-xl border border-warm-200 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
                Order Type
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setOrderType("Pickup")}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${orderType === "Pickup" ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500/20" : "border-warm-200 hover:border-warm-300"}`}
                >
                  <ShoppingBag
                    className={`h-5 w-5 ${orderType === "Pickup" ? "text-primary-600" : "text-warm-400"}`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-warm-900">
                      Pickup
                    </p>
                    <p className="text-xs text-warm-500">
                      Pick up at the restaurant
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("Delivery")}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${orderType === "Delivery" ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500/20" : "border-warm-200 hover:border-warm-300"}`}
                >
                  <MapPin
                    className={`h-5 w-5 ${orderType === "Delivery" ? "text-primary-600" : "text-warm-400"}`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-warm-900">
                      Delivery
                    </p>
                    <p className="text-xs text-warm-500">
                      Delivered to your address
                    </p>
                  </div>
                </button>
              </div>

              {orderType === "Delivery" && (
                <div className="mt-4">
                  <label
                    htmlFor="address"
                    className="mb-1 block text-sm font-medium text-warm-700"
                  >
                    Delivery Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.address ? "border-red-400 focus:border-red-500" : "border-warm-200 focus:border-primary-500"}`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Special Instructions */}
            <section className="rounded-xl border border-warm-200 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
                Special Instructions
              </h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Allergies, dietary restrictions, delivery instructions..."
                rows={3}
                maxLength={500}
                className="w-full rounded-lg border border-warm-200 bg-white px-4 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <p className="mt-1 text-xs text-warm-400">
                {specialInstructions.length}/500 characters
              </p>
            </section>
          </div>

          {/* ---- Order Summary Sidebar ---- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-warm-200 bg-white p-6">
              <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-warm-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-warm-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-warm-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-warm-700">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-warm-200 pt-4 text-sm">
                <div className="flex justify-between text-warm-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-warm-600">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-warm-200 pt-2 font-semibold text-warm-900">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order — ${formatCurrency(total)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
