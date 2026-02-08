# Phase 3: Cart Management & Context

## Overview

Phase 3 establishes the foundational cart management system for the Bella Cucina restaurant web application. This phase implements a robust, type-safe shopping cart using React Context API with localStorage persistence, enabling users to add, modify, and manage menu items across the application.

The cart system serves as the backbone for the ordering workflow, providing centralized state management that persists across page refreshes and sessions. This implementation follows React best practices, handles Next.js hydration challenges, and provides a clean API for cart operations throughout the application.

## Objectives

1. **Centralized Cart State Management**: Implement a React Context-based solution for global cart state accessible from any component
2. **Persistent Storage**: Integrate localStorage to maintain cart data across browser sessions
3. **Type-Safe Operations**: Create fully typed cart operations with TypeScript interfaces
4. **Hydration-Safe Implementation**: Handle Next.js SSR/CSR hydration without mismatches
5. **Scalable Architecture**: Design a cart system that supports future enhancements (discounts, modifiers, etc.)

## Dependencies

### Required Phases
- **Phase 1.4**: TypeScript type definitions (MenuItem, CartItem types)
- **Phase 1.7**: Root layout structure for provider integration

### Technology Stack
- React 18+ Context API
- TypeScript for type safety
- localStorage API
- Next.js 14+ App Router
- Custom React hooks

## Task List

### Task 3.1: Create Cart Context
**File**: `task-3.1-create-cart-context.md`
**Estimated Time**: 2-3 hours
**Priority**: High

Create the CartContext with CartProvider component implementing:
- React Context setup with createContext
- Cart state management (items array)
- CRUD operations for cart items
- localStorage synchronization
- Client-side hydration handling
- Custom useCart hook for consuming context

**Key Deliverables**:
- `components/CartProvider.tsx` - Context provider component
- Typed interfaces for CartContext and CartState
- Complete set of cart operations (add, remove, update, clear)
- localStorage persistence layer
- Error handling and validation

### Task 3.2: Integrate Cart Provider
**File**: `task-3.2-integrate-cart-provider.md`
**Estimated Time**: 1.5 hours
**Priority**: High

Integrate the CartProvider into the application layout:
- Wrap root layout with CartProvider
- Verify context accessibility in child components
- Test cart operations from multiple locations
- Validate localStorage persistence
- Ensure hydration safety

**Key Deliverables**:
- Updated root layout with provider
- Integration tests
- Documentation for using useCart hook
- Troubleshooting guide

## Phase Deliverables

### Core Components
1. **CartProvider Component** (`components/CartProvider.tsx`)
   - Context provider with state management
   - localStorage integration
   - Cart operation methods
   - TypeScript interfaces

### Custom Hooks
1. **useCart Hook**
   - Typed hook for accessing cart context
   - Error handling for usage outside provider
   - Auto-completion support for cart operations

### Type Definitions
1. **CartContext Interface**
   - Cart state structure
   - Method signatures
   - CartItem type integration

### Integration
1. **Root Layout Update**
   - Provider wrapper implementation
   - Proper nesting with other providers
   - Performance optimization

## Technical Architecture

### State Structure
```typescript
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
```

### Cart Operations
- `addItem(item: MenuItem, quantity: number)`: Add item to cart
- `removeItem(itemId: string)`: Remove item completely
- `updateQuantity(itemId: string, quantity: number)`: Set specific quantity
- `incrementItem(itemId: string)`: Increase quantity by 1
- `decrementItem(itemId: string)`: Decrease quantity by 1
- `clearCart()`: Remove all items
- `getCartTotal()`: Calculate total price
- `getCartCount()`: Get total item count

### Persistence Strategy
- Automatic localStorage sync on cart changes
- JSON serialization/deserialization
- Hydration-safe loading (client-side only)
- Error recovery for corrupted data

## Estimated Timeline

| Task | Estimated Time | Dependencies |
|------|---------------|--------------|
| Task 3.1: Create Cart Context | 2-3 hours | Phase 1.4, 1.7 |
| Task 3.2: Integrate Cart Provider | 1.5 hours | Task 3.1 |
| **Total Phase Time** | **3.5-4.5 hours** | |

## Success Criteria

### Functional Requirements
- [ ] Cart state accessible from any component via useCart
- [ ] Items persist across page refreshes via localStorage
- [ ] All cart operations work correctly (add, remove, update)
- [ ] Quantity updates reflect immediately in UI
- [ ] Cart totals calculate accurately
- [ ] No hydration errors in Next.js

### Technical Requirements
- [ ] Full TypeScript type coverage
- [ ] Proper error handling for edge cases
- [ ] Clean separation of concerns
- [ ] Efficient re-renders (minimal unnecessary updates)
- [ ] Memory-safe localStorage usage
- [ ] Cross-browser compatibility

