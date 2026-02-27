# Auth Feature Module

Complete authentication feature module with Redux store, actions, selectors, and custom hooks.

## Structure

```
features/auth/
├── store/
│   ├── authSlice.ts       # Redux Toolkit slice
│   ├── authActions.ts     # Thunk actions
│   ├── authSelectors.ts   # Memoized selectors
│   └── index.ts           # Store barrel export
├── hooks/
│   ├── useAuth.ts         # Custom auth hook
│   └── index.ts           # Hooks barrel export
├── index.ts               # Main barrel export
└── README.md              # This file
```

## Usage

### Using the useAuth Hook (Recommended)

The `useAuth` hook provides a clean interface to all auth functionality:

```typescript
import { useAuth } from '@/features/auth';

function MyComponent() {
  const {
    // State
    user,
    isAuthenticating,
    isSigningUp,
    isSigningIn,
    vehicles,
    profile,
    
    // Actions
    signin,
    signup,
    signout,
    listVehicles,
    getProfile,
    updateProfile,
  } = useAuth();

  const handleSignin = async () => {
    await signin({ email, password });
  };

  return <div>...</div>;
}
```

### Using Redux Directly

For more control, use Redux directly:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { authActions, selectUser, selectIsAuthenticating } from '@/features/auth';

function MyComponent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticating = useSelector(selectIsAuthenticating);

  const handleSignin = () => {
    dispatch(authActions.handleSignin({ email, password }));
  };

  return <div>...</div>;
}
```

## API Reference

### State

```typescript
interface AuthState {
  isAuthenticated: boolean;      // User authentication status
  isAuthenticating: boolean;     // Loading state for auth operations
  isSigningUp: boolean;          // Signup in progress
  isSigningIn: boolean;          // Signin in progress
  user: any | null;              // Current user object
  userType: string;              // User type (consumer/producer)
  vehicles: any[];               // Available vehicles list
  profile: any;                  // User profile data
  profileLoading: boolean;       // Profile fetch loading
  profileUpdating: boolean;      // Profile update loading
}
```

### Actions

#### `handleSetUser(user)`
Set user from cache (used on app initialization)

```typescript
dispatch(authActions.handleSetUser(cachedUser));
```

#### `handleListVehicles()`
Fetch list of available vehicles

```typescript
dispatch(authActions.handleListVehicles());
```

#### `handleSignup(data)`
Register a new user

```typescript
dispatch(authActions.handleSignup({
  name: "John Doe",
  email: "john@example.com",
  vehicle: "vehicle_id",
  password: "password123",
  userType: "consumer"
}));
```

#### `handleSignin(data)`
Sign in existing user

```typescript
dispatch(authActions.handleSignin({
  email: "john@example.com",
  password: "password123"
}));
```

#### `handleSignout()`
Sign out current user

```typescript
dispatch(authActions.handleSignout());
```

#### `handleGetProfile(callback?)`
Fetch user profile

```typescript
dispatch(authActions.handleGetProfile((user) => {
  console.log('Profile loaded:', user);
}));
```

#### `handleUpdateProfile(data)`
Update user profile

```typescript
dispatch(authActions.handleUpdateProfile({
  name: "John Updated",
  phone: "1234567890",
  vehicle: "new_vehicle_id"
}));
```

### Selectors

```typescript
import {
  selectAuth,              // Entire auth state
  selectUser,              // Current user
  selectIsAuthenticated,   // Auth status
  selectIsAuthenticating,  // Loading state
  selectIsSigningUp,       // Signup loading
  selectIsSigningIn,       // Signin loading
  selectUserType,          // User type
  selectVehicles,          // Vehicles list
  selectProfile,           // User profile
  selectProfileLoading,    // Profile loading
  selectProfileUpdating,   // Profile updating
} from '@/features/auth';

const user = useSelector(selectUser);
```

### useAuth Hook

Complete hook interface:

```typescript
const {
  // State
  user: any | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isSigningUp: boolean;
  isSigningIn: boolean;
  userType: string;
  vehicles: any[];
  profile: any;
  profileLoading: boolean;
  profileUpdating: boolean;
  
  // Actions
  setUser: (user: any) => void;
  listVehicles: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  signin: (data: SigninData) => Promise<void>;
  signout: () => void;
  getProfile: (callback?: (user: any) => void) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
} = useAuth();
```

## Examples

### Complete Signin Flow

```typescript
import { useAuth } from '@/features/auth';
import { useState } from 'react';

function SigninPage() {
  const { signin, isSigningIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signin({ email, password });
    // Redirect handled automatically by action
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isSigningIn}>
        {isSigningIn ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Complete Signup Flow

```typescript
import { useAuth } from '@/features/auth';
import { useEffect, useState } from 'react';

function SignupPage() {
  const { signup, listVehicles, vehicles, isSigningUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vehicle: '',
    password: '',
    userType: 'consumer'
  });

  useEffect(() => {
    listVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <select
        value={formData.vehicle}
        onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
      >
        {vehicles.map(v => (
          <option key={v.pk} value={v.pk}>{v.name}</option>
        ))}
      </select>
      <button type="submit" disabled={isSigningUp}>
        {isSigningUp ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### Profile Management

```typescript
import { useAuth } from '@/features/auth';
import { useEffect } from 'react';

function ProfilePage() {
  const {
    profile,
    profileLoading,
    profileUpdating,
    getProfile,
    updateProfile,
    signout
  } = useAuth();

  useEffect(() => {
    getProfile();
  }, []);

  const handleUpdate = async (data) => {
    await updateProfile(data);
  };

  if (profileLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <button onClick={signout}>Sign Out</button>
    </div>
  );
}
```

## Migration from Old Redux

### Before (Old Redux)
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../redux/auth';

const { user } = useSelector(state => state.auth);
dispatch(authActions.handleSignin({ email, password }));
```

### After (New Feature Module)
```typescript
import { useAuth } from '@/features/auth';

const { user, signin } = useAuth();
signin({ email, password });
```

## Benefits

1. **Encapsulation**: All auth logic in one place
2. **Type Safety**: Full TypeScript support
3. **Reusability**: Easy to use across components
4. **Testability**: Isolated and mockable
5. **Modern**: Uses Redux Toolkit best practices
6. **Clean API**: Simple hook interface

## Testing

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '@/features/auth';

test('useAuth provides auth state', () => {
  const { result } = renderHook(() => useAuth());
  
  expect(result.current.user).toBeDefined();
  expect(result.current.signin).toBeInstanceOf(Function);
});
```
