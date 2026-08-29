import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';

/**
 * Production-ready Axios instance configured with timeouts, headers, and interceptors.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.PRICES_API_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: measure start time / add metadata
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    (
      config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }
    ).metadata = {
      startTime: Date.now(),
    };
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: log response duration & normalize error messages
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.warn(`[API] Request timed out after ${ENV.API_TIMEOUT_MS}ms`);
    } else if (!error.response) {
      console.warn('[API] Network error or CORS issue encountered.');
    }
    return Promise.reject(error);
  }
);