### Quality Standards
- [ ] Code follows React best practices
- [ ] Context uses useMemo/useCallback for optimization
- [ ] Comprehensive error messages
- [ ] Clear documentation and comments
- [ ] Unit tests for cart operations
- [ ] Integration tests for persistence

## Testing Strategy

### Unit Tests
- Cart operation functions (add, remove, update)
- Quantity calculations (totals, counts)
- Edge cases (empty cart, duplicate items)
- localStorage serialization/deserialization

### Integration Tests
- Context provider rendering
- Hook usage in components
- localStorage persistence
- Hydration behavior

### Manual Testing
- Add items from menu
- Update quantities in cart
- Remove items
- Clear entire cart
- Refresh page and verify persistence
- Test in multiple browsers

## Common Pitfalls

1. **Hydration Mismatches**: localStorage access during SSR causes hydration errors
   - Solution: Use useEffect for localStorage operations
   - Initialize with empty state, hydrate on mount

2. **State Mutation**: Directly mutating cart items array
   - Solution: Always create new arrays/objects with spread operators
   - Use immutable update patterns

3. **Missing Context Provider**: Using useCart outside CartProvider
   - Solution: Throw descriptive error in useCart hook
   - Ensure provider wraps all components

4. **localStorage Size Limits**: Exceeding 5-10MB storage quota
   - Solution: Implement size monitoring
   - Clear old data, handle quota exceeded errors

5. **Race Conditions**: Multiple rapid updates to cart
   - Solution: Use functional setState updates
   - Batch updates when possible

6. **Memory Leaks**: Event listeners not cleaned up
   - Solution: Proper useEffect cleanup functions
   - Remove storage event listeners on unmount

## Integration Points

### Current Phase Integrations
- **Phase 1.4 Types**: Uses MenuItem and CartItem interfaces
- **Phase 1.7 Layout**: Wraps layout with CartProvider

### Future Phase Integrations
- **Phase 4**: Menu items will use addItem from useCart
- **Phase 5**: Cart component will display items from context
- **Phase 6**: Checkout will read cart state for order submission
- **Phase 8**: Order confirmation will clear cart after success

## File Structure

```
dev-plan/phase-3-cart-management/
├── README.md                              # This file
├── task-3.1-create-cart-context.md       # Cart Context implementation
└── task-3.2-integrate-cart-provider.md   # Provider integration

app/
└── components/
    └── CartProvider.tsx                   # New: Cart context provider

app/layout.tsx                             # Modified: Add CartProvider wrapper
```

## Best Practices

### React Context
1. **Single Responsibility**: Cart context only manages cart state
2. **Memoization**: Use useMemo for cart totals and counts
3. **Callback Optimization**: Wrap functions in useCallback
4. **Selective Subscriptions**: Minimize re-renders with context splitting if needed

### localStorage
1. **Error Handling**: Wrap all localStorage calls in try-catch
2. **Key Naming**: Use descriptive, namespaced keys (e.g., "bella-cucina-cart")
3. **Data Validation**: Validate parsed JSON before using
4. **Size Management**: Monitor storage usage, implement cleanup

### TypeScript
1. **Strict Types**: No `any` types, use proper interfaces
2. **Null Safety**: Handle undefined cases for cart operations
3. **Generic Constraints**: Type parameters for extensibility
4. **Discriminated Unions**: For cart action types if using reducer pattern

### Performance
1. **Lazy Initialization**: Delay expensive operations until needed
2. **Debouncing**: For rapid quantity changes
3. **Memoization**: Cache computed values (totals, counts)
4. **Batched Updates**: Group state changes when possible

## Next Steps

After completing Phase 3:

1. **Immediate**:
   - Verify cart context integration works
   - Test localStorage persistence thoroughly
   - Review code for optimization opportunities

2. **Phase 4 Preview**:
   - Menu component will import useCart
   - Add to cart buttons will call addItem
   - Item cards will show "Added to cart" feedback

3. **Preparation**:
   - Review menu item structure for cart compatibility
   - Plan cart UI component design
   - Consider cart badge/icon placement in navbar

## Resources

### Documentation
- [React Context API](https://react.dev/reference/react/createContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Next.js Hydration](https://nextjs.org/docs/messages/react-hydration-error)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

### Examples
- React Context patterns
- localStorage persistence strategies
- Custom hook patterns
- Next.js SSR/CSR coordination

## Notes

- Keep cart operations simple and predictable
- Prioritize type safety and error handling
- Document edge cases and limitations
- Consider future extensibility (modifiers, special instructions)
- Plan for potential cart sharing/sync features in future

## Support

For questions or issues during Phase 3 implementation:
1. Review task-specific documentation
2. Check common pitfalls section
3. Verify prerequisites are complete
4. Test in isolation before integration
5. Review React Context best practices

---

**Phase Status**: Ready for Implementation
**Last Updated**: 2026-02-09
**Owner**: Development Team
**Review Required**: Post-implementation code review
