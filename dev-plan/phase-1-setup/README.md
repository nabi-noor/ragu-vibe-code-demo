# Phase 1: Project Setup & Foundation

**Phase Number:** 1
**Estimated Time:** 8-11 hours
**Status:** Not Started
**Difficulty:** Medium

## Overview

Phase 1 establishes the foundational infrastructure for the Bella Cucina restaurant management web application. This phase focuses on creating a robust development environment with modern tooling, implementing core data structures, and setting up the essential configuration that will support all future development phases.

By the end of this phase, you will have a fully configured Next.js 15 application with TypeScript, a custom-themed Tailwind CSS setup, complete type definitions, seed data stores, utility functions, and a properly structured root layout.

## Objectives

1. **Initialize Modern Tech Stack** - Set up Next.js 15 with App Router and TypeScript strict mode
2. **Configure Styling System** - Implement Tailwind CSS with custom warm color palette (amber/orange theme)
3. **Establish Type Safety** - Create comprehensive TypeScript interfaces for all data models
4. **Implement Data Layer** - Build in-memory data store with realistic seed data
5. **Create Utility Functions** - Develop reusable helper functions for common operations
6. **Structure Application** - Set up root layout with proper metadata and configuration

## Phase Tasks

This phase consists of 7 sequential tasks that build upon each other:

### Task 1.1: Initialize Next.js Project
**File:** [task-1.1-initialize-nextjs.md](./task-1.1-initialize-nextjs.md)
**Estimated Time:** 1 hour
**Complexity:** Low

Initialize a new Next.js 15 project with App Router, TypeScript, and ESLint configuration. Set up the basic project structure and configuration files.

### Task 1.2: Install Dependencies
**File:** [task-1.2-install-dependencies.md](./task-1.2-install-dependencies.md)
**Estimated Time:** 30 minutes
**Complexity:** Low

Install all required npm packages including Tailwind CSS, lucide-react for icons, and sonner for toast notifications.

### Task 1.3: Configure Tailwind CSS
**File:** [task-1.3-configure-tailwind.md](./task-1.3-configure-tailwind.md)
**Estimated Time:** 1.5 hours
**Complexity:** Medium

Configure Tailwind CSS with a custom warm color palette featuring amber and orange tones. Set up custom theme extensions, typography, and spacing configurations.

### Task 1.4: Create Type Definitions
**File:** [task-1.4-create-type-definitions.md](./task-1.4-create-type-definitions.md)
**Estimated Time:** 1.5 hours
**Complexity:** Medium

Define comprehensive TypeScript interfaces for MenuItem, Order, OrderItem, Category, and OrderStatus. Establish type safety across the application.

### Task 1.5: Implement Data Store
**File:** [task-1.5-implement-data-store.md](./task-1.5-implement-data-store.md)
**Estimated Time:** 2-3 hours
**Complexity:** High

Create an in-memory data store with 16 menu items (4 appetizers, 5 mains, 3 desserts, 4 drinks) and 8 orders in various statuses. Implement CRUD operations for both entities.

### Task 1.6: Create Utility Functions
**File:** [task-1.6-create-utility-functions.md](./task-1.6-create-utility-functions.md)
**Estimated Time:** 1-1.5 hours
**Complexity:** Low-Medium

Develop helper functions for currency formatting, date manipulation, order calculations, and validation logic.

### Task 1.7: Setup Root Layout
**File:** [task-1.7-setup-root-layout.md](./task-1.7-setup-root-layout.md)
**Estimated Time:** 1 hour
**Complexity:** Low-Medium

Configure the Next.js root layout with proper metadata, font optimization, global styles, and toast notification provider.

## Prerequisites

Before starting this phase, ensure you have:

- **Node.js** version 18.17 or higher installed
- **npm** or **yarn** package manager
- **Git** for version control
- A code editor (VS Code recommended with TypeScript/ESLint extensions)
- Basic understanding of:
  - TypeScript
  - React and Next.js concepts
  - Tailwind CSS
  - RESTful API patterns

## Phase Deliverables

Upon completion of Phase 1, you will have:

### Configuration Files
- `package.json` with all dependencies
- `tsconfig.json` with strict TypeScript configuration
- `tailwind.config.ts` with custom theme
- `.eslintrc.json` for code quality
- `next.config.js` for Next.js settings

### Source Code Structure
```
/Users/noorragu/Documents/vibe-code-demo/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage (placeholder)
│   └── globals.css         # Global styles with Tailwind
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── data-store.ts       # In-memory data store
│   └── utils.ts            # Utility functions
└── public/
    └── assets/             # Static assets directory
```

