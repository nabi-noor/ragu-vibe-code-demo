"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { TAX_RATE } from "@/lib/types";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  const subtotal = totalPrice;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  // ---- Empty State ----
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-warm-300" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-warm-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-warm-500">
            Looks like you haven&apos;t added any dishes yet. Browse our menu to
            find something delicious!
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Browse Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ---- Cart with items ----
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-900">
            Your Cart
          </h1>
          <p className="mt-1 text-warm-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ---- Cart Items ---- */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-warm-200 rounded-xl border border-warm-200 bg-white">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 sm:items-center sm:gap-6 sm:p-6"
              >
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-warm-100 sm:h-24 sm:w-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-base font-semibold text-warm-900">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-warm-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg border border-warm-200 bg-warm-50">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center text-warm-600 transition-colors hover:bg-warm-200"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold text-warm-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center text-primary-600 transition-colors hover:bg-primary-50"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="min-w-[4.5rem] text-right text-sm font-semibold text-warm-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-warm-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <Link
            href="/menu"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            &larr; Continue Shopping
          </Link>
        </div>

        {/* ---- Order Summary ---- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-warm-200 bg-white p-6">
            <h2 className="mb-4 font-serif text-lg font-semibold text-warm-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-warm-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-warm-600">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-warm-200 pt-3">
                <div className="flex justify-between font-semibold text-warm-900">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-3 text-center text-xs text-warm-400">
              Tax calculated at checkout. Delivery fees may apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
