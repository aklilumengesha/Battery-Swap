# WebSocket API Documentation

## Overview

The Battery Swap application provides real-time updates via WebSocket connections for station inventory and user notifications.

## WebSocket Endpoints

### 1. All Stations Updates

**URL**: `ws://localhost:8000/ws/stations/`

Subscribe to updates for all stations in the system.

**Connection**:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/stations/');

ws.onopen = () => {
    console.log('Connected to all stations');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Update received:', data);
};
```

### 2. Specific Station Updates

**URL**: `ws://localhost:8000/ws/stations/{station_id}/`

Subscribe to updates for a specific station.

**Example**:
```javascript
const stationId = 1;
const ws = new WebSocket(`ws://localhost:8000/ws/stations/${stationId}/`);
```

### 3. User Notifications

**URL**: `ws://localhost:8000/ws/notifications/`

Receive personal notifications (requires authentication).

**Example**:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
```

## Message Types

### Connection Established

Sent when connection is successfully established.

```json
{
    "type": "connection_established",
    "message": "Connected to station_1",
    "station_id": 1
}
```

### Inventory Update

Sent when station inventory changes.

```json
{
    "type": "inventory_update",
    "station_id": 1,
    "station_name": "Downtown Station",
    "available_batteries": 15,
    "booked_batteries": 3,
    "total_batteries": 18,
    "timestamp": "2024-02-27T10:30:00",
    "action": "update"
}
```

**Actions**: `update`, `add`, `book`, `collect`

### Battery Booked

Sent when a battery is booked from a station.

```json
{
    "type": "battery_booked",
    "station_id": 1,
    "station_name": "Downtown Station",
    "battery_id": 5,
    "available_batteries": 14,
    "booked_batteries": 4,
    "user": "user@example.com",
    "timestamp": "2024-02-27T10:30:00"
}
```

### Battery Collected

Sent when a booked battery is collected.

```json
{
    "type": "battery_collected",
    "station_id": 1,
    "station_name": "Downtown Station",
    "battery_id": 5,
    "available_batteries": 14,
    "booked_batteries": 3,
    "timestamp": "2024-02-27T10:35:00"
}
```

### Battery Added

Sent when a new battery is added to a station.

```json
{
    "type": "battery_added",
    "station_id": 1,
    "station_name": "Downtown Station",
    "battery_id": 20,
    "available_batteries": 16,
    "total_batteries": 19,
    "timestamp": "2024-02-27T10:40:00"
}
```

### Station Status

Sent when station operational status changes.

```json
{
    "type": "station_status",
    "station_id": 1,
    "station_name": "Downtown Station",
    "status": "online",
    "message": "Station is now operational",
    "timestamp": "2024-02-27T10:45:00"
}
```

**Status values**: `online`, `offline`, `maintenance`

### Booking Confirmed (User Notifications)

Sent to user when their booking is confirmed.

```json
{
    "type": "booking_confirmed",
    "booking_id": 123,
    "station_name": "Downtown Station",
    "battery_info": "Tesla Battery - Model 3",
    "message": "Battery booked successfully at Downtown Station",
    "timestamp": "2024-02-27T10:30:00"
}
```

### Booking Ready (User Notifications)

Sent to user when their battery is ready for collection.

```json
{
    "type": "booking_ready",
    "booking_id": 123,
    "station_name": "Downtown Station",
    "message": "Your battery is ready for collection at Downtown Station",
    "timestamp": "2024-02-27T10:50:00"
}
```

### General Notification (User Notifications)

General notification message for users.

```json
{
    "type": "notification",
    "title": "System Update",
    "message": "New features available!",
    "level": "info",
    "timestamp": "2024-02-27T11:00:00"
}
```

**Levels**: `info`, `success`, `warning`, `error`

## Client-to-Server Messages

### Ping

Keep connection alive and test connectivity.

**Send**:
```json
{
    "type": "ping",
    "timestamp": "2024-02-27T10:30:00"
}
```

**Receive**:
```json
{
    "type": "pong",
    "timestamp": "2024-02-27T10:30:00"
}
```

## Frontend Integration Examples

### React Hook for Station Updates

```javascript
import { useEffect, useState } from 'react';

export const useStationWebSocket = (stationId) => {
    const [inventory, setInventory] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const url = stationId 
            ? `ws://localhost:8000/ws/stations/${stationId}/`
            : 'ws://localhost:8000/ws/stations/';
        
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'inventory_update' || 
                data.type === 'battery_booked' || 
                data.type === 'battery_collected') {
                setInventory({
                    available: data.available_batteries,
                    booked: data.booked_batteries,
                    total: data.total_batteries
                });
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, [stationId]);

    return { inventory, isConnected };
};
```

### Usage in Component

```javascript
import { useStationWebSocket } from './hooks/useStationWebSocket';

function StationDetail({ stationId }) {
    const { inventory, isConnected } = useStationWebSocket(stationId);

    return (
        <div>
            <h2>Station Inventory</h2>
            {isConnected && <span>🟢 Live</span>}
            {inventory && (
                <div>
                    <p>Available: {inventory.available}</p>
                    <p>Booked: {inventory.booked}</p>
                    <p>Total: {inventory.total}</p>
                </div>
            )}
        </div>
    );
}
```

### User Notifications Hook

```javascript
export const useUserNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/notifications/');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'notification' || 
                data.type === 'booking_confirmed' || 
                data.type === 'booking_ready') {
                setNotifications(prev => [...prev, data]);
            }
        };

        return () => ws.close();
    }, []);

    return notifications;
};
```

## Testing WebSocket Connections

### Using Browser Console

```javascript
// Connect to all stations
const ws = new WebSocket('ws://localhost:8000/ws/stations/');

ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('Error:', e);
ws.onclose = () => console.log('Disconnected');

// Send ping
ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
```

### Using Python (for testing)

```python
import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws/stations/"
    
    async with websockets.connect(uri) as websocket:
        # Receive connection message
        message = await websocket.recv()
        print(f"Received: {message}")
        
        # Send ping
        await websocket.send(json.dumps({
            'type': 'ping',
            'timestamp': '2024-02-27T10:30:00'
        }))
        
        # Receive pong
        response = await websocket.recv()
        print(f"Response: {response}")
        
        # Listen for updates
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            print(f"Update: {data}")

asyncio.run(test_websocket())
```

## Authentication

User notification WebSocket requires authentication. The authentication is handled by Django Channels' `AuthMiddlewareStack`.

For authenticated connections, include session cookies or JWT token in the WebSocket connection.

## Error Handling

### Connection Errors

```javascript
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Implement reconnection logic
};

ws.onclose = (event) => {
    if (event.code !== 1000) {
        // Abnormal closure, attempt reconnection
        setTimeout(() => {
            // Reconnect logic
        }, 5000);
    }
};
```

### Invalid JSON

If invalid JSON is sent, server responds with:

```json
{
    "type": "error",
    "message": "Invalid JSON"
}
```

## Production Considerations

1. **SSL/TLS**: Use `wss://` instead of `ws://` in production
2. **Authentication**: Implement proper token-based authentication
3. **Rate Limiting**: Implement rate limiting for WebSocket connections
4. **Reconnection**: Implement exponential backoff for reconnections
5. **Heartbeat**: Send periodic pings to keep connection alive
6. **Error Handling**: Implement comprehensive error handling

## Next Steps

- Commit 3 will integrate these WebSocket updates with actual station views
- Signals will be added to automatically trigger updates on database changes
- Frontend components will be created to consume these WebSocket updates

---

**Status**: WebSocket infrastructure complete ✅
**Next**: Integrate with station inventory logic
