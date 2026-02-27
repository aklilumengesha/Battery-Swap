import { get, post, put } from "./api";

/**
 * User Service
 * Handles all user-related API calls including auth, orders, and profile
 */

interface SignupData {
  name: string;
  email: string;
  vehicle: string;
  password: string;
  user_type: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface BookBatteryData {
  station: string | number;
  battery: string | number;
}

interface UpdateConsumerData {
  name?: string;
  phone?: string;
  vehicle?: string | number;
}

/**
 * User signup
 */
export const signup = (data: SignupData) => 
  post(`user/signup/`, data);

/**
 * User signin
 */
export const signin = (data: SigninData) => 
  post(`user/signin/`, data);

/**
 * Book a battery at a station
 */
export const bookBattery = (data: BookBatteryData) => 
  post(`user/orders/`, data);

/**
 * List all orders for the current user
 */
export const listOrders = () => 
  get(`user/orders/`);

/**
 * Get order details by ID
 */
export const getOrder = (id: string | number, params?: any) => 
  get(`user/order/${id}/`, params);

/**
 * Mark battery as collected
 */
export const collectBattery = (id: string | number) => 
  post(`user/order/collect/${id}/`);

/**
 * Get consumer profile
 */
export const getConsumer = () => 
  get(`consumer/manage/`);

/**
 * Update consumer profile
 */
export const updateConsumer = (data: UpdateConsumerData) => 
  put(`consumer/manage/`, data);
