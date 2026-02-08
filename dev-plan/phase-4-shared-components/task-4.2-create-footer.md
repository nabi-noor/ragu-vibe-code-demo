# Task 4.2: Create Footer Component

## Task Metadata

- **Task ID**: 4.2
- **Phase**: 4 - Shared Components
- **Complexity**: Low
- **Estimated Time**: 1-1.5 hours
- **Priority**: Medium
- **Dependencies**: Phase 1 (Setup)
- **Component Type**: Server Component (static content)

## Overview

The Footer component provides essential information and secondary navigation at the bottom of every page. It serves as the closing element of the user interface, offering contact information, legal links, social media connections, and reinforcing brand identity. Unlike the Navbar, the Footer is primarily informational and doesn't require complex interactivity.

### Importance

- **Brand Reinforcement**: Displays restaurant name, tagline, and identity
- **Contact Information**: Provides address, phone, email, hours
- **Secondary Navigation**: Links to important pages and policies
- **Social Proof**: Social media links for community engagement
- **Legal Compliance**: Privacy policy, terms of service links
- **Professional Appearance**: Completes the page layout

### User Experience Goals

1. **Easy Access**: Contact info readily available on every page
2. **Trust Building**: Professional footer increases credibility
3. **Quick Links**: Fast access to important pages
4. **Social Connection**: Easy path to social media presence
5. **Mobile Friendly**: Responsive layout for all screen sizes

## Prerequisites

### Required Completions

- ✅ Phase 1 completed (Next.js 15, TypeScript, Tailwind CSS setup)
- ✅ Basic understanding of Next.js App Router
- ✅ lucide-react package installed (for icons)

### Required Knowledge

- React component basics
- Tailwind CSS grid and responsive utilities
- Next.js Link component
- TypeScript (optional for this simple component)
- Semantic HTML

### Verify Prerequisites

```bash
# Check if lucide-react is installed
grep "lucide-react" package.json

# Verify app structure
ls -la app/

# Run development server
npm run dev
```

## Technical Specifications

### Component Architecture

```
Footer (Server Component)
├── Container
│   ├── Grid Layout (4 columns on desktop, 1-2 on mobile)
│   │   ├── Brand Section
│   │   │   ├── Restaurant Name
│   │   │   ├── Tagline
│   │   │   └── Description
│   │   ├── Quick Links Section
│   │   │   └── Navigation Links
│   │   ├── Contact Section
│   │   │   ├── Address
│   │   │   ├── Phone
│   │   │   ├── Email
│   │   │   └── Hours
│   │   └── Follow Us Section
│   │       └── Social Media Links
│   └── Copyright Bar
│       ├── Copyright Text
│       └── Legal Links
```

### Responsive Behavior

- **Mobile (< 640px)**: Single column stack
- **Tablet (640px - 1024px)**: Two column grid
- **Desktop (>= 1024px)**: Four column grid

### Styling Theme

- **Background**: Warm amber-50 (light amber background)
- **Text**: Gray-700 for body, gray-900 for headings
- **Links**: Hover transitions to amber-600
- **Icons**: Amber-600 for social media
- **Border**: Top border with amber-200
- **Spacing**: Generous padding for readability

## Component Interface

### Props

The Footer component doesn't accept props as it contains static content.

```typescript
// No props interface needed
export default function Footer() {
  // Component implementation
}
```

### Content Structure

```typescript
// Restaurant Information
const restaurantInfo = {
  name: 'Bella Cucina',
  tagline: 'Authentic Italian Cuisine',
  description: 'Experience the taste of Italy in every bite.',
  address: '123 Main Street, Downtown, NY 10001',
  phone: '(555) 123-4567',
  email: 'info@bellacucina.com',
  hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
}

// Navigation Links
const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/orders', label: 'Orders' },
  { href: '/about', label: 'About Us' },
]

// Social Media Links
const socialLinks = [
  { name: 'Facebook', url: '#', icon: Facebook },
  { name: 'Instagram', url: '#', icon: Instagram },
  { name: 'Twitter', url: '#', icon: Twitter },
]

// Legal Links
const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]
```

## Files to Create/Modify

### Create New File

```
app/components/Footer.tsx
```

### Modify Existing Files

```
app/layout.tsx (integrate Footer into layout)
```

