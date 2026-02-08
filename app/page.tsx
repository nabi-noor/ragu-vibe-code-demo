import Image from "next/image";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  Truck,
  Star,
  ArrowRight,
  Leaf,
  UtensilsCrossed,
} from "lucide-react";
import { getMenuItems } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

// ============================================
// Static data for the landing page
// ============================================

const testimonials = [
  {
    name: "Maria Rossi",
    text: "The best Italian food outside of Italy! The pasta carbonara is absolutely divine — creamy, rich, and perfectly seasoned every time.",
    rating: 5,
  },
  {
    name: "John & Sarah K.",
    text: "We order from Bella Cucina every Friday night. The delivery is always on time and the food arrives hot. Our kids love the margherita pizza!",
    rating: 5,
  },
  {
    name: "David Chen",
    text: "Incredible tiramisu and the best espresso in town. The online ordering makes it so convenient. Highly recommend for date nights!",
    rating: 5,
  },
];

const features = [
  {
    icon: ChefHat,
    title: "Authentic Recipes",
    description:
      "Traditional Italian recipes passed down through generations, prepared with love by our expert chefs.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We source the finest local and imported ingredients daily to ensure every dish is bursting with flavor.",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description:
      "From our kitchen to your table in record time. Order online and enjoy fast pickup or delivery.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description:
      "Complimentary delivery within 5 miles. Your favorite Italian dishes delivered right to your doorstep.",
  },
];

// ============================================
// Landing Page (Server Component)
// ============================================

export default function HomePage() {
  const allItems = getMenuItems();
  const featuredItems = allItems.filter((item) => item.available).slice(0, 6);

  return (
    <>
      {/* ======== Hero Section ======== */}
      <section className="relative overflow-hidden bg-warm-900">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920"
            alt="Bella Cucina restaurant interior"
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-400">
              <UtensilsCrossed className="h-4 w-4" />
              Authentic Italian Cuisine
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              A Taste of Italy,{" "}
              <span className="text-primary-400">Delivered to You</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-warm-300 sm:text-xl">
              Experience the warmth of traditional Italian cooking with our
              handcrafted dishes, made from the freshest ingredients and served
              with love.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                View Our Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Featured Dishes ======== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Chef&apos;s Selection
          </p>
          <h2 className="font-serif text-3xl font-bold text-warm-900 sm:text-4xl">
            Featured Dishes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-warm-500">
            Discover our most popular dishes, crafted daily by our talented
            chefs using the finest ingredients.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm transition-shadow hover:shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-warm-700 backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold text-warm-900">
                    {item.name}
                  </h3>
                  <span className="shrink-0 font-semibold text-primary-600">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-warm-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            View Full Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ======== About Section ======== */}
      <section className="bg-warm-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
              alt="Chef preparing food at Bella Cucina"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
              Our Story
            </p>
            <h2 className="font-serif text-3xl font-bold text-warm-900 sm:text-4xl">
              Family Tradition Since 1985
            </h2>
            <p className="mt-4 leading-relaxed text-warm-600">
              Bella Cucina was born from a simple dream — to bring the authentic
              flavors of Italy to our community. For nearly four decades, our
              family has been crafting dishes that celebrate the rich culinary
              heritage of Italian cooking.
            </p>
            <p className="mt-4 leading-relaxed text-warm-600">
              Every dish on our menu tells a story of tradition, passion, and the
              finest ingredients. From our hand-rolled pasta to our wood-fired
              pizzas, each recipe has been perfected over generations and served
              with the warmth that only a family kitchen can provide.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              Explore our menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======== Why Choose Us ======== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
            Why Bella Cucina
          </p>
          <h2 className="font-serif text-3xl font-bold text-warm-900 sm:text-4xl">
            The Bella Cucina Difference
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-warm-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-soft"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-warm-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-warm-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======== Testimonials ======== */}
      <section className="bg-warm-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-600">
              What Our Customers Say
            </p>
            <h2 className="font-serif text-3xl font-bold text-warm-900 sm:text-4xl">
              Loved by Thousands
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-warm-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary-500 text-primary-500"
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-warm-600">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-sm font-semibold text-warm-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Final CTA ======== */}
      <section className="bg-warm-900">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Ready to Order?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-warm-300">
            Browse our full menu and place your order in minutes. Enjoy pickup or
            delivery — your choice!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Order Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
