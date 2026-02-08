# Task 7.6: Add SEO Metadata

## Task Metadata
- **Task ID**: 7.6
- **Phase**: 7 - Polish & UX Enhancements
- **Estimated Time**: 2-3 hours
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: None
- **Assigned To**: Frontend Developer
- **Status**: Not Started

## Overview

Implement comprehensive SEO metadata for all pages of the Bella Cucina web app using Next.js Metadata API. This includes page-specific titles and descriptions, Open Graph tags for social sharing, Twitter Card tags, structured data (JSON-LD) for rich search results, sitemap generation, and robots.txt configuration. Proper SEO is essential for organic traffic and discoverability.

## Importance

### Business Impact
- **Organic Traffic**: SEO drives 53% of all website traffic
- **Cost-Effective Marketing**: Organic search is free traffic
- **Brand Visibility**: Higher rankings increase brand awareness
- **Trust and Credibility**: Good SEO signals quality to users
- **Competitive Advantage**: Outrank competitors in search

### User Experience Benefits
1. **Better Social Sharing**: Rich previews on social media
2. **Clear Search Results**: Compelling titles and descriptions
3. **Easier to Find**: Appears in relevant searches
4. **Rich Snippets**: Enhanced search results with ratings, prices, etc.

### Technical Benefits
- Better crawlability
- Improved indexing
- Clear site structure
- Enhanced discoverability
- Better analytics

## Prerequisites

### Completed Requirements
- All pages implemented
- Content finalized
- Image assets optimized

### Technical Knowledge Required
- Next.js Metadata API
- SEO best practices
- Open Graph protocol
- Schema.org structured data
- Sitemap XML format

### No Additional Packages Required
Next.js 13+ includes everything needed for metadata.

## Technical Specifications

### Metadata Requirements

#### 1. Page Titles
- **Format**: `[Page Name] | Bella Cucina`
- **Length**: 50-60 characters (max 70)
- **Include keywords** but keep natural
- **Unique for each page**

#### 2. Meta Descriptions
- **Length**: 150-160 characters (max 160)
- **Include primary keyword**
- **Compelling call-to-action**
- **Unique for each page**

#### 3. Open Graph Tags
```typescript
{
  title: 'Page Title',
  description: 'Page description',
  url: 'https://bellacucina.com/page',
  siteName: 'Bella Cucina',
  images: [{
    url: 'https://bellacucina.com/og-image.jpg',
    width: 1200,
    height: 630,
  }],
  locale: 'en_US',
  type: 'website',
}
```

#### 4. Twitter Card Tags
```typescript
{
  card: 'summary_large_image',
  title: 'Page Title',
  description: 'Page description',
  images: ['https://bellacucina.com/twitter-image.jpg'],
}
```

#### 5. Structured Data (JSON-LD)
- **Organization**: Business information
- **Restaurant**: Menu, hours, location
- **MenuItem**: Individual menu items
- **Review**: Customer reviews
- **BreadcrumbList**: Navigation hierarchy

## Implementation Guide

### Step 1: Configure Root Metadata (20 minutes)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

