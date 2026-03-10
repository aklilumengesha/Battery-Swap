export const routes = {
  INITIAL: "/",
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  FORGOT_PASSWORD: "/auth/signin",
  HOME: "/home",
  PROFILE: "/profile",
  HISTORY: "/history",
  SCANNER: "/scanner",
  PRICING: "/pricing",
  MY_PLAN: "/my-plan",
  ORDER_DETAILS: (id) => `/order/${id}`,
  ORDER_SUCCESS: "/order/success",
  ORDER_FAILURE: "/order/failure",
  STATION: (id) => `/station/${id}`,
  
  // Producer routes
  PRODUCER_DASHBOARD: "/producer/dashboard",
  PRODUCER_STATIONS: "/producer/stations",
  PRODUCER_STATION_CREATE: "/producer/stations/create",
  PRODUCER_STATION_DETAIL: (id: number | string) => `/producer/stations/${id}`,
  PRODUCER_BATTERIES: "/producer/batteries",
  PRODUCER_BOOKINGS: "/producer/bookings",
  PRODUCER_COMPANY: "/producer/company",
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin-panel/dashboard',
  ADMIN_USERS: '/admin-panel/users',
  ADMIN_PRODUCERS: '/admin-panel/producers',
  ADMIN_STATIONS: '/admin-panel/stations',
  ADMIN_BOOKINGS: '/admin-panel/bookings',
  ADMIN_SUBSCRIPTIONS: '/admin-panel/subscriptions',
};
