# Troubleshooting Guide

## Common Issues and Solutions

### Error: Cannot find module './440.js' (or similar numbered module)

**Symptom:**
```
Server Error
Error: Cannot find module './440.js'
Require stack:
- C:\django\batterySwap\frontend\.next\server\webpack-runtime.js
```

Or in browser console:
```
GET http://localhost:3001/_next/static/chunks/main-app.js net::ERR_ABORTED 404
GET http://localhost:3001/_next/static/chunks/app-pages-internals.js net::ERR_ABORTED 404
```

**Cause:**
This is a Next.js build cache issue. It occurs when:
- The development server is running with stale cached modules
- Files were modified or deleted while the server was running
- Build artifacts are out of sync with source code
- Dev server wasn't restarted after rebuild

**Solution:**
Delete the `.next` folder, rebuild, and restart dev server:

```bash
# Step 1: Stop the dev server (Ctrl+C)

# Step 2: Clean and rebuild
npm run rebuild

# Step 3: Start dev server again
npm run dev
```

**Quick Fix:**
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next
npm run build
npm run dev

# Or use the clean script
npm run clean
npm run build
npm run dev
```

**Prevention:**
- Always restart dev server after major changes
- Use `npm run rebuild` before starting dev server
- Clear cache when switching branches
- Stop server before pulling updates

**Important:** After running `npm run rebuild`, you MUST restart the dev server for changes to take effect.

---

### Build Warnings (Safe to Ignore)

**Warning: React Hook useEffect has missing dependencies**
```
./src/components/layout/AuthLayout.tsx
30:6  Warning: React Hook useEffect has missing dependencies
```

**Status:** Safe to ignore - intentional design decision for auth flow.

**Warning: Using `<img>` instead of `<Image />`**
```
./src/components/shared/AuthLabel.tsx
10:7  Warning: Using `<img>` could result in slower LCP
```

**Status:** Safe to ignore - these are small decorative images.

---

### Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

### Module Not Found Errors

**Symptom:**
```
Module not found: Can't resolve 'some-module'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or with legacy peer deps (if needed)
npm install --legacy-peer-deps
```

---

### TypeScript Errors After Updates

**Symptom:**
```
Type error: Cannot find module or its corresponding type declarations
```

**Solution:**
```bash
# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build
```

---

### Styles Not Updating

**Symptom:**
- CSS changes not reflecting in browser
- Old styles still showing

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear browser cache
# Chrome: Ctrl+Shift+Delete
# Or hard refresh: Ctrl+Shift+R

# Restart dev server
npm run dev
```

---

### React Query DevTools Not Showing

**Symptom:**
- DevTools panel not visible in development

**Solution:**
- Check if `NODE_ENV` is set to 'development'
- Verify `@tanstack/react-query-devtools` is installed
- Check browser console for errors
- Try toggling with keyboard shortcut (if configured)

---

### WebSocket Connection Failed

**Symptom:**
```
WebSocket connection failed
```

**Solution:**
1. Check if backend server is running
2. Verify Redis is running: `docker ps | grep redis`
3. Check WebSocket URL in code
4. Ensure CORS settings allow WebSocket connections

---

### Database Connection Errors (Backend)

**Symptom:**
```
django.db.utils.OperationalError: could not connect to server
```

**Solution:**
```bash
# Check if PostgreSQL is running
# Verify .env file has correct DATABASE_URL
# Run migrations
python manage.py migrate
```

---

## Quick Fixes

### Clean Everything
```bash
# Frontend
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Backend
cd backend
rm -rf __pycache__ **/__pycache__
pip install -r requirements.txt
python manage.py migrate
```

### Restart All Services
```bash
# Stop all
# Ctrl+C in all terminals

# Start Redis
docker start redis

# Start Backend
cd backend
.\venv\Scripts\activate
python manage.py runserver

# Start Frontend
cd frontend
npm run dev
```

---

## Getting Help

If issues persist:

1. Check the error message carefully
2. Search in project documentation
3. Check GitHub issues
4. Review recent commits for breaking changes
5. Ask in team chat with:
   - Error message
   - Steps to reproduce
   - What you've tried
   - Environment details

---

## Useful Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run clean        # Clean build artifacts

# Backend
python manage.py runserver              # Start server
python manage.py migrate                # Run migrations
python manage.py test_websocket         # Test WebSocket
python manage.py createsuperuser        # Create admin user

# Docker
docker ps                               # List running containers
docker start redis                      # Start Redis
docker stop redis                       # Stop Redis
docker logs redis                       # View Redis logs
```

---

## Environment Check

Before reporting issues, verify:

- [ ] Node.js version: 18+ (`node --version`)
- [ ] npm version: 9+ (`npm --version`)
- [ ] Python version: 3.8+ (`python --version`)
- [ ] Redis running (`docker ps | grep redis`)
- [ ] Dependencies installed (`node_modules` exists)
- [ ] Environment variables set (`.env` file exists)
- [ ] No port conflicts (3000, 8000, 6379)
- [ ] Sufficient disk space
- [ ] No firewall blocking connections
