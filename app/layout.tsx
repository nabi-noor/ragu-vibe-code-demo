import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SkipNavLink, SkipNavTarget } from "@/components/SkipNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bella Cucina — Authentic Italian Restaurant",
    template: "%s | Bella Cucina",
  },
  description:
    "Experience authentic Italian cuisine at Bella Cucina. Browse our menu, order online for pickup or delivery, and track your order in real time.",
  keywords: [
    "Italian restaurant",
    "pizza",
    "pasta",
    "Bella Cucina",
    "online ordering",
  ],
  authors: [{ name: "Bella Cucina" }],
  openGraph: {
    title: "Bella Cucina — Authentic Italian Restaurant",
    description:
      "Browse our menu and order online for pickup or delivery.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SkipNavLink />
        <CartProvider>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            <SkipNavTarget />
            {children}
          </main>
          <Footer />
        </CartProvider>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
