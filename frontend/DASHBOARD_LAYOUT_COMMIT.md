# Commit Message

```
feat: Create DashboardLayout component for authenticated pages

- Create new DashboardLayout component with modern SaaS design
- Add sticky header with page title and user avatar
- Implement centered max-width content container
- Maintain bottom Appbar navigation unchanged
- Replace BarLayout with DashboardLayout in Home page
- Keep location functionality fully intact
- Maintain responsive design across all screen sizes

Component Features:
- Sticky top header with clean white background
- Subtle border-bottom for visual separation
- Page title on left side of header
- User avatar circle on right with first letter initial
- User name and location display (hidden on mobile)
- Gradient avatar background (gray-700 to gray-900)
- Max-width centered content container (max-w-7xl)
- Proper padding and spacing throughout
- Bottom navigation bar preserved

Home Page Updates:
- Replaced BarLayout with DashboardLayout
- Added "Home" as page title
- Location prop passed to layout for header display
- All existing functionality preserved (stats, stations, scan button)
- Hero section, stats cards, and station list unchanged
```

## Files Changed
- `batterySwap/frontend/src/components/layout/DashboardLayout.tsx` - Created new layout component
- `batterySwap/frontend/src/app/home/page.tsx` - Updated to use DashboardLayout
- `batterySwap/frontend/src/components/layout/index.ts` - Added DashboardLayout export
- `batterySwap/frontend/src/components/index.ts` - Added DashboardLayout to barrel exports

## Component Structure
```
DashboardLayout
├── Sticky Header (bg-white, border-bottom)
│   ├── Page Title (left)
│   └── User Info (right)
│       ├── Name + Location (hidden on mobile)
│       └── Avatar Circle
├── Main Content (max-w-7xl, centered)
│   └── {children}
└── Bottom Appbar (unchanged)
```

## Usage Example
```tsx
<DashboardLayout title="Home" location={location}>
  {/* Your page content */}
</DashboardLayout>
```

## Testing
1. Visit http://localhost:3001/home
2. Verify sticky header appears at top
3. Check user avatar shows first letter of name
4. Verify location displays in header (desktop only)
5. Scroll page to confirm header stays fixed
6. Test on mobile - avatar and title should be visible
7. Verify bottom navigation bar still works
8. Check all existing functionality (stats, stations, scan) works
