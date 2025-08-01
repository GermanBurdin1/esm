export interface TaskComment {
  id?: number;
  taskId: number;
  authorId: number;
  text: string;
  createdAt?: Date;
  task?: any;
  author?: any;
}

export interface CreateCommentRequest {
  taskId: number;
  authorId: number;
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}

