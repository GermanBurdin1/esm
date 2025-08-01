import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BoardService, WorkspaceService } from '../../services';
import { Board, Workspace } from '../../simple-models';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="board-list-container">
      <div class="page-header">
        <h1>
          <mat-icon>view_kanban</mat-icon>
          Tableaux Kanban
        </h1>
        <button mat-raised-button color="primary" (click)="createBoard()">
          <mat-icon>add</mat-icon>
          Nouveau tableau
        </button>
      </div>

      <!-- Workspace Filter -->
      <div class="filter-section">
        <mat-form-field appearance="outline">
          <mat-label>Filtrer par espace de travail</mat-label>
          <mat-select [(ngModel)]="selectedWorkspaceId" (selectionChange)="onWorkspaceFilter()">
            <mat-option [value]="null">Tous les espaces de travail</mat-option>
            <mat-option *ngFor="let workspace of workspaces" [value]="workspace.id">
              {{ workspace.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement des tableaux...</p>
      </div>

      <!-- Boards Grid -->
      <div *ngIf="!loading" class="boards-grid">
        <mat-card 
          *ngFor="let board of filteredBoards" 
          class="board-card card-hover"
          [routerLink]="['/boards', board.id]">
          
          <mat-card-header>
            <mat-card-title>{{ board.name }}</mat-card-title>
            <mat-card-subtitle>
              Workspace #{{ board.workspaceId }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="board-preview">
              <div class="board-columns">
                <div class="column-preview">
                  <div class="column-header">À faire</div>
                  <div class="column-tasks">
                    <div class="task-preview"></div>
                    <div class="task-preview"></div>
                  </div>
                </div>
                <div class="column-preview">
                  <div class="column-header">En cours</div>
                  <div class="column-tasks">
                    <div class="task-preview"></div>
                  </div>
                </div>
                <div class="column-preview">
                  <div class="column-header">Terminé</div>
                  <div class="column-tasks">
                    <div class="task-preview"></div>
                    <div class="task-preview"></div>
                    <div class="task-preview"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="board-stats">
              <mat-chip-set>
                <mat-chip>
                  <mat-icon>view_column</mat-icon>
                  3 colonnes
                </mat-chip>
                <mat-chip>
                  <mat-icon>label</mat-icon>
                  0 étiquettes
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button [routerLink]="['/boards', board.id]">
              <mat-icon>open_in_new</mat-icon>
              Ouvrir le tableau
            </button>
            <button mat-button (click)="$event.stopPropagation(); editBoard(board)">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredBoards.length === 0" class="empty-state">
        <mat-icon>view_kanban</mat-icon>
        <h2>{{ selectedWorkspaceId ? 'Aucun tableau dans cet espace' : 'Aucun tableau disponible' }}</h2>
        <p>
          {{ selectedWorkspaceId 
            ? 'Créez votre premier tableau dans cet espace de travail' 
            : 'Commencez par créer votre premier tableau Kanban pour organiser vos tâches' 
          }}
        </p>
        <button mat-raised-button color="primary" (click)="createBoard()">
          <mat-icon>add</mat-icon>
          Créer un tableau
        </button>
      </div>
    </div>
  `,
  styles: [`
    .board-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
      color: #333;
    }

    .filter-section {
      margin-bottom: 30px;
    }

    .filter-section mat-form-field {
      width: 300px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px;
    }

    .boards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .board-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .board-preview {
      margin: 16px 0;
    }

    .board-columns {
      display: flex;
      gap: 8px;
      overflow: hidden;
    }

    .column-preview {
      min-width: 80px;
      background: #f5f5f5;
      border-radius: 6px;
      padding: 8px;
    }

    .column-header {
      font-size: 0.7rem;
      font-weight: 500;
      color: #666;
      margin-bottom: 6px;
      text-align: center;
    }

    .column-tasks {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .task-preview {
      height: 16px;
      background: white;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .more-columns {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      font-size: 0.8rem;
      color: #666;
      background: #f0f0f0;
      border-radius: 6px;
      padding: 8px;
    }

    .board-stats {
      margin-top: 16px;
    }

    .board-stats mat-chip {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .board-stats mat-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 24px;
      opacity: 0.5;
      color: #999;
    }

    .empty-state h2 {
      margin: 0 0 12px 0;
      font-size: 1.5rem;
      font-weight: 400;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      max-width: 400px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .board-list-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .page-header h1 {
        font-size: 1.5rem;
      }

      .boards-grid {
        grid-template-columns: 1fr;
      }

      .filter-section mat-form-field {
        width: 100%;
      }

      .board-columns {
        gap: 4px;
      }

      .column-preview {
        min-width: 60px;
      }
    }
  `]
})
export class BoardListComponent implements OnInit {
  loading = true;
  boards: Board[] = [];
  workspaces: Workspace[] = [];
  filteredBoards: Board[] = [];
  selectedWorkspaceId: number | null = null;

  constructor(
    private boardService: BoardService,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    forkJoin({
      boards: this.boardService.getAllBoards(),
      workspaces: this.workspaceService.getAllWorkspaces()
    }).subscribe({
      next: (data) => {
        this.boards = data.boards;
        this.workspaces = data.workspaces;
        this.filteredBoards = data.boards;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  onWorkspaceFilter(): void {
    if (this.selectedWorkspaceId === null) {
      this.filteredBoards = this.boards;
    } else {
      this.filteredBoards = this.boards.filter(
        board => board.workspaceId === this.selectedWorkspaceId
      );
    }
  }

  createBoard(): void {
    // TODO: Open board creation dialog
    console.log('Create board');
  }

  editBoard(board: Board): void {
    // TODO: Open board edit dialog
    console.log('Edit board:', board);
  }

  getArray(length: number): number[] {
    return Array(Math.max(0, length)).fill(0).map((_, i) => i);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}