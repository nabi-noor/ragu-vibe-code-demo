"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  ArrowLeft,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Auth constants (same as AdminAuth component)
// ============================================

const STORAGE_KEY = "bella-cucina-admin";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

// ============================================
// Sidebar nav items
// ============================================

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
];

// ============================================
// Admin Layout
// ============================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth check
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setAuthed(true);
    setChecking(false);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  }

  // ---- Loading ----
  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-300 border-t-primary-600" />
      </div>
    );
  }

  // ---- Login form ----
  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  // ---- Authenticated layout ----
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-warm-200 bg-warm-900 lg:block">
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-warm-900 transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-warm-700 px-4">
          <span className="font-serif text-sm font-bold text-white">
            Admin Panel
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-warm-400 hover:bg-warm-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile top bar */}
        <div className="flex h-12 items-center gap-3 border-b border-warm-200 bg-warm-50 px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-warm-600 hover:bg-warm-200"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-warm-700">
            Admin Panel
          </span>
        </div>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}

// ============================================
// Sidebar Content (shared between desktop & mobile)
// ============================================

function SidebarContent({
  pathname,
  onLogout,
}: {
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="hidden border-b border-warm-700 px-4 py-4 lg:block">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <UtensilsCrossed className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif text-lg font-bold text-white">
            Bella Cucina
          </span>
        </Link>
        <p className="mt-1 text-xs text-warm-400">Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-600 text-white"
                  : "text-warm-300 hover:bg-warm-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="space-y-1 border-t border-warm-700 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-warm-300 transition-colors hover:bg-warm-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Site
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-warm-300 transition-colors hover:bg-warm-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ============================================
// Login Form (inline — same UX as AdminAuth)
// ============================================

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        onSuccess();
      } else {
        setError("Incorrect password. Please try again.");
      }
      setSubmitting(false);
    }, 400);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Lock className="h-7 w-7 text-primary-600" />
          </div>
        </div>

        <h1 className="mb-1 text-center font-serif text-2xl font-bold text-warm-900">
          Admin Access
        </h1>
        <p className="mb-6 text-center text-sm text-warm-500">
          Enter the admin password to continue
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-lg border border-warm-300 px-4 py-2.5 pr-11 text-sm text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!password || submitting}
            className={cn(
              "flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
              password && !submitting
                ? "bg-primary-600 hover:bg-primary-700"
                : "cursor-not-allowed bg-warm-300"
            )}
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-warm-400">
          Default password:{" "}
          <code className="rounded bg-warm-100 px-1 py-0.5 text-warm-600">
            admin123
          </code>
        </p>
      </div>
    </div>
  );
}
