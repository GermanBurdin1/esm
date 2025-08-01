export interface TaskLabel {
  id?: number;
  name: string;
  color: string; // Hex color like #FF5733
  boardId: number;
  board?: any;
  labelRelations?: TaskLabelRelation[];
}

export interface TaskLabelRelation {
  id?: number;
  taskId: number;
  labelId: number;
  task?: any;
  label?: TaskLabel;
}

export interface CreateLabelRequest {
  name: string;
  color: string;
  boardId: number;
}

export interface UpdateLabelRequest {
  name?: string;
  color?: string;
}

