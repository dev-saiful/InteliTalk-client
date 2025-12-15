/**
 * API Services for all endpoints
 */

import { apiClient, type ApiResponse } from './api-client';
import type { User, Chat, UpdateUserData, UploadResponse, LoginCredentials, ChangePasswordData, SignupData, PaginationParams, PaginatedResponse, DepartmentStats } from './types';

// Auth Services
export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/login', credentials);
  },

  async logout(): Promise<ApiResponse> {
    return apiClient.post('/logout');
  },

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return apiClient.post('/change-password', data);
  },
};

// Admin Services
export const adminService = {
  async getDashboard(): Promise<ApiResponse> {
    return apiClient.get('/admin');
  },

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/admin/user');
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/admin/user/${id}`);
  },

  async updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/admin/user/${id}`, data);
  },

  async deleteUser(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/admin/user/${id}`);
  },

  async createStudent(data: SignupData): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/admin/student-signup', data);
  },

  async createTeacher(data: SignupData): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/admin/teacher-signup', data);
  },

  async uploadPublicPDF(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('pdf', file);
    return apiClient.upload<UploadResponse>('/admin/public/upload/pdf', formData);
  },

  async uploadPrivatePDF(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('pdf', file);
    return apiClient.upload<UploadResponse>('/admin/private/upload/pdf', formData);
  },
};

// Teacher Services
export const teacherService = {
  async getDashboard(): Promise<ApiResponse> {
    return apiClient.get('/teacher');
  },

  async createStudent(data: SignupData): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/teacher/student-signup', data);
  },

  async getAllStudents(params?: PaginationParams): Promise<PaginatedResponse<User[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/teacher/students?${queryString}` : '/teacher/students';
    return apiClient.get(url) as unknown as Promise<PaginatedResponse<User[]>>;
  },

  async getStudentById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/teacher/student/${id}`);
  },

  async updateStudent(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/teacher/student/${id}`, data);
  },

  async deleteStudent(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/teacher/student/${id}`);
  },

  async getDepartmentStats(): Promise<ApiResponse<DepartmentStats>> {
    return apiClient.get<DepartmentStats>('/teacher/department-stats');
  },
};

// Student Services
export const studentService = {
  async getDashboard(): Promise<ApiResponse> {
    return apiClient.get('/student');
  },

  async askQuestion(question: string): Promise<ApiResponse<{answer: string}>> {
    if (!question || !question.trim()) {
      throw new Error('Question is required');
    }
    return apiClient.get<{answer: string}>(`/student?question=${encodeURIComponent(question)}`);
  },

  async getChats(userId: string): Promise<ApiResponse<Chat[]>> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return apiClient.get<Chat[]>(`/student/message/${userId}`);
  },

  async getStudentProfile(id: string): Promise<ApiResponse<User>> {
    if (!id) {
      throw new Error('Student ID is required');
    }
    return apiClient.get<User>(`/student/${id}`);
  },

  async updateStudentProfile(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    if (!id) {
      throw new Error('Student ID is required');
    }
    
    // Validate email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    // Validate name
    if (data.name && data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    
    return apiClient.put<User>(`/student/${id}`, data);
  },
};

// Guest Services
export const guestService = {
  async askQuestion(question: string): Promise<ApiResponse> {
    return apiClient.get(`/guest?question=${encodeURIComponent(question)}`);
  },
};
