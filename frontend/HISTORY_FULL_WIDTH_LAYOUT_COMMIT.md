# Commit Message

```
feat: Implement full-width two-column layout for History page with stats sidebar

- Remove max-width constraint from history page wrapper (max-w-2xl → w-full)
- Restructure layout with two-column grid on desktop (lg:grid-cols-3)
- Left column (lg:col-span-2) contains filters and booking list
- Right column (1/3 width) contains sticky stats sidebar
- Add comprehensive summary stats card with:
  - Total bookings count
  - Paid bookings count (green)
  - Unpaid bookings count (yellow)
  - Collected bookings count (blue)
  - Pending bookings count (gray)
  - Total spent calculation (dark card at bottom)
- Stats sidebar is sticky (top-24) for better UX while scrolling
- Add CheckCircleFilled icon import for stats
- Update page header styling (text-2xl, text-gray-400)
- All existing features preserved:
  - Search functionality unchanged
  - Filter pills unchanged
  - Expand/collapse logic unchanged
  - Booking cards unchanged
  - Empty states unchanged
  - Loading skeletons unchanged

Result:
✓ History page uses full screen width
✓ Booking list takes left 2/3 width
✓ Stats sidebar on right 1/3 width
✓ Sidebar is sticky while scrolling
✓ Total spent shows at bottom of sidebar
✓ All existing features still work
✓ Single column layout on mobile
✓ Better use of screen real estate
✓ No TypeScript errors
```

## Files Changed

1. `src/app/history/page.tsx`
   - Changed wrapper: `max-w-2xl mx-auto space-y-4` → `w-full space-y-5`
   - Added two-column grid: `grid grid-cols-1 lg:grid-cols-3 gap-5`
   - Left column: `lg:col-span-2 space-y-4` (booking list)
   - Right column: Stats sidebar with sticky positioning
   - Updated header: `text-xl` → `text-2xl`, `text-gray-500` → `text-gray-400`
   - Added CheckCircleFilled import

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                      │
│ Booking History | X total bookings                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────┐
│ LEFT COLUMN (2/3)                │ RIGHT COLUMN (1/3)           │
├──────────────────────────────────┼──────────────────────────────┤
│ Search Bar                       │ ┌──────────────────────────┐ │
│ Filter Pills (All/Paid/etc)      │ │ Summary (Sticky)         │ │
│ Result Count                     │ │                          │ │
│                                  │ │ • Total Bookings         │ │
│ ┌──────────────────────────────┐ │ │ • Paid (green)           │ │
│ │ Booking Card 1               │ │ │ • Unpaid (yellow)        │ │
│ │ - Station, Vehicle, Price    │ │ │ • Collected (blue)       │ │
│ │ - Date, Status Badges        │ │ │ • Pending (gray)         │ │
│ │ - Expand for details         │ │ │                          │ │
│ └──────────────────────────────┘ │ │ ┌──────────────────────┐ │ │
│                                  │ │ │ Total Spent          │ │ │
│ ┌──────────────────────────────┐ │ │ │ Rs XXX               │ │ │
│ │ Booking Card 2               │ │ │ └──────────────────────┘ │ │
│ └──────────────────────────────┘ │ └──────────────────────────┘ │
│                                  │                              │
│ ┌──────────────────────────────┐ │                              │
│ │ Booking Card 3               │ │                              │
│ └──────────────────────────────┘ │                              │
│                                  │                              │
│ ... more cards ...               │                              │
└──────────────────────────────────┴──────────────────────────────┘
```

## Stats Sidebar Features

- **Sticky positioning**: Stays visible while scrolling (top-24)
- **Icon-based stats**: Each stat has a colored icon badge
- **Color-coded values**: 
  - Green for paid bookings
  - Yellow for unpaid bookings
  - Blue for collected bookings
  - Gray for pending bookings
- **Total spent card**: Dark background at bottom showing cumulative spending
- **Responsive**: Hidden on mobile, shows on desktop (lg breakpoint)

## Testing Checklist

- [ ] History page uses full screen width
- [ ] Booking list displays in left column (2/3 width)
- [ ] Stats sidebar displays in right column (1/3 width)
- [ ] Sidebar is sticky while scrolling
- [ ] All stats calculate correctly
- [ ] Total spent calculates correctly
- [ ] Search functionality works
- [ ] Filter pills work
- [ ] Expand/collapse works on booking cards
- [ ] Empty states display correctly
- [ ] Loading skeletons display correctly
- [ ] Single column on mobile/tablet
- [ ] Two columns on desktop (lg breakpoint)
- [ ] No horizontal scrolling
- [ ] No TypeScript errors
