import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="user-list-container">
      <h1><mat-icon>people</mat-icon> Utilisateurs</h1>
      <p>Composant de liste des utilisateurs - À implémenter</p>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class UserListComponent {}