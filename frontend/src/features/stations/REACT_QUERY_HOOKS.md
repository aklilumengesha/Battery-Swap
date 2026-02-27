# Stations React Query Hooks

React Query implementation of stations and bookings feature hooks.

## useStationsQuery Hook

Modern React Query version of stations management with automatic caching, location-based queries, and optimistic updates.

### Import

```typescript
import { useStationsQuery } from '@/features/stations';

// Or use convenience hooks directly
import {
  useNearbyStations,
  useStation,
  useBookings,
  useBooking
} from '@/features/stations';
```

### API Reference

#### Main Hook

```typescript
const {
  // Query hooks
  useNearbyStations: (lat?: number, lng?: number) => QueryResult;
  useStation: (id?: string | number, lat?: number, lng?: number) => QueryResult;
  useBookings: () => QueryResult;
  useBooking: (id?: string | number, lat?: number, lng?: number) => QueryResult;
  
  // Mutations
  bookBattery: (data: BookBatteryData) => void;
  isBooking: boolean;
} = useStationsQuery();
```

#### Convenience Hooks

```typescript
// Direct hooks for simpler usage
const { data, isLoading, error } = useNearbyStations(latitude, longitude);
const { data, isLoading, error } = useStation(id, latitude, longitude);
const { data, isLoading, error } = useBookings();
const { data, isLoading, error } = useBooking(id, latitude, longitude);
```

#### Interfaces

```typescript
interface BookBatteryData {
  station?: string | number;
  battery?: string | number;
}
```

### Usage Examples

#### List Nearby Stations

```typescript
import { useNearbyStations } from '@/features/stations';

function HomePage() {
  const [location, setLocation] = useState<{latitude: number, longitude: number}>();
  
  const { data: stations, isLoading, error } = useNearbyStations(
    location?.latitude,
    location?.longitude
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
    });
  }, []);

  if (isLoading) return <div>Loading stations...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {stations?.map(station => (
        <StationCard key={station.pk} station={station} />
      ))}
    </div>
  );
}
```

#### Station Details

```typescript
import { useStation, useStationsQuery } from '@/features/stations';
import { useParams } from 'next/navigation';

function StationDetailsPage() {
  const params = useParams();
  const [location, setLocation] = useState<{latitude: number, longitude: number}>();
  const { bookBattery, isBooking } = useStationsQuery();
  
  const { data: station, isLoading } = useStation(
    params.id,
    location?.latitude,
    location?.longitude
  );

  const [selectedBattery, setSelectedBattery] = useState(null);

  const handleBook = () => {
    if (selectedBattery) {
      bookBattery({
        station: params.id,
        battery: selectedBattery.pk
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{station?.name}</h1>
      <p>Distance: {station?.distance?.toFixed(2)} km</p>
      <p>Available: {station?.available_batteries}</p>
      
      {station?.batteries?.map(battery => (
        <BatteryCard
          key={battery.pk}
          battery={battery}
          selected={selectedBattery?.pk === battery.pk}
          onClick={() => setSelectedBattery(battery)}
        />
      ))}
      
      <button onClick={handleBook} disabled={!selectedBattery || isBooking}>
        {isBooking ? 'Booking...' : 'Book Battery'}
      </button>
    </div>
  );
}
```

#### Booking History

```typescript
import { useBookings } from '@/features/stations';

function HistoryPage() {
  const { data: bookings, isLoading } = useBookings();

  if (isLoading) return <div>Loading bookings...</div>;

  const pending = bookings?.filter(b => b.status === 'pending') || [];
  const completed = bookings?.filter(b => b.status === 'completed') || [];

  return (
    <div>
      <h2>Pending Orders ({pending.length})</h2>
      {pending.map(booking => (
        <BookingCard key={booking.pk} booking={booking} />
      ))}

      <h2>Completed Orders ({completed.length})</h2>
      {completed.map(booking => (
        <BookingCard key={booking.pk} booking={booking} />
      ))}
    </div>
  );
}
```

#### Order Details

```typescript
import { useBooking } from '@/features/stations';
import { useParams } from 'next/navigation';

function OrderDetailsPage() {
  const params = useParams();
  const [location, setLocation] = useState<{latitude: number, longitude: number}>();
  
  const { data, isLoading } = useBooking(
    params.id,
    location?.latitude,
    location?.longitude
  );

  if (isLoading) return <div>Loading...</div>;

  const { booking, station } = data || {};

  return (
    <div>
      <h1>Order #{booking?.pk}</h1>
      <p>Status: {booking?.status}</p>
      <p>Station: {station?.name}</p>
      <p>Distance: {station?.distance?.toFixed(2)} km</p>
      <p>Battery: {booking?.battery?.company?.name}</p>
      <p>Price: Rs {booking?.battery?.price}</p>
    </div>
  );
}
```

