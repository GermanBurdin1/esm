import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { 
  UserService, 
  WorkspaceService, 
  BoardService, 
  TaskService 
} from '../../services';
import { 
  User, 
  Workspace, 
  Board, 
  Task 
} from '../../simple-models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>
          <mat-icon>dashboard</mat-icon>
          Tableau de bord
        </h1>
        <p class="welcome-text">
          Bienvenue dans votre espace de travail, {{ currentUser || 'Utilisateur' }}!
        </p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Chargement des données...</p>
      </div>

      <div *ngIf="!loading" class="dashboard-content">
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card workspaces-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>work</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.workspaces }}</h3>
                  <p>Espaces de travail</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card boards-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>view_kanban</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.boards }}</h3>
                  <p>Tableaux</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card tasks-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>task</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.tasks }}</h3>
                  <p>Tâches totales</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card users-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.users }}</h3>
                  <p>Utilisateurs</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Workspaces -->
        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>work</mat-icon>
              Espaces de travail récents
            </mat-card-title>
            <div class="card-actions">
              <button mat-button color="primary" routerLink="/workspaces">
                Voir tout
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="recentWorkspaces.length === 0" class="empty-state">
              <mat-icon>work_off</mat-icon>
              <p>Aucun espace de travail trouvé</p>
              <button mat-raised-button color="primary" routerLink="/workspaces">
                Créer un espace de travail
              </button>
            </div>
            <div *ngIf="recentWorkspaces.length > 0" class="workspaces-grid">
              <mat-card 
                *ngFor="let workspace of recentWorkspaces" 
                class="workspace-item card-hover"
                [routerLink]="['/workspaces', workspace.id]">
                <mat-card-content>
                  <h4>{{ workspace.name }}</h4>
                  <p>{{ workspace.description || 'Aucune description' }}</p>
                  <div class="workspace-meta">
                    <mat-chip-set>
                      <mat-chip>0 tableaux</mat-chip>
                    </mat-chip-set>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Tasks -->
        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>task</mat-icon>
              Tâches récentes
            </mat-card-title>
            <div class="card-actions">
              <button mat-button color="primary" routerLink="/tasks">
                Voir tout
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="recentTasks.length === 0" class="empty-state">
              <mat-icon>task_alt</mat-icon>
              <p>Aucune tâche trouvée</p>
            </div>
            <div *ngIf="recentTasks.length > 0" class="tasks-list">
              <div 
                *ngFor="let task of recentTasks" 
                class="task-item"
                [class]="'priority-' + task.priority.toLowerCase()"
                [routerLink]="['/tasks', task.id]">
                <div class="task-content">
                  <h5>{{ task.title }}</h5>
                  <p>{{ task.description || 'Aucune description' }}</p>
                  <div class="task-meta">
                    <mat-chip [class]="'priority-chip-' + task.priority.toLowerCase()">
                      {{ task.priority }}
                    </mat-chip>
                    <span class="task-date" *ngIf="task.dueDate">
                      <mat-icon>schedule</mat-icon>
                      {{ task.dueDate | date:'short' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quick Actions -->
        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>flash_on</mat-icon>
              Actions rapides
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" routerLink="/workspaces">
                <mat-icon>add</mat-icon>
                Nouvel espace de travail
              </button>
              <button mat-raised-button color="accent" routerLink="/boards">
                <mat-icon>view_kanban</mat-icon>
                Nouveau tableau
              </button>
              <button mat-raised-button routerLink="/tasks">
                <mat-icon>add_task</mat-icon>
                Nouvelle tâche
              </button>
              <button mat-raised-button routerLink="/users">
                <mat-icon>person_add</mat-icon>
                Inviter utilisateur
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 2rem;
      font-weight: 500;
      color: #333;
    }

    .welcome-text {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .workspaces-card .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .boards-card .stat-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .tasks-card .stat-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .users-card .stat-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .section-card {
      margin-bottom: 30px;
    }

    .section-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-actions {
      display: flex;
      align-items: center;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .workspaces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .workspace-item {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .workspace-item:hover {
      transform: translateY(-2px);
    }

    .workspace-meta {
      margin-top: 12px;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-item {
      padding: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-left: 4px solid #e0e0e0;
    }

    .task-item:hover {
      background-color: #f5f5f5;
    }

    .task-item.priority-high {
      border-left-color: #f44336;
    }

    .task-item.priority-medium {
      border-left-color: #ff9800;
    }

    .task-item.priority-low {
      border-left-color: #4caf50;
    }

    .task-content h5 {
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .task-content p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .priority-chip-high {
      background-color: #ffebee;
      color: #f44336;
    }

    .priority-chip-medium {
      background-color: #fff3e0;
      color: #ff9800;
    }

    .priority-chip-low {
      background-color: #e8f5e8;
      color: #4caf50;
    }

    .task-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #666;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .quick-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .workspaces-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        flex-direction: column;
      }

      .quick-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  currentUser = sessionStorage.getItem('username') || 'Utilisateur';
  
  stats = {
    workspaces: 0,
    boards: 0,
    tasks: 0,
    users: 0
  };

  recentWorkspaces: Workspace[] = [];
  recentTasks: Task[] = [];

  constructor(
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private boardService: BoardService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      users: this.userService.getAllUsers(),
      workspaces: this.workspaceService.getAllWorkspaces(),
      boards: this.boardService.getAllBoards(),
      tasks: this.taskService.getAllTasks()
    }).subscribe({
      next: (data) => {
        this.stats = {
          users: data.users.length,
          workspaces: data.workspaces.length,
          boards: data.boards.length,
          tasks: data.tasks.length
        };

        // Recent data (limit to 3-5 items)
        this.recentWorkspaces = data.workspaces.slice(0, 3);
        this.recentTasks = data.tasks.slice(0, 5);

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }
}