/**
 * Authentication utilities
 */

import { apiClient, type ApiResponse } from './api-client';
import type { User, LoginCredentials, SignupData, ChangePasswordData } from './types';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/login', credentials);
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    return apiClient.post('/logout');
  },

  /**
   * Sign up new user (Admin/Teacher only can create accounts)
   */
  async signup(data: SignupData): Promise<ApiResponse<User>> {
    const endpoint = data.role === 'Student' 
      ? '/admin/student-signup' 
      : data.role === 'Teacher'
      ? '/admin/teacher-signup'
      : '/admin/student-signup'; // default fallback
    
    return apiClient.post<User>(endpoint, data);
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return apiClient.post('/change-password', data);
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save user to localStorage
   */
  saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Remove user from localStorage
   */
  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  },
};
