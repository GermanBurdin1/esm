import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { TaskService, UserService, CommentService } from '../../services';
import { Task, User, TaskComment } from '../../simple-models';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="task-detail-container" *ngIf="!loading">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="task-title-section">
            <h1>{{ task?.title }}</h1>
            <div class="task-meta">
              <mat-chip [class]="'priority-chip-' + task?.priority?.toLowerCase()">
                <mat-icon>{{ getPriorityIcon(task?.priority) }}</mat-icon>
                {{ task?.priority }}
              </mat-chip>
              <span class="task-id">ID: #{{ task?.id }}</span>
            </div>
          </div>
        </div>
        
        <div class="header-actions">
          <button mat-button (click)="editTask()">
            <mat-icon>edit</mat-icon>
            Modifier
          </button>
          <button mat-button color="warn" (click)="deleteTask()">
            <mat-icon>delete</mat-icon>
            Supprimer
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left Column - Main Info -->
        <div class="main-content">
          <mat-card class="task-info-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>info</mat-icon>
                Informations générales
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Description:</span>
                  <p class="description">{{ task?.description || 'Aucune description fournie' }}</p>
                </div>
                
                <div class="info-item">
                  <span class="label">Assigné à:</span>
                  <div class="assignee-info" *ngIf="task?.assigneeId; else unassigned">
                    <div class="user-avatar" [style.background-color]="getUserAvatarColor(assignee?.username)">
                      {{ getInitials(assignee?.username) }}
                    </div>
                    <span>{{ assignee?.username }}</span>
                    <mat-chip class="role-chip">{{ assignee?.role }}</mat-chip>
                  </div>
                  <ng-template #unassigned>
                    <span class="unassigned">Non assigné</span>
                  </ng-template>
                </div>

                <div class="info-item">
                  <span class="label">Date d'échéance:</span>
                  <span *ngIf="task?.dueDate; else noDueDate" class="due-date">
                    <mat-icon>schedule</mat-icon>
                    {{ task?.dueDate | date:'full' }}
                  </span>
                  <ng-template #noDueDate>
                    <span class="no-date">Aucune échéance définie</span>
                  </ng-template>
                </div>

                <div class="info-item">
                  <span class="label">Date de création:</span>
                  <span *ngIf="task?.createdAt">
                    <mat-icon>date_range</mat-icon>
                    {{ task?.createdAt | date:'full' }}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Colonne:</span>
                  <span class="column-info">
                    <mat-icon>view_column</mat-icon>
                    Colonne #{{ task?.columnId }}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Position:</span>
                  <span class="position-info">
                    <mat-icon>reorder</mat-icon>
                    Position {{ task?.position }}
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Comments Section -->
          <mat-card class="comments-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>comment</mat-icon>
                Commentaires ({{ comments.length }})
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="comments.length === 0" class="no-comments">
                <mat-icon>chat_bubble_outline</mat-icon>
                <p>Aucun commentaire pour cette tâche</p>
                <button mat-button color="primary" (click)="addComment()">
                  <mat-icon>add</mat-icon>
                  Ajouter un commentaire
                </button>
              </div>
              
              <div *ngIf="comments.length > 0" class="comments-list">
                <div *ngFor="let comment of comments; trackBy: trackByCommentId" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-author">
                      <div class="user-avatar small" [style.background-color]="getUserAvatarColor('user')">
                        U{{ comment.authorId }}
                      </div>
                      <span class="author-name">User #{{ comment.authorId }}</span>
                    </div>
                    <span class="comment-date">{{ comment.createdAt | date:'short' }}</span>
                  </div>
                  <div class="comment-content">
                    {{ comment.text }}
                  </div>
                </div>
                
                <button mat-button color="primary" (click)="addComment()" class="add-comment-btn">
                  <mat-icon>add</mat-icon>
                  Ajouter un commentaire
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right Column - Actions & Status -->
        <div class="sidebar-content">
          <mat-card class="status-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>settings</mat-icon>
                Actions rapides
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="action-buttons">
                <button mat-stroked-button class="action-btn" (click)="moveTask()">
                  <mat-icon>swap_horiz</mat-icon>
                  Déplacer vers une autre colonne
                </button>
                
                <button mat-stroked-button class="action-btn" (click)="changePriority()">
                  <mat-icon>priority_high</mat-icon>
                  Changer la priorité
                </button>
                
                <button mat-stroked-button class="action-btn" (click)="assignTask()">
                  <mat-icon>person_add</mat-icon>
                  Réassigner la tâche
                </button>
                
                <button mat-stroked-button class="action-btn" (click)="duplicateTask()">
                  <mat-icon>content_copy</mat-icon>
                  Dupliquer la tâche
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="activity-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>history</mat-icon>
                Activité récente
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div class="activity-item">
                  <mat-icon class="activity-icon">add_task</mat-icon>
                  <div class="activity-content">
                    <span class="activity-text">Tâche créée</span>
                    <span class="activity-date">{{ task?.createdAt | date:'short' }}</span>
                  </div>
                </div>
                
                <div class="activity-item" *ngFor="let comment of comments.slice(-3)">
                  <mat-icon class="activity-icon">comment</mat-icon>
                  <div class="activity-content">
                    <span class="activity-text">Commentaire ajouté</span>
                    <span class="activity-date">{{ comment.createdAt | date:'short' }}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Chargement de la tâche...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="error-container">
      <mat-icon>error</mat-icon>
      <h2>Erreur de chargement</h2>
      <p>{{ error }}</p>
      <button mat-button (click)="goBack()">Retour à la liste</button>
    </div>
  `,
  styles: [`
    .task-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .task-title-section h1 {
      margin: 0 0 12px 0;
      font-size: 1.8rem;
      font-weight: 500;
      color: #333;
      line-height: 1.2;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .task-id {
      font-family: monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #666;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .sidebar-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .task-info-card, .comments-card, .status-card, .activity-card {
      height: fit-content;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .description {
      margin: 0;
      line-height: 1.6;
      color: #333;
      background: #f9f9f9;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid #3f51b5;
    }

    .assignee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
      background-color: #3f51b5;
    }

    .user-avatar.small {
      width: 24px;
      height: 24px;
      font-size: 0.7rem;
    }

    .role-chip {
      font-size: 0.7rem !important;
      height: 20px !important;
    }

    .unassigned, .no-date {
      font-style: italic;
      color: #999;
    }

    .due-date, .column-info, .position-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .due-date mat-icon, .column-info mat-icon, .position-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
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

    .no-comments {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      text-align: center;
      color: #666;
    }

    .no-comments mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment-item {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 3px solid #3f51b5;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .comment-author {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .author-name {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .comment-date {
      font-size: 0.8rem;
      color: #666;
    }

    .comment-content {
      line-height: 1.5;
      color: #333;
    }

    .add-comment-btn {
      margin-top: 16px;
      width: 100%;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-btn {
      justify-content: flex-start;
      gap: 12px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .activity-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .activity-text {
      font-size: 0.9rem;
      color: #333;
    }

    .activity-date {
      font-size: 0.8rem;
      color: #666;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #f44336;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .task-detail-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .header-left {
        width: 100%;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .content-layout {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .task-title-section h1 {
        font-size: 1.4rem;
      }
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  loading = true;
  error: string | null = null;
  task: Task | null = null;
  assignee: User | null = null;
  comments: TaskComment[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (taskId) {
      this.loadTaskData(taskId);
    } else {
      this.error = 'ID de tâche invalide';
      this.loading = false;
    }
  }

  private loadTaskData(taskId: number): void {
    this.loading = true;
    this.error = null;

    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.loadRelatedData();
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.error = 'Impossible de charger les détails de la tâche';
        this.loading = false;
      }
    });
  }

  private loadRelatedData(): void {
    const requests: any = {
      comments: this.commentService.getCommentsByTask(this.task!.id!)
    };

    if (this.task!.assigneeId) {
      requests.assignee = this.userService.getUserById(this.task!.assigneeId);
    }

    forkJoin(requests).subscribe({
      next: (data: any) => {
        this.comments = data.comments || [];
        this.assignee = data.assignee || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading related data:', error);
        this.comments = [];
        this.assignee = null;
        this.loading = false;
      }
    });
  }

  getPriorityIcon(priority?: string): string {
    switch (priority) {
      case 'HIGH': return 'priority_high';
      case 'MEDIUM': return 'remove';
      case 'LOW': return 'keyboard_arrow_down';
      default: return 'help';
    }
  }

  getUserAvatarColor(username?: string): string {
    if (!username) return '#3f51b5';
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'];
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.split('_').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2);
  }

  trackByCommentId(index: number, comment: TaskComment): number {
    return comment.id!;
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  editTask(): void {
    // TODO: Open edit dialog
    console.log('Edit task:', this.task);
  }

  deleteTask(): void {
    if (this.task && confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${this.task.title}" ?`)) {
      this.taskService.deleteTask(this.task.id!).subscribe({
        next: () => {
          console.log('Tâche supprimée avec succès');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Erreur lors de la suppression de la tâche');
        }
      });
    }
  }

  moveTask(): void {
    console.log('Move task to another column');
  }

  changePriority(): void {
    console.log('Change task priority');
  }

  assignTask(): void {
    console.log('Assign task to user');
  }

  duplicateTask(): void {
    console.log('Duplicate task');
  }

  addComment(): void {
    console.log('Add comment to task');
  }
}