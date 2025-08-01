import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="user-profile-container">
      <h1><mat-icon>person</mat-icon> Profil utilisateur</h1>
      <p>Composant de profil utilisateur - À implémenter</p>
    </div>
  `,
  styles: [`
    .user-profile-container {
      padding: 20px;
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class UserProfileComponent {}