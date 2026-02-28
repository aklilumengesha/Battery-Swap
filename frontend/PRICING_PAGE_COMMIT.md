# Pricing Page - Commit Message

```
feat: Add modern pricing page with subscription plans

Created Components:
- Pricing page at /pricing with premium SaaS design
- Responsive card-based layout for subscription plans
- Highlighted recommended plan with badge
- Plan comparison with features list
- FAQ section for common questions
- CTA section for user conversion

Created Services:
- subscription.service.ts with API methods:
  * getPlans() - Fetch all active plans
  * subscribe() - Subscribe to a plan
  * getMySubscription() - Get user's subscription

Created React Query Hooks:
- useSubscriptionQuery hook with:
  * usePlans() - Query for fetching plans
  * useMySubscription() - Query for user subscription
  * subscribe() - Mutation for subscribing
- Automatic cache invalidation
- Error handling with user feedback

Features:
- Fetches plans from /api/plans/ endpoint
- Card layout with hover effects and animations
- Recommended plan highlighted with ring and scale
- Plan details displayed:
  * Price per month
  * Swap limit per month
  * Support type (Priority/Standard)
  * Additional features
- Subscribe button with loading state
- Redirects to signin if not authenticated
- Premium SaaS styling with:
  * Gradient backgrounds
  * Shadow effects
  * Smooth transitions
  * Modern iconography (Ant Design icons)
- Fully responsive design (mobile, tablet, desktop)
- FAQ section for user education
- CTA section for conversion

Design Elements:
- Gradient header background
- White cards with shadow and hover effects
- Black accent color for recommended plan
- Green checkmarks for features
- Icon-based plan differentiation
- Rounded corners and modern spacing
- Professional typography hierarchy

User Experience:
- Clear pricing information
- Easy plan comparison
- One-click subscription (no payment yet)
- Loading states during subscription
- Success/error messages via Ant Design
- Smooth animations and transitions

No payment integration yet - subscription creates record in database for future payment processing.
```

## File Structure

```
frontend/src/
├── app/
│   └── pricing/
│       └── page.tsx                    # Pricing page component
├── features/
│   └── subscription/
│       ├── hooks/
│       │   └── useSubscriptionQuery.ts # React Query hooks
│       └── index.ts                    # Feature exports
├── services/
│   ├── subscription.service.ts         # API service
│   └── index.ts                        # Updated exports
└── routes/
    └── index.ts                        # Added PRICING route
```

## API Integration

### Endpoints Used:
1. `GET /api/plans/` - Fetch subscription plans
2. `POST /api/subscribe/` - Create subscription
3. `GET /api/my-subscription/` - Get user subscription

### Request/Response:

**Get Plans:**
```typescript
GET /api/plans/
Response: {
  results: [
    {
      id: 1,
      name: "Basic",
      price: "9.99",
      swap_limit_per_month: 10,
      priority_support: false,
      is_active: true
    }
  ]
}
```

**Subscribe:**
```typescript
POST /api/subscribe/
Body: {
  plan_id: 1,
  duration_months: 1
}
Response: {
  success: true,
  message: "Subscription created successfully",
  subscription: { ... }
}
```

## Design Specifications

### Colors:
- Primary: Black (#000000)
- Background: Gray-50 to Gray-100 gradient
- Cards: White with shadows
- Accent: Green-500 for checkmarks
- Text: Gray-900, Gray-700, Gray-600

### Typography:
- Heading: 4xl-5xl, bold
- Subheading: xl-2xl, semibold
- Body: base, regular
- Price: 4xl, bold

### Spacing:
- Card padding: 8 (2rem)
- Grid gap: 6 (1.5rem)
- Section margins: 16-20 (4-5rem)

### Effects:
- Hover scale: 105%
- Shadow: lg to xl on hover
- Transitions: 200-300ms
- Border radius: 2xl (1rem)

## Usage

Navigate to `/pricing` to view the pricing page. Users can:
1. View all available subscription plans
2. Compare features across plans
3. Click "Subscribe Now" to subscribe (requires authentication)
4. See loading state during subscription
5. Receive success/error feedback

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Plan comparison table
- Annual billing option with discount
- Usage analytics per plan
- Plan upgrade/downgrade flow
- Subscription management page
- Invoice generation
- Proration calculations
