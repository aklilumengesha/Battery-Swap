import { QueryClient, DefaultOptions } from "@tanstack/react-query";

/**
 * Default options for React Query
 * Configures caching, refetching, and retry behavior
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Throw errors instead of returning them in the error state
    throwOnError: false,
    
    // Refetch on window focus (useful for keeping data fresh)
    refetchOnWindowFocus: false,
    
    // Retry failed requests
    retry: 1,
    
    // Stale time: how long data is considered fresh (5 minutes)
    staleTime: 5 * 60 * 1000,
    
    // Cache time: how long unused data stays in cache (10 minutes)
    gcTime: 10 * 60 * 1000,
  },
  mutations: {
    // Throw errors for mutations
    throwOnError: false,
    
    // Retry failed mutations
    retry: 0,
  },
};

/**
 * Create and configure the React Query client
 * This client manages all queries and mutations in the application
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Query Keys
 * Centralized query key factory for consistent cache management
 */
export const queryKeys = {
  // Auth keys
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
    vehicles: () => [...queryKeys.auth.all, "vehicles"] as const,
  },
  
  // Stations keys
  stations: {
    all: ["stations"] as const,
    lists: () => [...queryKeys.stations.all, "list"] as const,
    list: (latitude: number, longitude: number) =>
      [...queryKeys.stations.lists(), { latitude, longitude }] as const,
    details: () => [...queryKeys.stations.all, "detail"] as const,
    detail: (id: string | number, latitude?: number, longitude?: number) =>
      [...queryKeys.stations.details(), id, { latitude, longitude }] as const,
  },
  
  // Bookings/Orders keys
  bookings: {
    all: ["bookings"] as const,
    lists: () => [...queryKeys.bookings.all, "list"] as const,
    list: () => [...queryKeys.bookings.lists()] as const,
    details: () => [...queryKeys.bookings.all, "detail"] as const,
    detail: (id: string | number, latitude?: number, longitude?: number) =>
      [...queryKeys.bookings.details(), id, { latitude, longitude }] as const,
  },
};
