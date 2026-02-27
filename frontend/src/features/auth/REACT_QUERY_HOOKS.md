# Auth React Query Hooks

React Query implementation of auth feature hooks.

## useAuthQuery Hook

Modern React Query version of authentication management with automatic caching, background refetching, and optimistic updates.

### Import

```typescript
import { useAuthQuery } from '@/features/auth';
```

### API Reference

#### State

```typescript
const {
  // User data
  user: any | null;                    // Current user from cache
  isAuthenticated: boolean;            // Authentication status
  profile: any | null;                 // User profile (from query)
  profileLoading: boolean;             // Profile fetch loading
  
  // Vehicles
  vehicles: any[];                     // Available vehicles list
  vehiclesLoading: boolean;            // Vehicles fetch loading
  
  // Loading states
  isSigningUp: boolean;                // Signup mutation pending
  isSigningIn: boolean;                // Signin mutation pending
  isUpdatingProfile: boolean;          // Update mutation pending
  
  // Actions
  signup: (data: SignupData) => void;
  signin: (data: SigninData) => void;
  signout: () => void;
  updateProfile: (data: UpdateProfileData) => void;
  getProfile: (callback?: (user: any) => void) => Promise<void>;
  refetchProfile: () => Promise<void>;
} = useAuthQuery();
```

#### Interfaces

```typescript
interface SignupData {
  name: string;
  email: string;
  vehicle: string | number;
  password: string;
  userType: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  vehicle?: string | number;
}
```

### Usage Examples

#### Basic Authentication

```typescript
import { useAuthQuery } from '@/features/auth';

function SigninPage() {
  const { signin, isSigningIn } = useAuthQuery();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    signin({ email, password });
    // Automatically redirects on success
    // Shows error message on failure
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={isSigningIn}>
        {isSigningIn ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

#### User Profile

```typescript
import { useAuthQuery } from '@/features/auth';

function ProfilePage() {
  const {
    profile,
    profileLoading,
    updateProfile,
    isUpdatingProfile,
    signout
  } = useAuthQuery();

  if (profileLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>{profile?.email}</p>
      <button onClick={() => updateProfile({ name: 'New Name' })}>
        {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
      </button>
      <button onClick={signout}>Sign Out</button>
    </div>
  );
}
```

#### Vehicle Selection

```typescript
import { useAuthQuery } from '@/features/auth';

function SignupPage() {
  const { vehicles, vehiclesLoading, signup, isSigningUp } = useAuthQuery();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vehicle: '',
    password: '',
    userType: 'consumer'
  });

  if (vehiclesLoading) return <div>Loading vehicles...</div>;

  return (
    <form onSubmit={() => signup(formData)}>
      <select
        value={formData.vehicle}
        onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
      >
        <option value="">Select Vehicle</option>
        {vehicles.map(v => (
          <option key={v.pk} value={v.pk}>{v.name}</option>
        ))}
      </select>
      <button disabled={isSigningUp}>
        {isSigningUp ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

## Key Features

### Automatic Caching
- Profile data cached for 10 minutes
- Vehicles cached for 30 minutes
- Automatic background refetching

### Optimistic Updates
- Immediate UI updates on mutations
- Automatic rollback on errors
- Cache invalidation on success

### Error Handling
- Automatic error messages via Ant Design
- Success notifications
- Graceful error recovery

### Type Safety
- Full TypeScript support
- Type-safe mutations
- Inferred return types

## Comparison: Redux vs React Query

### Redux (Old)
```typescript
const { user, isSigningIn } = useSelector(state => state.auth);
const dispatch = useDispatch();

const handleSignin = () => {
  dispatch(authActions.handleSignin({ email, password }));
};
```

### React Query (New)
```typescript
const { user, signin, isSigningIn } = useAuthQuery();

const handleSignin = () => {
  signin({ email, password });
};
```

**Benefits:**
- 50% less code
- Automatic caching
- Better loading states
- Automatic error handling
- No Redux boilerplate

## Cache Management

### Query Keys
```typescript
queryKeys.auth.user()       // ['auth', 'user']
queryKeys.auth.profile()    // ['auth', 'profile']
queryKeys.auth.vehicles()   // ['auth', 'vehicles']
```

### Manual Cache Invalidation
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

const queryClient = useQueryClient();

// Invalidate all auth queries
queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
```

## Migration Guide

### Step 1: Import New Hook
```typescript
// Old
import { useAuth } from '@/features/auth';

// New (both work during migration)
import { useAuth, useAuthQuery } from '@/features/auth';
```

### Step 2: Replace Hook Usage
```typescript
// Old
const { user, signin } = useAuth();

// New
const { user, signin } = useAuthQuery();
```

### Step 3: Update Loading States
```typescript
// Old
const { isSigningIn } = useAuth();

// New (same name!)
const { isSigningIn } = useAuthQuery();
```

### Step 4: Test Thoroughly
- Verify signin/signup flows
- Check profile updates
- Test signout functionality
- Verify error handling

## Best Practices

1. **Use the hook at component level**
   ```typescript
   function MyComponent() {
     const { user, signin } = useAuthQuery();
     // ...
   }
   ```

2. **Handle loading states**
   ```typescript
   if (profileLoading) return <Loader />;
   ```

3. **Check authentication**
   ```typescript
   if (!isAuthenticated) return <SigninPrompt />;
   ```

4. **Use optimistic updates**
   ```typescript
   updateProfile(data); // UI updates immediately
   ```

## Troubleshooting

### Profile not loading
- Check if user is authenticated
- Verify access token in cache
- Check network tab for API calls

### Mutations not working
- Verify mutation is not pending
- Check error messages in console
- Ensure data format is correct

### Cache not updating
- Check query key matches
- Verify invalidation is called
- Use React Query DevTools to inspect

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
