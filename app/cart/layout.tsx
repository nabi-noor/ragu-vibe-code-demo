import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your cart items, adjust quantities, and proceed to checkout at Bella Cucina.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
