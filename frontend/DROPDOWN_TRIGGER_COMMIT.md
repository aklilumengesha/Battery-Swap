# Add dropdown trigger button to user avatar

## Changes
Converted the static user avatar into an interactive dropdown trigger button with visual feedback.

## Implementation Details

### 1. Added Active Page Detection
```tsx
const isDropdownPageActive = 
  pathname === routes.HISTORY || 
  pathname === routes.PROFILE;
```
Shows active indicator dot when user is on History or Profile pages (which will be in the dropdown menu).

### 2. Replaced Static Avatar with Button
Converted the non-interactive avatar div into a clickable button with:

**Interactive Features:**
- `onClick` handler toggles `dropdownOpen` state
- Background highlight when dropdown is open OR on dropdown pages
- Smooth transitions on all state changes

**Visual Elements:**
- Avatar circle with gradient background
- First letter of user's name (or UserOutlined icon)
- Active dot indicator (bottom-right) when on History/Profile pages
- User name (hidden on mobile)
- Chevron arrow (▾) that rotates 180° when dropdown opens

**Styling:**
- `bg-gray-100` when dropdown open or on dropdown pages
- `hover:bg-gray-100` otherwise
- Smooth 200ms transitions
- Rounded corners (rounded-xl)

### 3. Added Ref for Click-Outside Detection
Wrapped in `<div ref={dropdownRef}>` to enable the click-outside-to-close logic added in previous commit.

## Visual Changes
- Chevron arrow (▾) now visible next to user name
- Button highlights when clicked
- Active dot appears on avatar when viewing History or Profile pages
- Chevron rotates when dropdown opens (though dropdown panel not yet built)

## Next Steps
- Build dropdown menu panel with Profile, History, and Logout options
- Position dropdown below the trigger button
- Wire up navigation and logout actions

## Files Modified
- `batterySwap/frontend/src/components/layout/DashboardLayout.tsx`

## Testing Checklist
✓ Avatar displays correctly with user's first letter
✓ Clicking avatar toggles dropdownOpen state (no crash)
✓ Chevron (▾) visible next to user name
✓ Chevron rotates when clicked
✓ Button highlights when dropdown open
✓ Active dot shows when on History or Profile pages
