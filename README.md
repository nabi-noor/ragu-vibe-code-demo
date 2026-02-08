# Bella Cucina — Authentic Italian Restaurant

A full-stack restaurant web application built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Features an online ordering system for customers and a management panel for admins — all powered by an in-memory data store pre-loaded with realistic seed data.

> **Live demo data:** The app boots with 16 menu items and 8 orders already loaded so every page looks fully functional from the first visit.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development Plan](#development-plan)
- [Seed Data](#seed-data)
- [API Routes](#api-routes)
- [Architecture Decisions](#architecture-decisions)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Customer-Facing
- **Landing Page** — Hero section, featured dishes, about section, customer testimonials
- **Menu Browsing** — All items grouped by category (Appetizers, Mains, Desserts, Drinks) with search and category filters
- **Shopping Cart** — Add/remove items, adjust quantities, subtotal/tax/total calculation, persists across page refreshes via `localStorage`
- **Checkout Flow** — Customer info form, pickup vs delivery selection, address fields for delivery, special instructions
- **Order Confirmation** — Real-time order status tracking with auto-polling every 10 seconds

### Admin Panel
- **Dashboard** — Overview cards (total orders, pending, completed, revenue), recent orders list
- **Menu Management** — Full CRUD: add, edit, delete menu items with category and availability controls
- **Order Management** — View all orders, filter by status, update order status (Pending → Preparing → Ready → Completed / Cancelled)
- **Simple Auth** — Password-protected admin area (demo credentials below)

### Technical
- 8 REST API routes (menu CRUD + order CRUD)
- In-memory data store with 16 seed menu items and 8 seed orders
- Responsive mobile-first design with warm amber/orange colour palette
- Toast notifications for all user actions
- Loading states and skeleton screens
- TypeScript strict mode throughout

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.1.6 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (strict mode) | 5.9 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.1 |
| **React** | [React](https://react.dev/) | 19.2 |
| **Icons** | [lucide-react](https://lucide.dev/) | 0.563 |
| **Notifications** | [sonner](https://sonner.emilkowal.dev/) | 2.0 |
| **Class Merging** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — |
| **Code Formatting** | [Prettier](https://prettier.io/) + [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) | 3.8 |
| **Linting** | [ESLint](https://eslint.org/) with next/core-web-vitals | 9.39 |
| **Deployment** | [Vercel](https://vercel.com/) | — |

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** — v18.17.0 or higher (v20+ recommended)
- **npm** — v9.0.0 or higher (comes with Node.js)
- **Git** — any recent version

Verify your versions:

```bash
node --version    # Should be >= 18.17.0
npm --version     # Should be >= 9.0.0
git --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nabi-noor/ragu-vibe-code-demo.git
cd ragu-vibe-code-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

This creates a `.env.local` file with the default admin password. You can change it if you like — see [Environment Variables](#environment-variables) below.

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the app

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

- **Customer site:** [http://localhost:3000](http://localhost:3000)
- **Menu:** [http://localhost:3000/menu](http://localhost:3000/menu)
- **Cart:** [http://localhost:3000/cart](http://localhost:3000/cart)
- **Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin) (password: `admin123`)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack (hot reload) |
| `npm run build` | Create optimised production build |
| `npm start` | Run the production build locally |
| `npm run lint` | Run ESLint across the codebase |

### Additional useful commands

```bash
# Type-check without emitting files
npx tsc --noEmit

# Format code with Prettier
npx prettier --write .

# Check formatting without writing
npx prettier --check .
```

---

## Project Structure

```
ragu-vibe-code-demo/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, Toaster)
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # Tailwind theme & global styles
│   ├── menu/
│   │   └── page.tsx              # Menu browsing (/menu)
│   ├── cart/
│   │   └── page.tsx              # Shopping cart (/cart)
│   ├── checkout/
│   │   └── page.tsx              # Checkout form (/checkout)
│   ├── order/
│   │   └── [id]/
│   │       └── page.tsx          # Order confirmation (/order/ORD-001)
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard (/admin)
│   │   ├── layout.tsx            # Admin layout with auth + nav
│   │   ├── menu/
│   │   │   └── page.tsx          # Menu management (/admin/menu)
│   │   └── orders/
│   │       └── page.tsx          # Order management (/admin/orders)
│   └── api/
│       ├── menu/
│       │   ├── route.ts          # GET all / POST new menu item
│       │   └── [id]/
│       │       └── route.ts      # PUT / DELETE single menu item
│       └── orders/
│           ├── route.ts          # GET all / POST new order
│           └── [id]/
│               └── route.ts      # GET / PATCH single order
│
├── components/                   # Shared React components
│   ├── Navbar.tsx                # Responsive nav with cart badge
│   ├── Footer.tsx                # Site footer
│   ├── MenuCard.tsx              # Menu item card with add-to-cart
│   ├── CartProvider.tsx          # React Context for cart state
│   ├── OrderStatusBadge.tsx      # Colour-coded status pill
│   ├── AdminAuth.tsx             # Password gate for admin
│   └── Skeletons.tsx             # Loading skeleton components
│
├── lib/                          # Core logic (no React)
│   ├── types.ts                  # TypeScript interfaces & constants
│   ├── data.ts                   # In-memory store + seed data + CRUD
│   └── utils.ts                  # Formatting, calculations, validation
│
├── public/                       # Static assets (favicon, images)
├── dev-plan/                     # Development plan documentation
│   ├── README.md                 # Master plan overview
│   ├── DEPENDENCIES.md           # Phase/task dependency map
│   └── phase-{1..8}-*/           # 8 phases, 40 task files
│
├── .env.example                  # Template for environment variables
├── .env.local                    # Local env (gitignored)
├── .gitignore
├── .prettierrc                   # Prettier config
├── eslint.config.mjs             # ESLint flat config
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS (Tailwind plugin)
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── package-lock.json
```

### Key directories

- **`app/`** — All pages and API routes live here. Next.js App Router uses file-system routing: `app/menu/page.tsx` becomes `/menu`.
- **`lib/`** — Pure TypeScript modules with no React dependencies. This is where types, data, and utilities live.
- **`components/`** — Shared React components used across multiple pages.
- **`dev-plan/`** — Comprehensive development plan split into 8 phases with 40 individual task documents. Not required to run the app, but useful for understanding the implementation roadmap.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADMIN_PASSWORD` | Yes | `admin123` | Password for accessing the admin panel |

### Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` to change the password (optional):
   ```
   ADMIN_PASSWORD=your_custom_password
   ```

The `.env.local` file is gitignored and will never be committed.

---

## Development Plan

The `dev-plan/` directory contains a comprehensive 8-phase implementation plan with 40 detailed task documents totalling ~47,000 lines of documentation.

| Phase | Name | Tasks | Status |
|-------|------|-------|--------|
| 1 | Project Setup & Foundation | 7 | Complete |
| 2 | Core API Routes | 4 | Pending |
| 3 | Cart Management & Context | 2 | Pending |
| 4 | Shared Components | 6 | Pending |
| 5 | Customer-Facing Pages | 5 | Pending |
| 6 | Admin Panel | 4 | Pending |
| 7 | Polish & UX Enhancements | 7 | Pending |
| 8 | Deployment & Documentation | 5 | Pending |

Each task file includes step-by-step implementation guides, code examples, acceptance criteria, testing strategies, and common pitfalls. Start with [dev-plan/README.md](dev-plan/README.md).

---

## Seed Data

The app ships with pre-loaded data so it looks fully functional immediately.

### Menu Items (16)

| Category | Items | Price Range |
|----------|-------|-------------|
| **Appetizers** (4) | Classic Bruschetta, Garlic Bread, Soup of the Day, Caprese Salad | $6.49 – $10.99 |
| **Mains** (5) | Margherita Pizza, Grilled Salmon, Pasta Carbonara, Chicken Parmesan, Mushroom Risotto | $14.99 – $22.99 |
| **Desserts** (3) | Tiramisu, Chocolate Lava Cake, Panna Cotta | $8.99 – $10.99 |
| **Drinks** (4) | Fresh Lemonade, Espresso, House Red Wine, Sparkling Water | $3.49 – $12.99 |

### Orders (8)

| ID | Customer | Status | Type |
|----|----------|--------|------|
| ORD-001 | Sarah Johnson | Completed | Delivery |
| ORD-002 | Mike Chen | Completed | Pickup |
| ORD-003 | Emily Davis | Ready | Delivery |
| ORD-004 | James Wilson | Preparing | Pickup |
| ORD-005 | Lisa Anderson | Preparing | Delivery |
| ORD-006 | Tom Martinez | Pending | Pickup |
| ORD-007 | Amy Thompson | Pending | Delivery |
| ORD-008 | David Lee | Cancelled | Pickup |

All order timestamps are **relative to the current time** (`Date.now() - offset`) so they always appear fresh, never stale.

> **Note:** All data lives in memory and resets on every server restart. This is intentional for a demo application.

---

## API Routes

All endpoints live under `app/api/` and use Next.js Route Handlers.

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/menu` | Return all menu items |
| `POST` | `/api/menu` | Add a new menu item (admin) |
| `PUT` | `/api/menu/[id]` | Update a menu item (admin) |
| `DELETE` | `/api/menu/[id]` | Delete a menu item (admin) |
| `GET` | `/api/orders` | Return all orders (admin) |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/[id]` | Get a single order (confirmation page) |
| `PATCH` | `/api/orders/[id]` | Update order status (admin) |

### Example: Place an order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "555-1234",
    "orderType": "Pickup",
    "items": [
      { "menuItemId": "menu-5", "name": "Margherita Pizza", "price": 14.99, "quantity": 2 }
    ]
  }'
```

### Example: Update order status

```bash
curl -X PATCH http://localhost:3000/api/orders/ORD-001 \
  -H "Content-Type: application/json" \
  -d '{ "status": "Completed" }'
```

---

## Architecture Decisions

### Why in-memory data (no database)?

This is a **demo application**. An in-memory store means:
- Zero infrastructure to set up — just `npm install && npm run dev`
- Instant data resets for demos — restart the server to get a clean slate
- The seed data is always present on first load
- **Trade-off:** Data doesn't persist across server restarts. This is expected and acceptable for a portfolio/demo project.

### Why Next.js App Router (not Pages Router)?

- App Router is the default and recommended architecture since Next.js 13+
- Server Components reduce client-side JavaScript by default
- Simplified data fetching with `async` components
- Built-in support for layouts, loading states, and error boundaries

### Why Tailwind CSS v4?

- Utility-first approach accelerates UI development
- CSS-based configuration via `@theme` (no `tailwind.config.ts` needed)
- Automatic tree-shaking — only ships CSS you actually use
- First-class support for custom design tokens (colours, fonts, animations)

### Why React Context for cart (not Redux/Zustand)?

- Cart state is simple (array of items) — no need for a global store library
- React Context + `useReducer` is sufficient for single-user cart management
- `localStorage` provides persistence across page refreshes
- Zero additional dependencies

---

## Design System

The custom Tailwind theme uses a warm Italian restaurant palette:

| Token | Colour | Usage |
|-------|--------|-------|
| `primary-*` | Warm amber (#f47e33) | Buttons, links, active states |
| `secondary-*` | Terracotta (#e24f4f) | Alerts, destructive actions |
| `accent-*` | Olive green (#809050) | Success states, highlights |
| `warm-*` | Warm grays (#faf9f7 → #2d2724) | Backgrounds, text, borders |

Typography:
- **Inter** (sans-serif) — Body text and UI elements
- **Playfair Display** (serif) — Headings and decorative text

---

## Deployment

### Deploy to Vercel (recommended)

1. Push your code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the environment variable:
   - `ADMIN_PASSWORD` = `admin123` (or your custom password)
4. Deploy

The app will build and deploy automatically on every push to `main`.

### Deploy manually

```bash
npm run build
npm start
```

The production server will start on port 3000 by default.

---

## Contributing

1. Check the [dev-plan/](dev-plan/) for the current roadmap and task list
2. Pick an uncompleted task from the next pending phase
3. Create a feature branch: `git checkout -b feat/task-X.Y-description`
4. Follow the task document's step-by-step guide
5. Verify the build passes: `npm run build && npm run lint`
6. Commit with a descriptive message following the existing convention:
   ```
   feat(scope): short description

   Task X.Y - Task Name

   - Detail 1
   - Detail 2
   ```
7. Push and open a pull request

---

## License

This is a demonstration project for portfolio and learning purposes.
