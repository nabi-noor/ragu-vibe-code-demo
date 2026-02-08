import { NextResponse } from "next/server";
import { getOrders, getMenuItems } from "@/lib/data";

export async function GET() {
  try {
    const orders = getOrders();
    const menuItems = getMenuItems();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const nonCancelled = orders.filter((o) => o.status !== "Cancelled");
    const todayOrders = orders.filter((o) => o.createdAt >= todayMs);
    const todayNonCancelled = todayOrders.filter(
      (o) => o.status !== "Cancelled"
    );
    const activeOrders = orders.filter(
      (o) => o.status === "Pending" || o.status === "Preparing"
    );

    const totalRevenue = nonCancelled.reduce((s, o) => s + o.total, 0);
    const todayRevenue = todayNonCancelled.reduce((s, o) => s + o.total, 0);

    // Popular items — count appearances across all orders
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const order of nonCancelled) {
      for (const item of order.items) {
        if (!itemCounts[item.menuItemId]) {
          itemCounts[item.menuItemId] = { name: item.name, count: 0, revenue: 0 };
        }
        itemCounts[item.menuItemId].count += item.quantity;
        itemCounts[item.menuItemId].revenue += item.price * item.quantity;
      }
    }
    const popularItems = Object.entries(itemCounts)
      .map(([id, data]) => ({ itemId: id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent orders (last 10, newest first)
    const recentOrders = [...orders]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    return NextResponse.json({
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      activeOrders: activeOrders.length,
      totalMenuItems: menuItems.length,
      availableItems: menuItems.filter((i) => i.available).length,
      recentOrders,
      popularItems,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
