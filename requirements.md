Sure — here's the updated requirement with a dedicated seed data section:

---

# Restaurant Web App — Demo Project Requirements

## Project Overview

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, deployed on Vercel
**Data:** All in-memory (no database — server-side state resets on redeploy/restart, client-side state via React context + localStorage for cart persistence)
**Seed Data:** App must boot with a fully populated dataset so the demo feels lived-in from the first screen.

---

## 1. Landing Page (`/`)

- Hero section with restaurant name ("Bella Cucina"), tagline, and a prominent "Order Now" CTA
- Featured dishes section (3–4 items pulled from the in-memory menu)
- About section (short blurb, opening hours, location with an embedded map or static image)
- Testimonials section (3 hardcoded customer reviews)
- Footer with contact info, social links, and a link to the admin panel

---

## 2. Menu Page (`/menu`)

- Displays all menu items grouped by category (Appetizers, Mains, Desserts, Drinks)
- Each item shows: image (use placeholder URLs like `unsplash` or `/placeholder.svg`), name, description, price, and an "Add to Cart" button
- Category filter/tabs to jump between sections
- Search bar to filter items by name
- Menu data is served from a Next.js API route that reads from an in-memory array

---

## 3. Cart & Ordering Flow

### 3a. Cart (`/cart`)
- Lists all added items with quantity controls (increment, decrement, remove)
- Shows subtotal, tax (calculated at ~10%), and total
- "Proceed to Checkout" button (disabled if cart is empty)
- Cart state managed via React Context + localStorage so it survives page refreshes

### 3b. Checkout (`/checkout`)
- Form collecting: name, phone number, email, order type (Pickup or Delivery)
- If delivery: address fields appear
- Optional special instructions textarea
- Order summary sidebar showing cart contents and total
- "Place Order" button that POSTs to an API route

### 3c. Order Confirmation (`/order/[id]`)
- Displays order ID, items ordered, total, estimated time
- Order status badge (Pending → Preparing → Ready → Completed)
- Auto-polls the API every 10 seconds to check for status updates (so the admin panel changes reflect here in near real-time)

---

## 4. Admin Panel (`/admin`)

Protected by a simple hardcoded password check (e.g., password = `admin123`, stored in an env var). No real auth — just a client-side gate for demo purposes.

### 4a. Dashboard (`/admin`)
- Overview cards: total orders today, pending orders, completed orders, revenue
- Quick list of recent orders
- **Should show meaningful numbers on first load thanks to seed orders**

### 4b. Menu Management (`/admin/menu`)
- Table listing all menu items
- Add new item form (name, description, price, category, image URL)
- Edit existing items inline or via modal
- Delete item with confirmation
- All changes hit API routes that mutate the in-memory array

### 4c. Order Management (`/admin/orders`)
- Table of all orders with columns: Order ID, customer name, items summary, total, status, time placed
- Ability to update order status via dropdown (Pending → Preparing → Ready → Completed → Cancelled)
- Filter by status
- Click an order to see full details
- **Should already show several orders in different statuses on first load**

---

## 5. API Routes (Next.js Route Handlers)

All under `app/api/`:

| Route | Method | Purpose |
|---|---|---|
| `/api/menu` | GET | Return all menu items |
| `/api/menu` | POST | Add a new menu item (admin) |
| `/api/menu/[id]` | PUT | Update a menu item (admin) |
| `/api/menu/[id]` | DELETE | Delete a menu item (admin) |
| `/api/orders` | GET | Return all orders (admin) |
| `/api/orders` | POST | Place a new order |
| `/api/orders/[id]` | GET | Get single order (for confirmation page) |
| `/api/orders/[id]` | PATCH | Update order status (admin) |

---

## 6. Pre-Loaded Seed Data

The in-memory store (`lib/data.ts`) must be pre-populated so the app looks fully functional the moment it loads. No empty states on first visit.

### 6a. Menu Items (15+ items)

**Appetizers**
| Name | Description | Price |
|---|---|---|
| Classic Bruschetta | Toasted bread with fresh tomatoes, basil & balsamic glaze | $8.99 |
| Garlic Bread | Oven-baked with herb butter and parmesan | $6.49 |
| Soup of the Day | Chef's daily selection served with crusty bread | $7.99 |
| Caprese Salad | Fresh mozzarella, tomatoes, basil with olive oil | $10.99 |

**Mains**
| Name | Description | Price |
|---|---|---|
| Margherita Pizza | San Marzano tomatoes, fresh mozzarella, basil | $14.99 |
| Grilled Salmon | Atlantic salmon with lemon butter, seasonal vegetables | $22.99 |
| Pasta Carbonara | Spaghetti with pancetta, egg, parmesan, black pepper | $16.99 |
| Chicken Parmesan | Breaded chicken breast, marinara, melted mozzarella | $18.99 |
| Mushroom Risotto | Arborio rice with wild mushrooms, parmesan, truffle oil | $17.99 |