## Key Features

### Location-Based Caching
- Stations cached per location (2 minutes)
- Automatic refetch when location changes
- Efficient cache key structure

### Automatic Refetching
- Bookings refetch every minute
- Stations refetch on stale data
- Background updates without loading states

### Optimistic Updates
- Immediate UI feedback on booking
- Automatic cache invalidation
- Rollback on errors

### Smart Query Enabling
- Queries only run when data is available
- Prevents unnecessary API calls
- Better performance

## Cache Management

### Query Keys

```typescript
// Stations
queryKeys.stations.list(lat, lng)           // ['stations', 'list', { latitude, longitude }]
queryKeys.stations.detail(id, lat, lng)     // ['stations', 'detail', id, { latitude, longitude }]

// Bookings
queryKeys.bookings.list()                   // ['bookings', 'list']
queryKeys.bookings.detail(id, lat, lng)     // ['bookings', 'detail', id, { latitude, longitude }]
```

### Manual Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

const queryClient = useQueryClient();

// Invalidate all stations
queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });

// Invalidate specific location
queryClient.invalidateQueries({
  queryKey: queryKeys.stations.list(latitude, longitude)
});

// Invalidate all bookings
queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
```

## Comparison: Redux vs React Query

### Redux (Old)
```typescript
const { stationList, loadingList } = useSelector(state => state.stations);
const dispatch = useDispatch();

useEffect(() => {
  if (latitude && longitude) {
    dispatch(stationsActions.handleListStations(latitude, longitude));
  }
}, [latitude, longitude, dispatch]);
```

### React Query (New)
```typescript
const { data: stationList, isLoading: loadingList } = useNearbyStations(
  latitude,
  longitude
);
```

**Benefits:**
- 70% less code
- Automatic caching per location
- No manual useEffect needed
- Automatic cleanup
- Better TypeScript inference

## Advanced Usage

### Prefetching

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

function StationsList() {
  const queryClient = useQueryClient();
  
  const handleHover = (stationId: string) => {
    // Prefetch station details on hover
    queryClient.prefetchQuery({
      queryKey: queryKeys.stations.detail(stationId, lat, lng),
      queryFn: () => StationsService.getStation(stationId, { lat, lng })
    });
  };

  return (
    <div>
      {stations.map(station => (
        <div key={station.pk} onMouseEnter={() => handleHover(station.pk)}>
          {station.name}
        </div>
      ))}
    </div>
  );
}
```

### Dependent Queries

```typescript
function OrderWithStation() {
  // First query: Get booking
  const { data: bookingData } = useBooking(orderId);
  
  // Second query: Get station (depends on booking)
  const { data: station } = useStation(
    bookingData?.booking?.station?.pk,
    latitude,
    longitude
  );
  
  // Station query only runs after booking is loaded
}
```

### Polling

```typescript
function LiveStationStatus() {
  const { data: stations } = useNearbyStations(latitude, longitude, {
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue when tab is inactive
  });

  return <StationsList stations={stations} />;
}
```

## Best Practices

1. **Always provide location when available**
   ```typescript
   const { data } = useNearbyStations(latitude, longitude);
   ```

2. **Handle loading and error states**
   ```typescript
   if (isLoading) return <Loader />;
   if (error) return <Error message={error.message} />;
   ```

3. **Use convenience hooks for simpler code**
   ```typescript
   // Prefer this
   const { data } = useNearbyStations(lat, lng);
   
   // Over this
   const { useNearbyStations: hook } = useStationsQuery();
   const { data } = hook(lat, lng);
   ```

4. **Invalidate related queries after mutations**
   ```typescript
   // Automatically handled in bookBattery mutation
   queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
   queryClient.invalidateQueries({ queryKey: queryKeys.stations.all });
   ```

## Troubleshooting

### Stations not loading
- Verify location is provided
- Check user is authenticated
- Inspect network tab for API calls

### Stale data showing
- Check staleTime configuration
- Manually invalidate if needed
- Use React Query DevTools

### Booking not updating list
- Verify cache invalidation
- Check query keys match
- Inspect DevTools for cache state

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Dependent Queries](https://tanstack.com/query/latest/docs/react/guides/dependent-queries)
- [Prefetching](https://tanstack.com/query/latest/docs/react/guides/prefetching)
