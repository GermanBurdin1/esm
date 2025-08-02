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
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TaskService, UserService, BoardService } from '../../services';
import { Task, User, Board } from '../../simple-models';
import { TaskCreateDialogComponent } from './task-create-dialog.component';

@Component({
  selector: 'app-task-list',
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
    MatSelectModule,
    MatDialogModule,
    FormsModule
  ],
  template: `
    <div class="task-list-container">
      <div class="page-header">
        <h1>
          <mat-icon>task</mat-icon>
          Gestion des Tâches
        </h1>
        <button mat-raised-button color="primary" (click)="createTask()">
          <mat-icon>add</mat-icon>
          Nouvelle tâche
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <mat-form-field appearance="outline">
          <mat-label>Rechercher des tâches</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Titre ou description...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Filtrer par priorité</mat-label>
          <mat-select [(ngModel)]="selectedPriority" (selectionChange)="onFilter()">
            <mat-option [value]="null">Toutes les priorités</mat-option>
            <mat-option value="HIGH">Haute</mat-option>
            <mat-option value="MEDIUM">Moyenne</mat-option>
            <mat-option value="LOW">Basse</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Filtrer par assigné</mat-label>
          <mat-select [(ngModel)]="selectedAssignee" (selectionChange)="onFilter()">
            <mat-option [value]="null">Tous les utilisateurs</mat-option>
            <mat-option *ngFor="let user of users" [value]="user.id">
              {{ user.username }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement des tâches...</p>
      </div>

      <!-- Tasks Grid -->
      <div *ngIf="!loading" class="tasks-grid">
        <mat-card 
          *ngFor="let task of filteredTasks" 
          class="task-card card-hover"
          [class]="'priority-border-' + task.priority.toLowerCase()"
          [routerLink]="['/tasks', task.id]">
          
          <mat-card-header>
            <mat-card-title>{{ task.title }}</mat-card-title>
            <mat-card-subtitle>
              <div class="task-meta">
                <mat-chip [class]="'priority-chip-' + task.priority.toLowerCase()">
                  {{ task.priority }}
                </mat-chip>
                <span *ngIf="task.dueDate" class="due-date">
                  <mat-icon>schedule</mat-icon>
                  {{ task.dueDate | date:'dd/MM/yyyy' }}
                </span>
              </div>
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p class="task-description">
              {{ task.description || 'Aucune description disponible' }}
            </p>
            
            <div class="task-details">
              <div class="task-info">
                <span class="info-item">
                  <mat-icon>person</mat-icon>
                  <span *ngIf="task.assigneeId; else unassigned">
                    {{ getUserName(task.assigneeId) }}
                  </span>
                  <ng-template #unassigned>
                    <span class="unassigned">Non assigné</span>
                  </ng-template>
                </span>
                
                <span class="info-item">
                  <mat-icon>view_column</mat-icon>
                  Colonne #{{ task.columnId }}
                </span>
                
                <span class="info-item" *ngIf="task.createdAt">
                  <mat-icon>date_range</mat-icon>
                  {{ task.createdAt | date:'dd/MM/yyyy' }}
                </span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button [routerLink]="['/tasks', task.id]">
              <mat-icon>visibility</mat-icon>
              Voir
            </button>
            <button mat-button (click)="$event.stopPropagation(); editTask(task)">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
            <button mat-button color="warn" (click)="$event.stopPropagation(); deleteTask(task)">
              <mat-icon>delete</mat-icon>
              Supprimer
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredTasks.length === 0" class="empty-state">
        <mat-icon>task_alt</mat-icon>
        <h2>{{ searchQuery || selectedPriority || selectedAssignee ? 'Aucun résultat trouvé' : 'Aucune tâche disponible' }}</h2>
        <p>
          {{ searchQuery || selectedPriority || selectedAssignee 
            ? 'Essayez de modifier vos filtres de recherche' 
            : 'Commencez par créer votre première tâche pour organiser votre travail' 
          }}
        </p>
        <button *ngIf="!searchQuery && !selectedPriority && !selectedAssignee" mat-raised-button color="primary" (click)="createTask()">
          <mat-icon>add</mat-icon>
          Créer une tâche
        </button>
      </div>

      <!-- Summary -->
      <div *ngIf="!loading && tasks.length > 0" class="summary-section">
        <mat-card class="summary-card">
          <mat-card-content>
            <h3>Résumé</h3>
            <div class="summary-stats">
              <div class="stat-item">
                <span class="stat-label">Total:</span>
                <span class="stat-value">{{ tasks.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Haute priorité:</span>
                <span class="stat-value high">{{ getTasksByPriority('HIGH').length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Moyenne priorité:</span>
                <span class="stat-value medium">{{ getTasksByPriority('MEDIUM').length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Basse priorité:</span>
                <span class="stat-value low">{{ getTasksByPriority('LOW').length }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
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

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .filters-section mat-form-field {
      min-width: 200px;
      flex: 1;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }

    .task-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .priority-border-high {
      border-left: 4px solid #f44336;
    }

    .priority-border-medium {
      border-left: 4px solid #ff9800;
    }

    .priority-border-low {
      border-left: 4px solid #4caf50;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .priority-chip-high {
      background-color: #ffebee !important;
      color: #f44336 !important;
    }

    .priority-chip-medium {
      background-color: #fff3e0 !important;
      color: #ff9800 !important;
    }

    .priority-chip-low {
      background-color: #e8f5e8 !important;
      color: #4caf50 !important;
    }

    .due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      color: #666;
    }

    .due-date mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .task-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-details {
      margin-top: 16px;
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #666;
    }

    .info-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .unassigned {
      font-style: italic;
      color: #999;
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

    .summary-section {
      margin-top: 30px;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .summary-card h3 {
      margin: 0 0 16px 0;
      font-size: 1.2rem;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .stat-value.high {
      color: #ffcdd2;
    }

    .stat-value.medium {
      color: #ffe0b2;
    }

    .stat-value.low {
      color: #c8e6c9;
    }

    @media (max-width: 768px) {
      .task-list-container {
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

      .filters-section {
        flex-direction: column;
      }

      .filters-section mat-form-field {
        min-width: unset;
        width: 100%;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }

      .summary-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  loading = true;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  users: User[] = [];
  searchQuery = '';
  selectedPriority: string | null = null;
  selectedAssignee: number | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    forkJoin({
      tasks: this.taskService.getAllTasks(),
      users: this.userService.getAllUsers()
    }).subscribe({
      next: (data) => {
        this.tasks = data.tasks || [];
        this.users = data.users || [];
        this.filteredTasks = data.tasks || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        // Set empty arrays so UI doesn't break
        this.tasks = [];
        this.users = [];
        this.filteredTasks = [];
        this.loading = false;
        
        // Show user-friendly message
        if (error.status === 0) {
          console.warn('Backend server is not running. Please start the backend on localhost:8080');
        }
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilter(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.tasks];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Priority filter
    if (this.selectedPriority) {
      filtered = filtered.filter(task => task.priority === this.selectedPriority);
    }

    // Assignee filter
    if (this.selectedAssignee) {
      filtered = filtered.filter(task => task.assigneeId === this.selectedAssignee);
    }

    this.filteredTasks = filtered;
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : `User #${userId}`;
  }

  getTasksByPriority(priority: string): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  createTask(): void {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '550px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Task was created successfully, refresh the list
        this.loadData();
      }
    });
  }

  editTask(task: Task): void {
    // TODO: Open task edit dialog
    console.log('Edit task:', task);
  }

  deleteTask(task: Task): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      this.taskService.deleteTask(task.id!).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.applyFilters();
          console.log('Tâche supprimée avec succès');
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Erreur lors de la suppression de la tâche');
        }
      });
    }
  }
}