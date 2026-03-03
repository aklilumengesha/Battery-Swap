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
 * Base API request handler
 * Handles all HTTP requests with consistent error handling and headers
 * 
 * IMPORTANT: Uses getFreshHeaders() to ensure JWT token is always current.
 * This is critical for authenticated requests after login.
 * 
 * NOTE: This function returns { data, status } for ALL responses (including errors).
 * It does NOT throw on non-2xx status codes. Error handling is done at the service layer.
 */
const base = async <T = any>(
  url: string,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  const fetchUrl = config.API_URL + url;
  const headers = getFreshHeaders();
  
  console.log(`[API] ${options.method} ${fetchUrl}`);
  console.log('[API] Has auth header:', 'Authorization' in headers);
  
  let res: Response;
  
  try {
    res = await fetch(fetchUrl, {
      headers,
      method: options.method,
      body: options.data ? JSON.stringify(options.data) : undefined,
    });
  } catch (networkError) {
    // Network level failure - server not reachable
    throw new Error(
      `Cannot reach server at ${config.API_URL}. ` +
      `Make sure Django is running.`
    );
  }
  
  console.log(`[API] Response: ${res.status} ${res.statusText}`);
  
  const contentType = res.headers.get('content-type') || '';
  console.log('[API] Content-Type:', contentType);
  
  // Handle HTML response
  if (contentType.includes('text/html')) {
    if (res.status === 404) {
      throw new Error(`Endpoint not found: ${fetchUrl}`);
    }
    
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        'Authentication failed. Token may be expired. ' +
        'Please log out and log in again.'
      );
    }
    
    if (res.status === 500) {
      throw new Error('Server error (500). Check Django terminal for details.');
    }
    
    throw new Error(
      `Server returned HTML (${res.status}). ` +
      `Endpoint may not exist: ${fetchUrl}`
    );
  }
  
  // Parse JSON
  const data = await res.json();
  console.log('[API] Response data:', data);
  
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
