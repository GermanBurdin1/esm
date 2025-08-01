import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Board, 
  BoardColumn
} from '../simple-models';

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

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly endpoint = '/boards';

  constructor(private apiService: ApiService) {}

  // === BOARD MANAGEMENT ===

  // Obtenir tous les boards
  getAllBoards(): Observable<Board[]> {
    return this.apiService.get<Board[]>(this.endpoint);
  }

  // Obtenir les boards par workspace
  getBoardsByWorkspace(workspaceId: number): Observable<Board[]> {
    return this.apiService.get<Board[]>(`${this.endpoint}/workspace/${workspaceId}`);
  }

  // Obtenir le board par ID
  getBoardById(id: number): Observable<Board> {
    return this.apiService.get<Board>(`${this.endpoint}/${id}`);
  }

  // Créer un nouveau board
  createBoard(board: CreateBoardRequest): Observable<Board> {
    return this.apiService.post<Board>(this.endpoint, board);
  }

  // Mettre à jour le board
  updateBoard(id: number, board: Partial<Board>): Observable<Board> {
    return this.apiService.put<Board>(`${this.endpoint}/${id}`, board);
  }

  // Supprimer le board
  deleteBoard(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // === COLUMN MANAGEMENT ===

  // Obtenir les colonnes du board
  getColumnsByBoard(boardId: number): Observable<BoardColumn[]> {
    return this.apiService.get<BoardColumn[]>(`${this.endpoint}/${boardId}/columns`);
  }

  // Créer une nouvelle colonne
  createColumn(column: CreateColumnRequest): Observable<BoardColumn> {
    return this.apiService.post<BoardColumn>(`${this.endpoint}/${column.boardId}/columns`, column);
  }

  // Mettre à jour la colonne
  updateColumn(id: number, column: UpdateColumnRequest): Observable<BoardColumn> {
    return this.apiService.put<BoardColumn>(`${this.endpoint}/columns/${id}`, column);
  }

  // Supprimer la colonne
  deleteColumn(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/columns/${id}`);
  }
}