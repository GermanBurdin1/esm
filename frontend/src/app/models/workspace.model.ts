export interface Workspace {
  id?: number;
  name: string;
  description?: string;
  ownerId: number;
  createdAt?: Date;
  owner?: any;
  boards?: any[];
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  ownerId: number;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

