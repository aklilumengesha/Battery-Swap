# Admin Panel Testing Report

## Test Setup

### Step 1: Create Admin User ✅
**Command:**
```bash
cd backend
python manage.py shell -c "from user.models import User..."
```

**Result:**
```
Creating new admin...
User created successfully.
Admin user ready
PK: 6
is_staff: True
user_type: admin
```

**Status:** ✅ SUCCESS
- Admin user created with email: `admin@batteryswap.com`
- Password: `Admin@123`
- User type: `admin`
- Is staff: `True`
- Primary key: `6`

---

## Test Credentials
- **Email:** admin@batteryswap.com
- **Password:** Admin@123
- **Login URL:** http://localhost:3001/auth/signin

---

## Testing Checklist

### Step 2: Backend Server
- [ ] Django server running on port 8000
- [ ] No migration warnings
- [ ] Admin API endpoints accessible

### Step 3: Frontend Server
- [ ] Next.js dev server running on port 3001
- [ ] No build errors
- [ ] No TypeScript errors

### Step 4: Admin Login Test
- [ ] Navigate to http://localhost:3001/auth/signin
- [ ] Enter credentials (admin@batteryswap.com / Admin@123)
- [ ] Click sign in button
- [ ] Check redirect to /admin-panel/dashboard

### Step 5: Dashboard Page Test
- [ ] Redirects to /admin-panel/dashboard after login
- [ ] Stats cards load with data
- [ ] Shows: Total Users, Producers, Stations, Total Revenue
- [ ] Shows: Total Bookings, Paid Bookings, Pending Payment
- [ ] Recent Bookings table displays
- [ ] Live status indicator shows green dot

### Step 6: Navigation Test
Test all 5 navbar links work:
1. [ ] Dashboard link (/admin-panel/dashboard)
2. [ ] Users link (/admin-panel/users)
3. [ ] Producers link (/admin-panel/producers)
4. [ ] Stations link (/admin-panel/stations)
5. [ ] Bookings link (/admin-panel/bookings)

### Step 7: Users Page Test
- [ ] Users page loads (/admin-panel/users)
- [ ] Shows all users in list
- [ ] Search box works
- [ ] Filter buttons work (All, Producers, Consumers, Active, Inactive)
- [ ] Consumer/Producer count cards display
- [ ] Activate/Deactivate buttons visible
- [ ] User type badges show (consumer/producer)
- [ ] Status badges show (active/inactive)

### Step 8: Producers Page Test
- [ ] Producers page loads (/admin-panel/producers)
- [ ] Shows producer cards in grid
- [ ] Search box works
- [ ] Total revenue displays at top
- [ ] Each card shows: name, company, status
- [ ] Each card shows: stations, bookings, revenue stats
- [ ] Gradient purple icons display

### Step 9: Stations Page Test
- [ ] Stations page loads (/admin-panel/stations)
- [ ] Shows table with 4 columns
- [ ] Search box works
- [ ] Total batteries count displays
- [ ] Table shows: Station, Owner, Location, Batteries
- [ ] GPS coordinates display correctly
- [ ] Battery count badges show

### Step 10: Bookings Page Test
- [ ] Bookings page loads (/admin-panel/bookings)
- [ ] Shows bookings list
- [ ] Search box works
- [ ] Filter buttons work (All, Paid, Unpaid, Collected, Pending)
- [ ] Paid revenue and unpaid count display
- [ ] Each booking shows: station, producer, vehicle, date
- [ ] Payment status badges show (paid/unpaid)
- [ ] Collection status shows (collected/pending)
- [ ] Prices display correctly

---

## Console Errors Check
- [ ] No errors in browser console
- [ ] No 404 errors for API calls
- [ ] No TypeScript errors
- [ ] No React warnings

---

## API Endpoints Test
Check these endpoints return data:
- [ ] GET /api/user/admin/stats/
- [ ] GET /api/user/admin/users/
- [ ] GET /api/user/admin/producers/
- [ ] GET /api/user/admin/stations/
- [ ] GET /api/user/admin/bookings/

---

## Notes
- Admin user must have `user_type='admin'` OR `is_staff=True`
- Both conditions are checked in AdminRoute component
- Signin redirect logic prioritizes admin users first
- All pages use React Query for data fetching
- All pages wrapped with AdminRoute for access control

---

## Instructions to Complete Testing

1. **Start Backend:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser:**
   - Navigate to: http://localhost:3001/auth/signin
   - Login with: admin@batteryswap.com / Admin@123

4. **Test Each Page:**
   - Check dashboard loads
   - Click each nav link
   - Test search and filters
   - Verify data displays

5. **Check Console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

---

## Expected Results

### ✅ SUCCESS Criteria:
- Admin login redirects to /admin-panel/dashboard
- All 5 pages load without errors
- Stats and data display correctly
- Search and filters work
- No console errors
- All API calls return 200 status

### ❌ FAILURE Indicators:
- 403 Forbidden on admin API calls
- Redirect to /home instead of /admin-panel/dashboard
- Blank pages or loading states that don't resolve
- Console errors about missing routes
- TypeScript errors in browser console

---

## Troubleshooting

### If redirect fails:
- Check user.user_type === 'admin' in sessionStorage
- Check user.is_staff === true in sessionStorage
- Verify routes.ADMIN_DASHBOARD is defined
- Check useAuthQuery signin redirect logic

### If API calls fail:
- Verify Django server is running
- Check admin user has is_staff=True
- Verify backend admin views check is_admin()
- Check CORS settings allow localhost:3001

### If pages don't load:
- Check Next.js dev server is running
- Verify all admin page files exist
- Check for TypeScript compilation errors
- Verify AdminRoute and AdminLayout imports

---

## Status: READY FOR TESTING

Admin user created successfully. Ready to start servers and begin testing.
