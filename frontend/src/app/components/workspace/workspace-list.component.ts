import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../services';
import { Workspace } from '../../simple-models';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="workspace-list-container">
      <div class="page-header">
        <h1>
          <mat-icon>work</mat-icon>
          Espaces de travail
        </h1>
        <button mat-raised-button color="primary" (click)="createWorkspace()">
          <mat-icon>add</mat-icon>
          Nouvel espace de travail
        </button>
      </div>

      <!-- Search -->
      <div class="search-section">
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Rechercher des espaces de travail</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Nom ou description...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement des espaces de travail...</p>
      </div>

      <!-- Workspaces Grid -->
      <div *ngIf="!loading" class="workspaces-grid">
        <mat-card 
          *ngFor="let workspace of filteredWorkspaces" 
          class="workspace-card card-hover"
          [routerLink]="['/workspaces', workspace.id]">
          
          <mat-card-header>
            <mat-card-title>{{ workspace.name }}</mat-card-title>
            <mat-card-subtitle>
              Espace de travail #{{ workspace.id }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p class="workspace-description">
              {{ workspace.description || 'Aucune description disponible' }}
            </p>
            
            <div class="workspace-stats">
              <mat-chip-set>
                <mat-chip>
                  <mat-icon>view_kanban</mat-icon>
                  0 tableaux
                </mat-chip>
                <mat-chip>
                  <mat-icon>person</mat-icon>
                  Owner #{{ workspace.ownerId }}
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button [routerLink]="['/workspaces', workspace.id]">
              <mat-icon>open_in_new</mat-icon>
              Ouvrir
            </button>
            <button mat-button [routerLink]="['/boards']" [queryParams]="{workspace: workspace.id}">
              <mat-icon>view_kanban</mat-icon>
              Tableaux
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredWorkspaces.length === 0" class="empty-state">
        <mat-icon>work_off</mat-icon>
        <h2>{{ searchQuery ? 'Aucun résultat trouvé' : 'Aucun espace de travail' }}</h2>
        <p>
          {{ searchQuery 
            ? 'Essayez de modifier votre recherche' 
            : 'Commencez par créer votre premier espace de travail pour organiser vos projets' 
          }}
        </p>
        <button *ngIf="!searchQuery" mat-raised-button color="primary" (click)="createWorkspace()">
          <mat-icon>add</mat-icon>
          Créer un espace de travail
        </button>
      </div>
    </div>
  `,
  styles: [`
    .workspace-list-container {
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

    .search-section {
      margin-bottom: 30px;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px;
    }

    .workspaces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .workspace-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: fit-content;
    }

    .workspace-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .workspace-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .workspace-stats {
      margin-top: 16px;
    }

    .workspace-stats mat-chip {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .workspace-stats mat-chip mat-icon {
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
      .workspace-list-container {
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

      .workspaces-grid {
        grid-template-columns: 1fr;
      }

      .search-field {
        max-width: none;
      }
    }
  `]
})
export class WorkspaceListComponent implements OnInit {
  loading = true;
  workspaces: Workspace[] = [];
  filteredWorkspaces: Workspace[] = [];
  searchQuery = '';

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  private loadWorkspaces(): void {
    this.loading = true;
    this.workspaceService.getAllWorkspaces().subscribe({
      next: (workspaces) => {
        this.workspaces = workspaces;
        this.filteredWorkspaces = workspaces;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading workspaces:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredWorkspaces = this.workspaces;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredWorkspaces = this.workspaces.filter(workspace =>
      workspace.name.toLowerCase().includes(query) ||
      (workspace.description && workspace.description.toLowerCase().includes(query))
    );
  }

  createWorkspace(): void {
    // TODO: Open workspace creation dialog
    console.log('Create workspace');
  }
}