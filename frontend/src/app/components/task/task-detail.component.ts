import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="task-detail-container">
      <h1><mat-icon>task</mat-icon> Détail de la tâche</h1>
      <p>Composant de détail des tâches - À implémenter</p>
    </div>
  `,
  styles: [`
    .task-detail-container {
      padding: 20px;
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class TaskDetailComponent {}