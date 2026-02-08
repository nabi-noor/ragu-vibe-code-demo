"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Lock, Eye, EyeOff, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bella-cucina-admin";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setAuthed(true);
    setChecking(false);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Small delay for UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setAuthed(true);
      } else {
        setError("Incorrect password. Please try again.");
      }
      setSubmitting(false);
    }, 400);
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPassword("");
  }

  // Initial session check
  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-300 border-t-primary-600" />
      </div>
    );
  }

  // Authenticated
  if (authed) {
    return (
      <div>
        {/* Logout bar */}
        <div className="border-b border-warm-200 bg-warm-50 px-4 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span className="text-sm text-warm-500">Admin Panel</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-warm-600 transition-colors hover:bg-warm-200 hover:text-warm-900"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Login form
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Icon */}
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

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password field */}
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

          {/* Submit */}
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
