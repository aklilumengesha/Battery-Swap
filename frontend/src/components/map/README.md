# Map Components

Leaflet map components for displaying station locations and interactive maps.

## Installation

Already installed:
```bash
npm install leaflet react-leaflet @types/leaflet --legacy-peer-deps
```

## Components

### MapWrapper

Wrapper component that handles dynamic import to avoid SSR issues in Next.js.

**Usage:**
```tsx
import MapWrapper from "@/components/map/MapWrapper";

<MapWrapper>
  <YourMapComponent />
</MapWrapper>
```

### StationMap

Example map component showing stations with markers.

**Props:**
- `center`: `[latitude, longitude]` - Map center coordinates
- `zoom`: `number` - Initial zoom level (default: 13)
- `stations`: `Station[]` - Array of station objects
- `className`: `string` - Custom CSS classes

**Station Interface:**
```typescript
interface Station {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}
```

**Usage:**
```tsx
import MapWrapper from "@/components/map/MapWrapper";
import StationMap from "@/components/map/StationMap";

<MapWrapper>
  <StationMap 
    center={[28.6139, 77.2090]} 
    zoom={13}
    stations={stationList}
    className="h-96 w-full rounded-xl"
  />
</MapWrapper>
```

## Important Notes

### Next.js SSR

Leaflet requires the `window` object which is not available during server-side rendering. Always wrap map components with `MapWrapper` or use dynamic import:

```tsx
import dynamic from "next/dynamic";

const StationMap = dynamic(
  () => import("@/components/map/StationMap"),
  { ssr: false }
);
```

### Marker Icons

Default Leaflet marker icons need to be configured for Next.js. The `StationMap` component includes the fix:

```typescript
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
```

### CSS Import

Leaflet CSS is imported globally in `src/styles/globals.css`:

```css
@import 'leaflet/dist/leaflet.css';
```

## TypeScript Support

TypeScript definitions are included via `@types/leaflet`. All components are fully typed.

## Examples

### Basic Map
```tsx
<MapWrapper>
  <StationMap center={[28.6139, 77.2090]} />
</MapWrapper>
```

### Map with Stations
```tsx
const stations = [
  {
    id: 1,
    name: "Station A",
    latitude: 28.6139,
    longitude: 77.2090,
    address: "123 Main St"
  },
  {
    id: 2,
    name: "Station B",
    latitude: 28.6239,
    longitude: 77.2190,
    address: "456 Oak Ave"
  }
];

<MapWrapper>
  <StationMap 
    center={[28.6139, 77.2090]}
    zoom={14}
    stations={stations}
  />
</MapWrapper>
```

### Custom Styling
```tsx
<MapWrapper>
  <StationMap 
    center={[28.6139, 77.2090]}
    className="h-screen w-full"
  />
</MapWrapper>
```

## Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
