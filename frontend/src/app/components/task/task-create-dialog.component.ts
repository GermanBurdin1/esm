import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { TaskService, UserService, BoardService } from '../../services';
import { User, BoardColumn, TaskPriority, CreateTaskRequest } from '../../simple-models';

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>add_task</mat-icon>
      Créer une nouvelle tâche
    </h2>

    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="dialog-content">
        
        <!-- Task Title -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre de la tâche *</mat-label>
          <input matInput 
                 formControlName="title" 
                 placeholder="Saisissez le titre de la tâche"
                 maxlength="200">
          <mat-icon matSuffix>title</mat-icon>
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            Le titre est obligatoire
          </mat-error>
          <mat-error *ngIf="taskForm.get('title')?.hasError('minlength')">
            Le titre doit contenir au moins 1 caractère
          </mat-error>
          <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
            Le titre ne peut pas dépasser 200 caractères
          </mat-error>
        </mat-form-field>

        <!-- Task Description -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput 
                    formControlName="description" 
                    placeholder="Décrivez la tâche en détail (optionnel)"
                    rows="4"
                    maxlength="2000"></textarea>
          <mat-icon matSuffix>description</mat-icon>
          <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
            La description ne peut pas dépasser 2000 caractères
          </mat-error>
        </mat-form-field>

        <!-- Column Selection -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Colonne *</mat-label>
          <mat-select formControlName="columnId" placeholder="Sélectionnez une colonne">
            <mat-option *ngFor="let column of columns" [value]="column.id">
              {{ column.name }} (Board #{{ column.boardId }})
            </mat-option>
          </mat-select>
          <mat-icon matSuffix>view_column</mat-icon>
          <mat-error *ngIf="taskForm.get('columnId')?.hasError('required')">
            La colonne est obligatoire
          </mat-error>
        </mat-form-field>

        <!-- Priority Selection -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priority">
            <mat-option value="LOW">
              <span class="priority-option low">
                <mat-icon>keyboard_arrow_down</mat-icon>
                Basse
              </span>
            </mat-option>
            <mat-option value="MEDIUM">
              <span class="priority-option medium">
                <mat-icon>remove</mat-icon>
                Moyenne
              </span>
            </mat-option>
            <mat-option value="HIGH">
              <span class="priority-option high">
                <mat-icon>priority_high</mat-icon>
                Haute
              </span>
            </mat-option>
          </mat-select>
          <mat-icon matSuffix>flag</mat-icon>
        </mat-form-field>

        <!-- Assignee Selection -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Assigné à</mat-label>
          <mat-select formControlName="assigneeId" placeholder="Sélectionnez un utilisateur (optionnel)">
            <mat-option [value]="null">Non assigné</mat-option>
            <mat-option *ngFor="let user of users" [value]="user.id">
              <div class="user-option">
                <div class="user-avatar-small" [style.background-color]="getUserAvatarColor(user.username)">
                  {{ getInitials(user.username) }}
                </div>
                <span>{{ user.username }}</span>
                <span class="user-role">({{ user.role }})</span>
              </div>
            </mat-option>
          </mat-select>
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <!-- Due Date -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date d'échéance</mat-label>
          <input matInput 
                 [matDatepicker]="picker" 
                 formControlName="dueDate"
                 placeholder="Sélectionnez une date (optionnel)">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <!-- Position -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Position dans la colonne</mat-label>
          <input matInput 
                 type="number" 
                 formControlName="position" 
                 placeholder="0"
                 min="0">
          <mat-icon matSuffix>reorder</mat-icon>
          <mat-error *ngIf="taskForm.get('position')?.hasError('min')">
            La position doit être un nombre positif
          </mat-error>
        </mat-form-field>

        <!-- Loading indicator for dropdowns -->
        <div *ngIf="loading" class="loading-section">
          <mat-spinner diameter="30"></mat-spinner>
          <span>Chargement des données...</span>
        </div>

      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button type="button" (click)="onCancel()">
          Annuler
        </button>
        <button mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="taskForm.invalid || submitting">
          <mat-icon *ngIf="!submitting">add_task</mat-icon>
          <mat-spinner *ngIf="submitting" diameter="20"></mat-spinner>
          {{ submitting ? 'Création...' : 'Créer la tâche' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content {
      width: 500px;
      max-width: 90vw;
      padding: 20px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .priority-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .priority-option.high {
      color: #f44336;
    }

    .priority-option.medium {
      color: #ff9800;
    }

    .priority-option.low {
      color: #4caf50;
    }

    .user-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    .user-avatar-small {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
      color: white;
      background-color: #3f51b5;
    }

    .user-role {
      font-size: 0.8rem;
      color: #666;
      font-style: italic;
    }

    .loading-section {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: center;
      padding: 20px;
      color: #666;
    }

    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 16px 0;
      color: #333;
    }

    /* Custom scrollbar for dialog content */
    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class TaskCreateDialogComponent implements OnInit {
  taskForm: FormGroup;
  loading = true;
  submitting = false;
  users: User[] = [];
  columns: BoardColumn[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskCreateDialogComponent>,
    private taskService: TaskService,
    private userService: UserService,
    private boardService: BoardService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      columnId: [null, [Validators.required]],
      priority: ['MEDIUM'],
      assigneeId: [null],
      dueDate: [null],
      position: [0, [Validators.min(0)]]
    });
  }

  private loadFormData(): void {
    this.loading = true;
    
    forkJoin({
      users: this.userService.getAllUsers(),
      boards: this.boardService.getAllBoards()
    }).subscribe({
      next: (data: any) => {
        this.users = data.users || [];
        
        // Flatten all columns from all boards
        this.columns = [];
        if (data.boards && Array.isArray(data.boards)) {
          data.boards.forEach((board: any) => {
            if (board.columns && Array.isArray(board.columns)) {
              this.columns.push(...board.columns);
            }
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.snackBar.open('Erreur lors du chargement des données', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  getUserAvatarColor(username: string): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'];
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split('_').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2);
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.submitting) {
      this.submitting = true;
      
      const formValue = this.taskForm.value;
      const taskRequest: CreateTaskRequest = {
        title: formValue.title,
        description: formValue.description || undefined,
        columnId: formValue.columnId,
        priority: formValue.priority,
        assigneeId: formValue.assigneeId || undefined,
        dueDate: formValue.dueDate || undefined,
        position: formValue.position || 0
      };

      this.taskService.createTask(taskRequest).subscribe({
        next: (createdTask) => {
          this.snackBar.open('Tâche créée avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(createdTask);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.snackBar.open('Erreur lors de la création de la tâche', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}