# BatterySwap - Complete Project Overview

## 📋 Table of Contents
- [Project Description](#project-description)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [User Roles & Features](#user-roles--features)
- [Key Features](#key-features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Real-time Features](#real-time-features)
- [Subscription System](#subscription-system)
- [Admin Panel](#admin-panel)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)

---

## 🎯 Project Description

**BatterySwap** is a comprehensive battery swapping platform that connects electric vehicle users with battery swap stations. The platform enables users to quickly exchange depleted batteries for fully charged ones at nearby stations, managed by producers/station owners.

### Core Concept
- **Consumers**: EV users who need battery swaps
- **Producers**: Station owners who provide battery swap services
- **Admins**: Platform administrators who oversee operations

---

## 🏗️ System Architecture

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Consumer   │  │   Producer   │  │    Admin     │     │
│  │     App      │  │     App      │  │    Panel     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
            ┌───────▼──────┐  ┌────▼─────┐
            │   REST API   │  │ WebSocket│
            │   (Django)   │  │(Channels)│
            └───────┬──────┘  └────┬─────┘
                    │               │
            ┌───────▼───────────────▼─────┐
            │     PostgreSQL Database      │
            └──────────────────────────────┘
```

### Communication Flow
1. **HTTP/REST**: Standard CRUD operations
2. **WebSocket**: Real-time updates for battery availability
3. **JWT Authentication**: Secure token-based auth
4. **React Query**: Client-side state management and caching

---

## 💻 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: 
  - React Query (TanStack Query) - Server state
  - Redux Toolkit - Legacy support
- **UI Components**: Ant Design Icons
- **Maps**: Leaflet.js for station locations
- **Real-time**: WebSocket client

### Backend
- **Framework**: Django 4.x
- **API**: Django REST Framework
- **Real-time**: Django Channels (WebSocket)
- **Database**: PostgreSQL
- **Authentication**: JWT (Simple JWT)
- **ASGI Server**: Daphne

### DevOps & Tools
- **Version Control**: Git
- **Package Managers**: npm (frontend), pip (backend)
- **Environment**: Python virtual environment

---

## 👥 User Roles & Features

### 1. Consumer (EV Users)

#### Features
- **Authentication**
  - Sign up with email, password, vehicle type
  - Sign in with JWT tokens
  - Profile management

- **Station Discovery**
  - Browse nearby swap stations on interactive map
  - View station details (location, available batteries, pricing)
  - Real-time battery availability updates via WebSocket
  - Filter stations by distance and availability

- **Battery Booking**
  - Book batteries at selected stations
  - View booking history
  - Track booking status (pending/collected)
  - Receive booking confirmations

- **Subscription Management**
  - View available subscription plans (Basic, Standard, Premium)
  - Subscribe to plans for swap limits
  - Track swap usage and remaining swaps
  - Subscription enforcement on bookings

- **Profile & History**
  - View and edit profile information
  - Access complete booking history
  - Track subscription status

### 2. Producer (Station Owners)

#### Features
- **Authentication**
  - Sign up with company details
  - Manage company profile

- **Station Management**
  - Create new swap stations with location
  - Edit station details
  - View station performance metrics
  - Monitor real-time battery inventory

- **Battery Inventory**
  - Add batteries to stations
  - Track battery status (available/booked)
  - Manage battery pricing
  - View battery utilization

- **Booking Management**
  - View all bookings for owned stations
  - Track booking status
  - Monitor revenue from bookings
  - Access booking analytics

- **Dashboard**
  - Overview of all stations
  - Total bookings and revenue
  - Performance metrics
  - Recent activity feed

### 3. Admin (Platform Administrators)

#### Features
- **Dashboard**
  - Platform-wide statistics
  - Total users, producers, stations, batteries
  - Revenue analytics with 30-day chart
  - Recent bookings overview

- **User Management**
  - View all users (consumers and producers)
  - Activate/deactivate user accounts
  - User activity monitoring
  - User type filtering

- **Producer Management**
  - View all producers and their companies
  - Monitor producer performance
  - Track stations per producer
  - Revenue per producer

- **Station Management**
  - View all stations platform-wide
  - Monitor battery inventory per station
  - Station location overview
  - Station performance metrics

- **Booking Management**
  - View all bookings with pagination (20 per page)
  - Filter by payment status (paid/unpaid)
  - Filter by collection status (collected/pending)
  - Search by station, producer, or vehicle
  - Export booking data

- **Subscription Management**
  - View all user subscriptions
  - Monitor active vs inactive subscriptions
  - Track revenue per subscription plan
  - Plan-wise user distribution
  - Filter by plan type and status

- **Analytics**
  - 30-day revenue chart with daily breakdown
  - Peak day identification
  - Average daily revenue
  - Total bookings and revenue metrics

---

## 🚀 Key Features

### 1. Real-time Battery Availability
- WebSocket connections for live updates
- Instant notification when batteries are booked/collected
- Automatic UI updates without page refresh
- Connection status indicators

### 2. Subscription System
- **Three Tiers**:
  - **Basic**: Limited swaps per month
  - **Standard**: More swaps + priority support
  - **Premium**: Unlimited swaps + premium features

- **Enforcement**:
  - Swap limit tracking per user
  - Automatic limit checks before booking
  - Monthly reset of swap counts
  - Subscription expiry handling

### 3. Interactive Maps
- Leaflet.js integration
- Station markers with custom icons
- Click to view station details
- Distance calculation from user location
- Zoom and pan controls

### 4. Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Adaptive layouts

### 5. Search & Filtering
- Station search by name/location
- Filter by availability
- Sort by distance/price
- Advanced admin filters

---

## 🗄️ Database Schema

### Core Models

#### User Model
```python
- id (PK)
- email (unique)
- name
- password (hashed)
- user_type (consumer/producer/admin)
- is_active
- date_joined
- orders (FK to Order)
```

#### Consumer Model
```python
- id (PK)
- user (FK to User)
- vehicle (FK to Vehicle)
```

#### Producer Model
```python
- id (PK)
- user (FK to User)
- company (FK to Company)
```

#### Company Model
```python
- id (PK)
- name
- address
- phone
- email
```

#### Vehicle Model
```python
- id (PK)
- name
- model
- manufacturer
```

#### Station Model
```python
- id (PK)
- name
- latitude
- longitude
- owner (FK to Producer)
- batteries (M2M to Battery)
- booked_batteries (M2M to Battery)
```

#### Battery Model
```python
- id (PK)
- vehicle (FK to Vehicle)
- company (FK to Company)
- price
- capacity
- status
```

#### Order Model
```python
- id (PK)
- battery (FK to Battery)
- station (FK to Station)
- booked_time
- expiry_time
- is_paid
- is_collected
```

#### SubscriptionPlan Model
```python
- id (PK)
- name (Basic/Standard/Premium)
- price
- swap_limit_per_month
- priority_support
- is_active
- created_at
- updated_at
```

#### UserSubscription Model
```python
- id (PK)
- user (FK to User)
- plan (FK to SubscriptionPlan)
- start_date
- end_date
- is_active
- swaps_used
- created_at
- updated_at
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /user/signup/              - User registration
POST   /user/signin/              - User login
POST   /user/token/refresh/       - Refresh JWT token
POST   /user/token/pair/          - Get token pair
```

### User Management
```
GET    /user/manage/              - List users
POST   /user/manage/              - Create user
GET    /user/user/manage/:id/     - Get user details
PUT    /user/user/manage/:id/     - Update user
DELETE /user/user/manage/:id/     - Delete user
```

### Orders/Bookings
```
GET    /user/orders/              - Get user orders
POST   /user/orders/              - Create booking
GET    /user/order/:id/           - Get order details
GET    /user/order/collect/:id/   - Mark as collected
```

### Stations
```
GET    /battery/stations/         - List all stations
POST   /battery/stations/         - Create station
GET    /battery/stations/:id/     - Get station details
PUT    /battery/stations/:id/     - Update station
DELETE /battery/stations/:id/     - Delete station
```

### Batteries
```
GET    /battery/batteries/        - List batteries
POST   /battery/batteries/        - Add battery
GET    /battery/batteries/:id/    - Get battery details
PUT    /battery/batteries/:id/    - Update battery
DELETE /battery/batteries/:id/    - Delete battery
```

### Subscriptions
```
GET    /subscription/plans/       - List subscription plans
GET    /subscription/my-subscription/ - Get user subscription
POST   /subscription/subscribe/   - Subscribe to plan
GET    /subscription/status/      - Get subscription status
```

### Producer Endpoints
```
GET    /producer/dashboard/       - Producer dashboard stats
GET    /producer/stations/        - Producer's stations
GET    /producer/bookings/        - Producer's bookings
PUT    /producer/company/         - Update company info
```

### Admin Endpoints
```
GET    /user/admin/stats/         - Platform statistics
GET    /user/admin/users/         - All users
PATCH  /user/admin/users/:id/toggle/ - Toggle user status
GET    /user/admin/producers/     - All producers
GET    /user/admin/stations/      - All stations
GET    /user/admin/bookings/      - All bookings (limited)
GET    /user/admin/bookings/paginated/ - Paginated bookings
GET    /user/admin/subscriptions/ - All subscriptions
GET    /user/admin/revenue/chart/ - Revenue analytics
```

### WebSocket
```
WS     /ws/stations/              - Real-time station updates
```

---

## ⚡ Real-time Features

### WebSocket Implementation

#### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/stations/');
```

#### Events Broadcasted
1. **battery_booked**
   ```json
   {
     "type": "battery_booked",
     "station_id": 1,
     "battery_id": 5,
     "user_name": "John Doe",
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```

2. **battery_collected**
   ```json
   {
     "type": "battery_collected",
     "station_id": 1,
     "battery_id": 5,
     "timestamp": "2024-01-15T11:00:00Z"
   }
   ```

3. **booking_ready**
   ```json
   {
     "type": "booking_ready",
     "order_id": 123,
     "station_name": "Downtown Station",
     "message": "Your battery is ready for pickup"
   }
   ```

#### Frontend Integration
- Automatic reconnection on disconnect
- Connection status indicators
- Real-time UI updates
- Toast notifications for events

---

## 💳 Subscription System

### Plans Overview

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Monthly Swaps | 10 | 30 | Unlimited |
| Priority Support | ❌ | ✅ | ✅ |
| Price | Rs 299 | Rs 799 | Rs 1499 |

### Enforcement Logic
```python
def can_create_order(user):
    subscription = get_active_subscription(user)
    
    if not subscription:
        return False, "No active subscription"
    
    if subscription.plan.swap_limit_per_month == -1:
        return True, None  # Unlimited
    
    if subscription.swaps_used >= subscription.plan.swap_limit_per_month:
        return False, "Monthly swap limit exceeded"
    
    return True, None
```

### Subscription Lifecycle
1. User subscribes to a plan
2. Subscription becomes active
3. Each booking increments `swaps_used`
4. Monthly reset of `swaps_used`
5. Auto-deactivation on expiry

---

## 🛡️ Admin Panel

### Dashboard Features
- **Statistics Cards**
  - Total Users (with consumer breakdown)
  - Total Producers
  - Total Stations (with battery count)
  - Total Revenue (with paid orders)

- **Secondary Stats**
  - Total Bookings
  - Paid Bookings
  - Pending Payments

- **Revenue Chart**
  - 30-day daily revenue visualization
  - Bar chart with hover tooltips
  - Peak day highlighting
  - Summary statistics

- **Recent Bookings**
  - Latest 8 bookings
  - Station and producer info
  - Payment and collection status
  - Booking timestamps

### Management Pages

#### Users Page
- Complete user list
- Filter by user type
- Activate/deactivate accounts
- User registration dates
- Search functionality

#### Producers Page
- All producers with company info
- Stations per producer
- Bookings per producer
- Revenue per producer
- Activity status

#### Stations Page
- All stations platform-wide
- Location coordinates
- Battery inventory count
- Owner information
- Company details

#### Bookings Page (Paginated)
- 20 bookings per page
- Search by station/producer/vehicle
- Filter by payment status
- Filter by collection status
- Page navigation (prev/next + numbers)
- Total count display

#### Subscriptions Page
- All user subscriptions
- Plan breakdown cards
- Active vs inactive filtering
- Revenue per plan
- User count per plan
- Search by user or plan

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- pip and npm

### Backend Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd batterySwap/backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Load Sample Data** (Optional)
   ```bash
   python add_sample_data.py
   python add_subscription_plans.py
   ```

8. **Run Server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to Frontend**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with API URL
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

---

## 📁 Project Structure

### Backend Structure
```
backend/
├── batteryswap/          # Project settings
│   ├── settings.py       # Django settings
│   ├── urls.py          # Root URL config
│   ├── asgi.py          # ASGI config for WebSocket
│   └── wsgi.py          # WSGI config
├── user/                # User management app
│   ├── models.py        # User, Order models
│   ├── views.py         # Auth, user, admin views
│   ├── serializers.py   # DRF serializers
│   └── urls.py          # User endpoints
├── battery/             # Battery & station app
│   ├── models.py        # Station, Battery, Vehicle
│   ├── views.py         # Station CRUD
│   ├── consumers.py     # WebSocket consumers
│   ├── signals.py       # Django signals
│   └── websocket_utils.py # WebSocket helpers
├── producer/            # Producer app
│   ├── models.py        # Producer, Company
│   ├── views.py         # Producer endpoints
│   └── serializers.py   # Producer serializers
├── consumer/            # Consumer app
│   ├── models.py        # Consumer model
│   └── views.py         # Consumer endpoints
├── subscription/        # Subscription system
│   ├── models.py        # Plans, UserSubscription
│   ├── views.py         # Subscription endpoints
│   ├── utils.py         # Subscription logic
│   └── serializers.py   # Subscription serializers
├── manage.py            # Django management
└── requirements.txt     # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Auth pages
│   │   ├── home/              # Consumer home
│   │   ├── station/           # Station details
│   │   ├── order/             # Order pages
│   │   ├── profile/           # User profile
│   │   ├── history/           # Booking history
│   │   ├── pricing/           # Subscription plans
│   │   ├── my-plan/           # User subscription
│   │   ├── producer/          # Producer dashboard
│   │   │   ├── dashboard/
│   │   │   ├── stations/
│   │   │   ├── batteries/
│   │   │   ├── bookings/
│   │   │   └── company/
│   │   └── admin-panel/       # Admin panel
│   │       ├── dashboard/
│   │       ├── users/
│   │       ├── producers/
│   │       ├── stations/
│   │       ├── bookings/
│   │       └── subscriptions/
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── shared/           # Shared components
│   │   ├── map/              # Map components
│   │   └── ui/               # UI components
│   ├── features/             # Feature modules
│   │   ├── auth/            # Auth logic
│   │   ├── stations/        # Station logic
│   │   ├── producer/        # Producer logic
│   │   ├── admin/           # Admin logic
│   │   └── subscription/    # Subscription logic
│   ├── services/            # API services
│   │   ├── api/            # API utilities
│   │   ├── admin.service.ts
│   │   ├── producer.service.ts
│   │   └── websocket.service.ts
│   ├── lib/                # Libraries
│   │   └── react-query.ts  # React Query config
│   ├── utils/              # Utilities
│   ├── styles/             # Global styles
│   └── routes/             # Route constants
├── public/                 # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
└── next.config.js         # Next.js config
```

---

## 🔄 Development Workflow

### Git Workflow
1. Create feature branch from `main`
2. Implement feature with commits
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge to `main`

### Testing Strategy
- **Backend**: Django test cases
- **Frontend**: Component testing
- **Integration**: End-to-end testing
- **Manual**: User acceptance testing

### Code Quality
- **Linting**: ESLint (frontend), Flake8 (backend)
- **Formatting**: Prettier (frontend), Black (backend)
- **Type Checking**: TypeScript strict mode
- **Code Review**: Required before merge

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Token refresh mechanism
- Secure password hashing (Django's PBKDF2)
- CORS configuration

### Authorization
- Role-based access control
- Admin-only endpoints protection
- Producer-specific data isolation
- Consumer data privacy

### Data Protection
- SQL injection prevention (ORM)
- XSS protection
- CSRF tokens
- Secure WebSocket connections

---

## 📊 Performance Optimizations

### Frontend
- React Query caching
- Lazy loading components
- Image optimization
- Code splitting
- Memoization

### Backend
- Database query optimization
- Select/prefetch related
- Pagination for large datasets
- WebSocket connection pooling
- Database indexing

---

## 🚀 Deployment Considerations

### Backend Deployment
- Use Gunicorn/Daphne for production
- Configure PostgreSQL with connection pooling
- Set up Redis for WebSocket channel layer
- Enable HTTPS
- Configure CORS properly
- Set DEBUG=False

### Frontend Deployment
- Build optimized production bundle
- Configure environment variables
- Set up CDN for static assets
- Enable caching headers
- Configure API base URL

---

