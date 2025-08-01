import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="task-list-container">
      <h1><mat-icon>task</mat-icon> Tâches</h1>
      <p>Composant de liste des tâches - À implémenter</p>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class TaskListComponent {}