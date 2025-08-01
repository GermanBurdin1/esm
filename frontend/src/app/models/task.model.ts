export interface Task {
  id?: number;
  title: string;
  description?: string;
  columnId: number;
  assigneeId?: number;
  createdAt?: Date;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  position: number;
  priority: TaskPriority;
  column?: any;
  assignee?: any;
  comments?: any[];
  attachments?: TaskAttachment[];
  labelRelations?: any[];
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  columnId: number;
  assigneeId?: number;
  dueDate?: string;
  priority?: TaskPriority;
  position?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: number;
  dueDate?: string;
  priority?: TaskPriority;
}

export interface MoveTaskRequest {
  columnId: number;
  position: number;
}

export interface TaskAttachment {
  id?: number;
  filename: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  filePath: string;
  taskId: number;
  uploadedAt?: Date;
  task?: Task;
}

