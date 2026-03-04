import { config } from "../../../common/config";
import { getFreshHeaders } from "./utils";

interface RequestOptions {
  method: string;
  data?: any;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

/**
 * Try to refresh the access token using the refresh token
 * Returns true if refresh was successful, false otherwise
 */
const tryRefreshToken = async (): Promise<boolean> => {
  try {
    const raw = sessionStorage.getItem('refreshToken');
    if (!raw) return false;

    let refreshToken: string | null = null;
    try {
      refreshToken = JSON.parse(raw);
    } catch {
      refreshToken = raw;
    }

    if (!refreshToken) return false;

    console.log('[Auth] Access token expired, refreshing...');

    const res = await fetch(config.API_URL + 'user/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();

      // Save new access token to sessionStorage
      sessionStorage.setItem('accessToken', JSON.stringify(data.access));

      // Save new refresh token if returned
      if (data.refresh) {
        sessionStorage.setItem('refreshToken', JSON.stringify(data.refresh));
      }

      console.log('[Auth] Token refreshed successfully');
      return true;
    }

    console.log('[Auth] Token refresh failed:', res.status);
    return false;
  } catch (error) {
    console.log('[Auth] Token refresh error:', error);
    return false;
  }
};

/**
 * Base API request handler
 * Handles all HTTP requests with consistent error handling and headers
 * 
 * IMPORTANT: Uses getFreshHeaders() to ensure JWT token is always current.
 * This is critical for authenticated requests after login.
 * 
 * AUTOMATIC TOKEN REFRESH: On 401 responses, automatically attempts to refresh
 * the access token using the refresh token and retries the request once.
 * 
 * NOTE: This function returns { data, status } for ALL responses (including errors).
 * It does NOT throw on non-2xx status codes. Error handling is done at the service layer.
 */
const base = async <T = any>(
  url: string,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  const fetchUrl = config.API_URL + url;
  let headers = getFreshHeaders();

  console.log(`[API] ${options.method} ${fetchUrl}`);
  console.log('[API] Has auth:', 'Authorization' in headers);

  let res = await fetch(fetchUrl, {
    method: options.method,
    headers,
    body: options.data ? JSON.stringify(options.data) : undefined,
  });

  // Auto-refresh on 401 and retry ONCE
  if (res.status === 401) {
    console.log('[API] Got 401, attempting token refresh...');
    
    const refreshed = await tryRefreshToken();
    
    if (refreshed) {
      // Get fresh headers with new token
      headers = getFreshHeaders();
      
      // Retry the original request
      res = await fetch(fetchUrl, {
        method: options.method,
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
      });
      
      console.log('[API] Retry result:', res.status);
    } else {
      // Refresh failed - clear session and redirect to signin
      console.log('[API] Refresh failed, clearing session');
      sessionStorage.clear();
      window.location.href = '/auth/signin';
      throw new Error('Session expired. Please sign in again.');
    }
  }

  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(`Server returned non-JSON (${res.status})`);
  }

  const data = await res.json();
  console.log('[API] Response:', res.status, data);

  return { data, status: res.status };
};

/**
 * HTTP GET request
 */
export const get = <T = any>(
  url: string,
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> => {
  const urlParams = new URLSearchParams(params).toString();
  if (urlParams) url = `${url}?${urlParams}`;
  const options: RequestOptions = { method: "GET" };
  return base<T>(url, options);
};

/**
 * HTTP POST request
 */
export const post = <T = any>(
  url: string,
  data: any = {}
): Promise<ApiResponse<T>> => {
  const options: RequestOptions = { method: "POST", data };
  return base<T>(url, options);
};

/**
 * HTTP PATCH request
 */
export const patch = <T = any>(
  url: string,
  data: any = {}
): Promise<ApiResponse<T>> => {
  const options: RequestOptions = { method: "PATCH", data };
  return base<T>(url, options);
};

/**
 * HTTP PUT request
 */
export const put = <T = any>(
  url: string,
  data: any = {}
): Promise<ApiResponse<T>> => {
  const options: RequestOptions = { method: "PUT", data };
  return base<T>(url, options);
};

/**
 * HTTP DELETE request
 */
export const del = <T = any>(
  url: string,
  data: any = {}
): Promise<ApiResponse<T>> => {
  const options: RequestOptions = { method: "DELETE", data };
  return base<T>(url, options);
};
