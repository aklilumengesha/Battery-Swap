#!/bin/bash
set -e

echo "==> Waiting for database..."
python << 'EOF'
import time, os, psycopg2
db_url = os.environ.get("DATABASE_URL", "")
for i in range(30):
    try:
        conn = psycopg2.connect(db_url)
        conn.close()
        print("Database is ready.")
        break
    except psycopg2.OperationalError:
        print(f"Database not ready, retrying ({i+1}/30)...")
        time.sleep(2)
else:
    print("ERROR: Database not ready after 60 seconds.")
    exit(1)
EOF

echo "==> Running migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "==> Starting Daphne ASGI server..."
exec daphne -b 0.0.0.0 -p 8000 batteryswap.asgi:application
