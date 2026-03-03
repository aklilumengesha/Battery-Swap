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

  if (Cache.checkItem('accessToken')) {
    // Cache.getItem uses JSON.parse so token may have 
    // extra quotes - clean it:
    let token = Cache.getItem('accessToken');
    
    // Remove any surrounding quotes added by JSON.stringify
    if (typeof token === 'string') {
      token = token.replace(/^"|"$/g, '').trim();
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Temporary debug - remove after confirming fix:
    console.log('[Auth] Token preview:', token ? token.substring(0, 40) + '...' : 'MISSING');
    console.log('[Auth] Header:', headers['Authorization'] ? headers['Authorization'].substring(0, 50) + '...' : 'NOT SET');
  }

  return headers;
};
