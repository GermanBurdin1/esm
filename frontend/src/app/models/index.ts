// Export all models from a single entry point (avoiding duplicates)
export { 
  User, UserRole, LoginRequest, LoginResponse, CreateUserRequest 
} from './user.model';

export { 
  Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest 
} from './workspace.model';

export { 
  Board, BoardColumn, CreateBoardRequest, CreateColumnRequest, UpdateColumnRequest 
} from './board.model';

export { 
  Task, TaskPriority, CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest, TaskAttachment 
} from './task.model';

export { 
  TaskComment, CreateCommentRequest, UpdateCommentRequest 
} from './comment.model';

export { 
  TaskLabel, TaskLabelRelation, CreateLabelRequest, UpdateLabelRequest 
} from './label.model';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

// Common types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SearchParams {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
}