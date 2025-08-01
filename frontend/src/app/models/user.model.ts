export interface User {
  id?: number;
  username: string;
  email: string;
  passwordHash?: string; // Optional for responses (security)
  role: UserRole;
  createdAt?: Date;
  ownedWorkspaces?: any[];
  assignedTasks?: any[];
  comments?: any[];
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  valid: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

