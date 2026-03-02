# Commit Message

```
fix: add "use client" directive to AvailabilityBadge component

Add Next.js App Router client directive and simplify component typing to resolve render error.

Issue:
- "render is not a function" error in React
- AvailabilityBadge missing "use client" directive
- Component used in client-side context (StationCard with useState/useEffect)
- Next.js App Router requires explicit client directive for client components

Solution:
- Added "use client" directive at top of file
- Simplified React.FC typing to standard function component
- Now consistent with other UI components (Button, Input, etc.)
- Component properly marked for client-side rendering

Files modified:
- src/components/ui/AvailabilityBadge.tsx
```

## Error Details

**Before Fix:**
```
TypeError: render is not a function
Call Stack: React
```

**Root Cause:**
In Next.js 13+ App Router, components are Server Components by default. When a component is used in a client-side context (like StationCard which uses `useState` and `useEffect`), it needs the `"use client"` directive.

The AvailabilityBadge component was missing this directive, causing React to fail when trying to render it in the client-side StationCard component.

**After Fix:**
Component now has the `"use client"` directive and will render correctly in client-side contexts.

## Next.js App Router Context

### Server Components (Default)
```typescript
// No directive needed
const ServerComponent = () => {
  return <div>Server rendered</div>;
};
```

### Client Components (Requires Directive)
```typescript
"use client";

const ClientComponent = () => {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
};
```

## Component Usage Chain

```
Home (Client Component - uses useState)
  ↓
StationCard (Client Component - uses useState, useEffect)
  ↓
AvailabilityBadge (Now Client Component ✅)
```

Since AvailabilityBadge is used within StationCard (a client component), it also needs to be a client component.

## Consistency with Other Components

All interactive UI components now have the directive:

```typescript
// Button.tsx
"use client";
export default Button;

// Input.tsx
"use client";
export default Input;

// Loader.tsx
"use client";
export default Loader;

// AvailabilityBadge.tsx ✅ Fixed
"use client";
export default AvailabilityBadge;
```

## Additional Changes

Also simplified the component typing from:
```typescript
const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ availableCount }) => {
```

To:
```typescript
const AvailabilityBadge = ({ availableCount }: AvailabilityBadgeProps) => {
```

This is the modern, recommended approach and matches the pattern used in other components.

## Why This Matters

1. **Next.js Compatibility**: Proper App Router usage
2. **Client-Side Features**: Enables use in interactive components
3. **Error Prevention**: Avoids "render is not a function" errors
4. **Best Practices**: Follows Next.js 13+ conventions

## Testing

The component should now render correctly in all contexts:

```typescript
// In a client component
"use client";

import AvailabilityBadge from "@/components/ui/AvailabilityBadge";

const MyComponent = () => {
  return <AvailabilityBadge availableCount={5} />;
};
```

## Related Documentation

- [Next.js App Router - Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Server Components](https://react.dev/reference/react/use-client)

## Related Files

- `src/components/ui/AvailabilityBadge.tsx` - Component implementation (fixed)
- `src/components/shared/StationCard.tsx` - Parent component (client component)
- `src/app/home/page.tsx` - Page component (client component)
