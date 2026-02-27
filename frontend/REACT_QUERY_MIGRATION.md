# React Query Migration Guide

## Overview

This document tracks the migration from Redux to React Query for server state management.

## Migration Strategy

### Phase 1: Setup (Commit 1) ✅
- Install React Query dependencies
- Configure Query Client
- Add QueryClientProvider to app
- Keep Redux running in parallel

### Phase 2: Create React Query Hooks (Commit 2)
- Create React Query versions of hooks
- Implement queries and mutations
- Keep Redux hooks for comparison

### Phase 3: Remove Redux (Commit 3)
- Remove Redux Provider
- Remove Redux store configuration
- Keep Redux logic in features for reference

## Commit 1: Install React Query and Setup Provider

### Changes Made

#### 1. Dependencies Added
```json
"@tanstack/react-query": "^5.62.11"
"@tanstack/react-query-devtools": "^5.62.11"
```

#### 2. Files Created
- `src/lib/react-query.ts` - Query client configuration and query keys
- `src/lib/README.md` - Documentation for library configurations

#### 3. Files Modified
- `package.json` - Added React Query dependencies
- `src/app/providers.tsx` - Added QueryClientProvider (alongside Redux)

### Installation Steps

After pulling these changes, run:

```bash
cd frontend
npm install
```

### What's New

#### Query Client Configuration

The query client is configured with sensible defaults:
- 5-minute stale time (data stays fresh)
- 10-minute cache time (unused data cleanup)
- 1 retry on failed requests
- No refetch on window focus

#### Query Keys Factory

Centralized query keys for consistent cache management:

```typescript
import { queryKeys } from '@/lib/react-query';

// Examples
queryKeys.auth.user()
queryKeys.stations.list(lat, lng)
queryKeys.bookings.detail(id)
```

#### React Query DevTools

Available in development mode:
- Click the icon in bottom-right corner
- Inspect queries, cache, and state
- Debug query behavior
- Monitor performance

### Current State

**Both Redux and React Query are now running in parallel:**
- Redux: Still handling all state management
- React Query: Configured and ready, but not used yet

**Next Steps:**
- Commit 2: Create React Query hooks for auth and stations
- Commit 3: Remove Redux and switch to React Query

### Benefits of React Query

1. **Automatic Caching**: Smart caching with configurable stale times
2. **Background Refetching**: Keep data fresh automatically
3. **Optimistic Updates**: Update UI before server responds
4. **Request Deduplication**: Prevent duplicate requests
5. **Pagination & Infinite Queries**: Built-in support
6. **DevTools**: Powerful debugging tools
7. **Less Boilerplate**: No actions, reducers, or thunks needed
8. **Better TypeScript**: Excellent type inference

### Comparison: Redux vs React Query

#### Redux (Current)
```typescript
// Define slice
const slice = createSlice({ ... });

// Define thunk action
const fetchStations = () => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await api.getStations();
  dispatch(setStations(data));
  dispatch(setLoading(false));
};

// Use in component
const { stations, loading } = useSelector(state => state.stations);
const dispatch = useDispatch();
useEffect(() => {
  dispatch(fetchStations());
}, []);
```

#### React Query (Coming in Commit 2)
```typescript
// Use in component
const { data: stations, isLoading } = useQuery({
  queryKey: queryKeys.stations.list(lat, lng),
  queryFn: () => StationsService.findNearbyStations(userId, { lat, lng }),
});
```

**Result**: 80% less code, automatic caching, better performance!

### Testing

After installation, verify:
1. App runs without errors: `npm run dev`
2. React Query DevTools appear in bottom-right corner
3. Redux still works (no functionality broken)
4. No console errors

### Rollback Plan

If issues arise:
1. Remove React Query from `providers.tsx`
2. Remove `@tanstack/react-query` imports
3. Run `npm uninstall @tanstack/react-query @tanstack/react-query-devtools`
4. App continues working with Redux

### Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Migration Guide](https://tanstack.com/query/latest/docs/react/guides/migrating-to-react-query-4)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)

---

**Status**: Commit 1 Complete ✅
**Next**: Commit 2 - Create React Query Hooks


---

## Commit 2: Create React Query Hooks for Features

### Changes Made

#### 1. Files Created

**Auth Feature:**
- `src/features/auth/hooks/useAuthQuery.ts` - React Query version of auth hook
- `src/features/auth/REACT_QUERY_HOOKS.md` - Complete documentation

**Stations Feature:**
- `src/features/stations/hooks/useStationsQuery.ts` - React Query version of stations hook
- `src/features/stations/REACT_QUERY_HOOKS.md` - Complete documentation

#### 2. Files Modified

- `src/features/auth/hooks/index.ts` - Added useAuthQuery export
- `src/features/stations/hooks/index.ts` - Added useStationsQuery exports

### New Hooks Overview

#### useAuthQuery

React Query implementation of authentication:

```typescript
import { useAuthQuery } from '@/features/auth';

const {
  // State
  user,
  isAuthenticated,
  profile,
  profileLoading,
  vehicles,
  vehiclesLoading,
  isSigningUp,
  isSigningIn,
  isUpdatingProfile,
  
  // Actions
  signup,
  signin,
  signout,
  updateProfile,
  getProfile,
  refetchProfile,
} = useAuthQuery();
```

**Features:**
- Automatic profile caching (10 minutes)
- Vehicles caching (30 minutes)
- Optimistic updates
- Automatic error handling
- Success notifications

#### useStationsQuery

React Query implementation of stations and bookings:

```typescript
import {
  useNearbyStations,
  useStation,
  useBookings,
  useBooking,
  useStationsQuery
} from '@/features/stations';

// Convenience hooks
const { data: stations, isLoading } = useNearbyStations(latitude, longitude);
const { data: station, isLoading } = useStation(id, latitude, longitude);
const { data: bookings, isLoading } = useBookings();
const { data, isLoading } = useBooking(id, latitude, longitude);

// Or use main hook
const { bookBattery, isBooking } = useStationsQuery();
```

**Features:**
- Location-based caching
- Automatic refetching (1-2 minutes)
- Smart query enabling
- Dependent queries support
- Optimistic booking updates

### Key Improvements

#### 1. Less Boilerplate

**Before (Redux):**
```typescript
// 15+ lines
const { stationList, loadingList } = useSelector(state => state.stations);
const dispatch = useDispatch();

useEffect(() => {
  if (latitude && longitude) {
    dispatch(stationsActions.handleListStations(latitude, longitude));
  }
}, [latitude, longitude, dispatch]);
```

**After (React Query):**
```typescript
// 3 lines
const { data: stationList, isLoading: loadingList } = useNearbyStations(
  latitude,
  longitude
);
```

#### 2. Automatic Caching

- Profile: 10 minutes
- Vehicles: 30 minutes
- Stations: 2 minutes (location-based)
- Bookings: 1 minute

#### 3. Better TypeScript

- Full type inference
- Type-safe mutations
- Proper error types

#### 4. Smart Features

- Automatic background refetching
- Request deduplication
- Optimistic updates
- Query enabling/disabling

### Usage Examples

#### Auth Example

```typescript
import { useAuthQuery } from '@/features/auth';

function SigninPage() {
  const { signin, isSigningIn } = useAuthQuery();
  
  const handleSubmit = () => {
    signin({ email, password });
    // Automatically redirects on success
    // Shows error message on failure
  };

  return (
    <button onClick={handleSubmit} disabled={isSigningIn}>
      {isSigningIn ? 'Signing in...' : 'Sign In'}
    </button>
  );
}
```

#### Stations Example

```typescript
import { useNearbyStations, useStationsQuery } from '@/features/stations';

function HomePage() {
  const { data: stations, isLoading } = useNearbyStations(latitude, longitude);
  const { bookBattery, isBooking } = useStationsQuery();

  if (isLoading) return <Loader />;

  return (
    <div>
      {stations?.map(station => (
        <StationCard key={station.pk} station={station} />
      ))}
    </div>
  );
}
```

### Current State

**Both Redux and React Query hooks are now available:**
- Redux hooks: `useAuth`, `useStations` (still working)
- React Query hooks: `useAuthQuery`, `useStationsQuery` (ready to use)

**Pages still use Redux hooks** - No breaking changes yet!

**Next Steps:**
- Commit 3: Remove Redux Provider and store
- Future: Migrate pages to use React Query hooks (optional)

### Testing

After pulling these changes:

1. **Verify both hooks work:**
   ```typescript
   // Old (still works)
   const { user } = useAuth();
   
   // New (also works)
   const { user } = useAuthQuery();
   ```

2. **Test React Query DevTools:**
   - Open app in browser
   - Click React Query icon (bottom-right)
   - Should see no queries yet (not used in pages)

3. **No functionality broken:**
   - All pages still work with Redux
   - No console errors
   - App runs normally

### Documentation

Complete documentation available:
- `src/features/auth/REACT_QUERY_HOOKS.md` - Auth hooks guide
- `src/features/stations/REACT_QUERY_HOOKS.md` - Stations hooks guide
- `src/lib/README.md` - React Query configuration

### Benefits Summary

| Feature | Redux | React Query |
|---------|-------|-------------|
| Code Lines | 100% | 30% |
| Caching | Manual | Automatic |
| Loading States | Manual | Automatic |
| Error Handling | Manual | Automatic |
| TypeScript | Good | Excellent |
| DevTools | Basic | Advanced |
| Background Refetch | No | Yes |
| Optimistic Updates | Manual | Built-in |

### Rollback Plan

If issues arise:
1. Simply don't use the new hooks
2. Continue using Redux hooks
3. Remove new hook files if desired
4. No breaking changes to existing code

---

**Status**: Commit 2 Complete ✅
**Next**: Commit 3 - Remove Redux Store
