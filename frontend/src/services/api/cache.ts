import { isSsr } from "../../common/constants";

/**
 * Cache utility for managing session storage
 * Provides a consistent interface for storing and retrieving data
 */
export const Cache = {
  /**
   * Check if an item exists in session storage
   */
  checkItem: (key: string): boolean => 
    !isSsr && (sessionStorage?.getItem(key) ? true : false),
  
  /**
   * Get an item from session storage
   */
  getItem: (key: string): any => 
    !isSsr && JSON.parse(sessionStorage?.getItem(key) || "null"),
  
  /**
   * Set multiple items in session storage
   */
  setItem: (data: Record<string, any> = {}): void =>
    Object.keys(data).forEach(
      (key) => !isSsr && sessionStorage?.setItem(key, JSON.stringify(data[key]))
    ),
  
  /**
   * Remove an item from session storage
   */
  removeItem: (key: string): void => 
    !isSsr && sessionStorage?.removeItem(key),
  
  /**
   * Clear all items from session storage
   */
  clear: (): void => 
    !isSsr && sessionStorage?.clear(),
};
