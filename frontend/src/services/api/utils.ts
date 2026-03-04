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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Read raw value from sessionStorage to avoid double-parsing issues
  const raw = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
  
  if (raw) {
    let token: string | null = null;
    
    try {
      // Try to parse as JSON (in case it was JSON.stringify'd)
      token = JSON.parse(raw);
    } catch {
      // If parse fails, use raw value (it's already a plain string)
      token = raw;
    }
    
    // Clean any extra quotes that might remain
    if (typeof token === 'string' && token) {
      token = token.replace(/^"|"$/g, '').trim();
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        
        // Temporary debug log
        console.log('[PUT Auth] token exists:', true);
        console.log('[PUT Auth] header set:', `Authorization: Bearer ${token.substring(0, 20)}...`);
      }
    }
  } else {
    console.log('[PUT Auth] token exists:', false);
    console.log('[PUT Auth] header set:', 'NO AUTH HEADER');
  }

  return headers;
};
