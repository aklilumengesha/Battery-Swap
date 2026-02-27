# Redux Legacy Code - Preserved for Reference

## Overview

This directory contains Redux Toolkit slices, actions, and selectors that were used before migrating to React Query. These files are **preserved for reference only** and are **not actively used** in the application.

## Why Keep This Code?

1. **Reference**: Useful for understanding the old implementation
2. **Rollback**: Easy to revert if React Query issues arise
3. **Comparison**: Compare Redux vs React Query approaches
4. **Learning**: Educational value for team members
5. **Documentation**: Shows evolution of the codebase

## Current State

### ✅ Active (React Query)
- `features/auth/hooks/useAuthQuery.ts` - **IN USE**
- `features/stations/hooks/useStationsQuery.ts` - **IN USE**

### 📦 Archived (Redux - Reference Only)
- `features/auth/store/` - Redux Toolkit implementation
  - `authSlice.ts` - Auth slice with reducers
  - `authActions.ts` - Thunk actions
  - `authSelectors.ts` - Memoized selectors
- `features/auth/hooks/useAuth.ts` - Redux-based hook

- `features/stations/store/` - Redux Toolkit implementation
  - `stationsSlice.ts` - Stations slice with reducers
  - `stationsActions.ts` - Thunk actions
  - `stationsSelectors.ts` - Memoized selectors
- `features/stations/hooks/useStations.ts` - Redux-based hook

## Migration Complete

### What Was Removed
- ❌ Redux store configuration (`src/redux/index.ts`)
- ❌ Redux Provider from `app/providers.tsx`
- ❌ Redux dependencies from `package.json`:
  - `@reduxjs/toolkit`
  - `react-redux`
  - `redux`
  - `redux-thunk`

### What Was Kept
- ✅ All Redux slices, actions, and selectors (for reference)
- ✅ Old Redux hooks (for comparison)
- ✅ Feature module structure

## If You Need to Use This Code

### Option 1: Rollback to Redux (Not Recommended)

1. Reinstall Redux dependencies:
   ```bash
   npm install @reduxjs/toolkit react-redux redux redux-thunk
   ```

2. Restore Redux store:
   ```typescript
   // src/redux/index.ts
   import { combineReducers, configureStore } from "@reduxjs/toolkit";
   import { authReducer } from "../features/auth";
   import { stationsReducer } from "../features/stations";

   const rootReducer = combineReducers({
     auth: authReducer,
     stations: stationsReducer,
   });

   export const store = configureStore({
     reducer: rootReducer,
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware({
         serializableCheck: false,
       }),
   });

   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   ```

3. Add Redux Provider back to `app/providers.tsx`:
   ```typescript
   import { Provider } from "react-redux";
   import { store } from "../redux";

   <Provider store={store}>
     {/* ... */}
   </Provider>
   ```

4. Use old hooks:
   ```typescript
   import { useAuth } from '@/features/auth';
   import { useStations } from '@/features/stations';
   ```

### Option 2: Learn from Redux Code (Recommended)

Study the Redux implementation to understand:
- How Redux Toolkit slices work
- Thunk actions for async operations
- Memoized selectors with `createSelector`
- Redux patterns and best practices

Then compare with React Query implementation to see:
- How much simpler React Query is
- Automatic caching and refetching
- Better TypeScript inference
- Less boilerplate code

## Code Comparison

### Redux Approach (Old)

```typescript
// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsSigningIn: (state, action) => {
      state.isSigningIn = action.payload;
    },
  },
});

// Thunk Action
export const handleSignin = (data) => async (dispatch) => {
  dispatch(setIsSigningIn(true));
  try {
    const res = await UsersService.signin(data);
    if (res.data.success) {
      dispatch(setUser(res.data.user));
      // ... more logic
    }
  } finally {
    dispatch(setIsSigningIn(false));
  }
};

// Hook
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isSigningIn = useSelector(selectIsSigningIn);
  
  const signin = (data) => dispatch(handleSignin(data));
  
  return { user, isSigningIn, signin };
};

// Usage
const { user, signin, isSigningIn } = useAuth();
```

### React Query Approach (New)

```typescript
// Hook (all-in-one)
export const useAuthQuery = () => {
  const signinMutation = useMutation({
    mutationFn: async (data) => {
      const res = await UsersService.signin(data);
      if (res.data.success) return res.data;
      throw new Error(res.data.message);
    },
    onSuccess: (data) => {
      Cache.setItem("user", data.user);
      window.location.href = routes.HOME;
    },
  });

  return {
    user: Cache.getItem("user"),
    signin: signinMutation.mutate,
    isSigningIn: signinMutation.isPending,
  };
};

// Usage (same!)
const { user, signin, isSigningIn } = useAuthQuery();
```

**Result**: 70% less code, automatic caching, better DX!

## Future Cleanup

These Redux files can be safely deleted in the future when:
1. React Query is proven stable in production
2. Team is comfortable with React Query
3. No need for reference anymore
4. Codebase cleanup is desired

**Recommended timeline**: 3-6 months after React Query migration

## Questions?

If you have questions about:
- Why we migrated from Redux to React Query
- How to use the new React Query hooks
- Understanding the old Redux code

See:
- `REACT_QUERY_MIGRATION.md` - Complete migration guide
- `features/auth/REACT_QUERY_HOOKS.md` - Auth hooks documentation
- `features/stations/REACT_QUERY_HOOKS.md` - Stations hooks documentation
- `lib/README.md` - React Query configuration

---

**Status**: Redux removed, React Query active ✅
**Redux Code**: Preserved for reference only 📦
**Safe to Delete**: After 3-6 months ♻️
