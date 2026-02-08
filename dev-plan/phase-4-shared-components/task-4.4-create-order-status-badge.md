# Task 4.4: Create Order Status Badge Component

## Task Metadata

- **Task ID**: 4.4
- **Phase**: 4 - Shared Components
- **Complexity**: Low
- **Estimated Time**: 1-1.5 hours
- **Priority**: Medium
- **Dependencies**: Phase 1 (Setup)
- **Component Type**: Server Component (presentational, no interactivity)

## Overview

The OrderStatusBadge component is a small but important UI element that provides at-a-glance information about order status. It uses intuitive color coding and optional icons to communicate order state quickly and clearly. This component appears in order lists, order details pages, and anywhere order status needs to be displayed.

### Importance

- **Visual Communication**: Color and icons convey status faster than text
- **User Clarity**: Reduces confusion about order state
- **Consistency**: Standardized status display across all views
- **Professionalism**: Polished UI increases trust
- **Accessibility**: Proper contrast and text for screen readers
- **Scalability**: Easy to add new status types

### User Experience Goals

1. **Instant Recognition**: Color-coded badges are immediately understandable
2. **Clear Status**: Text clearly states current order state
3. **Visual Hierarchy**: Different colors help users prioritize
4. **Accessibility**: Works for colorblind users with text labels
5. **Responsive**: Adapts to container size

## Prerequisites

### Required Completions

- ✅ Phase 1 completed (Next.js 15, TypeScript, Tailwind CSS setup)
- ✅ lucide-react package installed (optional for icons)
- ✅ Basic understanding of TypeScript enums or union types

### Required Knowledge

- React component basics
- Tailwind CSS utility classes
- TypeScript type definitions
- Conditional styling in React
- Semantic color usage

### Verify Prerequisites

```bash
# Check lucide-react (optional)
grep "lucide-react" package.json

# Verify Tailwind config
cat tailwind.config.ts

# Run development server
npm run dev
```

## Technical Specifications

### Component Architecture

```
OrderStatusBadge (Server Component)
├── Container Span/Div
│   ├── Icon (optional)
│   ├── Status Text
│   └── Timestamp (optional variant)
```

### Status Types and Colors

```typescript
type OrderStatus =
  | 'pending'      // Yellow/Amber - Awaiting processing
  | 'confirmed'    // Blue - Order confirmed
  | 'preparing'    // Purple - Being prepared
  | 'ready'        // Green - Ready for pickup/delivery
  | 'out-for-delivery' // Cyan - On the way
  | 'delivered'    // Green (darker) - Completed
  | 'cancelled'    // Red - Cancelled

// Color Mapping
const statusConfig = {
  pending: { color: 'amber', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  preparing: { color: 'purple', label: 'Preparing' },
  ready: { color: 'green', label: 'Ready' },
  'out-for-delivery': { color: 'cyan', label: 'Out for Delivery' },
  delivered: { color: 'emerald', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
}
```

### Responsive Behavior

- Adapts to container width
- Text truncates gracefully if needed
- Icons scale proportionally
- Maintains readability on all screen sizes

### Styling Theme

- **Badge Style**: Rounded pill shape with padding
- **Font**: Semi-bold, uppercase for emphasis
- **Size Variants**: Small (text-xs), Medium (text-sm), Large (text-base)
- **Color Intensity**: 100 background, 800 text for contrast
- **Icons**: Match text color, 16px default size

## Component Interface

### Props Interface

```typescript
type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}
```

**Prop Descriptions**:
- `status`: Current order status (required)
- `size`: Badge size variant (optional, default: 'md')
- `showIcon`: Display status icon (optional, default: false)
- `className`: Additional Tailwind classes (optional)

### Status Configuration Type

```typescript
interface StatusConfig {
  label: string
  bgColor: string
  textColor: string
  icon?: React.ComponentType<{ className?: string }>
}
```

