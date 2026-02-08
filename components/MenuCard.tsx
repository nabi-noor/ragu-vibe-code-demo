"use client";

import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
import { toast } from "sonner";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addItem, incrementItem, decrementItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);
  const inCart = quantity > 0;

  function handleAdd() {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  }

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm transition-shadow hover:shadow-soft",
        !item.available && "opacity-60"
      )}
    >
      {/* ---- Image ---- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-warm-800">
              Unavailable
            </span>
          </div>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-warm-700 backdrop-blur-sm">
          {item.category}
        </span>
      </div>

      {/* ---- Content ---- */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-warm-900">
            {item.name}
          </h3>
          <span className="shrink-0 font-semibold text-primary-600">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-warm-500">
          {item.description}
        </p>

        {/* ---- Action ---- */}
        {item.available ? (
          inCart ? (
            <div className="flex items-center justify-between rounded-lg border border-warm-200 bg-warm-50 p-1">
              <button
                onClick={() => decrementItem(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-warm-600 transition-colors hover:bg-warm-200"
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold text-warm-900">
                {quantity}
              </span>
              <button
                onClick={() => incrementItem(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-primary-600 transition-colors hover:bg-primary-50"
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-warm-200 px-4 py-2.5 text-sm font-semibold text-warm-400"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
