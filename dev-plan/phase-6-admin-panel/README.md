# Phase 6: Admin Panel

## Overview

Phase 6 implements a comprehensive admin panel for managing the Bella Cucina restaurant operations. This phase creates protected admin routes with a full-featured dashboard, menu management system, order management interface, and dedicated admin navigation. The admin panel provides restaurant staff with real-time insights and control over all aspects of the restaurant's digital operations.

## Objectives

- Create a protected admin dashboard with key metrics and analytics
- Implement full CRUD operations for menu management
- Build an order management system with status updates
- Design a dedicated admin navigation sidebar
- Establish secure admin-only routes and access control
- Provide real-time data updates and monitoring capabilities
- Create intuitive interfaces for non-technical staff
- Implement data validation and error handling

## Prerequisites

Before starting Phase 6, ensure the following are complete:

- **Phase 3**: Authentication system with role-based access control
- **Phase 4**: API routes for menu, orders, and admin operations
- **Phase 5**: Database integration with all required tables
- Admin user accounts created in the database
- Environment variables properly configured
- Next.js app router structure in place

## Architecture Overview

The admin panel follows a modular architecture:

```
app/
├── admin/
│   ├── layout.tsx                 # Admin layout with navigation
│   ├── page.tsx                   # Dashboard (landing page)
│   ├── menu/
│   │   └── page.tsx              # Menu management
│   ├── orders/
│   │   └── page.tsx              # Order management
│   └── components/
│       ├── AdminAuth.tsx         # Auth wrapper component
│       ├── AdminNav.tsx          # Navigation sidebar
│       ├── MetricCard.tsx        # Dashboard metric display
│       ├── OrderTable.tsx        # Order data table
│       ├── MenuTable.tsx         # Menu data table
│       └── ConfirmDialog.tsx     # Confirmation modal
```

## Task Breakdown

### Task 6.1: Create Admin Dashboard (4-5 hours)
**File**: `task-6.1-create-admin-dashboard.md`

Build the admin dashboard landing page with:
- Real-time metrics (total orders, revenue, active orders)
- Recent orders table with quick actions
- Daily/weekly/monthly statistics
- Auto-refresh every 30 seconds
- Performance indicators and trends

**Deliverables**:
- `app/admin/page.tsx` - Dashboard page component
- `app/admin/components/AdminAuth.tsx` - Auth wrapper
- `app/admin/components/MetricCard.tsx` - Metric display component
- `app/api/admin/stats/route.ts` - Statistics API endpoint

### Task 6.2: Create Menu Management (5-6 hours)
**File**: `task-6.2-create-menu-management.md`

Implement complete menu CRUD interface:
- Display all menu items in a data table
- Add new menu items with form validation
- Edit existing items with inline or modal editing
- Delete items with confirmation
- Category filtering and search
- Image upload and preview
- Price and availability management

**Deliverables**:
- `app/admin/menu/page.tsx` - Menu management page
- `app/admin/components/MenuTable.tsx` - Menu data table
- `app/admin/components/MenuForm.tsx` - Add/edit form modal
- Integration with existing menu API routes

### Task 6.3: Create Order Management (4-5 hours)
**File**: `task-6.3-create-order-management.md`

Build order management system with:
- Comprehensive order list with filtering
- Order status updates (pending → preparing → ready → completed)
- Order details view with customer information
- Real-time order notifications
- Status history tracking
- Bulk actions for multiple orders
- Export capabilities

**Deliverables**:
- `app/admin/orders/page.tsx` - Order management page
- `app/admin/components/OrderTable.tsx` - Order data table
- `app/admin/components/OrderDetails.tsx` - Order detail modal
- `app/api/admin/orders/[id]/route.ts` - Order update endpoint

### Task 6.4: Add Admin Navigation (2-3 hours)
**File**: `task-6.4-add-admin-navigation.md`

Create dedicated admin navigation:
- Persistent sidebar navigation
- Active route highlighting
- Admin user information display
- Logout functionality
- Mobile-responsive drawer
- Quick stats in sidebar
- Breadcrumb navigation

**Deliverables**:
- `app/admin/layout.tsx` - Admin layout with navigation
- `app/admin/components/AdminNav.tsx` - Navigation sidebar
- `app/admin/components/AdminHeader.tsx` - Top header bar
- Responsive navigation for mobile devices

## Estimated Timeline

| Task | Estimated Time | Complexity |
|------|---------------|------------|
| Task 6.1: Admin Dashboard | 4-5 hours | Medium |
| Task 6.2: Menu Management | 5-6 hours | High |
| Task 6.3: Order Management | 4-5 hours | Medium-High |
| Task 6.4: Admin Navigation | 2-3 hours | Low-Medium |
| **Total** | **15-19 hours** | **Medium-High** |

## Key Features

### Security & Access Control
- Protected routes requiring admin authentication
- Role-based access control (admin only)
- Session validation on each request
- Secure API endpoints with admin verification
- CSRF protection on all mutations

### Real-Time Updates
- Auto-refresh dashboard metrics (30-second intervals)
- Live order status updates
- Instant UI updates after mutations
- Optimistic UI updates for better UX

### Data Management
- Full CRUD operations for menu items
- Order status workflow management
- Soft delete with restore capability
- Data validation and error handling
- Transaction support for critical operations

### User Experience
- Intuitive, clean interface design
- Loading states and skeletons
- Error messages and success notifications
- Confirmation dialogs for destructive actions
- Keyboard shortcuts for power users
- Mobile-responsive design

## Technical Stack

- **Framework**: Next.js 14+ with App Router
- **UI Components**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks (useState, useEffect)
- **Data Fetching**: Native fetch with SWR or React Query (optional)
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Custom auth with JWT/sessions
- **Database**: Prisma ORM with PostgreSQL

