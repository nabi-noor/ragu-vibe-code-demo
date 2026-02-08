# Phase 5: Customer-Facing Pages

## Overview

Phase 5 focuses on building the complete customer-facing experience for the Bella Cucina restaurant web application. This phase creates all public-facing pages that customers will interact with, from browsing the menu to completing an order. These pages leverage the API routes, cart context, and shared components built in previous phases to deliver a seamless ordering experience.

## Objectives

1. **Create an engaging landing page** that showcases the restaurant's brand, featured dishes, and customer testimonials
2. **Build a comprehensive menu page** with filtering, search, and category navigation
3. **Implement a shopping cart page** with quantity controls and order summary
4. **Develop a checkout flow** with form validation and payment processing
5. **Design an order confirmation page** with real-time order status updates
6. **Ensure responsive design** across all pages for mobile, tablet, and desktop
7. **Optimize for SEO** with proper metadata and semantic HTML
8. **Implement error handling** and user feedback through toast notifications

## Phase Dependencies

### Prerequisites (Must be completed first)
- **Phase 1**: Project Setup and Configuration
- **Phase 2**: Database Schema and Models
- **Phase 3**: API Routes and Backend Logic
- **Phase 4**: Shared Components and Context

### What This Phase Provides
- Complete customer-facing user interface
- Seamless ordering workflow
- Real-time order tracking
- Responsive, mobile-first design
- Foundation for Phase 6 (Admin Dashboard)

## Task Breakdown

### Task 5.1: Create Landing Page
**File**: `task-5.1-create-landing-page.md`
**Estimated Time**: 3-4 hours
**Priority**: High

Build the homepage featuring:
- Hero section with call-to-action
- Featured dishes carousel
- Restaurant highlights (hours, location, contact)
- Customer testimonials
- Newsletter signup form

**Key Components**:
- `app/page.tsx` - Landing page
- Hero banner with animated elements
- Responsive grid layout
- Image optimization with Next.js Image

### Task 5.2: Create Menu Page
**File**: `task-5.2-create-menu-page.md`
**Estimated Time**: 4-5 hours
**Priority**: High

Build the menu browsing experience:
- Category filtering (Appetizers, Mains, Desserts, Drinks)
- Search functionality
- Grid/list view toggle
- Dish cards with add-to-cart functionality
- Loading states and error handling

**Key Components**:
- `app/menu/page.tsx` - Menu page
- Search and filter controls
- MenuCard integration
- Responsive grid layout

### Task 5.3: Create Cart Page
**File**: `task-5.3-create-cart-page.md`
**Estimated Time**: 3-4 hours
**Priority**: High

Build the shopping cart interface:
- Cart items list with quantity controls
- Order summary with calculations
- Promo code input
- Proceed to checkout button
- Empty cart state

**Key Components**:
- `app/cart/page.tsx` - Cart page
- CartItem component integration
- Real-time price calculations
- Responsive layout

### Task 5.4: Create Checkout Page
**File**: `task-5.4-create-checkout-page.md`
**Estimated Time**: 4-5 hours
**Priority**: High

Build the checkout flow:
- Customer information form
- Delivery address input
- Order type selection (Delivery/Pickup)
- Payment method selection
- Form validation
- Order submission

**Key Components**:
- `app/checkout/page.tsx` - Checkout page
- Multi-step form or single page
- Client-side validation
- Server action integration
- Loading and error states

### Task 5.5: Create Order Confirmation Page
**File**: `task-5.5-create-order-confirmation.md`
**Estimated Time**: 2-3 hours
**Priority**: High

Build the post-order experience:
- Order confirmation details
- Real-time status updates with polling
- Estimated delivery/pickup time
- Order summary
- Track order functionality

**Key Components**:
- `app/orders/[id]/page.tsx` - Order confirmation page
- Real-time polling with setInterval
- Status badge component
- Responsive timeline view

## Technical Specifications

### Architecture Overview

```
app/
├── page.tsx                    # Task 5.1 - Landing Page
├── menu/
│   └── page.tsx               # Task 5.2 - Menu Page
├── cart/
│   └── page.tsx               # Task 5.3 - Cart Page
├── checkout/
│   └── page.tsx               # Task 5.4 - Checkout Page
└── orders/
    └── [id]/
        └── page.tsx           # Task 5.5 - Order Confirmation
```

### Key Technologies

- **Next.js 15 App Router**: File-based routing with React Server Components
- **React Server Components**: Default for data fetching and static content
- **React Client Components**: For interactivity (forms, cart, real-time updates)
- **Tailwind CSS**: Responsive utility-first styling
- **React Context**: Cart state management
- **Zod**: Form validation schemas
- **React Hook Form**: Form state management
- **Toast Notifications**: User feedback with react-hot-toast

### Design Principles

1. **Mobile-First**: Design for mobile, enhance for larger screens
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Performance**: Optimize images, minimize JavaScript, use streaming
4. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
5. **SEO**: Metadata, structured data, semantic markup
6. **Error Handling**: Graceful degradation, helpful error messages

## Data Flow

### Customer Journey

```
Landing Page → Menu Page → Cart Page → Checkout Page → Order Confirmation
     ↓              ↓           ↓             ↓                ↓
  View Menu    Add Items   Review Cart   Submit Order   Track Status
```

### State Management

```
CartContext (Global State)
├── Cart Items
├── Add to Cart
├── Update Quantity
├── Remove Item
└── Clear Cart

Page-Level State
├── Loading States
├── Error States
├── Form Data
└── Polling Interval
```

### API Integration

Each page interacts with specific API routes:

- **Landing Page**: `/api/menu` (featured dishes)
- **Menu Page**: `/api/menu` (all dishes with filters)
- **Cart Page**: No direct API (uses context)
- **Checkout Page**: `/api/orders` (create order)
- **Order Confirmation**: `/api/orders/[id]` (order details and status)

## Implementation Strategy

### Phase 5.1: Core Pages (Tasks 5.1-5.3)
1. Build landing page structure and content
2. Implement menu browsing with filtering
3. Create cart review interface
4. **Duration**: 10-13 hours

### Phase 5.2: Checkout and Confirmation (Tasks 5.4-5.5)
1. Build checkout form with validation
2. Implement order submission
3. Create order confirmation with polling
4. **Duration**: 6-8 hours

### Total Estimated Time: 15-20 hours

## Deliverables

### Page Components
- [ ] Landing page (`app/page.tsx`)
- [ ] Menu page (`app/menu/page.tsx`)
- [ ] Cart page (`app/cart/page.tsx`)
- [ ] Checkout page (`app/checkout/page.tsx`)
- [ ] Order confirmation page (`app/orders/[id]/page.tsx`)

### Features
- [ ] Responsive design across all pages
- [ ] SEO metadata for all routes
- [ ] Loading states and skeletons
- [ ] Error handling with user feedback
- [ ] Form validation
- [ ] Real-time order tracking
- [ ] Toast notifications

### Documentation
- [ ] Component usage examples
- [ ] API integration patterns
- [ ] State management patterns
- [ ] Testing strategies

## Testing Strategy

### Manual Testing Checklist

**Landing Page**
- [ ] Hero section displays correctly
- [ ] Featured dishes load from API
- [ ] Testimonials render properly
- [ ] Newsletter form validation works
- [ ] Responsive on mobile, tablet, desktop

**Menu Page**
- [ ] All dishes load correctly
- [ ] Category filtering works
- [ ] Search returns correct results
- [ ] Add to cart updates context
- [ ] Loading states appear during fetch
- [ ] Error states display when API fails

**Cart Page**
- [ ] Cart items display from context
- [ ] Quantity controls update totals
- [ ] Remove item works correctly
- [ ] Empty cart state shows
- [ ] Proceed to checkout navigates correctly

**Checkout Page**
- [ ] Form validation shows errors
- [ ] Order submission creates order
- [ ] Loading state during submission
- [ ] Navigation to confirmation on success
- [ ] Error handling for failed orders

**Order Confirmation**
- [ ] Order details display correctly
- [ ] Status polling updates automatically
- [ ] Order summary matches submitted data
- [ ] Page handles invalid order IDs

### Automated Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test landing-page.test.tsx
```

### Performance Testing

```bash
# Lighthouse CI
npm run lighthouse

# Bundle analysis
npm run build
npm run analyze
```

## Common Pitfalls and Solutions

### 1. Server vs Client Components

**Problem**: Using client-side features in Server Components
**Solution**:
```tsx
// Use 'use client' directive for interactive components
'use client';

export default function InteractivePage() {
  // Can now use useState, useEffect, event handlers
}
```

### 2. Data Fetching Patterns

**Problem**: Over-fetching or waterfalling requests
**Solution**:
```tsx
// Parallel data fetching in Server Components
async function MenuPage() {
  const [dishes, categories] = await Promise.all([
    fetch('/api/menu').then(r => r.json()),
    fetch('/api/categories').then(r => r.json())
  ]);
}
```

### 3. Cart State Synchronization

**Problem**: Cart state not updating across pages
**Solution**:
- Use CartContext provider at root layout
- Ensure all pages are wrapped in provider
- Use localStorage for persistence

### 4. Form Validation

**Problem**: Inconsistent validation between client and server
**Solution**:
- Share Zod schemas between client and server
- Validate on both sides for security
- Provide clear error messages

### 5. Real-Time Updates

**Problem**: Polling creates memory leaks
**Solution**:
```tsx
useEffect(() => {
  const interval = setInterval(fetchStatus, 3000);
  return () => clearInterval(interval); // Cleanup
}, []);
```

## Environment Variables

Ensure these are set in `.env.local`:

```bash
# Database
DATABASE_URL="your_database_url"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
NEXT_PUBLIC_ENABLE_PROMO_CODES=true
```

## Related Documentation

- [Phase 3: API Routes](../phase-3-api-routes/README.md)
- [Phase 4: Shared Components](../phase-4-shared-components/README.md)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/rsc/server-components)

## Success Criteria

Phase 5 is complete when:

1. All five pages are functional and accessible
2. Complete customer journey from landing to confirmation works end-to-end
3. All forms validate properly with helpful error messages
4. Responsive design works on mobile, tablet, and desktop
5. Loading and error states are implemented consistently
6. Real-time order tracking updates automatically
7. SEO metadata is properly configured
8. Manual testing checklist is 100% complete
9. Performance metrics meet targets (Lighthouse score > 90)
10. Code is documented and follows project conventions

## Next Steps

After completing Phase 5:

1. **Test the complete customer flow** from landing to order confirmation
2. **Gather user feedback** on the ordering experience
3. **Optimize performance** using Next.js analytics
4. **Begin Phase 6**: Admin Dashboard for restaurant staff
5. **Implement Phase 7**: Advanced features (user accounts, order history, loyalty program)

## Support and Resources

- **Project Repository**: Check existing components and patterns
- **Design System**: Reference Tailwind config for colors and spacing
- **API Documentation**: Review Phase 3 for endpoint specifications
- **Component Library**: Use Phase 4 components for consistency

---

**Phase Owner**: Development Team
**Last Updated**: 2026-02-09
**Status**: Ready for Implementation