// Base URL from environment
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bellacucina.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Bella Cucina | Authentic Italian Restaurant',
    template: '%s | Bella Cucina', // Page title | Bella Cucina
  },
  description: 'Experience authentic Italian cuisine at Bella Cucina. Order online for delivery or pickup. Fresh pasta, wood-fired pizza, and traditional Italian dishes.',
  keywords: ['Italian restaurant', 'pizza delivery', 'pasta', 'authentic Italian food', 'online ordering'],
  authors: [{ name: 'Bella Cucina' }],
  creator: 'Bella Cucina',
  publisher: 'Bella Cucina',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Bella Cucina',
    title: 'Bella Cucina | Authentic Italian Restaurant',
    description: 'Experience authentic Italian cuisine. Order online for delivery or pickup.',
    images: [
      {
        url: '/og-image.jpg', // 1200x630px
        width: 1200,
        height: 630,
        alt: 'Bella Cucina Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bella Cucina | Authentic Italian Restaurant',
    description: 'Experience authentic Italian cuisine. Order online for delivery or pickup.',
    images: ['/twitter-image.jpg'], // 1200x630px
    creator: '@bellacucina',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Step 2: Add Page-Specific Metadata (30 minutes)

```typescript
// app/menu/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Browse our authentic Italian menu featuring fresh pasta, wood-fired pizzas, and traditional Italian dishes. Order online for delivery or pickup.',
  keywords: ['Italian menu', 'pizza menu', 'pasta dishes', 'Italian food online'],
  openGraph: {
    title: 'Menu | Bella Cucina',
    description: 'Browse our authentic Italian menu. Order online for delivery.',
    url: '/menu',
    images: [
      {
        url: '/og-menu.jpg',
        width: 1200,
        height: 630,
        alt: 'Bella Cucina Menu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu | Bella Cucina',
    description: 'Browse our authentic Italian menu. Order online for delivery.',
    images: ['/twitter-menu.jpg'],
  },
}

export default function MenuPage() {
  return <div>{/* Menu content */}</div>
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Bella Cucina\'s story, our commitment to authentic Italian cuisine, and our passion for bringing Italy to your table.',
  openGraph: {
    title: 'About Us | Bella Cucina',
    description: 'Learn about our story and commitment to authentic Italian cuisine.',
    url: '/about',
    images: ['/og-about.jpg'],
  },
}

// app/contact/page.tsx
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Bella Cucina. Visit us, call for reservations, or send us a message. We\'re here to serve you.',
  openGraph: {
    title: 'Contact Us | Bella Cucina',
    description: 'Get in touch with Bella Cucina for reservations and inquiries.',
    url: '/contact',
  },
}

// app/orders/[id]/page.tsx - Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const order = await fetchOrder(params.id)

  return {
    title: `Order #${order.id}`,
    description: `View details for your order #${order.id} placed on ${new Date(order.createdAt).toLocaleDateString()}`,
    robots: {
      index: false, // Don't index private order pages
      follow: false,
    },
  }
}
```

### Step 3: Add Structured Data (45 minutes)

```typescript
// components/structured-data.tsx
import Script from 'next/script'

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bella Cucina',
    image: 'https://bellacucina.com/logo.jpg',
    '@id': 'https://bellacucina.com',
    url: 'https://bellacucina.com',
    telephone: '+1-555-123-4567',
    priceRange: '$$',
    servesCuisine: 'Italian',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'City',
      addressRegion: 'ST',
      postalCode: '12345',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '12:00',
        closes: '23:00',
      },
    ],
    menu: 'https://bellacucina.com/menu',
    acceptsReservations: true,
  }

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// components/menu-item-structured-data.tsx
interface MenuItemStructuredDataProps {
  item: {
    name: string
    description: string
    price: number
    image: string
    category: string
  }
}

export function MenuItemStructuredData({ item }: MenuItemStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: item.name,
    description: item.description,
    image: item.image,
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    menuAddOn: {
      '@type': 'MenuSection',
      name: item.category,
    },
  }

  return (
    <Script
      id={`menu-item-${item.name}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// components/breadcrumb-structured-data.tsx
interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://bellacucina.com${item.href}`,
    })),
  }

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Usage in layout
// app/layout.tsx
import { OrganizationStructuredData } from '@/components/structured-data'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <OrganizationStructuredData />
      </body>
    </html>
  )
}

// Usage in menu page
// app/menu/page.tsx
import { BreadcrumbStructuredData } from '@/components/breadcrumb-structured-data'

