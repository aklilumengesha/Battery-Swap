import { Cache } from "./cache";

const defaultHeader = { "Content-Type": "application/json" };

/**
 * Generate request headers with authentication token if available
 */
export const ReqHeader = Cache.checkItem("accessToken")
  ? {
      ...defaultHeader,
      Authorization: `Bearer ${Cache.getItem("accessToken")}`,
    }
  : { ...defaultHeader };

/**
 * Get fresh headers (useful for requests after login)
 */
export const getFreshHeaders = (): Record<string, string> => {
  return Cache.checkItem("accessToken")
    ? {
        ...defaultHeader,
        Authorization: `Bearer ${Cache.getItem("accessToken")}`,
      }
    : { ...defaultHeader };
};
