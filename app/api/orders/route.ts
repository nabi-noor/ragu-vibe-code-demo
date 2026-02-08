import { NextRequest, NextResponse } from "next/server";
import { getOrders, addOrder, generateOrderId } from "@/lib/data";
import type { CreateOrderPayload, Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";
import { calculateSubtotal, calculateTax, calculateTotal } from "@/lib/utils";

// ─── GET /api/orders ────────────────────────────────────
// Returns all orders. Supports optional filters:
//   ?status=Pending        — filter by order status

export async function GET(request: NextRequest) {
  try {
    let items = getOrders();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    if (status) {
      items = items.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      );
    }

    // newest first
    const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json(sorted);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// ─── POST /api/orders ───────────────────────────────────
// Places a new order. Validates customer info & items,
// auto-calculates subtotal / tax / total, generates order ID.

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderPayload = await request.json();

    // --- validation ---
    const errors: string[] = [];

    if (!body.customerName || typeof body.customerName !== "string" || body.customerName.trim().length < 2) {
      errors.push("customerName is required (min 2 characters)");
    }
    if (!body.email || typeof body.email !== "string") {
      errors.push("email is required");
    }
    if (!body.phone || typeof body.phone !== "string") {
      errors.push("phone is required");
    }
    if (!body.orderType || !["Pickup", "Delivery"].includes(body.orderType)) {
      errors.push('orderType must be "Pickup" or "Delivery"');
    }
    if (body.orderType === "Delivery" && (!body.address || body.address.trim().length === 0)) {
      errors.push("address is required for delivery orders");
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      errors.push("items array is required and must not be empty");
    }

    // validate each item
    if (Array.isArray(body.items)) {
      body.items.forEach((item, i) => {
        if (!item.menuItemId) errors.push(`items[${i}].menuItemId is required`);
        if (!item.name) errors.push(`items[${i}].name is required`);
        if (typeof item.price !== "number" || item.price <= 0) {
          errors.push(`items[${i}].price must be a positive number`);
        }
        if (typeof item.quantity !== "number" || item.quantity < 1 || !Number.isInteger(item.quantity)) {
          errors.push(`items[${i}].quantity must be a positive integer`);
        }
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    const subtotal = calculateSubtotal(body.items);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    const order: Order = {
      id: generateOrderId(),
      customerName: body.customerName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      orderType: body.orderType,
      ...(body.address ? { address: body.address.trim() } : {}),
      items: body.items,
      subtotal,
      tax,
      total,
      status: "Pending" as OrderStatus,
      ...(body.specialInstructions
        ? { specialInstructions: body.specialInstructions.trim() }
        : {}),
      createdAt: Date.now(),
    };

    addOrder(order);

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