export default function MenuPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
  ]

  return (
    <div>
      <BreadcrumbStructuredData items={breadcrumbs} />
      {/* Menu content */}
    </div>
  )
}
```

### Step 4: Generate Sitemap (30 minutes)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { fetchMenuItems } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bellacucina.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic pages (menu items)
  const menuItems = await fetchMenuItems()
  const menuPages = menuItems.map((item) => ({
    url: `${baseUrl}/menu/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...menuPages]
}

// Alternative: Multiple sitemaps for large sites
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bellacucina.com',
      lastModified: new Date(),
    },
  ]
}

// app/menu/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await fetchMenuItems()

  return items.map((item) => ({
    url: `https://bellacucina.com/menu/${item.slug}`,
    lastModified: new Date(item.updatedAt),
  }))
}
```

### Step 5: Configure Robots.txt (10 minutes)

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bellacucina.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/orders/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/orders/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

// Alternative: Static robots.txt
// public/robots.txt
/*
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /orders/
Disallow: /_next/

Sitemap: https://bellacucina.com/sitemap.xml
*/
```

### Step 6: Add Canonical URLs (15 minutes)

```typescript
// app/menu/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Browse our menu',
  alternates: {
    canonical: '/menu',
  },
}

// For pages with query parameters
// app/menu/page.tsx
export async function generateMetadata({ searchParams }: { searchParams: { category?: string } }): Promise<Metadata> {
  return {
    title: 'Menu',
    description: 'Browse our menu',
    alternates: {
      canonical: '/menu', // Always point to base URL, not /menu?category=pizza
    },
  }
}

// For pagination
export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Promise<Metadata> {
  const page = searchParams.page || '1'

  return {
    title: `Menu - Page ${page}`,
    description: 'Browse our menu',
    alternates: {
      canonical: `/menu?page=${page}`,
    },
  }
}
```

### Step 7: Create OG Images (20 minutes)

```typescript
// app/og/route.tsx - Dynamic OG image generation
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Bella Cucina'

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom, #dc2626, #991b1b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ marginTop: 40 }}>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

// Usage in metadata
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/og?title=Menu',
        width: 1200,
        height: 630,
      },
    ],
  },
}
```

## Code Examples

### Example 1: Complete Menu Item Page with SEO

```typescript
// app/menu/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchMenuItem } from '@/lib/api'
import { MenuItemStructuredData } from '@/components/menu-item-structured-data'
import { BreadcrumbStructuredData } from '@/components/breadcrumb-structured-data'

interface PageProps {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await fetchMenuItem(params.slug)

  if (!item) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: item.name,
    description: `${item.description}. Order ${item.name} online for delivery or pickup at Bella Cucina.`,
    keywords: [item.name, 'Italian food', item.category, 'order online'],
    openGraph: {
      title: `${item.name} | Bella Cucina`,
      description: item.description,
      url: `/menu/${item.slug}`,
      type: 'website',
      images: [
        {
          url: item.image,
          width: 1200,
          height: 630,
          alt: item.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.name} | Bella Cucina`,
      description: item.description,
      images: [item.image],
    },
    alternates: {
      canonical: `/menu/${item.slug}`,
    },
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  const items = await fetchMenuItems()

  return items.map((item) => ({
    slug: item.slug,
  }))
}

