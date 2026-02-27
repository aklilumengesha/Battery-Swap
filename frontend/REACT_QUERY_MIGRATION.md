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
