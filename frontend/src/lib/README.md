# Library Configuration

This directory contains configuration and setup for third-party libraries used in the application.

## React Query Configuration

### File: `react-query.ts`

Configures React Query (TanStack Query) for server state management.

#### Query Client Configuration

```typescript
import { queryClient } from '@/lib/react-query';
```

**Default Settings:**
- `refetchOnWindowFocus`: false - Don't refetch when window regains focus
- `retry`: 1 - Retry failed requests once
- `staleTime`: 5 minutes - Data is fresh for 5 minutes
- `gcTime`: 10 minutes - Unused data cached for 10 minutes

#### Query Keys

Centralized query key factory for consistent cache management:

```typescript
import { queryKeys } from '@/lib/react-query';

// Auth keys
queryKeys.auth.user()           // ['auth', 'user']
queryKeys.auth.profile()        // ['auth', 'profile']
queryKeys.auth.vehicles()       // ['auth', 'vehicles']

// Stations keys
queryKeys.stations.list(lat, lng)           // ['stations', 'list', { latitude, longitude }]
queryKeys.stations.detail(id, lat, lng)     // ['stations', 'detail', id, { latitude, longitude }]

// Bookings keys
queryKeys.bookings.list()                   // ['bookings', 'list']
queryKeys.bookings.detail(id, lat, lng)     // ['bookings', 'detail', id, { latitude, longitude }]
```

#### Benefits of Query Keys

1. **Type Safety**: TypeScript ensures correct key usage
2. **Consistency**: Same keys used across the app
3. **Cache Invalidation**: Easy to invalidate related queries
4. **Hierarchical**: Nested structure for related data

#### Example Usage

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { StationsService } from '@/services';

// Query
const { data, isLoading } = useQuery({
  queryKey: queryKeys.stations.list(latitude, longitude),
  queryFn: () => StationsService.findNearbyStations(userId, { latitude, longitude }),
});

// Mutation with cache invalidation
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (data) => UsersService.bookBattery(data),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });
  },
});
```

## React Query DevTools

The React Query DevTools are automatically included in development mode:

- **Access**: Click the React Query icon in the bottom-right corner
- **Features**:
  - View all queries and their states
  - Inspect query data and errors
  - Manually refetch or invalidate queries
  - Monitor cache and garbage collection
  - Debug query behavior

**Note**: DevTools are automatically excluded from production builds.

## Adding New Libraries

When adding new library configurations:

1. Create a new file: `lib/library-name.ts`
2. Export configuration and utilities
3. Document usage in this README
4. Import and use in `app/providers.tsx` if needed

## Best Practices

### Query Keys
- Use the centralized `queryKeys` factory
- Keep keys hierarchical and consistent
- Include dynamic parameters in keys

### Configuration
- Keep default options conservative
- Override per-query when needed
- Document any custom configurations

### Cache Management
- Invalidate related queries after mutations
- Use optimistic updates for better UX
- Set appropriate stale times based on data volatility

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [DevTools Guide](https://tanstack.com/query/latest/docs/react/devtools)
