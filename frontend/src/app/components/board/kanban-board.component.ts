import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
// import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { 
  BoardService, 
  TaskService, 
  UserService, 
  LabelService 
} from '../../services';
import { 
  Board, 
  BoardColumn, 
  Task, 
  User, 
  TaskLabel
} from '../../simple-models';

export interface MoveTaskRequest {
  columnId: number;
  position: number;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    // DragDropModule
  ],
  template: `
    <div class="kanban-container" *ngIf="!loading">
      <!-- Board Header -->
      <div class="board-header">
        <div class="board-info">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="board-title">
            <h1>{{ board?.name }}</h1>
            <p>Workspace #{{ board?.workspaceId }}</p>
          </div>
        </div>
        
        <div class="board-actions">
          <button mat-button (click)="openTaskDialog()">
            <mat-icon>add</mat-icon>
            Nouvelle tâche
          </button>
          <button mat-button [matMenuTriggerFor]="boardMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #boardMenu="matMenu">
            <button mat-menu-item (click)="openColumnDialog()">
              <mat-icon>view_column</mat-icon>
              Ajouter colonne
            </button>
            <button mat-menu-item (click)="openLabelDialog()">
              <mat-icon>label</mat-icon>
              Gérer les étiquettes
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board">
        <div 
          *ngFor="let column of columns; trackBy: trackByColumnId" 
          class="kanban-column">
          
          <!-- Column Header -->
          <div class="kanban-column-header">
            <h3>{{ column.name }}</h3>
            <span class="task-count">{{ getTasksByColumn(column.id!).length }}</span>
          </div>

          <!-- Tasks Container -->
                      <div 
              class="tasks-container">
            
            <div 
              *ngFor="let task of getTasksByColumn(column.id!); trackBy: trackByTaskId"
              class="kanban-task"
              [class]="'priority-' + task.priority.toLowerCase()"

              (click)="openTaskDetail(task)">
              
              <!-- Task Content -->
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <button 
                  mat-icon-button 
                  class="task-menu-btn"
                  [matMenuTriggerFor]="taskMenu"
                  (click)="$event.stopPropagation()">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #taskMenu="matMenu">
                  <button mat-menu-item (click)="editTask(task)">
                    <mat-icon>edit</mat-icon>
                    Modifier
                  </button>
                  <button mat-menu-item (click)="deleteTask(task)">
                    <mat-icon>delete</mat-icon>
                    Supprimer
                  </button>
                </mat-menu>
              </div>

              <p *ngIf="task.description" class="task-description">
                {{ task.description | slice:0:100 }}
                <span *ngIf="task.description.length > 100">...</span>
              </p>

              <!-- Task Labels -->
              <div *ngIf="getTaskLabels(task.id!).length > 0" class="task-labels">
                <span 
                  *ngFor="let label of getTaskLabels(task.id!)"
                  class="task-label"
                  [style.background-color]="label.color">
                  {{ label.name }}
                </span>
              </div>

              <!-- Task Footer -->
              <div class="task-footer">
                <div class="task-meta">
                  <!-- Priority -->
                  <mat-chip 
                    [class]="'priority-chip-' + task.priority.toLowerCase()"
                    class="priority-chip">
                    {{ task.priority }}
                  </mat-chip>

                  <!-- Due Date -->
                  <span *ngIf="task.dueDate" class="due-date">
                    <mat-icon>schedule</mat-icon>
                    {{ task.dueDate | date:'MMM dd' }}
                  </span>
                </div>

                <!-- Assignee -->
                <div *ngIf="task.assigneeId" class="task-assignee">
                  <div class="user-avatar" [style.background-color]="getUserAvatarColor('user')">
                    U{{ task.assigneeId }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Column State -->
            <div *ngIf="getTasksByColumn(column.id!).length === 0" class="empty-column">
              <mat-icon>task_alt</mat-icon>
              <p>Aucune tâche</p>
              <button mat-button color="primary" (click)="openTaskDialog(column.id)">
                Ajouter une tâche
              </button>
            </div>
          </div>
        </div>

        <!-- Add Column Button -->
        <div class="add-column">
          <button mat-button color="primary" (click)="openColumnDialog()">
            <mat-icon>add</mat-icon>
            Ajouter une colonne
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Chargement du tableau...</p>
    </div>
  `,
  styles: [`
    .kanban-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .board-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .board-title h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: #333;
    }

    .board-title p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .board-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .kanban-board {
      flex: 1;
      display: flex;
      gap: 16px;
      padding: 24px;
      overflow-x: auto;
      background: #f5f5f5;
    }

    .kanban-column {
      min-width: 300px;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .kanban-column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      border-radius: 8px 8px 0 0;
    }

    .kanban-column-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    .task-count {
      background: #e0e0e0;
      color: #666;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .tasks-container {
      flex: 1;
      padding: 16px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .kanban-task {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .kanban-task:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-1px);
    }

    .kanban-task.priority-high {
      border-left: 4px solid #f44336;
    }

    .kanban-task.priority-medium {
      border-left: 4px solid #ff9800;
    }

    .kanban-task.priority-low {
      border-left: 4px solid #4caf50;
    }

    .kanban-task.cdk-drag-dragging {
      transform: rotate(5deg);
      opacity: 0.8;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .task-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      color: #333;
      flex: 1;
      line-height: 1.4;
    }

    .task-menu-btn {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .kanban-task:hover .task-menu-btn {
      opacity: 1;
    }

    .task-description {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .task-labels {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 12px;
    }

    .task-label {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 500;
      color: white;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .priority-chip {
      font-size: 0.7rem !important;
      height: 20px !important;
      min-height: 20px !important;
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
      font-size: 0.8rem;
      color: #666;
    }

    .due-date mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .task-assignee {
      display: flex;
      align-items: center;
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
      color: white;
    }

    .empty-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #999;
      text-align: center;
    }

    .empty-column mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .add-column {
      min-width: 280px;
      display: flex;
      align-items: flex-start;
      padding-top: 40px;
    }

    .add-column button {
      width: 100%;
      height: 100px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: white;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 16px;
    }

    .cdk-drop-list-dragging .kanban-task:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
      background: #f0f0f0;
      border: 2px dashed #ccc;
    }

    @media (max-width: 768px) {
      .kanban-board {
        flex-direction: column;
        padding: 16px;
      }

      .kanban-column {
        min-width: unset;
        max-width: unset;
        width: 100%;
      }

      .board-header {
        padding: 16px;
      }

      .board-actions {
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }
    }
  `]
})
export class KanbanBoardComponent implements OnInit {
  loading = true;
  board: Board | null = null;
  columns: BoardColumn[] = [];
  tasks: Task[] = [];
  users: User[] = [];
  labels: TaskLabel[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private taskService: TaskService,
    private userService: UserService,
    private labelService: LabelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const boardId = Number(this.route.snapshot.paramMap.get('id'));
    if (boardId) {
      this.loadBoardData(boardId);
    }
  }