## Step-by-Step Implementation

### Step 1: Create Component File

```bash
touch app/components/Footer.tsx
```

### Step 2: Import Dependencies

```typescript
import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react'
```

**Explanation**:
- `Link`: Next.js optimized navigation component
- Icons from `lucide-react`: Visual elements for contact info and social media
- No `'use client'` directive needed - this is a server component (static content)

### Step 3: Define Content Data

```typescript
const restaurantInfo = {
  name: 'Bella Cucina',
  tagline: 'Authentic Italian Cuisine',
  description: 'Experience the taste of Italy in every bite. Fresh ingredients, traditional recipes, and passionate cooking.',
  address: '123 Main Street, Downtown, NY 10001',
  phone: '(555) 123-4567',
  email: 'info@bellacucina.com',
  hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
}

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/orders', label: 'My Orders' },
  { href: '/about', label: 'About Us' },
]

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: Facebook,
    ariaLabel: 'Visit our Facebook page',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: Instagram,
    ariaLabel: 'Follow us on Instagram',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: Twitter,
    ariaLabel: 'Follow us on Twitter',
  },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]
```

**Note**: In a production app, this data might come from a CMS or configuration file.

### Step 4: Implement Main Component Structure

```typescript
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-amber-50 border-t border-amber-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          {/* Quick Links Section */}
          {/* Contact Section */}
          {/* Follow Us Section */}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-amber-200 bg-amber-100">
        {/* Copyright content */}
      </div>
    </footer>
  )
}
```

**Explanation**:
- `bg-amber-50`: Light amber background for warmth
- `border-t border-amber-200`: Subtle top border
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`: Responsive grid
- `gap-8`: Consistent spacing between sections
- Two-tier structure: Main content + copyright bar

### Step 5: Implement Brand Section

```typescript
{/* Brand Section */}
<div className="space-y-4">
  <div>
    <h3 className="text-2xl font-bold text-amber-600">
      {restaurantInfo.name}
    </h3>
    <p className="text-sm font-medium text-gray-600 mt-1">
      {restaurantInfo.tagline}
    </p>
  </div>
  <p className="text-sm text-gray-600 leading-relaxed">
    {restaurantInfo.description}
  </p>
