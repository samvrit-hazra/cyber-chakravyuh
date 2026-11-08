// Base API Client configured for seamless communication with FastAPI Backend on port 8000

const RAW_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000/api';

// Strip any trailing slash
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export class ApiClient {
  private static getHeaders(isFormData = false): HeadersInit {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cyber_chakravyuha_auth_token') : null;
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static formatUrl(endpoint: string): string {
    const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanedEndpoint}`;
  }

  static async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = this.formatUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: { ...this.getHeaders(), ...(options?.headers || {}) },
      signal: options?.signal,
      ...options,
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      } catch {
        // ignore json parse error
      }
      throw new Error(`API GET ${endpoint} failed (${response.status}): ${errorDetail}`);
    }

    return response.json() as Promise<T>;
  }

  static async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    const url = this.formatUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...this.getHeaders(), ...(options?.headers || {}) },
      body: JSON.stringify(body),
      signal: options?.signal,
      ...options,
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      } catch {
        // ignore json parse error
      }
      throw new Error(`API POST ${endpoint} failed (${response.status}): ${errorDetail}`);
    }

    return response.json() as Promise<T>;
  }

  static async postForm<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    const url = this.formatUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...this.getHeaders(true), ...(options?.headers || {}) },
      body: formData,
      signal: options?.signal,
      ...options,
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      } catch {
        // ignore json parse error
      }
      throw new Error(`API POST ${endpoint} (Form) failed (${response.status}): ${errorDetail}`);
    }

    return response.json() as Promise<T>;
  }
}
