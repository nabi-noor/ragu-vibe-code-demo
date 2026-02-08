# Phase 4: Shared Components

## Overview

Phase 4 focuses on building reusable shared components that will be used throughout the Bella Cucina restaurant web application. These components form the foundation of the user interface and provide consistent design patterns, interactions, and visual feedback across all pages.

This phase is critical for establishing:
- **Consistent UI/UX**: Standardized components ensure a cohesive user experience
- **Code Reusability**: DRY principles reduce duplication and maintenance overhead
- **Scalability**: Well-architected components can be easily extended and modified
- **Accessibility**: ARIA-compliant components ensure the app is usable by everyone
- **Performance**: Optimized components with proper loading states improve perceived performance

## Phase Objectives

1. **Create Navigation System**: Build a responsive navbar with cart indicator and mobile menu
2. **Establish Footer Presence**: Implement footer with contact information and links
3. **Design Menu Cards**: Create attractive, functional menu item cards with add-to-cart
4. **Build Status Indicators**: Develop order status badges with intuitive color coding
5. **Implement Loading States**: Create skeleton loaders for better perceived performance
6. **Secure Admin Access**: Build admin authentication gate with password protection

## Prerequisites

Before starting Phase 4, ensure the following are completed:

- ✅ **Phase 1**: Development environment setup with Next.js 15, TypeScript, Tailwind CSS
- ✅ **Phase 3**: Cart context and shopping cart functionality implemented
- ✅ Node.js 18+ installed
- ✅ Package dependencies: lucide-react, tailwindcss, TypeScript
- ✅ Understanding of React hooks (useState, useEffect, useContext)
- ✅ Familiarity with Next.js App Router and Server/Client Components

## Task Breakdown

| Task ID | Task Name | Complexity | Est. Time | Dependencies |
|---------|-----------|------------|-----------|--------------|
| 4.1 | Create Navbar Component | Medium | 2-3 hours | Phase 1, Phase 3 |
| 4.2 | Create Footer Component | Low | 1-1.5 hours | Phase 1 |
| 4.3 | Create Menu Card Component | Medium | 2-3 hours | Phase 1, Phase 3 |
| 4.4 | Create Order Status Badge | Low | 1-1.5 hours | Phase 1 |
| 4.5 | Create Loading Skeletons | Medium | 1.5-2 hours | Phase 1 |
| 4.6 | Create Admin Auth Component | Medium | 1.5-2 hours | Phase 1 |

**Total Estimated Time**: 9-12 hours

## Deliverables

### Components

1. **Navbar Component** (`components/Navbar.tsx`)
   - Responsive navigation with mobile menu
   - Shopping cart indicator with item count
   - Active link highlighting
   - Sticky positioning on scroll

2. **Footer Component** (`components/Footer.tsx`)
   - Contact information display
   - Social media links
   - Navigation links
   - Copyright information

3. **Menu Card Component** (`components/MenuCard.tsx`)
   - Menu item display with image, name, description, price
   - Add to cart button with quantity controls
   - Dietary information badges
   - Responsive grid layout

4. **Order Status Badge** (`components/OrderStatusBadge.tsx`)
   - Color-coded status indicators
   - Icon representations
   - Accessible status text

5. **Loading Skeletons** (`components/skeletons/`)
   - MenuCardSkeleton
   - OrderCardSkeleton
   - Generic skeleton utilities

6. **Admin Auth Component** (`components/AdminAuth.tsx`)
   - Password-protected gate
   - Session persistence
   - Secure password validation

### Design System

