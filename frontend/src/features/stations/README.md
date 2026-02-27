# Stations Feature Module

Complete stations and bookings feature module with Redux store, actions, selectors, and custom hooks.

## Structure

```
features/stations/
├── store/
│   ├── stationsSlice.ts       # Redux Toolkit slice
│   ├── stationsActions.ts     # Thunk actions
│   ├── stationsSelectors.ts   # Memoized selectors
│   └── index.ts               # Store barrel export
├── hooks/
│   ├── useStations.ts         # Custom stations hook
│   └── index.ts               # Hooks barrel export
├── index.ts                   # Main barrel export
└── README.md                  # This file
```

## Usage

### Using the useStations Hook (Recommended)

The `useStations` hook provides a clean interface to all stations functionality:

```typescript
import { useStations } from '@/features/stations';

function StationsPage() {
  const {
    // Basic State
    stationList,
    loadingList,
    station,
    bookingStation,
    bookings,
    
    // Computed State
    availableStations,
    nearestStation,
    completedBookings,
    pendingBookings,
    
    // Actions
    listStations,
    getStation,
    bookBattery,
    listBookings,
    getBooking,
  } = useStations();

  useEffect(() => {
    listStations(latitude, longitude);
  }, [latitude, longitude]);

  return <div>...</div>;
}
```

### Using Redux Directly

For more control, use Redux directly:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import {
  stationsActions,
  selectStationList,
  selectLoadingList
} from '@/features/stations';

function StationsPage() {
  const dispatch = useDispatch();
  const stationList = useSelector(selectStationList);
  const loadingList = useSelector(selectLoadingList);

  const fetchStations = () => {
    dispatch(stationsActions.handleListStations(latitude, longitude));
  };

  return <div>...</div>;
}
```

## API Reference

### State

```typescript
interface StationsState {
  stationList: Station[];        // List of nearby stations
  loadingList: boolean;          // Loading state for station list
  station: Station | null;       // Current selected station
  loadingStation: boolean;       // Loading state for single station
  bookingStation: boolean;       // Booking in progress
  bookings: Booking[];           // User's bookings/orders
  loadingBookings: boolean;      // Loading state for bookings list
  booking: Booking | null;       // Current selected booking
  loadingBooking: boolean;       // Loading state for single booking
}

interface Station {
  pk?: string | number;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  available_batteries?: number;
  [key: string]: any;
}

interface Booking {
  pk?: string | number;
  station?: Station;
  battery?: any;
  status?: string;
  created_at?: string;
  [key: string]: any;
}
```

### Actions

#### `handleListStations(latitude, longitude)`
Fetch nearby stations based on user location

```typescript
dispatch(stationsActions.handleListStations(37.7749, -122.4194));
```

#### `handleGetStation(id, latitude, longitude)`
Fetch single station details with distance calculation

```typescript
dispatch(stationsActions.handleGetStation('station_123', 37.7749, -122.4194));
```

#### `handleBookBattery(data)`
Book a battery at a station

```typescript
dispatch(stationsActions.handleBookBattery({
  station: 'station_123',
  battery: 'battery_456'
}));
```

#### `handleListBookings()`
Fetch list of user's bookings/orders

```typescript
dispatch(stationsActions.handleListBookings());
```

#### `handleGetBooking(id, latitude, longitude)`
Fetch single booking/order details with station info

```typescript
dispatch(stationsActions.handleGetBooking('order_789', 37.7749, -122.4194));
```

### Selectors

#### Basic Selectors
```typescript
import {
  selectStationsState,      // Entire stations state
  selectStationList,        // Station list
  selectLoadingList,        // Loading list state
  selectStation,            // Current station
  selectLoadingStation,     // Loading station state
  selectBookingStation,     // Booking in progress
  selectBookings,           // Bookings list
  selectLoadingBookings,    // Loading bookings state
  selectBooking,            // Current booking
  selectLoadingBooking,     // Loading booking state
} from '@/features/stations';

const stationList = useSelector(selectStationList);
```

#### Computed Selectors
```typescript
import {
  selectAvailableStations,   // Stations with available batteries
  selectNearestStation,       // Closest station to user
  selectCompletedBookings,    // Completed orders
  selectPendingBookings,      // Pending orders
} from '@/features/stations';

const availableStations = useSelector(selectAvailableStations);
const nearestStation = useSelector(selectNearestStation);
```

### useStations Hook

Complete hook interface:

```typescript
const {
  // Basic State
  stationList: Station[];
  loadingList: boolean;
  station: Station | null;
  loadingStation: boolean;
  bookingStation: boolean;
  bookings: Booking[];
  loadingBookings: boolean;
  booking: Booking | null;
  loadingBooking: boolean;
  
  // Computed State
  availableStations: Station[];
  nearestStation: Station | null;
  completedBookings: Booking[];
  pendingBookings: Booking[];
  
  // Actions
  listStations: (latitude: number, longitude: number) => Promise<void>;
  getStation: (id: string | number, latitude: number, longitude: number) => Promise<void>;
  bookBattery: (data: BookBatteryData) => Promise<void>;
  listBookings: () => Promise<void>;
  getBooking: (id: string | number, latitude: number, longitude: number) => Promise<void>;
} = useStations();
```

## Examples

### List Nearby Stations

```typescript
import { useStations } from '@/features/stations';
import { useEffect } from 'react';

