# Commit 1: Configure Django Channels with Redis Infrastructure

```
feat: configure Django Channels with Redis for WebSocket support

Add Django Channels and Redis infrastructure for real-time WebSocket
communication. This is the foundation for real-time station inventory
updates.

Changes:
- Add Django Channels dependencies (channels, channels-redis, daphne, redis)
- Configure ASGI application in settings.py
- Update asgi.py with ProtocolTypeRouter for HTTP/WebSocket handling
- Add Redis channel layer configuration
- Add REDIS_URL environment variable to .env and .env.example
- Create CHANNELS_SETUP.md documentation

Dependencies added:
- channels==4.0.0 (WebSocket support)
- channels-redis==4.2.0 (Redis channel layer backend)
- daphne==4.1.0 (ASGI server)
- redis==5.0.1 (Python Redis client)

Configuration:
- ASGI_APPLICATION = "batteryswap.asgi.application"
- CHANNEL_LAYERS with Redis backend
- REDIS_URL defaults to redis://localhost:6379/0

Files modified:
- requirements.txt (added 4 new dependencies)
- batteryswap/settings.py (added Channels configuration)
- batteryswap/asgi.py (configured ProtocolTypeRouter)
- .env (added REDIS_URL)
- .env.example (added REDIS_URL with documentation)

Files created:
- CHANNELS_SETUP.md (complete setup documentation)

Installation:
1. Install Redis: sudo apt install redis-server (Ubuntu)
2. Install dependencies: pip install -r requirements.txt
3. Start Redis: sudo systemctl start redis-server
4. Verify: redis-cli ping (should return PONG)

Testing:
python manage.py shell
>>> import channels.layers
>>> from asgiref.sync import async_to_sync
>>> channel_layer = channels.layers.get_channel_layer()
>>> async_to_sync(channel_layer.send)('test', {'type': 'test'})

Running:
- Development: python manage.py runserver (still works)
- Production: daphne -b 0.0.0.0 -p 8000 batteryswap.asgi:application

Next steps:
- Commit 2: Create WebSocket consumers and routing
- Commit 3: Integrate with station inventory updates

Notes:
- Daphne must be first in INSTALLED_APPS
- Redis must be running for Channels to work
- WebSocket routing will be added in next commit
- This commit only sets up infrastructure, no functional changes
```

## Short Version

```
feat: add Django Channels and Redis infrastructure

- Install channels, channels-redis, daphne, redis
- Configure ASGI application and channel layers
- Add Redis URL to environment configuration
- Create setup documentation

Installation: pip install -r requirements.txt
Requires: Redis server running on localhost:6379
```
