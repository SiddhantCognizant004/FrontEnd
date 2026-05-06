import { UserRole, UserStatus } from './enum.model';

export interface LoggedInUser {
  email: string;
  role: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  dob?: string;
  gender?: string;
  address?: string;
  landDetails?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserUpdateRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  landDetails?: string;
}

export interface user {
  name: string;
  email: string;
  phone: string;
  role: string;
}
