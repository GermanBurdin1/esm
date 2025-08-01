import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Workspace
} from '../simple-models';

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  ownerId: number;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private readonly endpoint = '/workspaces';

  constructor(private apiService: ApiService) {}

  // Obtenir tous les espaces de travail
  getAllWorkspaces(): Observable<Workspace[]> {
    return this.apiService.get<Workspace[]>(this.endpoint);
  }

  // Obtenir les espaces de travail de l'utilisateur
  getWorkspacesByOwner(ownerId: number): Observable<Workspace[]> {
    return this.apiService.get<Workspace[]>(`${this.endpoint}/owner/${ownerId}`);
  }

  // Obtenir l'espace de travail par ID
  getWorkspaceById(id: number): Observable<Workspace> {
    return this.apiService.get<Workspace>(`${this.endpoint}/${id}`);
  }

  // Créer un nouvel espace de travail
  createWorkspace(workspace: CreateWorkspaceRequest): Observable<Workspace> {
    return this.apiService.post<Workspace>(this.endpoint, workspace);
  }

  // Mettre à jour l'espace de travail
  updateWorkspace(id: number, workspace: UpdateWorkspaceRequest): Observable<Workspace> {
    return this.apiService.put<Workspace>(`${this.endpoint}/${id}`, workspace);
  }

  // Supprimer l'espace de travail
  deleteWorkspace(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Recherche des espaces de travail par nom
  searchWorkspaces(query: string): Observable<Workspace[]> {
    return this.apiService.get<Workspace[]>(`${this.endpoint}/search`, { q: query });
  }
}