function HomePage() {
  const { stationList, loadingList, listStations } = useStations();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      listStations(latitude, longitude);
    });
  }, []);

  if (loadingList) return <div>Loading stations...</div>;

  return (
    <div>
      {stationList.map((station) => (
        <StationCard key={station.pk} station={station} />
      ))}
    </div>
  );
}
```

### View Station Details

```typescript
import { useStations } from '@/features/stations';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

function StationDetailsPage() {
  const { id } = useParams();
  const { station, loadingStation, getStation } = useStations();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      getStation(id, latitude, longitude);
    });
  }, [id]);

  if (loadingStation) return <div>Loading...</div>;

  return (
    <div>
      <h1>{station?.name}</h1>
      <p>{station?.address}</p>
      <p>Distance: {station?.distance?.toFixed(2)} km</p>
      <p>Available Batteries: {station?.available_batteries}</p>
    </div>
  );
}
```

### Book a Battery

```typescript
import { useStations } from '@/features/stations';
import { useState } from 'react';

function BookingForm({ stationId, batteryId }) {
  const { bookBattery, bookingStation } = useStations();

  const handleBook = async () => {
    await bookBattery({
      station: stationId,
      battery: batteryId
    });
    // Redirect handled automatically by action
  };

  return (
    <button onClick={handleBook} disabled={bookingStation}>
      {bookingStation ? 'Booking...' : 'Book Battery'}
    </button>
  );
}
```

### View Booking History

```typescript
import { useStations } from '@/features/stations';
import { useEffect } from 'react';

function HistoryPage() {
  const {
    bookings,
    loadingBookings,
    completedBookings,
    pendingBookings,
    listBookings
  } = useStations();

  useEffect(() => {
    listBookings();
  }, []);

  if (loadingBookings) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pending Orders ({pendingBookings.length})</h2>
      {pendingBookings.map((booking) => (
        <BookingCard key={booking.pk} booking={booking} />
      ))}

      <h2>Completed Orders ({completedBookings.length})</h2>
      {completedBookings.map((booking) => (
        <BookingCard key={booking.pk} booking={booking} />
      ))}
    </div>
  );
}
```

### View Order Details

```typescript
import { useStations } from '@/features/stations';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

function OrderDetailsPage() {
  const { id } = useParams();
  const {
    booking,
    station,
    loadingBooking,
    loadingStation,
    getBooking
  } = useStations();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      getBooking(id, latitude, longitude);
    });
  }, [id]);

  if (loadingBooking || loadingStation) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{booking?.pk}</h1>
      <p>Status: {booking?.status}</p>
      <p>Created: {booking?.created_at}</p>
      
      <h2>Station Details</h2>
      <p>{station?.name}</p>
      <p>{station?.address}</p>
      <p>Distance: {station?.distance?.toFixed(2)} km</p>
    </div>
  );
}
```

### Using Computed Selectors

```typescript
import { useStations } from '@/features/stations';

function StationsList() {
  const {
    availableStations,
    nearestStation,
    loadingList
  } = useStations();

  if (loadingList) return <div>Loading...</div>;

  return (
    <div>
      {nearestStation && (
        <div className="nearest-station">
          <h3>Nearest Station</h3>
          <StationCard station={nearestStation} highlighted />
        </div>
      )}

      <h3>Available Stations ({availableStations.length})</h3>
      {availableStations.map((station) => (
        <StationCard key={station.pk} station={station} />
      ))}
    </div>
  );
}
```

## Migration from Old Redux

### Before (Old Redux)
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { stationsActions } from '../../redux/stations';

const { stationList } = useSelector(state => state.stations);
dispatch(stationsActions.handleListStations(lat, lng));
```

### After (New Feature Module)
```typescript
import { useStations } from '@/features/stations';

const { stationList, listStations } = useStations();
listStations(lat, lng);
```

## Benefits

1. **Encapsulation**: All stations logic in one place
2. **Type Safety**: Full TypeScript support with interfaces
3. **Reusability**: Easy to use across components
4. **Testability**: Isolated and mockable
5. **Modern**: Uses Redux Toolkit best practices
6. **Clean API**: Simple hook interface
7. **Computed State**: Memoized selectors for derived data
8. **Performance**: Optimized with createSelector

## Testing

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useStations } from '@/features/stations';

test('useStations provides stations state', () => {
  const { result } = renderHook(() => useStations());
  
  expect(result.current.stationList).toBeDefined();
  expect(result.current.listStations).toBeInstanceOf(Function);
  expect(result.current.bookBattery).toBeInstanceOf(Function);
});

test('availableStations filters correctly', () => {
  const { result } = renderHook(() => useStations());
  
  // Mock stations with and without batteries
  // Test that availableStations only includes stations with batteries > 0
});
```

## Advanced Usage

### Combining with Auth

```typescript
import { useAuth } from '@/features/auth';
import { useStations } from '@/features/stations';

function ProtectedStationsPage() {
  const { isAuthenticated, user } = useAuth();
  const { stationList, listStations } = useStations();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigator.geolocation.getCurrentPosition((position) => {
        listStations(position.coords.latitude, position.coords.longitude);
      });
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <div>Please login</div>;

  return <StationsList stations={stationList} />;
}
```

### Real-time Location Updates

```typescript
import { useStations } from '@/features/stations';
import { useEffect, useState } from 'react';

function LiveStationsMap() {
  const { listStations, stationList } = useStations();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Watch position for real-time updates
    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      listStations(latitude, longitude);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return <Map stations={stationList} userLocation={location} />;
}
```
