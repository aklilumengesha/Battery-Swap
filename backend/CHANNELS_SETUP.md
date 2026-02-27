# Django Channels Setup with Redis

This document describes the Django Channels and Redis configuration for real-time WebSocket support.

## Overview

Django Channels extends Django to handle WebSockets, HTTP2, and other protocols. We use Redis as the channel layer backend for production-ready message passing between different instances of the application.

## Dependencies Installed

- `channels==4.0.0` - Django Channels for WebSocket support
- `channels-redis==4.2.0` - Redis channel layer backend
- `daphne==4.1.0` - ASGI server for Django Channels
- `redis==5.0.1` - Python Redis client

## Configuration

### 1. ASGI Application

The application is configured to use ASGI (Asynchronous Server Gateway Interface) instead of WSGI for handling both HTTP and WebSocket connections.

**File: `batteryswap/asgi.py`**
- Configured `ProtocolTypeRouter` to handle different protocol types
- HTTP requests are handled by Django's ASGI application
- WebSocket routing will be added in the next commit

### 2. Settings Configuration

**File: `batteryswap/settings.py`**

Added to `INSTALLED_APPS`:
```python
"daphne",  # Must be first
"channels",
```

ASGI application setting:
```python
ASGI_APPLICATION = "batteryswap.asgi.application"
```

Channel layers configuration:
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.getenv("REDIS_URL", "redis://localhost:6379/0")],
        },
    },
}
```

### 3. Environment Variables

**File: `.env` and `.env.example`**

Added Redis configuration:
```
REDIS_URL=redis://localhost:6379/0
```

Format for different environments:
- **Local development**: `redis://localhost:6379/0`
- **Production with auth**: `redis://username:password@host:port/db_number`
- **Redis Cloud**: `redis://default:password@host:port`

## Installation

### 1. Install Redis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows:**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use WSL2 with Ubuntu

**Docker:**
```bash
docker run -d -p 6379:6379 redis:latest
```

### 2. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Verify Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

### 4. Test Channel Layers

```bash
python manage.py shell
```

```python
import channels.layers
from asgiref.sync import async_to_sync

channel_layer = channels.layers.get_channel_layer()
async_to_sync(channel_layer.send)('test_channel', {'type': 'test.message', 'text': 'Hello'})
# Should not raise any errors
```

## Running the Application

### Development Server

Use Daphne (ASGI server) instead of Django's runserver:

```bash
# Option 1: Using Daphne directly
daphne -b 0.0.0.0 -p 8000 batteryswap.asgi:application

# Option 2: Using Django's runserver (still works for development)
python manage.py runserver
```

### Production Deployment

For production, use Daphne with a process manager like Supervisor or systemd:

```bash
daphne -b 0.0.0.0 -p 8000 batteryswap.asgi:application
```

Or with Gunicorn + Uvicorn workers:
```bash
gunicorn batteryswap.asgi:application -k uvicorn.workers.UvicornWorker
```

## Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ WebSocket/HTTP
       │
┌──────▼──────┐
│   Daphne    │
│ ASGI Server │
└──────┬──────┘
       │
       │
┌──────▼──────────────┐
│  Django Channels    │
│  Protocol Router    │
├─────────────────────┤
│  HTTP │  WebSocket  │
└───┬───┴──────┬──────┘
    │          │
    │          │
┌───▼───┐  ┌──▼──────────┐
│ Django│  │  WebSocket  │
│ Views │  │  Consumers  │
└───────┘  └──────┬──────┘
                  │
           ┌──────▼──────┐
           │    Redis    │
           │Channel Layer│
           └─────────────┘
```

## Next Steps

1. **Commit 2**: Create WebSocket consumers and routing
2. **Commit 3**: Integrate WebSocket updates with station inventory

## Troubleshooting

### Redis Connection Error

**Error**: `redis.exceptions.ConnectionError: Error connecting to Redis`

**Solution**:
1. Check if Redis is running: `redis-cli ping`
2. Verify REDIS_URL in .env file
3. Check firewall settings

### Channel Layer Not Working

**Error**: `channels.exceptions.ChannelFull`

**Solution**:
1. Increase Redis memory: Edit `/etc/redis/redis.conf`
2. Set `maxmemory-policy allkeys-lru`
3. Restart Redis

### Import Errors

**Error**: `ModuleNotFoundError: No module named 'channels'`

**Solution**:
```bash
pip install -r requirements.txt
```

## Resources

- [Django Channels Documentation](https://channels.readthedocs.io/)
- [Redis Documentation](https://redis.io/documentation)
- [Daphne Documentation](https://github.com/django/daphne)
- [ASGI Specification](https://asgi.readthedocs.io/)

## Security Notes

1. **Production Redis**: Always use authentication and encryption
2. **CORS Settings**: Update CORS_ORIGIN_WHITELIST for WebSocket origins
3. **Rate Limiting**: Implement rate limiting for WebSocket connections
4. **Authentication**: WebSocket authentication will be added in Commit 2

---

**Status**: Infrastructure setup complete ✅
**Next**: Create WebSocket consumers and routing