### Data Assets
- **16 Menu Items** across 4 categories (appetizers, mains, desserts, drinks)
- **8 Sample Orders** with varying statuses (pending, preparing, ready, delivered)
- Complete with realistic pricing, descriptions, and relationships

### Utility Functions
- Currency formatting (USD)
- Date formatting and manipulation
- Order total calculations
- Tax and tip calculations
- Data validation helpers

## Success Criteria

Phase 1 is considered complete when:

1. ✅ Next.js 15 application runs without errors (`npm run dev`)
2. ✅ TypeScript strict mode enabled with no compilation errors
3. ✅ Tailwind CSS properly configured with custom theme visible
4. ✅ All type definitions created and exported correctly
5. ✅ Data store contains 16 menu items and 8 orders
6. ✅ CRUD operations work for menu items and orders
7. ✅ Utility functions pass all test cases
8. ✅ Root layout renders with proper metadata
9. ✅ No ESLint errors or warnings
10. ✅ Application builds successfully (`npm run build`)

## Testing Phase 1

After completing all tasks, verify the phase with these steps:

### 1. Development Server Check
```bash
npm run dev
```
- Application starts on http://localhost:3000
- No console errors
- Page loads with default content

### 2. Build Verification
```bash
npm run build
```
- Build completes without errors
- TypeScript compilation succeeds
- No linting issues

### 3. Type Safety Check
```bash
npx tsc --noEmit
```
- No TypeScript errors reported

### 4. Data Store Verification
Create a test page to verify data store:
```typescript
// app/test/page.tsx
import { getMenuItems, getOrders } from '@/lib/data-store';

export default function TestPage() {
  const menuItems = getMenuItems();
  const orders = getOrders();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Store Test</h1>
      <p>Menu Items: {menuItems.length} (Expected: 16)</p>
      <p>Orders: {orders.length} (Expected: 8)</p>
    </div>
  );
}
```

### 5. Tailwind Theme Check
Verify custom colors are working:
```typescript
// app/test-theme/page.tsx
export default function ThemeTest() {
  return (
    <div className="p-8 space-y-4">
      <div className="bg-primary text-white p-4 rounded-lg">Primary Color</div>
      <div className="bg-secondary text-white p-4 rounded-lg">Secondary Color</div>
      <div className="bg-accent text-white p-4 rounded-lg">Accent Color</div>
    </div>
  );
}
```

## Task Dependencies

Understanding task dependencies is crucial for efficient execution:

```
Task 1.1 (Initialize Next.js)
    ↓
Task 1.2 (Install Dependencies)
    ↓
Task 1.3 (Configure Tailwind)
    ↓
Task 1.4 (Create Type Definitions)
    ↓
Task 1.5 (Implement Data Store) ← depends on 1.4
    ↓
Task 1.6 (Create Utility Functions) ← can use 1.4 and 1.5
    ↓
Task 1.7 (Setup Root Layout) ← depends on 1.2 and 1.3
```

**Note:** Tasks must be completed in order. Each task builds upon previous ones.

## Estimated Timeline

| Task | Time Estimate | Cumulative Time |
|------|---------------|-----------------|
| 1.1 | 1 hour | 1 hour |
| 1.2 | 30 minutes | 1.5 hours |
| 1.3 | 1.5 hours | 3 hours |
| 1.4 | 1.5 hours | 4.5 hours |
| 1.5 | 2-3 hours | 6.5-7.5 hours |
| 1.6 | 1-1.5 hours | 7.5-9 hours |
| 1.7 | 1 hour | 8.5-10 hours |
| Testing & Debugging | 30-60 minutes | 9-11 hours |

## Common Issues & Solutions

### Issue: TypeScript Strict Mode Errors
**Solution:** Start with strict mode enabled from the beginning. It's harder to enable later.

### Issue: Tailwind Classes Not Working
**Solution:** Ensure `globals.css` imports Tailwind directives and is imported in root layout.

### Issue: Module Import Errors
**Solution:** Check `tsconfig.json` has proper path aliases configured (`@/*` mapping).

### Issue: Data Store Not Persisting
**Solution:** This is expected behavior - in-memory store resets on server restart. This will be addressed in Phase 2 with database integration.

## Next Steps

After completing Phase 1, proceed to:

- **Phase 2: Dashboard & Analytics** - Build the main dashboard with order statistics
- **Phase 3: Menu Management** - Create menu item CRUD interface
- **Phase 4: Order Management** - Implement order processing workflow

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)

## Phase Maintainers

This phase documentation is maintained as part of the Bella Cucina development plan. For questions or issues, refer to individual task files or project documentation.

---

**Last Updated:** 2026-02-09
**Version:** 1.0.0
