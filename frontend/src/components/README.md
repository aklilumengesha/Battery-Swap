# Components

This directory contains all React components organized by their purpose and reusability level.

## Structure

```
components/
├── ui/                    # Atomic UI components
│   ├── Button.tsx        # Reusable button with loading state
│   ├── Input.tsx         # Form input with validation
│   ├── Loader.tsx        # Loading spinner
│   ├── StationSkeleton.tsx # Loading skeleton for stations
│   └── index.ts          # UI components barrel export
├── layout/                # Layout and navigation components
│   ├── AuthLayout.tsx    # Authentication layout wrapper
│   ├── BarLayout.tsx     # Main app layout with bottom bar
│   ├── LeafLayout.tsx    # Leaf background layout
│   ├── Appbar.tsx        # Bottom navigation bar
│   ├── Navbar.tsx        # Top navigation bar with location/vehicle
│   ├── styles.module.css # Layout-specific styles
│   └── index.ts          # Layout components barrel export
├── shared/                # Shared business components
│   ├── StationCard.tsx   # Station information card
│   ├── HistoryCard.tsx   # Order history card
│   ├── ScanButton.tsx    # Floating QR scan button
│   ├── MetaTags.tsx      # SEO meta tags component
│   ├── AuthLabel.tsx     # Auth page branding
│   ├── styles.module.css # Shared component styles
│   └── index.ts          # Shared components barrel export
├── index.ts               # Main barrel export
└── README.md              # This file
```

## Component Categories

### UI Components (`/ui`)
Atomic, reusable UI elements with no business logic.

**Characteristics:**
- Pure presentational components
- No direct API calls or state management
- Highly reusable across the application
- Minimal dependencies

**Examples:**
```typescript
import { Button, Input, Loader, StationSkeleton, StationSkeletonList } from '@/components/ui';

<Button type="solid" loading={isLoading} onClick={handleClick}>
  Submit
</Button>

<Input placeholder="Email" value={email} onChange={setEmail} />

<Loader />

{/* Loading skeleton for single station */}
<StationSkeleton />

{/* Loading skeleton for multiple stations */}
<StationSkeletonList count={5} />
```
</Button>

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  validationMsg={emailError}
/>

<Loader size="large" />
```

### Layout Components (`/layout`)
Components that define page structure and navigation.

**Characteristics:**
- Define page layouts and structure
- Handle navigation and routing
- Manage authentication state
- Provide consistent UI structure

**Examples:**
```typescript
import { AuthLayout, BarLayout, Appbar, Navbar } from '@/components/layout';

// Wrap authenticated pages
<BarLayout location={location}>
  {children}
</BarLayout>

// Authentication wrapper
<AuthLayout>
  {children}
</AuthLayout>

// Top navigation with location and vehicle info
<Navbar location={location} />
```

### Shared Components (`/shared`)
Business-specific components used across features.

**Characteristics:**
- Domain-specific logic
- Reused across multiple features
- May contain business rules
- Connected to application state

**Examples:**
```typescript
import { StationCard, HistoryCard, ScanButton, MetaTags } from '@/components/shared';

<StationCard station={stationData} />
<HistoryCard item={orderData} />
<ScanButton />
<MetaTags title="BatterySwap" desc="Swap your batteries" />
```

## Usage Guidelines

### Importing Components

```typescript
// Import from main barrel (recommended)
import { Button, Input, StationCard } from '@/components';

// Import from specific category
import { Button } from '@/components/ui';
import { AuthLayout } from '@/components/layout';
import { StationCard } from '@/components/shared';

// Import specific component directly
import Button from '@/components/ui/Button';
```

### Creating New Components

1. **Determine the category:**
   - UI: Pure presentational, no business logic
   - Layout: Page structure and navigation
   - Shared: Business-specific, reusable

2. **Create the component file:**
   ```typescript
   // components/ui/MyComponent.tsx
   import React from 'react';
   
   interface MyComponentProps {
     // Define props
   }
   
   const MyComponent: React.FC<MyComponentProps> = (props) => {
     return <div>...</div>;
   };
   
   export default MyComponent;
   ```

3. **Add to barrel export:**
   ```typescript
   // components/ui/index.ts
   export { default as MyComponent } from './MyComponent';
   ```

4. **Add to main barrel (optional):**
   ```typescript
   // components/index.ts
   export { default as MyComponent } from './ui/MyComponent';
   ```

## Component Best Practices

### 1. TypeScript Props
Always define TypeScript interfaces for props:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

### 2. Default Props
Use default parameters for optional props:
```typescript
const Button: React.FC<ButtonProps> = ({
  children,
  onClick = () => {},
  disabled = false,
}) => { ... }
```

### 3. Client Components
Mark components using hooks with `"use client"`:
```typescript
"use client";

import { useState } from 'react';
```

### 4. Documentation
Add JSDoc comments for complex components:
```typescript
/**
 * Button Component
 * Reusable button with loading state and optional link wrapper
 * 
 * @param children - Button content
 * @param onClick - Click handler
 * @param loading - Show loading spinner
 */
```

### 5. Styling
Use Tailwind CSS classes for styling:
```typescript
<div className="flex items-center justify-center p-4 rounded-lg shadow-md">
```

## Migration Notes

### From Old Structure
- `components/Button.tsx` → `components/ui/Button.tsx`
- `components/Input.tsx` → `components/ui/Input.tsx`
- `components/Loader.tsx` → `components/ui/Loader.tsx`
- `components/Appbar.tsx` → `components/layout/Appbar.tsx`
- `components/Navbar.tsx` → `components/layout/Navbar.tsx`
- `components/BatteryCard.tsx` → `components/shared/StationCard.tsx`
- `components/HistoryCard.tsx` → `components/shared/HistoryCard.tsx`
- `components/ScanButton.tsx` → `components/shared/ScanButton.tsx`
- `components/MetaTags.tsx` → `components/shared/MetaTags.tsx`
- `components/AuthLabel.tsx` → `components/shared/AuthLabel.tsx`
- `layouts/` → `components/layout/`

### Backward Compatibility
Legacy imports are supported through barrel exports:
```typescript
// Still works
import { BatteryCard } from '@/components';
// Maps to StationCard internally
```

## Testing

Components should be tested for:
- Rendering with different props
- User interactions (clicks, inputs)
- Conditional rendering
- Accessibility (ARIA labels, keyboard navigation)

## Performance

- Use `React.memo()` for expensive components
- Avoid inline function definitions in props
- Use `useCallback` and `useMemo` when appropriate
- Lazy load heavy components with `dynamic()`
