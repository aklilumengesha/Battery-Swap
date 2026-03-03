import { Cache } from "./cache";

const defaultHeader = { "Content-Type": "application/json" };

/**
 * Get fresh headers with current authentication token
 * 
 * IMPORTANT: Always use this function instead of static headers!
 * This reads from sessionStorage on every call, ensuring the token
 * is always current even if the user logs in after module load.
 * 
 * @returns Headers object with Content-Type and Authorization (if logged in)
 */
export const getFreshHeaders = (): Record<string, string> => {
  return Cache.checkItem("accessToken")
    ? {
        ...defaultHeader,
        Authorization: `Bearer ${Cache.getItem("accessToken")}`,
      }
    : { ...defaultHeader };
};
