# Commit Message

```
feat: Add SubscriptionBanner component to Home page

- Create reusable SubscriptionBanner component in shared folder
- Add soft gradient background (indigo-50 → purple-50 → pink-50)
- Display current plan name with crown icon
- Show swap limit remaining with progress bar
- Include "Upgrade Plan" button with gradient styling
- Add decorative background elements with blur effects
- Implement dynamic progress bar color based on remaining swaps:
  * Green: >50% remaining
  * Yellow: 25-50% remaining
  * Red: <25% remaining
- Use modern SaaS styling with clean layout
- Add component below stats row in Home page
- Use mock values (not connected to backend yet)
- Export component from shared and main component indexes

Component Features:
- Gradient background with purple/indigo/pink tones
- Crown icon in gradient circle (purple-500 to indigo-600)
- Plan name and subscription label
- Large swap count display (text-2xl)
- Animated progress bar with color transitions
- Gradient upgrade button with hover effects
- Arrow icon with translate animation on hover
- Decorative radial blur elements in corners
- Responsive layout with flex design

Props Interface:
- planName?: string (default: "Basic Plan")
- swapsRemaining?: number (default: 8)
- swapLimit?: number (default: 10)
- onUpgradeClick?: () => void (default: navigate to pricing)
```

## Files Changed
- `batterySwap/frontend/src/components/shared/SubscriptionBanner.tsx` - Created new component
- `batterySwap/frontend/src/components/shared/index.ts` - Added export
- `batterySwap/frontend/src/components/index.ts` - Added export
- `batterySwap/frontend/src/app/home/page.tsx` - Added banner below stats row

## Component Structure

```tsx
<SubscriptionBanner
  planName="Basic Plan"
  swapsRemaining={8}
  swapLimit={10}
  onUpgradeClick={() => router.push('/pricing')}
/>
```

## Visual Design

1. **Background**:
   - Gradient: indigo-50 → purple-50 → pink-50
   - Rounded-2xl with shadow-lg
   - Border: purple-100/50
   - Decorative blur elements in corners

2. **Left Section**:
   - Crown icon in gradient circle (8x8)
   - Plan name (text-sm font-semibold)
   - "Current subscription" label (text-xs)
   - Swap count (text-2xl font-bold)
   - Progress bar with dynamic color

3. **Right Section**:
   - Gradient button (purple-600 to indigo-600)
   - "Upgrade" text with arrow icon
   - Hover effects: darker gradient, shadow-xl
   - Arrow translates right on hover

## Progress Bar Colors

- **Green** (>50%): User has plenty of swaps left
- **Yellow** (25-50%): User should consider usage
- **Red** (<25%): User is running low, should upgrade

## Reusability

The component is fully reusable and can be:
- Placed on any page
- Connected to real backend data later
- Customized with different plan names and limits
- Given custom upgrade click handlers

## Testing
1. Visit http://localhost:3001/home
2. Verify banner appears below stats row
3. Check gradient background displays correctly
4. Verify crown icon and plan name show
5. Check swap count displays "8 of 10 swaps remaining"
6. Verify progress bar shows green color (80% full)
7. Test "Upgrade" button navigates to /pricing
8. Check hover effects on button work smoothly
9. Verify decorative blur elements are visible
10. Test responsive layout on mobile devices

## Future Enhancements
- Connect to subscription API endpoint
- Fetch real plan data and swap counts
- Add loading state while fetching data
- Show different messages based on plan tier
- Add expiry date display
- Implement plan comparison on hover
