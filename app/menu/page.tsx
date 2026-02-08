"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import MenuCard from "@/components/MenuCard";
import { MenuCardSkeletonGrid } from "@/components/Skeletons";
import { cn } from "@/lib/utils";
import type { MenuItem, MenuCategory } from "@/lib/types";
import { MENU_CATEGORIES } from "@/lib/types";

// ============================================
// Category filter tabs
// ============================================

const categoryFilters: { value: MenuCategory | "All"; label: string }[] = [
  { value: "All", label: "All Items" },
  ...MENU_CATEGORIES.map((c) => ({ value: c, label: c })),
];

// ============================================
// Menu Page (Client Component)
// ============================================

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MenuCategory | "All">("All");

  // Fetch menu items on mount
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to load menu");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    let result = items;

    if (category !== "All") {
      result = result.filter((item) => item.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-warm-900 sm:text-4xl">
          Our Menu
        </h1>
        <p className="mt-2 text-warm-500">
          Browse our selection of authentic Italian dishes, made fresh daily.
        </p>
      </div>

      {/* ---- Filters Bar ---- */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white py-2.5 pl-10 pr-4 text-sm text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:max-w-sm"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-warm-400" />
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                category === f.value
                  ? "bg-primary-600 text-white"
                  : "bg-warm-100 text-warm-600 hover:bg-warm-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Content ---- */}
      {loading ? (
        <MenuCardSkeletonGrid count={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Try again
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-12 text-center">
          <p className="text-lg font-medium text-warm-700">No dishes found</p>
          <p className="mt-1 text-sm text-warm-500">
            {search
              ? `No results for "${search}". Try a different search term.`
              : "No items available in this category right now."}
          </p>
          {(search || category !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-warm-500">
            Showing {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "dish" : "dishes"}
            {category !== "All" && ` in ${category}`}
            {search && ` matching "${search}"`}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