**Desserts**
| Name | Description | Price |
|---|---|---|
| Tiramisu | Classic Italian coffee-flavored layered dessert | $9.99 |
| Chocolate Lava Cake | Warm molten center with vanilla gelato | $10.99 |
| Panna Cotta | Vanilla bean cream with berry compote | $8.99 |

**Drinks**
| Name | Description | Price |
|---|---|---|
| Fresh Lemonade | House-made with mint | $4.99 |
| Espresso | Double-shot Italian roast | $3.99 |
| House Red Wine | Glass of Chianti Classico | $12.99 |
| Sparkling Water | San Pellegrino 750ml | $3.49 |

Each menu item should also have: a unique `id`, a `category` field, an `image` URL (placeholder), and an `available: boolean` flag.

### 6b. Seed Orders (8 orders)

Pre-populate with orders in various statuses so the admin panel and dashboard have data immediately:

| Order ID | Customer | Type | Items | Total | Status | Time |
|---|---|---|---|---|---|---|
| ORD-001 | Sarah Johnson | Delivery | 2× Margherita Pizza, 1× Lemonade | $34.97 | Completed | Today, 11:30 AM |
| ORD-002 | Mike Chen | Pickup | 1× Grilled Salmon, 1× Espresso | $26.98 | Completed | Today, 12:15 PM |
| ORD-003 | Emily Davis | Delivery | 1× Pasta Carbonara, 1× Tiramisu, 1× House Red Wine | $39.97 | Ready | Today, 12:45 PM |
| ORD-004 | James Wilson | Pickup | 2× Bruschetta, 1× Chicken Parmesan | $36.97 | Preparing | Today, 1:00 PM |
| ORD-005 | Lisa Anderson | Delivery | 1× Mushroom Risotto, 1× Chocolate Lava Cake, 2× Sparkling Water | $33.46 | Preparing | Today, 1:20 PM |
| ORD-006 | Tom Martinez | Pickup | 1× Caprese Salad, 1× Margherita Pizza | $25.98 | Pending | Today, 1:35 PM |
| ORD-007 | Amy Thompson | Delivery | 3× Garlic Bread, 2× Pasta Carbonara | $53.45 | Pending | Today, 1:42 PM |
| ORD-008 | David Lee | Pickup | 1× Soup of the Day, 1× Grilled Salmon | $30.98 | Cancelled | Today, 10:00 AM |

Each order should include: `id`, `customerName`, `email`, `phone`, `orderType` (pickup/delivery), `address` (if delivery), `items` array with quantities, `subtotal`, `tax`, `total`, `status`, `specialInstructions` (some should have these), and `createdAt` timestamp.

### 6c. Seed Timestamps

All seed order timestamps should be generated **relative to the current time** (e.g., `Date.now() - 2 * 60 * 60 * 1000` for 2 hours ago) so they always look fresh, not stale.

---

## 7. UI/UX Notes

- Responsive design (mobile-first since restaurant ordering is heavily mobile)
- Toast notifications for actions (item added to cart, order placed, status updated)
- Loading states and skeleton screens where data is being fetched
- Clean, modern design — use Tailwind with a warm color palette (amber/orange tones)
- Use `lucide-react` for icons
- Empty states should exist in code but won't be visible on first load thanks to seed data

---

## 8. Project Structure

```
app/
├── page.tsx                    # Landing page
├── menu/page.tsx               # Menu page
├── cart/page.tsx                # Cart page
├── checkout/page.tsx           # Checkout page
├── order/[id]/page.tsx         # Order confirmation
├── admin/
│   ├── page.tsx                # Admin dashboard
│   ├── menu/page.tsx           # Menu management
│   └── orders/page.tsx         # Order management
├── api/
│   ├── menu/route.ts
│   ├── menu/[id]/route.ts
│   ├── orders/route.ts
│   └── orders/[id]/route.ts
├── layout.tsx
└── globals.css
lib/
├── data.ts                     # In-memory store + ALL seed data
├── types.ts                    # TypeScript interfaces
└── utils.ts                    # Helpers (ID generation, tax calc, etc.)
components/
├── Navbar.tsx
├── Footer.tsx
├── MenuCard.tsx
├── CartProvider.tsx             # React Context for cart
├── OrderStatusBadge.tsx
└── AdminAuth.tsx               # Simple password gate
```

---

## 9. Deployment

- Push to GitHub, connect to Vercel
- Add env var `ADMIN_PASSWORD=admin123`
- Note for demo: in-memory data resets on each cold start, which is expected and fine for a demo

---

This should give you a fully alive-looking app the moment it boots — the admin dashboard has stats, the orders page has a backlog to manage, and the menu is ready to browse. Want me to turn this into a markdown file you can feed directly to Claude Code?
