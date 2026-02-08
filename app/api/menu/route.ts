import { NextRequest, NextResponse } from "next/server";
import {
  getMenuItems,
  addMenuItem,
  generateMenuItemId,
} from "@/lib/data";
import type { MenuCategory, CreateMenuItemPayload } from "@/lib/types";
import { MENU_CATEGORIES } from "@/lib/types";

// ─── GET /api/menu ──────────────────────────────────────
// Returns all menu items. Supports optional query filters:
//   ?category=Mains        — filter by category
//   ?available=true        — filter by availability

export async function GET(request: NextRequest) {
  try {
    let items = getMenuItems();

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    if (category) {
      items = items.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (available !== null) {
      const isAvailable = available === "true";
      items = items.filter((item) => item.available === isAvailable);
    }

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// ─── POST /api/menu ─────────────────────────────────────
// Creates a new menu item. Expects JSON body matching
// CreateMenuItemPayload (name, description, price, category, image).

export async function POST(request: NextRequest) {
  try {
    const body: CreateMenuItemPayload = await request.json();

    // --- validation ---
    const errors: string[] = [];

    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      errors.push("name is required (min 2 characters)");
    }
    if (!body.description || typeof body.description !== "string") {
      errors.push("description is required");
    }
    if (typeof body.price !== "number" || body.price <= 0) {
      errors.push("price must be a positive number");
    }
    if (!body.category || !MENU_CATEGORIES.includes(body.category as MenuCategory)) {
      errors.push(`category must be one of: ${MENU_CATEGORIES.join(", ")}`);
    }
    if (!body.image || typeof body.image !== "string") {
      errors.push("image URL is required");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    const newItem = {
      id: generateMenuItemId(),
      name: body.name.trim(),
      description: body.description.trim(),
      price: Math.round(body.price * 100) / 100,
      category: body.category,
      image: body.image,
      available: body.available ?? true,
    };

    addMenuItem(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
