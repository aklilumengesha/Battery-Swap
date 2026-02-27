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
  
  const res = await fetch(fetchUrl, {
    headers,
    ...options,
    body: options.data ? JSON.stringify(options.data) : undefined,
  });
  
  const data = await res.json();
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
