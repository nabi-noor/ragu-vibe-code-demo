# Task 5.1: Create Landing Page

## Task Metadata

- **Task ID**: 5.1
- **Task Name**: Create Landing Page
- **Phase**: 5 - Customer-Facing Pages
- **Prerequisites**: Phase 3 (API Routes), Phase 4 (Shared Components)
- **Estimated Time**: 3-4 hours
- **Priority**: High
- **Difficulty**: Medium
- **Last Updated**: 2026-02-09

## Overview

The landing page is the first impression customers have of Bella Cucina. This task involves creating an engaging, visually appealing homepage that showcases the restaurant's brand, highlights featured dishes, displays customer testimonials, and provides clear call-to-action buttons to guide users through the ordering process.

### Importance

- **First Impression**: Sets the tone for the entire customer experience
- **Conversion Driver**: Guides visitors toward browsing menu and placing orders
- **Brand Identity**: Communicates the restaurant's personality and values
- **SEO Foundation**: Optimized for search engines to drive organic traffic
- **Mobile Experience**: Ensures smooth experience on all devices

### User Stories

1. As a new visitor, I want to see what makes Bella Cucina special, so I can decide if I want to order
2. As a hungry customer, I want to see featured dishes with photos, so I can quickly decide what to order
3. As a potential customer, I want to read testimonials, so I can trust the restaurant's quality
4. As a mobile user, I want a fast-loading, responsive page, so I can browse on my phone
5. As a return customer, I want quick access to the menu, so I can start ordering immediately

## Prerequisites

### Completed Tasks

- ✅ Task 3.1: Menu API endpoints (`/api/menu`)
- ✅ Task 4.1: Create reusable components (Button, Card)
- ✅ Task 4.2: MenuCard component
- ✅ Project configuration (Tailwind, fonts, Next.js 15)

### Required Knowledge

- Next.js 15 App Router
- React Server Components
- Tailwind CSS responsive design
- Image optimization with next/image
- SEO metadata configuration

### Environment Setup

```bash
# Verify project dependencies
npm install

# Ensure database is running and seeded
npm run db:seed

# Start development server
npm run dev
```

## Technical Specifications

### Page Route

- **Path**: `/`
- **File**: `app/page.tsx`
- **Type**: React Server Component (default)
- **Layout**: Uses root layout (`app/layout.tsx`)

### Page Structure

The landing page consists of six main sections:

1. **Hero Section**: Large banner with headline, subheadline, and CTA button
2. **Featured Dishes**: Carousel or grid of 3-6 featured menu items
3. **About Section**: Brief description of the restaurant
4. **Features/Benefits**: Why choose Bella Cucina (quality, speed, variety)
5. **Testimonials**: Customer reviews and ratings
6. **Footer CTA**: Final call-to-action to view menu or place order

### Data Requirements

#### Featured Dishes (from API)

```typescript
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}
```

Fetch featured dishes from: `GET /api/menu?featured=true`

#### Static Content

All other content is static and defined in the component:
- Hero headline and copy
- Restaurant description
- Feature highlights
- Testimonials
- Contact information

### SEO Metadata

```typescript
export const metadata: Metadata = {
  title: 'Bella Cucina - Authentic Italian Cuisine',
  description: 'Order authentic Italian dishes from Bella Cucina. Fresh ingredients, traditional recipes, and fast delivery. Browse our menu of pasta, pizza, and more.',
  keywords: ['Italian restaurant', 'pasta', 'pizza', 'Italian food delivery'],
  openGraph: {
    title: 'Bella Cucina - Authentic Italian Cuisine',
    description: 'Order authentic Italian dishes from Bella Cucina',
    type: 'website',
    locale: 'en_US',
    siteName: 'Bella Cucina',
  },
};
```

### Responsive Design Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

## Implementation Guide

### Step 1: Create the Landing Page File

Create the main page component at `app/page.tsx`:

```tsx
// app/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MenuCard } from '@/components/MenuCard';

export const metadata: Metadata = {
  title: 'Bella Cucina - Authentic Italian Cuisine',
  description: 'Order authentic Italian dishes from Bella Cucina. Fresh ingredients, traditional recipes, and fast delivery.',
  keywords: ['Italian restaurant', 'pasta', 'pizza', 'Italian food delivery', 'authentic Italian cuisine'],
  openGraph: {
    title: 'Bella Cucina - Authentic Italian Cuisine',
    description: 'Order authentic Italian dishes from Bella Cucina. Fresh ingredients, traditional recipes, and fast delivery.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Bella Cucina',
  },
};

// Data fetching function
async function getFeaturedDishes() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/menu?featured=true`, {
      cache: 'no-store', // Always fetch fresh data
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!res.ok) {
      throw new Error('Failed to fetch featured dishes');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching featured dishes:', error);
    return [];
  }
}