## Data Models

### Admin Statistics Response
```typescript
interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  activeOrders: number;
  recentOrders: Order[];
  popularItems: {
    itemId: string;
    name: string;
    orderCount: number;
    revenue: number;
  }[];
}
```

### Menu Item
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order with Details
```typescript
interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: 'dine-in' | 'takeout' | 'delivery';
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: StatusChange[];
}
```

## API Endpoints

### Statistics Endpoints
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/stats/revenue?period=week` - Revenue analytics

### Menu Management Endpoints
- `GET /api/menu` - List all menu items (existing)
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/[id]` - Update menu item
- `DELETE /api/menu/[id]` - Delete menu item
- `PATCH /api/menu/[id]/toggle` - Toggle availability

### Order Management Endpoints
- `GET /api/admin/orders` - List all orders with filters
- `GET /api/orders/[id]` - Get order details (existing)
- `PATCH /api/admin/orders/[id]` - Update order status
- `DELETE /api/admin/orders/[id]` - Cancel order

## Testing Strategy

### Unit Tests
- Component rendering and props
- Form validation logic
- Data transformation utilities
- Auth guard functionality

### Integration Tests
- API endpoint responses
- CRUD operation flows
- Authentication workflows
- Status update workflows

### E2E Tests
- Complete order management workflow
- Menu item creation and editing
- Dashboard metric accuracy
- Navigation and routing

### Manual Testing Checklist
- [ ] Admin can log in and access dashboard
- [ ] Dashboard shows accurate metrics
- [ ] Metrics auto-refresh every 30 seconds
- [ ] Menu items can be created with all fields
- [ ] Menu items can be edited and changes persist
- [ ] Menu items can be deleted with confirmation
- [ ] Orders display with correct information
- [ ] Order status can be updated through workflow
- [ ] Status changes reflect immediately
- [ ] Non-admin users cannot access admin routes
- [ ] Navigation works on mobile devices
- [ ] All forms validate input correctly
- [ ] Error messages display appropriately
- [ ] Success notifications appear after actions

## Security Considerations

### Authentication & Authorization
- Verify admin role on every protected route
- Implement middleware for route protection
- Validate session/token on API requests
- Use secure HTTP-only cookies for sessions

### Data Protection
- Sanitize all user inputs
- Validate data types and formats
- Implement rate limiting on admin endpoints
- Log all admin actions for audit trail

### Best Practices
- Never expose sensitive data in client-side code
- Use environment variables for secrets
- Implement CORS policies appropriately
- Regular security audits and dependency updates

## Performance Optimization

### Frontend Optimization
- Lazy load components where appropriate
- Implement pagination for large datasets
- Use React.memo for expensive components
- Debounce search and filter inputs
- Optimize images and assets

### Backend Optimization
- Index frequently queried database fields
- Implement caching for dashboard metrics
- Use database connection pooling
- Optimize complex queries with joins
- Implement request throttling

## Common Pitfalls

### Authentication Issues
- **Problem**: Users can access admin routes by manipulating URLs
- **Solution**: Implement server-side auth checks in layout.tsx and API routes

### Stale Data
- **Problem**: Dashboard shows outdated information
- **Solution**: Implement auto-refresh and cache invalidation strategies

### Form Validation
- **Problem**: Invalid data submitted to API
- **Solution**: Implement client-side and server-side validation

### Concurrent Updates
- **Problem**: Multiple admins updating same order causes conflicts
- **Solution**: Implement optimistic locking or last-write-wins with warnings

## Deployment Considerations

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
ADMIN_EMAIL="admin@bellacucina.com"
NODE_ENV="production"
```

### Build Process
- Ensure all TypeScript types are correct
- Run linting and formatting checks
- Execute all tests before deployment
- Build optimized production bundle
- Test in staging environment

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor API response times
- Track admin user actions
- Set up alerts for critical failures

## Future Enhancements

### Phase 7 Considerations
- Advanced analytics and reporting
- Inventory management integration
- Staff scheduling system
- Customer relationship management
- Marketing campaign tools
- Multi-location support
- Mobile admin app

### Potential Improvements
- Real-time order notifications with WebSockets
- Advanced filtering and search capabilities
- Bulk import/export functionality
- Customizable dashboard widgets
- Role-based permission granularity
- Integration with POS systems
- Automated reporting schedules

## Resources

### Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Design Inspiration
- [Tailwind UI Admin Templates](https://tailwindui.com/components/application-ui)
- [Shadcn UI Components](https://ui.shadcn.com/)
- Material Design Admin Patterns

## Success Criteria

Phase 6 is considered complete when:

- [ ] All four tasks are fully implemented and tested
- [ ] Admin authentication protects all admin routes
- [ ] Dashboard displays accurate real-time metrics
- [ ] Menu CRUD operations work flawlessly
- [ ] Order status updates work correctly
- [ ] Navigation is intuitive and responsive
- [ ] All forms validate input properly
- [ ] Error handling works correctly
- [ ] Code passes all tests
- [ ] Documentation is complete
- [ ] Code review is approved
- [ ] Staging deployment is successful

## Getting Started

1. Review all prerequisite phases (3, 4, 5)
2. Set up admin user accounts in database
3. Start with Task 6.1 (Admin Dashboard)
4. Progress through tasks in numerical order
5. Test each component thoroughly before moving on
6. Conduct integration testing after all tasks complete
7. Perform security audit before production deployment

---

**Phase Status**: Ready for Implementation
**Priority**: High
**Estimated Completion**: 15-19 hours
**Dependencies**: Phase 3, Phase 4, Phase 5
