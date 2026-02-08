import { NextRequest, NextResponse } from "next/server";
import {
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/data";
import type { MenuCategory } from "@/lib/types";
import { MENU_CATEGORIES } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/menu/[id] ────────────────────────────────
// Returns a single menu item by ID.

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const item = getMenuItemById(id);

    if (!item) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/menu/[id] ────────────────────────────────
// Fully updates an existing menu item. All fields are validated.

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const existing = getMenuItemById(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const errors: string[] = [];

    if (body.name !== undefined && (typeof body.name !== "string" || body.name.trim().length < 2)) {
      errors.push("name must be at least 2 characters");
    }
    if (body.price !== undefined && (typeof body.price !== "number" || body.price <= 0)) {
      errors.push("price must be a positive number");
    }
    if (body.category !== undefined && !MENU_CATEGORIES.includes(body.category as MenuCategory)) {
      errors.push(`category must be one of: ${MENU_CATEGORIES.join(", ")}`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.price !== undefined) updates.price = Math.round(body.price * 100) / 100;
    if (body.category !== undefined) updates.category = body.category;
    if (body.image !== undefined) updates.image = body.image;
    if (body.available !== undefined) updates.available = Boolean(body.available);

    const updated = updateMenuItem(id, updates);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// ─── DELETE /api/menu/[id] ──────────────────────────────
// Deletes a menu item by ID.

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const deleted = deleteMenuItem(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