export default async function LandingPage() {
  const featuredDishes = await getFeaturedDishes();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Dishes Section */}
      <FeaturedDishesSection dishes={featuredDishes} />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
```

### Step 2: Create Hero Section Component

The hero section is the first thing users see:

```tsx
// app/page.tsx (continued)

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Authentic Italian
              <span className="block text-red-600">Cuisine Delivered</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0">
              Experience the rich flavors of Italy with our handcrafted dishes made from the finest ingredients.
              Order now and taste the difference.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                View Menu
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-red-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border-2 border-red-600"
              >
                Order Now
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fresh Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>500+ Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative lg:h-[500px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero-dish.jpg"
              alt="Delicious Italian pasta dish"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Step 3: Create Featured Dishes Section

Display featured dishes fetched from the API:

```tsx
// app/page.tsx (continued)

interface FeaturedDishesSectionProps {
  dishes: any[];
}

function FeaturedDishesSection({ dishes }: FeaturedDishesSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Featured Dishes
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our chef's special selections, crafted with passion and the finest ingredients
          </p>
        </div>

        {/* Dishes Grid */}
        {dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.slice(0, 6).map((dish) => (
              <MenuCard
                key={dish.id}
                dish={dish}
                showAddToCart
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured dishes available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            View Full Menu
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

### Step 4: Create About Section

Brief introduction to the restaurant:

```tsx
// app/page.tsx (continued)

function AboutSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/restaurant-interior.jpg"
              alt="Bella Cucina restaurant interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right Column - Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Welcome to Bella Cucina
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Since 1995, Bella Cucina has been serving authentic Italian cuisine to our community.
              Our passion for traditional recipes, combined with the finest imported and local ingredients,
              creates an unforgettable dining experience.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're dining in, taking out, or ordering delivery, we bring the heart of Italy
              to your table. Each dish is prepared with love by our experienced chefs who honor the
              time-tested methods of Italian cooking.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl font-bold text-red-600">28+</div>
                <div className="text-sm text-gray-600">Years of Service</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">50+</div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">10k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Step 5: Create Features Section

Highlight key benefits and features:

```tsx
// app/page.tsx (continued)

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Fresh Ingredients',
      description: 'We source the finest ingredients daily to ensure every dish is made with the best quality produce.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fast Delivery',
      description: 'Get your favorite dishes delivered hot and fresh to your door in 30 minutes or less.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Authentic Recipes',
      description: 'Traditional Italian recipes passed down through generations and perfected by our master chefs.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Great Value',
      description: 'Enjoy restaurant-quality Italian cuisine at prices that won\'t break the bank.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Family Friendly',
      description: 'Generous portions and a diverse menu that appeals to all ages and tastes.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Easy Ordering',
      description: 'Simple online ordering system with real-time tracking and multiple payment options.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why Choose Bella Cucina?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing an exceptional dining experience from order to delivery
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 6: Create Testimonials Section

Display customer reviews:

```tsx
// app/page.tsx (continued)

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      content: 'The best Italian food I\'ve had outside of Italy! The pasta is always cooked perfectly, and the sauces are incredible. Bella Cucina has become our family\'s go-to for special occasions.',
      rating: 5,
      avatar: '/images/avatars/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Food Blogger',
      content: 'As someone who reviews restaurants professionally, I can confidently say Bella Cucina stands out. The authenticity and attention to detail in every dish is remarkable.',
      rating: 5,
      avatar: '/images/avatars/michael.jpg'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Local Resident',
      content: 'I order from Bella Cucina at least twice a week. The delivery is always fast, the food arrives hot, and the portions are generous. Highly recommend the lasagna!',
      rating: 5,
      avatar: '/images/avatars/emma.jpg'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {/* Placeholder for avatar */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 7: Create Final CTA Section

Encourage users to take action:

```tsx
// app/page.tsx (continued)

function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-red-600 to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Experience Authentic Italian Cuisine?
        </h2>
        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
          Browse our menu and place your order today. Delivery and pickup available.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-red-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
          >
            View Full Menu
          </Link>
          <a
            href="tel:555-0123"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-800 rounded-lg hover:bg-red-900 transition-colors shadow-lg hover:shadow-xl border-2 border-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call to Order
          </a>
        </div>

        {/* Hours */}
        <div className="mt-12 text-red-100">
          <p className="text-sm font-semibold mb-2">OPEN DAILY</p>
          <p className="text-lg">Mon-Thu: 11am - 10pm | Fri-Sun: 11am - 11pm</p>
        </div>
      </div>
    </section>
  );
}
```

### Step 8: Add Image Placeholders

Create a public images directory structure:

```bash
# Create directory structure
mkdir -p public/images/avatars

# Add placeholder images or use real ones
# public/images/hero-dish.jpg
# public/images/restaurant-interior.jpg
# public/images/avatars/sarah.jpg
# public/images/avatars/michael.jpg
# public/images/avatars/emma.jpg
```

### Step 9: Test the Landing Page

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test the following:
# 1. Hero section loads with proper styling
# 2. Featured dishes appear from API
# 3. All sections are responsive
# 4. Images load with proper optimization
# 5. Links navigate correctly
# 6. SEO metadata is present
```

## Complete Code Example

Here's the complete landing page implementation:

```tsx
// app/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MenuCard } from '@/components/MenuCard';

export const metadata: Metadata = {
  title: 'Bella Cucina - Authentic Italian Cuisine',
  description: 'Order authentic Italian dishes from Bella Cucina. Fresh ingredients, traditional recipes, and fast delivery. Browse our menu of pasta, pizza, and more.',
  keywords: ['Italian restaurant', 'pasta', 'pizza', 'Italian food delivery', 'authentic Italian cuisine'],
  openGraph: {
    title: 'Bella Cucina - Authentic Italian Cuisine',
    description: 'Order authentic Italian dishes from Bella Cucina. Fresh ingredients, traditional recipes, and fast delivery.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Bella Cucina',
  },
};

async function getFeaturedDishes() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/menu?featured=true`, {
      cache: 'no-store',
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch featured dishes');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching featured dishes:', error);
    return [];
  }
}

export default async function LandingPage() {
  const featuredDishes = await getFeaturedDishes();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedDishesSection dishes={featuredDishes} />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Authentic Italian
              <span className="block text-red-600">Cuisine Delivered</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0">
              Experience the rich flavors of Italy with our handcrafted dishes made from the finest ingredients.
              Order now and taste the difference.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                View Menu
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-red-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border-2 border-red-600"
              >
                Order Now
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fresh Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>500+ Reviews</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[500px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero-dish.jpg"
              alt="Delicious Italian pasta dish"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturedDishesSectionProps {
  dishes: any[];
}

function FeaturedDishesSection({ dishes }: FeaturedDishesSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Featured Dishes
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our chef's special selections, crafted with passion and the finest ingredients
          </p>
        </div>

        {dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.slice(0, 6).map((dish) => (
              <MenuCard
                key={dish.id}
                dish={dish}
                showAddToCart
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured dishes available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            View Full Menu
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/restaurant-interior.jpg"
              alt="Bella Cucina restaurant interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Welcome to Bella Cucina
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Since 1995, Bella Cucina has been serving authentic Italian cuisine to our community.
              Our passion for traditional recipes, combined with the finest imported and local ingredients,
              creates an unforgettable dining experience.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're dining in, taking out, or ordering delivery, we bring the heart of Italy
              to your table. Each dish is prepared with love by our experienced chefs who honor the
              time-tested methods of Italian cooking.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl font-bold text-red-600">28+</div>
                <div className="text-sm text-gray-600">Years of Service</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">50+</div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">10k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Fresh Ingredients',
      description: 'We source the finest ingredients daily to ensure every dish is made with the best quality produce.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fast Delivery',
      description: 'Get your favorite dishes delivered hot and fresh to your door in 30 minutes or less.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Authentic Recipes',
      description: 'Traditional Italian recipes passed down through generations and perfected by our master chefs.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Great Value',
      description: 'Enjoy restaurant-quality Italian cuisine at prices that won\'t break the bank.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Family Friendly',
      description: 'Generous portions and a diverse menu that appeals to all ages and tastes.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Easy Ordering',
      description: 'Simple online ordering system with real-time tracking and multiple payment options.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why Choose Bella Cucina?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing an exceptional dining experience from order to delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      content: 'The best Italian food I\'ve had outside of Italy! The pasta is always cooked perfectly, and the sauces are incredible. Bella Cucina has become our family\'s go-to for special occasions.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Food Blogger',
      content: 'As someone who reviews restaurants professionally, I can confidently say Bella Cucina stands out. The authenticity and attention to detail in every dish is remarkable.',
      rating: 5,
    },
    {
      name: 'Emma Rodriguez',
      role: 'Local Resident',
      content: 'I order from Bella Cucina at least twice a week. The delivery is always fast, the food arrives hot, and the portions are generous. Highly recommend the lasagna!',
      rating: 5,
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-red-600 to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Experience Authentic Italian Cuisine?
        </h2>
        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
          Browse our menu and place your order today. Delivery and pickup available.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-red-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
          >
            View Full Menu
          </Link>
          <a
            href="tel:555-0123"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-red-800 rounded-lg hover:bg-red-900 transition-colors shadow-lg hover:shadow-xl border-2 border-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call to Order
          </a>
        </div>

        <div className="mt-12 text-red-100">
          <p className="text-sm font-semibold mb-2">OPEN DAILY</p>
          <p className="text-lg">Mon-Thu: 11am - 10pm | Fri-Sun: 11am - 11pm</p>
        </div>
      </div>
    </section>
  );
}
```

## Acceptance Criteria

- [ ] Landing page renders at root path (`/`)
- [ ] Hero section displays with gradient background and CTA buttons
- [ ] Featured dishes load from API and display in grid
- [ ] All six sections (Hero, Featured, About, Features, Testimonials, CTA) are present
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Images use Next.js Image component with optimization
- [ ] SEO metadata is properly configured
- [ ] Links navigate to correct pages
- [ ] Loading state appears while fetching featured dishes
- [ ] Error handling gracefully shows empty state
- [ ] Page loads in under 3 seconds on 3G connection
- [ ] Lighthouse score > 90 for performance, accessibility, SEO

## Testing Strategy

### Manual Testing

```bash
# Test checklist
1. Navigate to http://localhost:3000
2. Verify hero section loads with proper styling
3. Check featured dishes appear (if API is working)
4. Test all CTA buttons navigate correctly
5. Resize browser to test responsive design
6. Check mobile view (iPhone, Android sizes)
7. Verify images load and are optimized
8. Test with slow network connection
9. Check console for errors
10. Verify SEO metadata in page source
```

### Automated Testing

```typescript
// __tests__/landing-page.test.tsx
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

// Mock fetch
global.fetch = jest.fn();

describe('Landing Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it('renders hero section', async () => {
    render(await LandingPage());
    expect(screen.getByText(/Authentic Italian/i)).toBeInTheDocument();
  });

  it('renders CTA buttons', async () => {
    render(await LandingPage());
    expect(screen.getByText('View Menu')).toBeInTheDocument();
  });

  it('renders features section', async () => {
    render(await LandingPage());
    expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
  });
});
```

## Common Pitfalls

### 1. Image Optimization Issues

**Problem**: Images load slowly or cause layout shift
**Solution**:
- Always use Next.js Image component
- Provide width and height or use fill with relative parent
- Use priority prop for above-the-fold images
- Optimize image files before adding to project

### 2. API Fetching Errors

**Problem**: Featured dishes don't load
**Solution**:
- Add error handling with try/catch
- Return empty array on error
- Display fallback UI when dishes array is empty
- Use proper cache configuration

### 3. Responsive Design Issues

**Problem**: Layout breaks on mobile devices
**Solution**:
- Use mobile-first approach with Tailwind
- Test all breakpoints (sm, md, lg, xl)
- Use flex and grid for flexible layouts
- Avoid fixed widths

### 4. Server Component Mistakes

**Problem**: Using client-side features in server component
**Solution**:
- Remember: Server Components by default in Next.js 15
- Don't use useState, useEffect, or event handlers without 'use client'
- Keep data fetching in Server Components
- Create separate Client Components for interactivity

## Related Tasks

- **Task 3.1**: Menu API endpoints (provides featured dishes data)
- **Task 4.2**: MenuCard component (used in featured section)
- **Task 4.3**: Header component (provides navigation)
- **Task 4.4**: Footer component (closes the page)
- **Task 5.2**: Menu page (linked from CTA buttons)

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)

---

**Task Status**: Ready for Implementation
**Last Updated**: 2026-02-09
