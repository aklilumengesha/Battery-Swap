# Services Layer

This directory contains all API service modules and utilities for the BatterySwap application.

## Structure

```
services/
├── api/                      # Core API utilities
│   ├── base.ts              # HTTP request methods (get, post, put, patch, del)
│   ├── cache.ts             # Session storage management
│   ├── utils.ts             # Request headers and utilities
│   └── index.ts             # API utilities barrel export
├── stations.service.ts       # Station-related API calls
├── users.service.ts          # User/Auth/Orders API calls
├── vehicles.service.ts       # Vehicle-related API calls
├── index.ts                  # Main barrel export
└── README.md                 # This file
```

## Usage

### Importing Services

```typescript
// Import specific service
import { StationsService } from '@/services';

// Import API utilities
import { Cache, get, post } from '@/services';

// Import everything
import * as Services from '@/services';
```

### Service Modules

#### StationsService
```typescript
// Find nearby stations
const stations = await StationsService.findNearbyStations(userId, {
  latitude: 10.0484417,
  longitude: 76.3310651
});

// Get station details
const station = await StationsService.getStation(stationId, {
  latitude: 10.0484417,
  longitude: 76.3310651
});
```

#### UsersService
```typescript
// Authentication
await UsersService.signup({ name, email, vehicle, password, user_type });
await UsersService.signin({ email, password });

// Orders
await UsersService.bookBattery({ station, battery });
await UsersService.listOrders();
await UsersService.getOrder(orderId);

// Profile
await UsersService.getConsumer();
await UsersService.updateConsumer({ name, phone, vehicle });
```

#### VehiclesService
```typescript
// List all vehicles
const vehicles = await VehiclesService.listVehicles();
```

### Cache Utility

```typescript
import { Cache } from '@/services';

// Check if item exists
Cache.checkItem('accessToken');

// Get item
const user = Cache.getItem('user');

// Set multiple items
Cache.setItem({
  user: userData,
  accessToken: token,
  refreshToken: refreshToken
});

// Remove item
Cache.removeItem('accessToken');

// Clear all
Cache.clear();
```

### Direct HTTP Methods

```typescript
import { get, post, put, patch, del } from '@/services';

// GET request
const response = await get('endpoint/', { param1: 'value' });

// POST request
const response = await post('endpoint/', { data: 'value' });

// PUT request
const response = await put('endpoint/', { data: 'value' });

// PATCH request
const response = await patch('endpoint/', { data: 'value' });

// DELETE request
const response = await del('endpoint/', { data: 'value' });
```

## API Response Format

All API calls return a consistent response format:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}
```

## Error Handling

Services do not handle errors internally. Error handling should be done at the action/component level:

```typescript
try {
  const response = await UsersService.signin({ email, password });
  if (response.data.success) {
    // Handle success
  } else {
    // Handle API error
  }
} catch (error) {
  // Handle network/unexpected errors
  console.error(error);
}
```

## TypeScript Support

All services include TypeScript interfaces for request/response data:

- Type-safe function parameters
- Autocomplete support
- Compile-time error checking

## Migration Notes

This services layer replaces the old `infrastructure/` directory:

- `infrastructure/api/` → `services/*.service.ts`
- `infrastructure/common/` → `services/api/`

All imports have been updated in Redux actions to use the new services layer.