## Files to Create/Modify

### Create New Files

```
app/components/OrderStatusBadge.tsx
app/types/order.ts (optional - for shared types)
```

### No Files to Modify

This is a standalone component.

## Step-by-Step Implementation

### Step 1: Create Component File

```bash
touch app/components/OrderStatusBadge.tsx
```

### Step 2: Import Dependencies

```typescript
import {
  Clock,
  CheckCircle,
  ChefHat,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
```

**Explanation**:
- Icons from lucide-react (optional but recommended)
- Each status gets a distinct icon
- Icons enhance visual communication

### Step 3: Define Types and Interfaces

```typescript
type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

interface StatusConfig {
  label: string
  bgColor: string
  textColor: string
  icon: React.ComponentType<{ className?: string }>
}
```

### Step 4: Define Status Configuration

```typescript
const statusConfig: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: CheckCircle,
  },
  preparing: {
    label: 'Preparing',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: ChefHat,
  },
  ready: {
    label: 'Ready',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: PackageCheck,
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: XCircle,
  },
}
```

**Design Decisions**:
- **Pending (Amber)**: Yellow/orange suggests "waiting"
- **Confirmed (Blue)**: Cool blue suggests "acknowledged"
- **Preparing (Purple)**: Unique color for active cooking
- **Ready (Green)**: Green universally means "go/ready"
- **Out for Delivery (Cyan)**: Lighter blue for "in transit"
- **Delivered (Emerald)**: Darker green for "complete"
- **Cancelled (Red)**: Red universally indicates cancellation

### Step 5: Define Size Variants

```typescript
const sizeConfig = {
  sm: {
    text: 'text-xs',
    padding: 'px-2 py-0.5',
    icon: 'w-3 h-3',
  },
  md: {
    text: 'text-sm',
    padding: 'px-3 py-1',
    icon: 'w-4 h-4',
  },
  lg: {
    text: 'text-base',
    padding: 'px-4 py-1.5',
    icon: 'w-5 h-5',
  },
}
```

### Step 6: Implement Main Component

```typescript
export default function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = false,
  className = '',
}: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClasses = sizeConfig[size]
  const Icon = config.icon

  if (!config) {
    console.warn(`Unknown order status: ${status}`)
    return null
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1.5
        ${config.bgColor}
        ${config.textColor}
        ${sizeClasses.text}
        ${sizeClasses.padding}
        font-semibold uppercase tracking-wide rounded-full
        ${className}
      `}
      role="status"
      aria-label={`Order status: ${config.label}`}
    >
      {showIcon && <Icon className={sizeClasses.icon} />}
      <span>{config.label}</span>
    </span>
  )
}
```

**Key Features**:
- **Inline Flex**: Aligns icon and text
- **Gap**: Spacing between icon and text
- **Rounded Full**: Pill shape
- **Uppercase**: Emphasis and consistency
- **Role="status"**: ARIA role for screen readers
- **Aria-label**: Descriptive label for accessibility
- **Null Check**: Handles unknown status gracefully

### Step 7: Add Alternative Variant (Optional)

Create a dot indicator variant for compact displays:

```typescript
export function OrderStatusDot({
  status,
  showLabel = true,
  className = '',
}: {
  status: OrderStatus
  showLabel?: boolean
  className?: string
}) {
  const config = statusConfig[status]

  if (!config) return null

  // Extract color from bgColor (e.g., 'bg-amber-100' -> 'amber')
  const dotColor = config.textColor.replace('text-', 'bg-').replace('-800', '-500')

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full ${dotColor}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={`text-sm ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </span>
  )
}
```

## Complete Component Code

```typescript
import {
  Clock,
  CheckCircle,
  ChefHat,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

interface StatusConfig {
  label: string
  bgColor: string
  textColor: string
  icon: React.ComponentType<{ className?: string }>
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: CheckCircle,
  },
  preparing: {
    label: 'Preparing',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: ChefHat,
  },
  ready: {
    label: 'Ready',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: PackageCheck,
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: XCircle,
  },
}

const sizeConfig = {
  sm: {
    text: 'text-xs',
    padding: 'px-2 py-0.5',
    icon: 'w-3 h-3',
  },
  md: {
    text: 'text-sm',
    padding: 'px-3 py-1',
    icon: 'w-4 h-4',
  },
  lg: {
    text: 'text-base',
    padding: 'px-4 py-1.5',
    icon: 'w-5 h-5',
  },
}

export default function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = false,
  className = '',
}: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClasses = sizeConfig[size]
  const Icon = config.icon

  if (!config) {
    console.warn(`Unknown order status: ${status}`)
    return null
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1.5
        ${config.bgColor}
        ${config.textColor}
        ${sizeClasses.text}
        ${sizeClasses.padding}
        font-semibold uppercase tracking-wide rounded-full
        ${className}
      `}
      role="status"
      aria-label={`Order status: ${config.label}`}
    >
      {showIcon && <Icon className={sizeClasses.icon} />}
      <span>{config.label}</span>
    </span>
  )
}

