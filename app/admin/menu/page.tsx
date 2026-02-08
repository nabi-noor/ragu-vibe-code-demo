"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import AdminAuth from "@/components/AdminAuth";
import { cn, formatCurrency } from "@/lib/utils";
import type { MenuItem, MenuCategory } from "@/lib/types";
import { MENU_CATEGORIES } from "@/lib/types";

// ============================================
// Menu Management Page
// ============================================

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "All">(
    "All"
  );

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch");
      setItems(await res.json());
    } catch {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    let result = items;
    if (categoryFilter !== "All") {
      result = result.filter((i) => i.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, categoryFilter, search]);

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${item.name} ${!item.available ? "enabled" : "disabled"}`);
      fetchItems();
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/menu/${deleteItem.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${deleteItem.name} deleted`);
      setDeleteItem(null);
      fetchItems();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <AdminAuth>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-900">
              Menu Management
            </h1>
            <p className="mt-1 text-sm text-warm-500">
              Add, edit, and manage your menu items
            </p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 rounded-xl border border-warm-200 bg-white p-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-warm-200 py-2 pl-10 pr-4 text-sm text-warm-900 placeholder:text-warm-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as MenuCategory | "All")
            }
            className="rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">All Categories</option>
            {MENU_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-warm-500">
          Showing {filtered.length} of {items.length} items
        </p>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-warm-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-12 text-center text-sm text-warm-500">
            No menu items found
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-warm-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-warm-200 bg-warm-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-warm-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-warm-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-warm-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-warm-900">
                              {item.name}
                            </p>
                            <p className="truncate text-xs text-warm-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-warm-900">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                            item.available
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          )}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setFormOpen(true);
                            }}
                            className="rounded-md p-2 text-warm-400 transition-colors hover:bg-warm-100 hover:text-primary-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="rounded-md p-2 text-warm-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {formOpen && (
        <MenuFormModal
          item={editingItem}
          onClose={() => {
            setFormOpen(false);
            setEditingItem(null);
          }}
          onSaved={() => {
            setFormOpen(false);
            setEditingItem(null);
            fetchItems();
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteItem && (
        <ConfirmDeleteModal
          itemName={deleteItem.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </AdminAuth>
  );
}

// ============================================
// Menu Form Modal
// ============================================

function MenuFormModal({
  item,
  onClose,
  onSaved,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [category, setCategory] = useState<MenuCategory>(
    item?.category ?? "Mains"
  );
  const [image, setImage] = useState(item?.image ?? "");
  const [available, setAvailable] = useState(item?.available ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name is required (min 2 chars)";
    if (!description.trim() || description.trim().length < 5) e.description = "Description is required (min 5 chars)";
    const p = parseFloat(price);
    if (!price || isNaN(p) || p <= 0) e.price = "Valid price required";
    if (!image.trim()) e.image = "Image URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        image: image.trim(),
        available,
      };

      const res = isEdit
        ? await fetch(`/api/menu/${item!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/menu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) throw new Error("Failed");
      toast.success(isEdit ? "Item updated" : "Item created");
      onSaved();
    } catch {
      toast.error("Failed to save item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-warm-200 px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-warm-900">
            {isEdit ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-warm-400 hover:text-warm-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Field label="Name *" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Margherita Pizza"
              className={inputClass(errors.name)}
            />
          </Field>

          <Field label="Description *" error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the dish..."
              className={inputClass(errors.description)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price ($) *" error={errors.price}>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass(errors.price)}
              />
            </Field>
            <Field label="Category *">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategory)}
                className={inputClass()}
              >
                {MENU_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Image URL *" error={errors.image}>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={inputClass(errors.image)}
            />
          </Field>

          {image && (
            <div className="relative h-40 overflow-hidden rounded-lg bg-warm-100">
              <Image
                src={image}
                alt="Preview"
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-warm-700">Available for orders</span>
          </label>

          <div className="flex justify-end gap-3 border-t border-warm-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-warm-200 px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Confirm Delete Modal
// ============================================

function ConfirmDeleteModal({
  itemName,
  onConfirm,
  onCancel,
}: {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-warm-900">Delete Menu Item</h3>
        </div>
        <p className="mb-6 text-sm text-warm-600">
          Are you sure you want to delete &ldquo;{itemName}&rdquo;? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-warm-200 px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Helpers
// ============================================

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-warm-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
    error
      ? "border-red-400 focus:border-red-500"
      : "border-warm-200 focus:border-primary-500"
  );
}
