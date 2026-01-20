/**
 * API Client for InteliTalk Application
 * Handles all HTTP requests with authentication, error handling, and type safety
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: T;
  token?: string;
  ans?: string;
  chats?: T[];
  chatSave?: T;
  userData?: T;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    // Handle non-JSON responses (like network errors returning HTML)
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(this.getHttpErrorMessage(response.status));
      }
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();

    if (!response.ok) {
      // Throw an Error object with the server's message for proper error handling
      const error = new Error(data.message || this.getHttpErrorMessage(response.status));
      (error as any).statusCode = response.status;
      (error as any).serverError = data.error;
      throw error;
    }

    return data;
  }

  /**
   * Get user-friendly error message based on HTTP status code
   */
  private getHttpErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid email or password.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Wrapper to safely execute fetch with proper error handling
   */
  private async safeFetch(url: string, options: RequestInit): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (error) {
      // Network error (no internet, CORS, server down, etc.)
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
  }

  async get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await this.safeFetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await this.safeFetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T = any>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await this.safeFetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await this.safeFetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async upload<T = any>(endpoint: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await this.safeFetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