export default async function MenuItemPage({ params }: PageProps) {
  const item = await fetchMenuItem(params.slug)

  if (!item) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: item.name, href: `/menu/${item.slug}` },
  ]

  return (
    <div>
      <MenuItemStructuredData item={item} />
      <BreadcrumbStructuredData items={breadcrumbs} />

      <article>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        {/* Rest of content */}
      </article>
    </div>
  )
}
```

### Example 2: Blog Post with Rich Metadata

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBlogPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [post.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPost(params.slug)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bella Cucina',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bellacucina.com/logo.jpg',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  }

  return (
    <article>
      <Script
        id="blog-post-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

## Acceptance Criteria

### Metadata
- [ ] All pages have unique titles
- [ ] All pages have unique descriptions
- [ ] Titles are 50-60 characters
- [ ] Descriptions are 150-160 characters
- [ ] Keywords included naturally

### Open Graph
- [ ] All pages have OG tags
- [ ] OG images are 1200x630px
- [ ] OG titles and descriptions set
- [ ] URL and siteName configured

### Twitter Cards
- [ ] Twitter Card tags on all pages
- [ ] summary_large_image card type
- [ ] Twitter images optimized

### Structured Data
- [ ] Organization schema added
- [ ] Restaurant schema added
- [ ] MenuItem schema on menu items
- [ ] BreadcrumbList on all pages
- [ ] No errors in Rich Results Test

### Technical SEO
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Canonical URLs set
- [ ] No duplicate content
- [ ] Proper heading hierarchy

### Testing
- [ ] Google Rich Results Test passes
- [ ] Schema.org validator passes
- [ ] Facebook Sharing Debugger validates
- [ ] Twitter Card Validator validates
- [ ] Google Search Console indexed

## Testing Strategy

### SEO Testing Tools

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test all structured data

2. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Validate JSON-LD

3. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test Open Graph tags

4. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Test Twitter Cards

5. **Google Search Console**
   - Submit sitemap
   - Check indexing status
   - Monitor performance

### Testing Checklist
```bash
# Build and test locally
npm run build
npm run start

# Test URLs:
# https://localhost:3000 - Homepage
# https://localhost:3000/menu - Menu page
# https://localhost:3000/sitemap.xml - Sitemap
# https://localhost:3000/robots.txt - Robots

# View source and check:
# - Meta tags present
# - OG tags correct
# - Structured data valid
# - No errors in console
```

## Common Pitfalls

### 1. Missing metadataBase
**Problem**: Relative URLs in metadata

**Solution**: Set metadataBase in root layout
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://bellacucina.com'),
}
```

### 2. Duplicate Titles/Descriptions
**Problem**: Same metadata on multiple pages

**Solution**: Make each page unique
```typescript
// Bad
export const metadata = {
  title: 'Bella Cucina',
  description: 'Italian restaurant',
}

// Good
export const metadata = {
  title: 'Menu',
  description: 'Browse our authentic Italian menu with fresh pasta and pizza',
}
```

### 3. Wrong OG Image Size
**Problem**: Images not 1200x630px

**Solution**: Create proper OG images
```bash
# Create OG images at correct size
1200px x 630px
```

### 4. Not Testing Structured Data
**Problem**: Invalid JSON-LD

**Solution**: Always test with Google Rich Results Test

### 5. Blocking Important Pages
**Problem**: robots.txt blocks pages that should be indexed

**Solution**: Review robots.txt carefully
```txt
# Allow important pages
User-agent: *
Allow: /
Disallow: /admin/
```

## Related Tasks

### Dependencies
- None

### Related Tasks
- **Task 7.5**: Performance optimization includes image optimization for OG images

## Resources

### Documentation
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)

### Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org/)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Learning
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)

## Completion Checklist

- [ ] Root metadata configured
- [ ] Page-specific metadata added to all pages
- [ ] Open Graph tags implemented
- [ ] Twitter Card tags implemented
- [ ] Organization structured data added
- [ ] Restaurant structured data added
- [ ] MenuItem structured data added
- [ ] Breadcrumb structured data added
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Canonical URLs set
- [ ] OG images created (1200x630px)
- [ ] Rich Results Test passed
- [ ] Schema validator passed
- [ ] Facebook debugger validated
- [ ] Twitter validator validated
- [ ] Sitemap submitted to Google Search Console
- [ ] Documentation updated
- [ ] Code review completed

## Next Steps

After completing this task:
1. Move to Task 7.7 (Mobile Responsiveness Testing)
2. Submit sitemap to Google Search Console
3. Monitor search performance
4. Set up Google Analytics
5. Track organic traffic growth
6. Regularly update structured data
