"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-warm-200 bg-white/95 backdrop-blur-sm">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---- Brand ---- */}
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-7 w-7 text-primary-600" />
          <span className="font-serif text-xl font-bold text-warm-900">
            Bella Cucina
          </span>
        </Link>

        {/* ---- Desktop links ---- */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-warm-600 hover:bg-warm-100 hover:text-warm-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ---- Cart button (always visible) ---- */}
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-900"
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* ---- Mobile hamburger ---- */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-warm-600 transition-colors hover:bg-warm-100 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ---- Mobile menu ---- */}
      {mobileOpen && (
        <div className="border-t border-warm-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-warm-600 hover:bg-warm-100 hover:text-warm-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
