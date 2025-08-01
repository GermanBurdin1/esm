import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  TaskComment
} from '../simple-models';

export interface CreateCommentRequest {
  taskId: number;
  authorId: number;
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly endpoint = '/comments';

  constructor(private apiService: ApiService) {}

  // Obtenir les commentaires de la tâche
  getCommentsByTask(taskId: number): Observable<TaskComment[]> {
    return this.apiService.get<TaskComment[]>(`${this.endpoint}/task/${taskId}`);
  }

  // Obtenir le commentaire par ID
  getCommentById(id: number): Observable<TaskComment> {
    return this.apiService.get<TaskComment>(`${this.endpoint}/${id}`);
  }

  // Créer un nouveau commentaire
  createComment(comment: CreateCommentRequest): Observable<TaskComment> {
    return this.apiService.post<TaskComment>(this.endpoint, comment);
  }

  // Mettre à jour le commentaire
  updateComment(id: number, comment: UpdateCommentRequest): Observable<TaskComment> {
    return this.apiService.put<TaskComment>(`${this.endpoint}/${id}`, comment);
  }

  // Supprimer le commentaire
  deleteComment(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Obtenir le nombre de commentaires de la tâche
  getCommentCount(taskId: number): Observable<number> {
    return this.apiService.get<number>(`${this.endpoint}/task/${taskId}/count`);
  }
}