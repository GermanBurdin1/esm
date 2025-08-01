import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Task
} from '../simple-models';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  columnId: number;
  assigneeId?: number;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  position?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: number;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MoveTaskRequest {
  columnId: number;
  position: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly endpoint = '/tasks';

  constructor(private apiService: ApiService) {}

  // Obtenir toutes les tâches
  getAllTasks(): Observable<Task[]> {
    return this.apiService.get<Task[]>(this.endpoint);
  }

  // Obtenir les tâches par colonne
  getTasksByColumn(columnId: number): Observable<Task[]> {
    return this.apiService.get<Task[]>(`${this.endpoint}/column/${columnId}`);
  }

  // Obtenir les tâches par assigné
  getTasksByAssignee(assigneeId: number): Observable<Task[]> {
    return this.apiService.get<Task[]>(`${this.endpoint}/assignee/${assigneeId}`);
  }

  // Obtenir la tâche par ID
  getTaskById(id: number): Observable<Task> {
    return this.apiService.get<Task>(`${this.endpoint}/${id}`);
  }

  // Créer une nouvelle tâche
  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.apiService.post<Task>(this.endpoint, task);
  }

  // Mettre à jour la tâche
  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.apiService.put<Task>(`${this.endpoint}/${id}`, task);
  }

  // Déplacer la tâche (drag & drop)
  moveTask(id: number, moveRequest: MoveTaskRequest): Observable<Task> {
    return this.apiService.put<Task>(`${this.endpoint}/${id}/move`, moveRequest);
  }

  // Supprimer la tâche
  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Recherche des tâches par nom
  searchTasks(query: string): Observable<Task[]> {
    return this.apiService.get<Task[]>(`${this.endpoint}/search`, { q: query });
  }
}