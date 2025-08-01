import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  TaskLabel
} from '../simple-models';

export interface TaskLabelRelation {
  id?: number;
  taskId: number;
  labelId: number;
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

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private readonly endpoint = '/labels';

  constructor(private apiService: ApiService) {}

  // === LABEL MANAGEMENT ===

  // Obtenir les étiquettes du board
  getLabelsByBoard(boardId: number): Observable<TaskLabel[]> {
    return this.apiService.get<TaskLabel[]>(`${this.endpoint}/board/${boardId}`);
  }

  // Obtenir l'étiquette par ID
  getLabelById(id: number): Observable<TaskLabel> {
    return this.apiService.get<TaskLabel>(`${this.endpoint}/${id}`);
  }

  // Créer une nouvelle étiquette
  createLabel(label: CreateLabelRequest): Observable<TaskLabel> {
    return this.apiService.post<TaskLabel>(this.endpoint, label);
  }

  // Mettre à jour l'étiquette
  updateLabel(id: number, label: UpdateLabelRequest): Observable<TaskLabel> {
    return this.apiService.put<TaskLabel>(`${this.endpoint}/${id}`, label);
  }

  // Supprimer l'étiquette
  deleteLabel(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // === TASK-LABEL RELATIONS ===

  // Obtenir les étiquettes de la tâche
  getTaskLabels(taskId: number): Observable<TaskLabelRelation[]> {
    return this.apiService.get<TaskLabelRelation[]>(`${this.endpoint}/task/${taskId}`);
  }

  // Ajouter une étiquette à la tâche
  addLabelToTask(taskId: number, labelId: number): Observable<TaskLabelRelation> {
    return this.apiService.post<TaskLabelRelation>(`${this.endpoint}/task/${taskId}/label/${labelId}`, {});
  }

  // Supprimer l'étiquette de la tâche
  removeLabelFromTask(taskId: number, labelId: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/task/${taskId}/label/${labelId}`);
  }

  // Obtenir le nombre d'utilisations de l'étiquette
  getLabelUsageCount(labelId: number): Observable<number> {
    return this.apiService.get<number>(`${this.endpoint}/${labelId}/usage`);
  }
}