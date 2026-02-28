# WebSocket Testing Guide

## Prerequisites
✅ Redis is running (check with `docker ps`)
✅ Backend dependencies installed (`pip install -r requirements.txt`)
✅ Database migrated (`python manage.py migrate`)

## Testing Steps

### 1. Check Redis Connection
```bash
docker exec redis redis-cli ping
# Should return: PONG
```

### 2. Start Django Server
```bash
# In backend directory
python manage.py runserver
```

The server should start without errors. Look for:
```
Daphne running, listening on 127.0.0.1:8000
```

### 3. Test WebSocket with Management Command

**Terminal 1** (Keep server running):
```bash
python manage.py runserver
```

**Terminal 2** (Run test command):
```bash
# Test all stations
python manage.py test_websocket

# Test specific station (if you have station with ID 1)
python manage.py test_websocket --station-id 1
```

Expected output:
```
Testing WebSocket broadcasting...
Broadcasting to all stations...
✓ Broadcast successful!
Message sent to: stations_all
```

### 4. Test WebSocket from Browser Console

**Step 1**: Open browser and go to `http://localhost:8000`

**Step 2**: Open browser console (F12)

**Step 3**: Connect to WebSocket:
```javascript
// Connect to all stations channel
const ws = new WebSocket('ws://localhost:8000/ws/stations/');

ws.onopen = () => {
    console.log('✅ Connected to WebSocket');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('📨 Message received:', data);
};

ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
};

ws.onclose = () => {
    console.log('🔌 WebSocket closed');
};
```

**Step 4**: In another terminal, trigger a broadcast:
```bash
python manage.py test_websocket
```

**Expected Result**: You should see the message in browser console:
```javascript
📨 Message received: {
    type: "inventory_update",
    station_id: null,
    available_batteries: 10,
    booked_batteries: 5,
    timestamp: "2024-02-28T..."
}
```

### 5. Test Specific Station Channel

```javascript
// Connect to specific station (replace 1 with actual station ID)
const ws = new WebSocket('ws://localhost:8000/ws/stations/1/');

ws.onopen = () => console.log('✅ Connected to station 1');
ws.onmessage = (e) => console.log('📨 Update:', JSON.parse(e.data));
```

Then trigger:
```bash
python manage.py test_websocket --station-id 1
```

### 6. Test Real-Time Booking Flow

**Terminal 1**: Server running
```bash
python manage.py runserver
```

**Browser Console**: Connect WebSocket
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/stations/1/');
ws.onmessage = (e) => console.log('Update:', JSON.parse(e.data));
```

**Terminal 2**: Make a booking via API
```bash
# You'll need to authenticate first and get a token
# Then make a POST request to book a battery
curl -X POST http://localhost:8000/user/orders/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"station": 1, "battery": 1}'
```

**Expected**: Browser console should show real-time update!

### 7. Test User Notifications (Authenticated)

This requires authentication. First, get your user ID and token from login.

```javascript
// Connect to user notifications (replace with your user ID)
const ws = new WebSocket('ws://localhost:8000/ws/notifications/');

ws.onopen = () => console.log('✅ Connected to notifications');
ws.onmessage = (e) => console.log('🔔 Notification:', JSON.parse(e.data));
```

## Troubleshooting

### WebSocket Won't Connect

**Check 1**: Is Redis running?
```bash
docker ps | grep redis
```

**Check 2**: Is server running with Daphne?
```bash
# Look for "Daphne running" in server output
python manage.py runserver
```

**Check 3**: Check Redis URL in .env
```bash
cat .env | grep REDIS_URL
# Should be: REDIS_URL=redis://localhost:6379/0
```

### No Messages Received

**Check 1**: Is WebSocket connected?
```javascript
// Check readyState (1 = OPEN)
console.log(ws.readyState);
```

**Check 2**: Run test command
```bash
python manage.py test_websocket
```

**Check 3**: Check server logs for errors

### Redis Connection Error

**Start Redis**:
```bash
docker start redis
```

**Or create new Redis container**:
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

## Success Indicators

✅ Server starts with "Daphne running"
✅ `redis-cli ping` returns PONG
✅ WebSocket connects (onopen fires)
✅ Test command shows "Broadcast successful"
✅ Browser console receives messages
✅ Real-time updates work on booking

## Message Types You'll See

### Station Updates
```javascript
{
    type: "inventory_update",
    station_id: 1,
    available_batteries: 5,
    booked_batteries: 2
}
```

### Battery Booked
```javascript
{
    type: "battery_booked",
    station_id: 1,
    battery_id: 10,
    user_id: 5
}
```

### Battery Collected
```javascript
{
    type: "battery_collected",
    station_id: 1,
    battery_id: 10
}
```

### User Notifications
```javascript
{
    type: "booking_confirmed",
    message: "Battery booked successfully",
    order_id: 15
}
```

## Next Steps

Once WebSocket is working:
1. Integrate WebSocket in React frontend
2. Create useWebSocket hook
3. Update UI in real-time
4. Add notification system

See `WEBSOCKET_COMPLETE.md` for frontend integration examples.
