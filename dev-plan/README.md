# Bella Cucina Restaurant Web App - Development Plan

> **A comprehensive, phase-by-phase implementation guide for building a modern restaurant ordering system**

## 📋 Project Overview

**Bella Cucina** is a full-stack restaurant web application demo built with Next.js 15, designed to showcase a complete online ordering experience with both customer-facing and administrative interfaces. This development plan breaks down the entire implementation into 8 strategic phases with 40 detailed tasks.

### Key Features
- 🍕 **Customer Ordering System** - Browse menu, manage cart, place orders, track status
- 👨‍💼 **Admin Management Panel** - Manage menu items, track orders, view analytics
- 📱 **Mobile-First Design** - Responsive interface optimized for all devices
- ⚡ **Real-Time Updates** - Live order status polling and instant UI feedback
- 🎨 **Modern UI/UX** - Tailwind CSS with warm color palette, smooth animations
- 💾 **In-Memory Data Store** - Pre-populated with realistic seed data for demo purposes

## 🛠 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS with custom theme |
| **State Management** | React Context + localStorage |
| **Icons** | lucide-react |
| **Notifications** | sonner or react-hot-toast |
| **Deployment** | Vercel |
| **Data Storage** | In-memory (resets on redeploy) |

## 📊 Project Scope

### Customer-Facing Features
- Landing page with hero, featured dishes, and testimonials
- Comprehensive menu with category filtering and search
- Shopping cart with quantity controls and persistence
- Checkout flow with delivery/pickup options
- Order confirmation with real-time status tracking

### Admin Features
- Protected dashboard with order metrics and revenue tracking
- Complete menu management (CRUD operations)
- Order management with status updates
- Simple password-based authentication

### Technical Infrastructure
- 8 REST API routes for menu and order operations
- Global cart state with React Context
- Pre-loaded seed data (16 menu items, 8 orders)
- Responsive navigation and shared components
- Loading states, error handling, and accessibility features

## 🎯 Development Phases

### Overview Table

| Phase | Name | Tasks | Est. Time | Description |
|-------|------|-------|-----------|-------------|
| [Phase 1](./phase-1-setup/) | **Project Setup & Foundation** | 7 | 8-11 hrs | Initialize project, configure tools, create data models |
| [Phase 2](./phase-2-api-routes/) | **Core API Routes** | 4 | 9-10 hrs | Build all REST endpoints for menu and orders |
| [Phase 3](./phase-3-cart-management/) | **Cart Management** | 2 | 3.5-4.5 hrs | Implement global cart state with persistence |
| [Phase 4](./phase-4-shared-components/) | **Shared Components** | 6 | 9-12 hrs | Create reusable UI components |
| [Phase 5](./phase-5-customer-pages/) | **Customer Pages** | 5 | 15-20 hrs | Build complete ordering experience |
| [Phase 6](./phase-6-admin-panel/) | **Admin Panel** | 4 | 15-19 hrs | Create management interfaces |
| [Phase 7](./phase-7-polish/) | **Polish & UX** | 7 | 18-25 hrs | Enhance UX, accessibility, performance |
| [Phase 8](./phase-8-deployment/) | **Deployment** | 5 | 10-16 hrs | Deploy, document, and test |
| | **TOTAL** | **40** | **87-117 hrs** | **~2-3 weeks** |

### Phase Descriptions

#### Phase 1: Project Setup & Foundation
Establish the project foundation by initializing Next.js 15, configuring TypeScript and Tailwind CSS, defining all data types, implementing the in-memory data store with comprehensive seed data, and creating utility functions.

**Key Deliverables:** Configured Next.js project, TypeScript types, seed data store, utility functions

#### Phase 2: Core API Routes
Build all REST API endpoints for menu and order operations including GET, POST, PUT, PATCH, and DELETE handlers with proper validation and error handling.

**Key Deliverables:** 8 API routes (menu CRUD, order CRUD) with full functionality

