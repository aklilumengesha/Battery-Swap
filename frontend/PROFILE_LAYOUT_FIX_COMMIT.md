# Fix: Replace BarLayout with DashboardLayout on profile page

## Problem
The profile page was using the old `BarLayout` component, which meant:
- The new unified top navbar was not visible
- Old teal bar with bottom navigation was showing instead
- Inconsistent navigation experience across the app
- User dropdown menu not accessible from profile page

## Solution
Migrated profile page from `BarLayout` to `DashboardLayout` to match the rest of the app.

## Changes Made

### 1. Updated Imports
```tsx
// REMOVED:
import BarLayout from "../../components/layout/BarLayout";
import { getLocation } from "../../utils/location";
import React, { useEffect, useState } from "react";

// ADDED:
import DashboardLayout from "../../components/layout/DashboardLayout";
import React from "react";
```

### 2. Removed Location State Management
Removed local location state and useEffect since DashboardLayout handles location internally:
```tsx
// REMOVED:
const [location, setLocation] = useState<any>({ name: "loading..." });

useEffect(() => {
  const savedLocation = localStorage.getItem("location");
  if (savedLocation) {
    setLocation(JSON.parse(savedLocation));
  } else if ("geolocation" in navigator) {
    getLocation((data: any) => setLocation(data));
  }
}, []);
```

### 3. Updated Layout Wrapper
```tsx
// BEFORE:
<BarLayout location={location}>
  ...
</BarLayout>

// AFTER:
<DashboardLayout title="Profile">
  ...
</DashboardLayout>
```

### 4. Preserved Existing Content
- Profile display cards unchanged
- Logout button functionality preserved
- All user data display remains the same

## Visual Changes

**Before:**
- Teal bar at top with back button
- Bottom navigation bar (fixed)
- No unified navbar
- No user dropdown access

**After:**
- Modern fixed top navbar with BatterySwap brand
- Home and My Plan navigation items
- User dropdown in top right (with Profile link highlighted)
- Location pill visible on desktop
- Consistent with Home and My Plan pages

## Benefits

1. **Consistent Navigation:** All main pages now use the same navbar
2. **Better UX:** User can access dropdown menu from profile page
3. **Active Indicator:** Profile link in dropdown shows active state when on profile page
4. **Cleaner Code:** Removed redundant location management logic
5. **Modern Design:** Matches the redesigned navigation system

## Files Modified
- `batterySwap/frontend/src/app/profile/page.tsx`

## Testing Checklist
✓ Top navbar with BatterySwap brand shows
✓ Home and My Plan nav items visible in center
✓ User dropdown shows in top right
✓ Clicking avatar opens dropdown
✓ Profile link in dropdown is highlighted (active state)
✓ Active dot shows on avatar when on profile page
✓ Old teal bar is gone
✓ Bottom navigation bar is gone
✓ Profile content displays correctly
✓ Logout button still works
