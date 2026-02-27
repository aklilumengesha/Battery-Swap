# Next.js 14 App Router Migration

## Changes Made

### 1. Package Updates
- Upgraded Next.js from 12.1.3 to 14.2.18
- Upgraded React from 18.0.0 to 18.3.1
- Upgraded Redux Toolkit and related packages
- Upgraded Ant Design from 4.x to 5.x
- Removed next-pwa (will be re-added later if needed)

### 2. Directory Structure
Created new `/src/app` directory with App Router structure:
```
src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home route (redirects to signin)
├── providers.tsx       # Client-side providers (Redux, Theme)
├── auth/
│   ├── signin/page.tsx
│   └── signup/page.tsx
├── home/page.tsx
├── profile/page.tsx
├── history/page.tsx
├── scanner/page.tsx
├── station/[id]/page.tsx
└── order/[id]/page.tsx
```

### 3. Configuration Updates
- **next.config.js**: Removed PWA config, added image domains
- **tsconfig.json**: Updated for App Router (moduleResolution: bundler)
- **tailwind.config.js**: Added app directory to content paths
- **globals.css**: Updated for Ant Design 5

### 4. Component Updates
- All pages marked with `"use client"` directive
- Updated imports from `next/router` to `next/navigation`
- Updated `useRouter()` and added `usePathname()` hooks
- AuthLayout updated for App Router navigation

### 5. Preserved Features
- All existing UI components unchanged
- Redux store and actions unchanged
- All business logic unchanged
- Styling and layouts unchanged
- API integrations unchanged

## Migration Steps to Run

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Notes

- The `/src/pages` directory is kept for reference but can be removed after testing
- All routes now use App Router conventions
- Client components explicitly marked with "use client"
- Server components can be added later for optimization
- PWA functionality removed temporarily (can be re-added with next-pwa@5.6.0+)

## Testing Checklist

- [ ] Sign in page loads
- [ ] Sign up page loads
- [ ] Home page shows stations
- [ ] Station details page works
- [ ] Booking flow works
- [ ] Profile page displays user info
- [ ] History page shows bookings
- [ ] QR scanner works
- [ ] Navigation between pages works
- [ ] Redux state persists
- [ ] Authentication flow works