#### Phase 3: Cart Management & Context
Implement global cart state management using React Context with localStorage persistence, enabling add/remove/update operations accessible throughout the app.

**Key Deliverables:** CartProvider component with full cart operations

#### Phase 4: Shared Components
Create all reusable UI components including navigation, footer, menu cards, status badges, loading skeletons, and admin authentication.

**Key Deliverables:** 6 shared components used across all pages

#### Phase 5: Customer-Facing Pages
Build the complete customer experience from landing page through menu browsing, cart management, checkout, and order confirmation with real-time updates.

**Key Deliverables:** 5 pages for complete ordering flow

#### Phase 6: Admin Panel
Create protected administrative interfaces for managing menu items, tracking orders, viewing analytics, and updating order statuses.

**Key Deliverables:** Admin dashboard, menu management, order management interfaces

#### Phase 7: Polish & UX Enhancements
Enhance the application with toast notifications, loading states, accessibility improvements, animations, performance optimizations, SEO metadata, and mobile responsiveness.

**Key Deliverables:** Production-ready UX with accessibility and performance optimizations

#### Phase 8: Deployment & Documentation
Prepare the application for production, deploy to Vercel, create comprehensive documentation, and perform end-to-end testing.

**Key Deliverables:** Deployed application with complete documentation

## 🗺 How to Use This Plan

### For Developers

1. **Start with Phase 1** - Complete all tasks in order, as each phase builds on the previous
2. **Read Phase READMEs** - Each phase folder contains a README with objectives and context
3. **Follow Task Files** - Each task has extensive documentation with step-by-step implementation guides
4. **Check Dependencies** - Review [DEPENDENCIES.md](./DEPENDENCIES.md) to understand task relationships
5. **Track Progress** - Mark tasks complete as you finish them

### For Project Managers

- Use the phase overview table to track high-level progress
- Each phase README includes estimated time and deliverables
- Task files include complexity ratings (Low/Medium/High)
- Dependencies document shows critical path for scheduling

### For Stakeholders

- Review the Project Overview section to understand scope
- Phase descriptions provide high-level feature breakdown
- Estimated timeline: 2-3 weeks for one developer, 1-2 weeks for a small team

## 📂 Repository Structure

After completion, the project will have this structure:

```
vibe-code-demo/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── menu/page.tsx               # Menu browsing
│   ├── cart/page.tsx               # Shopping cart
│   ├── checkout/page.tsx           # Checkout flow
│   ├── order/[id]/page.tsx         # Order confirmation
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── menu/page.tsx           # Menu management
│   │   ├── orders/page.tsx         # Order management
│   │   └── layout.tsx              # Admin layout
│   ├── api/
│   │   ├── menu/route.ts           # Menu GET/POST
│   │   ├── menu/[id]/route.ts      # Menu PUT/DELETE
│   │   ├── orders/route.ts         # Orders GET/POST
│   │   └── orders/[id]/route.ts    # Order GET/PATCH
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   ├── Footer.tsx                  # Footer
│   ├── MenuCard.tsx                # Menu item card
│   ├── CartProvider.tsx            # Cart context
│   ├── OrderStatusBadge.tsx        # Status badge
│   ├── Skeletons.tsx               # Loading states
│   └── AdminAuth.tsx               # Auth gate
├── lib/
│   ├── data.ts                     # In-memory store + seed data
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # Helper functions
├── dev-plan/                       # This documentation
├── requirements.md                 # Original requirements
└── package.json                    # Dependencies
```

## 🎨 Design System

