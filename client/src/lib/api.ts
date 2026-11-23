import { ERROR_CODES, type ApiFailure, type ApiResponse } from '@prolinker/shared';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

import i18n from '@/i18n';

import { env } from './env';
import { supabase } from './supabase';

/** Normalised error thrown by every API call. */
export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

const http = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

// Attach the current Supabase access token (auto-refreshed by supabase-js).
http.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  config.headers.set('Accept-Language', i18n.language);
  return config;
});

function isApiFailure(value: unknown): value is ApiFailure {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    value.success === false &&
    'error' in value
  );
}

function toApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error;
  if (error instanceof AxiosError) {
    const body: unknown = error.response?.data;
    if (isApiFailure(body)) {
      return new ApiClientError(
        body.error.message,
        error.response?.status ?? 0,
        body.error.code,
        body.error.details,
      );
    }
    if (!error.response) {
      return new ApiClientError('Network error, please check your connection', 0, 'NETWORK_ERROR');
    }
    return new ApiClientError(error.message, error.response.status, ERROR_CODES.INTERNAL_ERROR);
  }
  return new ApiClientError('Unexpected error', 0, ERROR_CODES.INTERNAL_ERROR);
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await http.request<ApiResponse<T>>(config);
    const body = response.data;
    if (!body.success) {
      throw new ApiClientError(
        body.error.message,
        response.status,
        body.error.code,
        body.error.details,
      );
    }
    return body.data;
  } catch (error) {
    throw toApiClientError(error);
  }
}

/** Typed API client: resolves with `data`, rejects with `ApiClientError`. */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
};
