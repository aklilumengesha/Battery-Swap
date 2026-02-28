import { get, post } from "./api";

/**
 * Subscription Service
 * Handles all subscription-related API calls
 */

/**
 * Get all active subscription plans
 */
export const getPlans = () => 
  get(`api/plans/`);

/**
 * Subscribe to a plan
 * @param planId - Plan ID to subscribe to
 * @param durationMonths - Subscription duration in months (1-12)
 */
export const subscribe = (planId: number, durationMonths: number = 1) => 
  post(`api/subscribe/`, { plan_id: planId, duration_months: durationMonths });

/**
 * Get current user's active subscription
 */
export const getMySubscription = () => 
  get(`api/my-subscription/`);