// Export status type for use in other components
export type { OrderStatus }

// Export dot variant
export function OrderStatusDot({
  status,
  showLabel = true,
  className = '',
}: {
  status: OrderStatus
  showLabel?: boolean
  className?: string
}) {
  const config = statusConfig[status]

  if (!config) return null

  // Extract color for dot
  const dotColor = config.textColor.replace('text-', 'bg-').replace('-800', '-500')

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full ${dotColor}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={`text-sm ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </span>
  )
}
```

## Usage Examples

### Basic Usage

```typescript
import OrderStatusBadge from './components/OrderStatusBadge'

<OrderStatusBadge status="preparing" />
```

### With Icon

```typescript
<OrderStatusBadge status="confirmed" showIcon={true} />
```

### Different Sizes

```typescript
<OrderStatusBadge status="pending" size="sm" />
<OrderStatusBadge status="ready" size="md" />
<OrderStatusBadge status="delivered" size="lg" showIcon={true} />
```

### With Custom Classes

```typescript
<OrderStatusBadge
  status="cancelled"
  className="ml-2"
/>
```

### In Order List

```typescript
{orders.map((order) => (
  <div key={order.id} className="flex items-center justify-between">
    <span>Order #{order.id}</span>
    <OrderStatusBadge status={order.status} showIcon />
  </div>
))}
```

### Dot Variant

```typescript
import { OrderStatusDot } from './components/OrderStatusBadge'

<OrderStatusDot status="preparing" />
<OrderStatusDot status="delivered" showLabel={false} />
```

### Status Timeline

```typescript
const statusOrder: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out-for-delivery',
  'delivered',
]

<div className="flex flex-col space-y-2">
  {statusOrder.map((status) => (
    <div key={status} className="flex items-center space-x-3">
      <OrderStatusDot status={status} showLabel={false} />
      <OrderStatusBadge status={status} size="sm" />
    </div>
  ))}
</div>
```

## Acceptance Criteria

### Functional Requirements

- ✅ Displays correct label for each status
- ✅ Shows correct color for each status
- ✅ Icon displays when showIcon={true}
- ✅ Size variants work correctly (sm, md, lg)
- ✅ Handles unknown status gracefully
- ✅ Accepts custom className
- ✅ Returns null for invalid status

### Visual Requirements

- ✅ Pill-shaped badge with rounded corners
- ✅ Text is uppercase and semi-bold
- ✅ Colors have sufficient contrast (WCAG AA)
- ✅ Icon and text are vertically aligned
- ✅ Consistent padding across sizes
- ✅ Clean, professional appearance

### Accessibility Requirements

- ✅ Has role="status" for screen readers
- ✅ Descriptive aria-label
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Works with colorblind-safe colors
- ✅ Text is readable at all sizes

### Responsive Requirements

- ✅ Works on mobile (375px+)
- ✅ Works on tablet (768px+)
- ✅ Works on desktop (1280px+)
- ✅ Doesn't break layout on long labels
- ✅ Scales appropriately with container

## Testing Strategy

### Manual Testing

1. **All Status Types**
   ```
   - Render badge with each status
   - Verify correct color displays
   - Verify correct label displays
   - Check icon matches status (if enabled)
   ```

2. **Size Variants**
   ```
   - Render small badge
   - Render medium badge
   - Render large badge
   - Verify text size scales
   - Verify icon size scales
   - Verify padding adjusts
   ```

3. **Icon Toggle**
   ```
   - Render with showIcon={false}
   - Verify no icon displays
   - Render with showIcon={true}
   - Verify icon displays
   - Check icon alignment
   ```

4. **Edge Cases**
   ```
   - Pass invalid status
   - Verify console warning
   - Verify component returns null
   - Pass very long custom className
   - Verify classes apply correctly
   ```

5. **Accessibility**
   ```
   - Check with screen reader
   - Verify status is announced
   - Check color contrast with tool
   - Verify all combinations pass WCAG AA
   ```

### Visual Regression

Create a showcase page with all variants:

```typescript
<div className="p-8 space-y-6">
  <div>
    <h3 className="mb-2">All Statuses</h3>
    <div className="flex flex-wrap gap-2">
      <OrderStatusBadge status="pending" />
      <OrderStatusBadge status="confirmed" />
      <OrderStatusBadge status="preparing" />
      <OrderStatusBadge status="ready" />
      <OrderStatusBadge status="out-for-delivery" />
      <OrderStatusBadge status="delivered" />
      <OrderStatusBadge status="cancelled" />
    </div>
  </div>

  <div>
    <h3 className="mb-2">With Icons</h3>
    <div className="flex flex-wrap gap-2">
      <OrderStatusBadge status="pending" showIcon />
      <OrderStatusBadge status="confirmed" showIcon />
      <OrderStatusBadge status="preparing" showIcon />
    </div>
  </div>

  <div>
    <h3 className="mb-2">Sizes</h3>
    <div className="flex flex-wrap gap-2 items-center">
      <OrderStatusBadge status="ready" size="sm" />
      <OrderStatusBadge status="ready" size="md" />
      <OrderStatusBadge status="ready" size="lg" />
    </div>
  </div>
</div>
```

### Color Contrast Testing

Use WebAIM Contrast Checker:
- Pending: #92400e on #fef3c7 ✅
- Confirmed: #1e3a8a on #dbeafe ✅
- Preparing: #581c87 on #f3e8ff ✅
- Ready: #14532d on #d1fae5 ✅
- Out for Delivery: #164e63 on #cffafe ✅
- Delivered: #064e3b on #d1fae5 ✅
- Cancelled: #991b1b on #fee2e2 ✅

## Common Pitfalls

### Pitfall 1: Colors Not Showing

**Problem**: Badge shows default colors instead of status colors.

**Cause**: Tailwind JIT not recognizing dynamic classes.

**Solution**: Use full class names, not dynamic construction:
```typescript
// ❌ Bad
className={`bg-${color}-100`}

// ✅ Good
bgColor: 'bg-amber-100'
```

### Pitfall 2: Icons Not Importing

**Problem**: Icons don't render or show errors.

**Cause**: lucide-react not installed.

**Solution**:
```bash
npm install lucide-react
```

### Pitfall 3: TypeScript Errors on Status

**Problem**: TypeScript complains about status prop.

**Cause**: Passing string instead of OrderStatus type.

**Solution**:
```typescript
// ❌ Bad
<OrderStatusBadge status={orderData.status} />

// ✅ Good - cast to type
<OrderStatusBadge status={orderData.status as OrderStatus} />

// Or validate in parent
const isValidStatus = (status: string): status is OrderStatus => {
  return ['pending', 'confirmed', ...].includes(status)
}
```

### Pitfall 4: Badge Too Large for Container

**Problem**: Badge breaks layout on mobile.

**Cause**: Using large size on small screen.

**Solution**: Use responsive sizes:
```typescript
<OrderStatusBadge
  status="out-for-delivery"
  size="sm"
  className="lg:text-base lg:px-4"
/>
```

### Pitfall 5: Poor Contrast

**Problem**: Text hard to read on background.

**Cause**: Using 500-600 colors which have poor contrast.

**Solution**: Stick to 100 background, 800 text combination.

### Pitfall 6: Icon Misalignment

**Problem**: Icon doesn't align with text.

**Cause**: Missing flex alignment.

**Solution**: Use `inline-flex items-center`:
```typescript
className="inline-flex items-center gap-1.5"
```

## Enhancement Ideas

### 1. Animated Pulse for Active States

```typescript
const isActive = ['preparing', 'out-for-delivery'].includes(status)

<span className={`... ${isActive ? 'animate-pulse' : ''}`}>
```

### 2. Tooltip with Timestamp

```typescript
<span title={`Updated: ${formatDate(order.updatedAt)}`}>
  <OrderStatusBadge status={order.status} />
</span>
```

### 3. Progress Indicator

```typescript
export function OrderProgress({ currentStatus }: { currentStatus: OrderStatus }) {
  const steps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
  const currentIndex = steps.indexOf(currentStatus)

  return (
    <div className="flex items-center gap-2">
      {steps.map((status, index) => (
        <React.Fragment key={status}>
          <OrderStatusDot
            status={status}
            showLabel={false}
            className={index <= currentIndex ? 'opacity-100' : 'opacity-30'}
          />
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-8 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
```

### 4. Click Action

```typescript
export function ClickableStatusBadge({
  status,
  onClick,
}: OrderStatusBadgeProps & { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="focus:ring-2 focus:ring-offset-2"
    >
      <OrderStatusBadge status={status} />
    </button>
  )
}
```

### 5. Estimated Time Display

```typescript
interface OrderStatusWithTimeProps extends OrderStatusBadgeProps {
  estimatedTime?: string
}

export function OrderStatusWithTime({
  status,
  estimatedTime,
  ...props
}: OrderStatusWithTimeProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      <OrderStatusBadge status={status} {...props} />
      {estimatedTime && (
        <span className="text-xs text-gray-500">
          Est: {estimatedTime}
        </span>
      )}
    </div>
  )
}
```

## Related Tasks

- **Phase 5**: Orders Page (displays order status badges)
- **Phase 6**: Admin Dashboard (uses badges for order management)
- **Phase 7**: Order Tracking (shows status progression)
- **Task 4.5**: Loading Skeletons (skeleton for badge loading)

## Troubleshooting

### Issue: Colors not applying

**Solution**: Verify Tailwind config includes all colors:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      // Ensure amber, blue, purple, etc. are available
    }
  }
}
```

### Issue: Component returns null

**Solution**: Check console for warnings about unknown status.

### Issue: Layout breaks with long labels

**Solution**: Add max-width or truncate:
```typescript
<span className="max-w-xs truncate">
  {config.label}
</span>
```

## Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Lucide Icons](https://lucide.dev/)
- [ARIA Status Role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role)

## Completion Checklist

- [ ] Component file created
- [ ] All status types defined
- [ ] Status config implemented
- [ ] Size variants working
- [ ] Icon support added
- [ ] Accessibility attributes added
- [ ] Manual testing complete
- [ ] All status colors verified
- [ ] Contrast ratios checked
- [ ] TypeScript types exported
- [ ] Dot variant created (optional)
- [ ] No console warnings
- [ ] Documentation complete

**Task Complete**: Ready for Task 4.5!
