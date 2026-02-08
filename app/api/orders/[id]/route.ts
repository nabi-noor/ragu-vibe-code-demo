import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/orders/[id] ───────────────────────────────
// Returns a single order by ID.
// Used by the order confirmation page to show status.

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/orders/[id] ─────────────────────────────
// Partially updates an order — primarily for status changes.
// Body: { "status": "Preparing" }
// Valid statuses: Pending, Preparing, Ready, Completed, Cancelled

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!body.status || !ORDER_STATUSES.includes(body.status as OrderStatus)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${ORDER_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(id, body.status as OrderStatus);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
