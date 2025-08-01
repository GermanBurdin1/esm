import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="workspace-detail-container">
      <h1><mat-icon>work</mat-icon> Détail de l'espace de travail</h1>
      <p>Composant de détail des espaces de travail - À implémenter</p>
    </div>
  `,
  styles: [`
    .workspace-detail-container {
      padding: 20px;
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class WorkspaceDetailComponent {}