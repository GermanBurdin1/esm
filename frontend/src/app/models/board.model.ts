export interface Board {
  id?: number;
  name: string;
  workspaceId: number;
  createdAt?: Date;
  workspace?: any;
  columns?: BoardColumn[];
  labels?: any[];
}

export interface BoardColumn {
  id?: number;
  name: string;
  boardId: number;
  position: number;
  board?: Board;
  tasks?: any[];
}

export interface CreateBoardRequest {
  name: string;
  workspaceId: number;
}

export interface CreateColumnRequest {
  name: string;
  boardId: number;
  position?: number;
}

export interface UpdateColumnRequest {
  name?: string;
  position?: number;
}

