# Commit Message

```
fix: Fix CORS configuration and add missing python-dateutil dependency

- Move CorsMiddleware to top of middleware stack (before CommonMiddleware)
- Add explicit CORS_ALLOW_HEADERS configuration
- Add explicit CORS_ALLOW_METHODS configuration
- Add python-dateutil==2.9.0 to requirements.txt
- Ensure proper CORS headers are sent with all responses

The "failed to fetch" error was caused by two issues:
1. CORS middleware being positioned at the bottom of the middleware stack
2. Missing python-dateutil package required by subscription serializers

CORS middleware must be placed before CommonMiddleware to properly handle
preflight OPTIONS requests and add CORS headers to responses.

Changes:
- Repositioned corsheaders.middleware.CorsMiddleware to first position
- Added CORS_ALLOW_HEADERS list with standard headers
- Added CORS_ALLOW_METHODS list with all HTTP methods
- Added python-dateutil dependency for subscription date calculations

This fixes authentication requests from the frontend at localhost:3001
to the backend at localhost:8000.
```

## Files Changed
- `batterySwap/backend/batteryswap/settings.py` - Fixed CORS middleware order and added explicit headers/methods
- `batterySwap/backend/requirements.txt` - Added python-dateutil==2.9.0

## Installation
```bash
cd batterySwap/backend
pip install python-dateutil==2.9.0
# or
pip install -r requirements.txt
```

## Testing
1. Restart Django backend server: `python manage.py runserver`
2. Visit http://localhost:3001/auth/signin
3. Enter credentials and click "Sign In"
4. Verify signin works without "failed to fetch" error
5. Check browser console for no CORS errors
6. Verify successful redirect to /home after signin

## Technical Details
CORS middleware must be positioned early in the middleware stack to:
- Intercept OPTIONS preflight requests before other middleware
- Add CORS headers to all responses including error responses
- Handle cross-origin requests properly before authentication checks

python-dateutil is required for:
- Subscription date calculations using relativedelta
- Adding months to subscription start dates
- Handling subscription expiry logic
