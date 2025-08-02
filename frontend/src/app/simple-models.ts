// Simplified models for quick compilation

export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Workspace {
  id?: number;
  name: string;
  description?: string;
  ownerId: number;
  createdAt?: string;
}

export interface Board {
  id?: number;
  name: string;
  workspaceId: number;
  createdAt?: string;
}

export interface BoardColumn {
  id?: number;
  name: string;
  boardId: number;
  position: number;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  columnId: number;
  assigneeId?: number;
  createdAt?: string;
  dueDate?: string;
  position: number;
  priority: TaskPriority;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  columnId: number;
  assigneeId?: number;
  dueDate?: string;
  position?: number;
  priority?: TaskPriority;
}

export interface TaskComment {
  id?: number;
  taskId: number;
  authorId: number;
  text: string;
  createdAt?: string;
}

export interface TaskLabel {
  id?: number;
  name: string;
  color: string;
  boardId: number;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  valid: boolean;
}