</div>
```

**Key Features**:
- **Brand Name**: Large, bold, in primary amber color
- **Tagline**: Smaller, medium weight for hierarchy
- **Description**: Readable line height and color
- **Spacing**: `space-y-4` for vertical rhythm

### Step 6: Implement Quick Links Section

```typescript
{/* Quick Links Section */}
<div>
  <h4 className="text-lg font-bold text-gray-900 mb-4">
    Quick Links
  </h4>
  <ul className="space-y-2">
    {quickLinks.map((link) => (
      <li key={link.href}>
        <Link
          href={link.href}
          className="text-sm text-gray-600 hover:text-amber-600 transition-colors inline-block"
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

**Key Features**:
- **Section Heading**: Clear hierarchy with bold text
- **Link List**: Vertical stack with consistent spacing
- **Hover Effect**: Smooth color transition to amber
- **Semantic HTML**: Uses `ul` and `li` elements

### Step 7: Implement Contact Section

```typescript
{/* Contact Section */}
<div>
  <h4 className="text-lg font-bold text-gray-900 mb-4">
    Contact Us
  </h4>
  <ul className="space-y-3">
    {/* Address */}
    <li className="flex items-start space-x-3 text-sm text-gray-600">
      <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <span>{restaurantInfo.address}</span>
    </li>

    {/* Phone */}
    <li className="flex items-start space-x-3 text-sm text-gray-600">
      <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <a
        href={`tel:${restaurantInfo.phone.replace(/\D/g, '')}`}
        className="hover:text-amber-600 transition-colors"
      >
        {restaurantInfo.phone}
      </a>
    </li>

    {/* Email */}
    <li className="flex items-start space-x-3 text-sm text-gray-600">
      <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <a
        href={`mailto:${restaurantInfo.email}`}
        className="hover:text-amber-600 transition-colors"
      >
        {restaurantInfo.email}
      </a>
    </li>

    {/* Hours */}
    <li className="flex items-start space-x-3 text-sm text-gray-600">
      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <span>{restaurantInfo.hours}</span>
    </li>
  </ul>
</div>
```

**Key Features**:
- **Icons**: Visual indicators in amber color
- **Clickable Links**: Phone and email are interactive
- **Alignment**: Icons aligned with text using flexbox
- **flex-shrink-0**: Prevents icon squashing on small screens
- **mt-0.5**: Fine-tuned vertical alignment

### Step 8: Implement Social Media Section

```typescript
{/* Follow Us Section */}
<div>
  <h4 className="text-lg font-bold text-gray-900 mb-4">
    Follow Us
  </h4>
  <div className="flex space-x-4">
    {socialLinks.map((social) => {
      const Icon = social.icon
      return (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all"
          aria-label={social.ariaLabel}
        >
          <Icon className="w-5 h-5" />
        </a>
      )
    })}
  </div>
  <p className="text-xs text-gray-500 mt-4">
    Stay updated with our latest dishes and special offers!
  </p>
</div>
```

**Key Features**:
- **Icon Buttons**: Circular buttons with border
- **Hover Effect**: Fill with amber color on hover
- **External Links**: `target="_blank"` and `rel="noopener noreferrer"`
- **Accessibility**: aria-label for screen readers
- **Call to Action**: Encouraging text below icons

### Step 9: Implement Copyright Bar

```typescript
{/* Copyright Bar */}
<div className="border-t border-amber-200 bg-amber-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
      {/* Copyright Text */}
      <p className="text-sm text-gray-600">
        © {currentYear} {restaurantInfo.name}. All rights reserved.
      </p>

      {/* Legal Links */}
      <div className="flex space-x-6">
        {legalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
</div>
```

**Key Features**:
- **Dynamic Year**: Uses `new Date().getFullYear()`
- **Responsive Layout**: Stacks on mobile, horizontal on desktop
- **Legal Links**: Privacy and terms easily accessible
- **Darker Background**: `bg-amber-100` for visual separation

## Complete Component Code

```typescript
import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react'

const restaurantInfo = {
  name: 'Bella Cucina',
  tagline: 'Authentic Italian Cuisine',
  description: 'Experience the taste of Italy in every bite. Fresh ingredients, traditional recipes, and passionate cooking.',
  address: '123 Main Street, Downtown, NY 10001',
  phone: '(555) 123-4567',
  email: 'info@bellacucina.com',
  hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
}

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/orders', label: 'My Orders' },
  { href: '/about', label: 'About Us' },
]

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: Facebook,
    ariaLabel: 'Visit our Facebook page',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: Instagram,
    ariaLabel: 'Follow us on Instagram',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: Twitter,
    ariaLabel: 'Follow us on Twitter',
  },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-amber-50 border-t border-amber-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-amber-600">
                {restaurantInfo.name}
              </h3>
              <p className="text-sm font-medium text-gray-600 mt-1">
                {restaurantInfo.tagline}
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {restaurantInfo.description}
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-amber-600 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {/* Address */}
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{restaurantInfo.address}</span>
              </li>

              {/* Phone */}
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\D/g, '')}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {restaurantInfo.phone}
                </a>
              </li>

              {/* Email */}
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {restaurantInfo.email}
                </a>
              </li>

              {/* Hours */}
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{restaurantInfo.hours}</span>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all"
                    aria-label={social.ariaLabel}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Stay updated with our latest dishes and special offers!
            </p>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-amber-200 bg-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            {/* Copyright Text */}
            <p className="text-sm text-gray-600">
              © {currentYear} {restaurantInfo.name}. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

## Integration with Layout

Update `app/layout.tsx` to include the Footer:

```typescript
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
```

**Key Points**:
- `flex flex-col min-h-screen`: Full viewport height layout
- `flex-grow` on main: Pushes footer to bottom
- Footer always at bottom, even on short pages

## Acceptance Criteria

### Functional Requirements

- ✅ Footer displays on all pages
- ✅ All navigation links work correctly
- ✅ Phone number opens dialer on mobile
- ✅ Email address opens email client
- ✅ Social media links open in new tab
- ✅ Legal links navigate to correct pages
- ✅ Copyright year updates automatically

### Responsive Requirements

- ✅ Single column on mobile (<640px)
- ✅ Two columns on tablet (640px-1023px)
- ✅ Four columns on desktop (1024px+)
- ✅ All text readable on all screen sizes
- ✅ Icons properly sized and aligned
- ✅ No content overflow or horizontal scroll

### Accessibility Requirements

- ✅ Semantic HTML structure (footer, nav, ul/li)
- ✅ Social media links have aria-labels
- ✅ External links have rel="noopener noreferrer"
- ✅ Color contrast meets WCAG AA standards
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators visible on links

### Visual Requirements

- ✅ Follows design system color palette
- ✅ Consistent spacing and typography
- ✅ Smooth hover transitions
- ✅ Icons visually balanced with text
- ✅ Border separates footer from content
- ✅ Copyright bar visually distinct

## Testing Strategy

### Manual Testing

1. **Desktop Layout (1280px)**
   ```
   - Verify four columns display correctly
   - Check all links are clickable
   - Verify hover effects work
   - Check icon alignment
   - Verify copyright bar layout
   ```

2. **Tablet Layout (768px)**
   ```
   - Verify two columns display
   - Check content doesn't overflow
   - Verify spacing looks good
   - Test all interactive elements
   ```

3. **Mobile Layout (375px)**
   ```
   - Verify single column stack
   - Check text is readable
   - Verify icons don't overlap
   - Test touch targets (min 44x44px)
   - Check copyright bar stacks properly
   ```

4. **Link Functionality**
   ```
   - Click all Quick Links, verify navigation
   - Click phone number on mobile, verify dialer opens
   - Click email address, verify email client opens
   - Click social media links, verify new tab opens
   - Click legal links, verify navigation
   ```

5. **Accessibility**
   ```
   - Tab through all links
   - Verify focus indicators visible
   - Test with screen reader
   - Verify social link labels announced
   - Check color contrast ratios
   ```

### Visual Regression Testing

Take screenshots at:
- 375px (Mobile)
- 768px (Tablet)
- 1280px (Desktop)

Compare against design mockups.

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Common Pitfalls

### Pitfall 1: Footer Not Sticking to Bottom

**Problem**: Footer appears mid-page on short content.

**Cause**: Missing flex layout on body/html.

**Solution**:
```typescript
// In layout.tsx
<div className="flex flex-col min-h-screen">
  <Navbar />
  <main className="flex-grow">{children}</main>
  <Footer />
</div>
```

### Pitfall 2: Icons Not Importing

**Problem**: Icons don't render or show errors.

**Cause**: lucide-react not installed or wrong import.

**Solution**:
```bash
npm install lucide-react
```

```typescript
import { Facebook, Instagram, Twitter } from 'lucide-react'
```

### Pitfall 3: Phone Link Doesn't Work

**Problem**: Clicking phone number doesn't open dialer.

**Cause**: Incorrect tel: format or missing digits.

**Solution**:
```typescript
<a href={`tel:${restaurantInfo.phone.replace(/\D/g, '')}`}>
  {restaurantInfo.phone}
</a>
// replace(/\D/g, '') removes non-digits for tel: protocol
```

### Pitfall 4: Social Links Open in Same Tab

**Problem**: Social links replace current page.

**Cause**: Missing `target="_blank"`.

**Solution**:
```typescript
<a
  href={social.url}
  target="_blank"
  rel="noopener noreferrer"
>
```

### Pitfall 5: Grid Doesn't Respond

**Problem**: Layout doesn't change on different screen sizes.

**Cause**: Missing or incorrect responsive classes.

**Solution**:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// grid-cols-1: default (mobile)
// sm:grid-cols-2: tablet (640px+)
// lg:grid-cols-4: desktop (1024px+)
```

### Pitfall 6: Icons Misaligned with Text

**Problem**: Icons don't line up with text properly.

**Cause**: Missing flex alignment or shrink prevention.

**Solution**:
```typescript
<li className="flex items-start space-x-3">
  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
  <span>Text content here</span>
</li>
// flex-shrink-0: prevents icon from shrinking
// mt-0.5: fine-tune vertical alignment
```

### Pitfall 7: Copyright Year Not Updating

**Problem**: Year shows hardcoded value instead of current year.

**Cause**: Forgot to use `new Date().getFullYear()`.

**Solution**:
```typescript
const currentYear = new Date().getFullYear()

// In JSX
<p>© {currentYear} Bella Cucina. All rights reserved.</p>
```

## Enhancement Ideas

### 1. Newsletter Signup

Add email subscription form:

```typescript
<div>
  <h4 className="text-lg font-bold text-gray-900 mb-4">
    Newsletter
  </h4>
  <form className="space-y-2">
    <input
      type="email"
      placeholder="Enter your email"
      className="w-full px-4 py-2 rounded-lg border"
    />
    <button className="w-full bg-amber-600 text-white py-2 rounded-lg">
      Subscribe
    </button>
  </form>
</div>
```

### 2. Download App Links

Add mobile app buttons:

```typescript
<div className="flex space-x-2 mt-4">
  <a href="#">
    <img src="/app-store.png" alt="Download on App Store" />
  </a>
  <a href="#">
    <img src="/play-store.png" alt="Get it on Google Play" />
  </a>
</div>
```

### 3. Location Map

Embed Google Maps:

```typescript
<div className="mt-4">
  <a
    href="https://maps.google.com/?q=123+Main+Street"
    target="_blank"
    className="text-sm text-amber-600 hover:underline"
  >
    View on Google Maps →
  </a>
</div>
```

### 4. Payment Methods

Show accepted payment icons:

```typescript
<div className="flex space-x-2 items-center">
  <CreditCard className="w-8 h-8 text-gray-400" />
  <span className="text-xs text-gray-500">
    We accept Visa, Mastercard, Amex
  </span>
</div>
```

### 5. Language Selector

Add i18n support:

```typescript
<select className="text-sm border rounded px-2 py-1">
  <option value="en">English</option>
  <option value="it">Italiano</option>
  <option value="es">Español</option>
</select>
```

## Configuration Options

### External Content File

For easier maintenance, move content to separate file:

```typescript
// app/config/footer-content.ts
export const footerContent = {
  restaurant: {
    name: 'Bella Cucina',
    tagline: 'Authentic Italian Cuisine',
    // ... rest of info
  },
  links: {
    quick: [...],
    social: [...],
    legal: [...],
  },
}

// In Footer.tsx
import { footerContent } from '../config/footer-content'
```

### Environment Variables

Use env vars for dynamic content:

```typescript
// .env.local
NEXT_PUBLIC_RESTAURANT_PHONE=(555) 123-4567
NEXT_PUBLIC_RESTAURANT_EMAIL=info@bellacucina.com

// In Footer.tsx
const phone = process.env.NEXT_PUBLIC_RESTAURANT_PHONE
const email = process.env.NEXT_PUBLIC_RESTAURANT_EMAIL
```

## Related Tasks

- **Task 4.1**: Create Navbar Component (layout companion)
- **Phase 5**: Page implementations that use this footer
- **Future**: About Us page (linked from footer)
- **Future**: Privacy Policy page (linked from footer)
- **Future**: Terms of Service page (linked from footer)

## Troubleshooting

### Issue: Icons Not Displaying

**Solution**: Verify lucide-react installation:
```bash
npm list lucide-react
npm install lucide-react
```

### Issue: Links Not Working

**Solution**: Check Next.js Link usage:
```typescript
import Link from 'next/link'
<Link href="/menu">Menu</Link>
```

### Issue: Layout Breaking on Mobile

**Solution**: Verify responsive grid classes:
```typescript
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
```

### Issue: Footer Has White Space Below

**Solution**: Check for extra padding/margin:
```css
/* Verify no extra spacing in layout.tsx */
<Footer /> {/* No extra div wrappers */}
```

## Resources

- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [Lucide React Icons](https://lucide.dev/)
- [Semantic HTML Footer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## Completion Checklist

- [ ] Component file created at `app/components/Footer.tsx`
- [ ] All imports added correctly
- [ ] Content data defined
- [ ] Brand section implemented
- [ ] Quick links section implemented
- [ ] Contact section with icons implemented
- [ ] Social media section implemented
- [ ] Copyright bar implemented
- [ ] Integrated into app/layout.tsx
- [ ] Manual testing complete
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] All links tested and working
- [ ] Phone and email links functional
- [ ] Accessibility audit passed
- [ ] No console warnings or errors
- [ ] Footer sticks to bottom on short pages

**Task Complete**: When all checklist items are ✅, proceed to Task 4.3!