### Color Palette
- **Primary:** Amber-600 (#d97706) - Warm, inviting restaurant aesthetic
- **Secondary:** Orange-500 (#f97316) - Accent color for CTAs
- **Success:** Green-600 - Order status, confirmations
- **Warning:** Yellow-500 - Pending states
- **Error:** Red-600 - Errors, cancelled orders
- **Neutral:** Gray scale for text and backgrounds

### Typography
- **Headings:** Potentially serif font for elegance
- **Body:** Sans-serif for readability
- **Scale:** Tailwind's default typographic scale

### Components
- Rounded corners for friendly feel
- Shadow elevation for depth
- Smooth transitions (< 300ms)
- High contrast for accessibility (WCAG AA)

## 📊 Seed Data Summary

The application comes pre-loaded with realistic data for immediate demo functionality:

### Menu Items (16 total)
- **4 Appetizers:** Bruschetta, Garlic Bread, Soup of the Day, Caprese Salad
- **5 Mains:** Margherita Pizza, Grilled Salmon, Pasta Carbonara, Chicken Parmesan, Mushroom Risotto
- **3 Desserts:** Tiramisu, Chocolate Lava Cake, Panna Cotta
- **4 Drinks:** Fresh Lemonade, Espresso, House Red Wine, Sparkling Water

### Orders (8 total)
- 2 Completed orders (revenue visible on dashboard)
- 1 Ready order (ready for pickup)
- 2 Preparing orders (active kitchen orders)
- 2 Pending orders (new orders to process)
- 1 Cancelled order (demonstrating all statuses)

All order timestamps are relative to current time to always appear fresh.

## 🔐 Authentication

**Demo Admin Credentials:**
- Password: `admin123` (configurable via `ADMIN_PASSWORD` environment variable)
- Implementation: Simple client-side password gate (not production-secure)
- Purpose: Demo protection only

## ⚡ Key Technical Decisions

### Why In-Memory Data?
- **Demo Focus:** Simplifies deployment and demonstration
- **No Database Setup:** Reduces infrastructure complexity
- **Fast Iteration:** Quick resets during development
- **Trade-off:** Data resets on redeploy (acceptable for demo)

### Why App Router?
- **Next.js 15 Default:** Latest routing paradigm
- **Server Components:** Better performance out of the box
- **Simplified Data Fetching:** No separate API layer needed for SSR

### Why React Context for Cart?
- **Simple State:** Sufficient for single-user cart
- **localStorage Persistence:** Survives page refreshes
- **No External Dependencies:** Reduces bundle size

### Why Tailwind CSS?
- **Rapid Development:** Utility-first speeds up UI building
- **Consistency:** Design system built-in
- **Customization:** Easy theme customization
- **Small Bundle:** Purges unused styles

## 📈 Success Metrics

### Technical Metrics
- ✅ Lighthouse Performance Score > 90
- ✅ Lighthouse Accessibility Score > 90
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ Mobile-responsive on all pages
- ✅ All API endpoints functional

### Feature Completeness
- ✅ Complete customer ordering flow (browse → order → track)
- ✅ Complete admin management (menu + orders)
- ✅ Real-time order status updates
- ✅ Cart persistence across sessions
- ✅ Pre-loaded seed data on first load

### User Experience
- ✅ Loading states on all async operations
- ✅ Toast notifications for all actions
- ✅ Error handling with friendly messages
- ✅ Keyboard navigation support
- ✅ Screen reader accessibility

## 🚀 Quick Start for Developers

```bash
# Clone and install (after Phase 1 complete)
cd vibe-code-demo
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and set ADMIN_PASSWORD

# Run development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
npm start

# Deploy to Vercel
vercel deploy
```

## 📚 Additional Resources

- [DEPENDENCIES.md](./DEPENDENCIES.md) - Visual dependency mapping
- [Phase 1: Setup](./phase-1-setup/) - Get started here
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

This is a demo project with a fixed scope. The development plan is complete and ready for implementation. Follow the phases in order for best results.

## 📄 License

This is a demonstration project for portfolio/learning purposes.

---

**Ready to start?** Head to [Phase 1: Project Setup & Foundation](./phase-1-setup/) to begin implementation.

**Questions about dependencies?** Check [DEPENDENCIES.md](./DEPENDENCIES.md) for the complete task dependency graph.

**Need an overview?** Each phase folder contains a detailed README explaining objectives and deliverables.
