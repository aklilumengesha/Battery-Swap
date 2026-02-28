# Quick Start Guide

## First Time Setup

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build the project
npm run build

# 3. Start development server
npm run dev
```

Visit: http://localhost:3001

## Daily Development

### Starting Development
```bash
npm run dev
```

### After Making Changes

**Minor changes (components, styles):**
- Just save the file
- Hot reload will update automatically

**Major changes (new dependencies, config changes):**
```bash
# Stop server (Ctrl+C)
npm run rebuild
npm run dev
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server on port 3001

# Building
npm run build            # Production build
npm run rebuild          # Clean + build
npm run start            # Start production server

# Cleaning
npm run clean            # Remove .next folder
npm run clean:all        # Remove .next, node_modules, package-lock.json
npm run fresh            # Complete fresh install and build

# Code Quality
npm run lint             # Run ESLint

# Dependencies
npm run install:legacy   # Install with legacy peer deps
```

## Troubleshooting

### Nothing displays / 404 errors

**Problem:**
```
GET http://localhost:3001/_next/static/chunks/main-app.js 404
```

**Solution:**
```bash
# Stop server (Ctrl+C)
npm run rebuild
npm run dev
```

### Port already in use

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Then start again
npm run dev
```

### Module not found errors

**Solution:**
```bash
npm run clean:all
npm install --legacy-peer-deps
npm run build
npm run dev
```

### Styles not updating

**Solution:**
```bash
# Stop server (Ctrl+C)
npm run clean
npm run dev
```

## Project Structure

```
batterySwap/frontend/
├── src/
│   ├── app/              # Next.js app directory (pages)
│   ├── components/       # Reusable components
│   │   ├── layout/      # Layout components (Appbar, Navbar)
│   │   ├── shared/      # Shared components
│   │   └── ui/          # UI components
│   ├── features/        # Feature modules
│   │   ├── auth/        # Authentication
│   │   └── stations/    # Stations management
│   ├── lib/             # Library configurations
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   │   ├── design-tokens.css
│   │   └── globals.css
│   └── utils/           # Utility functions
├── public/              # Static assets
└── package.json
```

## Key Features

### Design System
- Inter font family
- 200+ design tokens
- Glassmorphism effects
- Modern color palette
- Responsive utilities

### State Management
- React Query for server state
- Local state with hooks
- No Redux (migrated)

### Styling
- Tailwind CSS
- CSS Variables
- Design tokens
- Ant Design components

### Navigation
- Modern glassmorphism bottom nav
- Floating container
- Smooth animations
- Active state indicators

## Environment

### Required
- Node.js 18+
- npm 9+

### Ports
- Frontend: 3001
- Backend: 8000
- Redis: 6379

## Backend Connection

The frontend connects to:
- API: http://localhost:8000
- WebSocket: ws://localhost:8000/ws/

Make sure backend is running:
```bash
cd ../backend
.\venv\Scripts\activate
python manage.py runserver
```

## Build for Production

```bash
# Build
npm run build

# Start production server
npm run start
```

## Getting Help

1. Check `TROUBLESHOOTING.md` for common issues
2. Check `DESIGN_SYSTEM.md` for styling guide
3. Check browser console for errors
4. Check terminal for build errors

## Tips

### Fast Refresh
- Save files to see changes instantly
- No need to restart for most changes

### When to Restart
- After installing dependencies
- After changing config files
- After major refactoring
- When seeing cache errors

### Performance
- Use `npm run rebuild` instead of manual clean + build
- Use `--legacy-peer-deps` for faster installs
- Clear `.next` folder if build is slow

### Best Practices
- Always stop server before pulling updates
- Run `npm run rebuild` after switching branches
- Keep dependencies up to date
- Use design tokens for styling
- Follow component structure

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Fix cache | `npm run rebuild` then `npm run dev` |
| Fresh start | `npm run fresh` then `npm run dev` |
| Install deps | `npm install --legacy-peer-deps` |
| Check errors | Check browser console + terminal |

## Success Indicators

✅ Server starts without errors
✅ Page loads at http://localhost:3001
✅ No 404 errors in console
✅ Hot reload works
✅ Styles load correctly
✅ Navigation works

## Need More Help?

- `TROUBLESHOOTING.md` - Detailed troubleshooting
- `DESIGN_SYSTEM.md` - Design system guide
- `BUILD_CACHE_FIX.md` - Cache issue solutions
- `BOTTOM_NAV_REDESIGN.md` - Navigation documentation
