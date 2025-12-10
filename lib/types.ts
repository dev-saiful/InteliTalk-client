/**
 * Type definitions for InteliTalk Application
 */

export type UserRole = 'Admin' | 'Teacher' | 'Student';
export type Department = 'CSE' | 'LAW' | 'BANGLA' | 'BBA' | 'NAVAL' | 'CIVIL' | 'MECHANICAL' | 'EEE';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  dept: Department;
  studentId?: string;
  teacherId?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  dept: Department;
  studentId?: string;
  teacherId?: string;
}

export interface ChangePasswordData {
  password: string;
  newPassword: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  dept: Department;
  studentId?: string;
  role?: UserRole;
}

export interface Chat {
  _id: string;
  question: string;
  answer: string;
  author: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadResponse {
  message: string;
  fileName: string;
  url: string;
  size: number;
}