  private loadBoardData(boardId: number): void {
    this.loading = true;

    forkJoin({
      board: this.boardService.getBoardById(boardId),
      columns: this.boardService.getColumnsByBoard(boardId),
      tasks: this.taskService.getAllTasks(),
      users: this.userService.getAllUsers(),
      labels: this.labelService.getLabelsByBoard(boardId)
    }).subscribe({
      next: (data) => {
        this.board = data.board;
        this.columns = data.columns.sort((a, b) => a.position - b.position);
        this.tasks = data.tasks.filter(task => 
          data.columns.some(col => col.id === task.columnId)
        );
        this.users = data.users;
        this.labels = data.labels;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading board data:', error);
        this.snackBar.open('Erreur lors du chargement du tableau', 'Fermer', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  getTasksByColumn(columnId: number): Task[] {
    return this.tasks
      .filter(task => task.columnId === columnId)
      .sort((a, b) => a.position - b.position);
  }

  getTaskLabels(taskId: number): TaskLabel[] {
    // In a real app, you'd get this from task.labelRelations
    // For demo, return a few random labels
    return this.labels.slice(0, Math.floor(Math.random() * 3));
  }

  onTaskDrop(event: any, targetColumn: BoardColumn): void {
    const task = event.item.data;
    const previousColumnId = task.columnId;
    const targetColumnId = targetColumn.id!;

    // Drag & Drop functionality disabled for now
    console.log('Task drop:', event, targetColumn);

    /*
    // TODO: Implement drag & drop with CDK
    const moveRequest: MoveTaskRequest = {
      columnId: targetColumnId,
      position: event.currentIndex
    };

    this.taskService.moveTask(task.id!, moveRequest).subscribe({
      next: (updatedTask) => {
        this.snackBar.open('Tâche déplacée avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du déplacement de la tâche', 'Fermer', { duration: 5000 });
      }
    });
    */
  }

  openTaskDialog(columnId?: number): void {
    // TODO: Open task creation dialog
    console.log('Open task dialog for column:', columnId);
  }

  openColumnDialog(): void {
    // TODO: Open column creation dialog
    console.log('Open column dialog');
  }

  openLabelDialog(): void {
    // TODO: Open label management dialog
    console.log('Open label dialog');
  }

  openTaskDetail(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
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
          this.snackBar.open('Tâche supprimée avec succès', 'Fermer', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/boards']);
  }

  getUserAvatarColor(username: string): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }

  getInitials(name: string): string {
    return name.split('_').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2);
  }

  trackByColumnId(index: number, column: BoardColumn): number {
    return column.id!;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id!;
  }

}