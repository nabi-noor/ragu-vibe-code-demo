import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse our authentic Italian menu featuring handcrafted pizzas, fresh pastas, classic appetizers, decadent desserts, and curated drinks.",
  openGraph: {
    title: "Menu — Bella Cucina",
    description:
      "Explore our full Italian menu. Order online for pickup or delivery.",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