- **Color Palette**: Warm amber/orange theme
  - Primary: `amber-600` (#d97706)
  - Accent: `orange-500` (#f97316)
  - Text: `gray-900`, `gray-600`
  - Backgrounds: `white`, `gray-50`, `gray-100`

- **Typography**: Default Next.js font (Geist)
  - Headings: `font-bold`, various text sizes
  - Body: `text-base`, `text-sm`
  - Captions: `text-xs`

- **Spacing**: Tailwind spacing scale (4px base unit)
- **Border Radius**: `rounded-lg` (8px) for cards, `rounded-md` (6px) for buttons
- **Shadows**: `shadow-sm`, `shadow-md` for elevation

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: lucide-react
- **State Management**: React Context API (Cart Context)
- **Type Safety**: Full TypeScript coverage with interfaces

## Directory Structure

```
bella-cucina/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx                 # Task 4.1
│   │   ├── Footer.tsx                 # Task 4.2
│   │   ├── MenuCard.tsx               # Task 4.3
│   │   ├── OrderStatusBadge.tsx       # Task 4.4
│   │   ├── AdminAuth.tsx              # Task 4.6
│   │   └── skeletons/                 # Task 4.5
│   │       ├── MenuCardSkeleton.tsx
│   │       ├── OrderCardSkeleton.tsx
│   │       └── Skeleton.tsx
│   ├── context/
│   │   └── CartContext.tsx            # From Phase 3
│   └── layout.tsx                     # Updated with Navbar/Footer
└── .env.local                          # Admin password config
```

## Implementation Order

Follow this sequence for optimal development flow:

1. **Task 4.5**: Create Loading Skeletons (no dependencies)
2. **Task 4.4**: Create Order Status Badge (no dependencies)
3. **Task 4.1**: Create Navbar (requires Cart Context)
4. **Task 4.2**: Create Footer (standalone)
5. **Task 4.3**: Create Menu Card (requires Cart Context)
6. **Task 4.6**: Create Admin Auth (standalone)

## Design Principles

### Component Architecture

- **Single Responsibility**: Each component has one clear purpose
- **Composability**: Components can be easily combined
- **Prop Interfaces**: Clear TypeScript interfaces for all props
- **Default Props**: Sensible defaults for optional props
- **Error Boundaries**: Graceful handling of component errors

### Responsive Design

- **Mobile-First**: Design for mobile, enhance for desktop
- **Breakpoints**:
  - `sm`: 640px (tablets)
  - `md`: 768px (small laptops)
  - `lg`: 1024px (desktops)
  - `xl`: 1280px (large screens)
- **Touch Targets**: Minimum 44x44px for mobile interactions
- **Flexible Layouts**: Use flexbox and grid for adaptive layouts

### Accessibility

- **Semantic HTML**: Use proper HTML5 elements
- **ARIA Labels**: Add descriptive labels for screen readers
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Indicators**: Visible focus states for all interactive elements
- **Color Contrast**: WCAG AA compliance (4.5:1 for normal text)
- **Alt Text**: Descriptive alternative text for all images

### Performance

- **Code Splitting**: Lazy load components when appropriate
- **Memoization**: Use React.memo for expensive renders
- **Optimized Images**: Use Next.js Image component
- **Minimal Re-renders**: Optimize context usage and state updates
- **Loading States**: Show skeletons instead of spinners

## Testing Strategy

### Manual Testing Checklist

For each component, verify:

- [ ] Renders correctly on mobile (375px width)
- [ ] Renders correctly on tablet (768px width)
- [ ] Renders correctly on desktop (1280px width)
- [ ] All interactive elements are clickable/tappable
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces content correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Props validation works with TypeScript
- [ ] Component integrates with parent components

### Browser Compatibility

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Accessibility Testing

- Use browser DevTools Lighthouse accessibility audit
- Test with keyboard only (no mouse)
- Test with screen reader (VoiceOver on Mac, NVDA on Windows)
- Verify color contrast ratios
- Check focus order and visibility

## Configuration

### Environment Variables

Create or update `.env.local`:

```env
# Admin Authentication
NEXT_PUBLIC_ADMIN_PASSWORD=admin123

# Optional: Session timeout (in milliseconds)
NEXT_PUBLIC_ADMIN_SESSION_TIMEOUT=3600000
```

### Tailwind Configuration

Ensure your `tailwind.config.ts` includes:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d97706', // amber-600
          light: '#fbbf24',   // amber-400
          dark: '#b45309',    // amber-700
        },
        accent: {
          DEFAULT: '#f97316', // orange-500
          light: '#fb923c',   // orange-400
          dark: '#ea580c',    // orange-600
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
```

## Integration with Layout

After completing all tasks, update `app/layout.tsx`:

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

## Quality Assurance

### Code Review Checklist

- [ ] TypeScript types are complete and accurate
- [ ] No TypeScript errors or warnings
- [ ] ESLint passes with no errors
- [ ] Components follow React best practices
- [ ] Tailwind classes are organized and consistent
- [ ] No hardcoded values (use constants/config)
- [ ] Props are documented with JSDoc comments
- [ ] Accessibility attributes are present
- [ ] Responsive design works across breakpoints
- [ ] Loading and error states are handled

### Performance Checklist

- [ ] No unnecessary re-renders
- [ ] Images are optimized
- [ ] No console errors or warnings
- [ ] Bundle size is reasonable
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

## Common Issues and Solutions

### Issue: Cart count not updating in Navbar

**Solution**: Ensure Navbar is wrapped in CartProvider and useCart hook is called correctly.

### Issue: Mobile menu not closing on navigation

**Solution**: Add click handlers to menu items that close the mobile menu state.

### Issue: Images not loading in MenuCard

**Solution**: Verify Next.js Image component configuration and image paths.

### Issue: Admin auth not persisting

**Solution**: Check sessionStorage implementation and ensure it's client-side only.

### Issue: Skeletons causing layout shift

**Solution**: Match skeleton dimensions exactly to actual component dimensions.

## Next Steps

After completing Phase 4:

1. **Phase 5**: Implement customer-facing pages (Home, Menu, Cart, Orders)
2. **Phase 6**: Build admin dashboard and management features
3. **Phase 7**: Add order processing and status updates
4. **Phase 8**: Implement advanced features and polish

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

If you encounter issues during Phase 4 implementation:

1. Review the task-specific documentation for detailed guidance
2. Check the Common Issues section above
3. Verify all prerequisites are met
4. Ensure dependencies are correctly installed
5. Review console errors for specific error messages

## Completion Criteria

Phase 4 is complete when:

- ✅ All 6 tasks are implemented and tested
- ✅ Components are integrated into the app layout
- ✅ Manual testing checklist is complete
- ✅ Accessibility audit passes
- ✅ No TypeScript or ESLint errors
- ✅ Responsive design works on all breakpoints
- ✅ Code review checklist is satisfied
- ✅ Documentation is updated with any changes

---

**Estimated Total Time**: 9-12 hours
**Complexity**: Medium
**Priority**: High (Foundation for all pages)

Ready to begin? Start with Task 4.5 (Loading Skeletons) as it has no dependencies!
