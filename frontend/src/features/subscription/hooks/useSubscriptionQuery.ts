"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { SubscriptionService } from "../../../services";

/**
 * Query keys for subscription-related queries
 */
const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  mySubscription: () => [...subscriptionKeys.all, 'my-subscription'] as const,
};

/**
 * useSubscriptionQuery Hook
 * React Query hooks for subscription management
 */
export const useSubscriptionQuery = () => {
  const queryClient = useQueryClient();

  // Query: Get all plans
  const usePlans = () => {
    return useQuery({
      queryKey: subscriptionKeys.plans(),
      queryFn: async () => {
        const res = await SubscriptionService.getPlans();
        
        if (res.status === 200) {
          return res.data.results || res.data || [];
        }
        
        throw new Error(`Failed to fetch plans: Status ${res.status}`);
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Retry once on failure
    });
  };

  // Query: Get my subscription
  const useMySubscription = () => {
    return useQuery({
      queryKey: subscriptionKeys.mySubscription(),
      queryFn: async () => {
        const res = await SubscriptionService.getMySubscription();
        if (res.data.success) {
          return res.data.subscription;
        }
        return null;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    });
  };

  // Mutation: Subscribe to plan
  const subscribeMutation = useMutation({
    mutationFn: async ({ 
      planId, 
      durationMonths 
    }: { 
      planId: number; 
      durationMonths: number;
    }) => {
      const response = await SubscriptionService.subscribe(planId, durationMonths);
      
      // Handle 201 Created success
      if (response.status === 201 || response.status === 200) {
        return response.data?.subscription || response.data;
      }
      
      // Handle backend error response
      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || 
          response.data?.detail ||
          'Subscription failed'
        );
      }
      
      // Handle HTTP error status
      if (response.status >= 400) {
        throw new Error(
          response.data?.detail || 
          response.data?.message ||
          `Request failed with status ${response.status}`
        );
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      message.success("Successfully subscribed to plan!");
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.mySubscription() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to subscribe");
    },
  });

  return {
    usePlans,
    useMySubscription,
    subscribe: subscribeMutation.mutate,
    isSubscribing: subscribeMutation.isPending,
  };
};

/**
 * Convenience hooks for direct use
 */
export const usePlans = () => {
  const { usePlans: hook } = useSubscriptionQuery();
  return hook();
};

export const useMySubscription = () => {
  const { useMySubscription: hook } = useSubscriptionQuery();
  return hook();
};
