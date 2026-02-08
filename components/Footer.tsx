import Link from "next/link";
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/admin", label: "Admin Panel" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 bg-warm-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* ---- Brand ---- */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary-600" />
              <span className="font-serif text-lg font-bold text-warm-900">
                Bella Cucina
              </span>
            </div>
            <p className="text-sm leading-relaxed text-warm-600">
              Experience the taste of Italy with our authentic recipes, fresh
              ingredients, and warm hospitality. Family owned since 1985.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-300 text-warm-500 transition-colors hover:border-primary-600 hover:bg-primary-600 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ---- Quick Links ---- */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warm-900">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-warm-600 transition-colors hover:text-primary-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Contact ---- */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warm-900">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-warm-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                123 Main Street, Downtown, NY 10001
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary-600" />
                <a href="tel:+15551234567" className="hover:text-primary-600">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary-600" />
                <a
                  href="mailto:info@bellacucina.com"
                  className="hover:text-primary-600"
                >
                  info@bellacucina.com
                </a>
              </li>
            </ul>
          </div>

          {/* ---- Hours ---- */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warm-900">
              Opening Hours
            </h3>
            <ul className="space-y-2 text-sm text-warm-600">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-primary-600" />
                Mon – Fri: 11 AM – 10 PM
              </li>
              <li className="pl-6">Sat – Sun: 10 AM – 11 PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---- Copyright bar ---- */}
      <div className="border-t border-warm-200 bg-warm-200/50 py-4 text-center text-xs text-warm-500">
        &copy; {new Date().getFullYear()} Bella Cucina. All rights reserved.
      </div>
    </footer>
  );
}
