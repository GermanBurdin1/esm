import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="settings-container">
      <h1><mat-icon>settings</mat-icon> Paramètres</h1>
      <p>Composant de paramètres - À implémenter</p>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class SettingsComponent {}