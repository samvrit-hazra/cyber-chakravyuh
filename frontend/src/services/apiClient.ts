// Base API Client configured for Cyber Chakravyuh backend

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000/api';

export class ApiClient {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('cyber_chakravyuha_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API GET request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  static async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API POST request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
