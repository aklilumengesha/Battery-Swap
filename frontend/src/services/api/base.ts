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
 */
const base = async <T = any>(
  url: string,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  const fetchUrl = config.API_URL + url;
  const headers = getFreshHeaders();
  
  try {
    console.log(`API Request: ${options.method} ${fetchUrl}`);
    
    const res = await fetch(fetchUrl, {
      headers,
      ...options,
      body: options.data ? JSON.stringify(options.data) : undefined,
    });
    
    console.log(`API Response: ${res.status} ${res.statusText}`);
    
    // Check content type before parsing
    const contentType = res.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response received:', text.substring(0, 200));
      throw new Error(
        `API returned HTML instead of JSON. This usually means:\n` +
        `1. Backend server is not running\n` +
        `2. Wrong API URL: ${fetchUrl}\n` +
        `3. Endpoint doesn't exist (404)\n\n` +
        `Check that Django server is running at: ${config.API_URL}`
      );
    }
    
    const data = await res.json();
    console.log('API Response Data:', data);
    
    return { data, status: res.status };
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
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
